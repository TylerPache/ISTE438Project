import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
        <img style={{"width" : 25 + '%'}} src="https://www.ny.gov/sites/default/files/thumbnails/image/NYGovFacebookMeta01LightGray.png"></img>
        </NavLink>
        <h3>NY State Parks Annual Attendance By Year</h3>
      </nav>
    </div>
  );
}
