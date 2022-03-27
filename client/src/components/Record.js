import React from 'react';
import { Link } from "react-router-dom";

const Record = (props) => (
    <tr>
      <td>{props.record['OPRHP Region']}</td>
      <td>{props.record.County}</td>
      <td>{props.record.Facility}</td>
      <td>{props.record.latitude}</td>
      <td>{props.record.longitude}</td>
      <td>
        <Link to={`/records/${props.record._id}`}><button class="btn btn-info btn-sm">View</button></Link>
      </td>
    </tr>
  );

  export default Record;