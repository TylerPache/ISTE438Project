import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Record from "./Record";
import Search from "./Search";

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [ search, setSearch ] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

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

  // This method fetches the records from the database.
  // Put our GET requests here.
  useEffect(() => {
    getRecords();
  }, []);

  const onSearchSubmit = async event => {
    try {
      event.preventDefault();

      console.log('FORM SUBMITTED')
      console.log("search: " + search);
      console.log("selectedOption: " + selectedOption);

      let searchRoute = "";
      switch (selectedOption) {
        case 'Region':
          searchRoute = `/record/Region/${search}`;
          break;
        case 'County':
          searchRoute = `/record/County/${search}`;
          break;
        case `Facility`:
          searchRoute = `/record/Facility/${search}`;
          break;
        case 'lld':
          searchRoute = `/record/Location/${search}`;
          break;
        default:
          break;
      }

      const response = await fetch(`http://localhost:5000${searchRoute}`);
      const data = await response.json();
      console.log("search response: " + JSON.stringify(data));

      setRecords(data);
    } catch (error) {
      console.log("ERRORaaaaaa: " + error);
    }
  };
  
  const onReset = () => {
    getRecords()
    setSearch('');
    setSelectedOption('');
  };

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div className="container">

      <Search 
        search={search} 
        onChangeSearch={event => setSearch(event.target.value)} 
        selectedOption={selectedOption}
        onSelectedOptionChange={event => setSelectedOption(event.target.value)}
        onSearchSubmit={onSearchSubmit}
        onReset={onReset}
      />

      

      {/* Display table after clicking search */}
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
        <tr>
            <th>OHRP Region</th>
            <th>County</th>
            <th>Facility</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
}