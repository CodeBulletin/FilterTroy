import React from "react";
import { Link } from "react-router-dom";
import "./Theme/Navbar.scss";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";

const Navbar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const dispatch = useDispatch();
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
        {isLogged ? (
          <Link
            className="NavbarLink"
            to="/"
            onClick={() => dispatch(logout())}
          >
            Logout
          </Link>
        ) : (
          <Link
            className="NavbarLink"
            to="/Login"
            onClick={() => {
              useDispatch(logout());
            }}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
