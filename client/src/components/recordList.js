import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";

const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.position}</td>
    <td>{props.record.level}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    search: "",
    comment: "",
    year: "",
    region: "",
    county: "",
    facility: "",
  });
  const navigate = useNavigate();

  //check state of checkboxes
  const [yearCheckbox, setYearChecked] = useState(false);
  const [regionCheckbox, setRegionChecked] = useState(false);
  const [countyCheckbox, setCountyChecked] = useState(false);
  const [facilityCheckbox, setFacilityChecked] = useState(false);
  const [attendanceCheckbox, setAttendanceChecked] = useState(false);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a GET request is sent to the create url, we'll fetch the results from the database.
   const newQuery = { ...form };
 
   //replace this route with ours
   await fetch("http://localhost:5000/record/add", {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newQuery),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
    setForm({ search: "",
    comment: "",
    year: "",
    region: "",
    county: "",
    facility: "" });
 
    window.location.reload();
  }

  // This method fetches the records from the database.
  // Put our GET requests here.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return; 
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Park Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Write a comment</label>
          <input
            type="textarea"
            className="form-control"
            id="comment"
            value={form.comment}
            onChange={(e) => updateForm({ comment: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="year"
              value={form.year}
              checked={yearCheckbox}
              onChange={(e) => updateForm({ year: e.target.value })}
            />
            <label htmlFor="year" className="form-check-label">Year</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="region"
              value={form.region}
              checked={form.region == true}
              onChange={(e) => updateForm({ region: e.target.value })}
            />
            <label htmlFor="region" className="form-check-label">Region</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="county"
              value={form.county}
              checked={form.county == true}
              onChange={(e) => updateForm({ county: e.target.value })}
            />
            <label htmlFor="county" className="form-check-label">County</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="facility"
              value={form.facility}
              checked={form.facility == true}
              onChange={(e) => updateForm({ facility: e.target.value })}
            />
            <label htmlFor="facility" className="form-check-label">Facility</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="attendance"
              value={form.attendance}
              checked={form.attendance == true}
              onChange={(e) => updateForm({ attendance: e.target.value })}
            />
            <label htmlFor="attendance" className="form-check-label">Attendance</label>
          </div>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Search"
            className="btn btn-primary"
          />
        </div>
      </form>

      {/* Display table after clicking search */}
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>OPHRP Region</th>
            <th>County</th>
            <th>Facility</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
}