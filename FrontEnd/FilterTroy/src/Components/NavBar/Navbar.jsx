import React from "react";
import { Link } from "react-router-dom";
import "./Theme/Navbar.scss";

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="NavbarItems">
        <Link to="/" className="NavbarTitle">
          FilterTroy
        </Link>
        <div className="SearchBar">
          <input type="text" placeholder="Search"></input>
        </div>
      </div>
      <div className="NavbarItems">
        <Link className="NavbarLink" to="/Browse">
          Browse
        </Link>
        <Link className="NavbarLink" to="/Filter/New">
          New
        </Link>
        <Link className="NavbarLink" to="/SignIn">
          SignIn
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
