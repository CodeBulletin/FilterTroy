import React from "react";
import { Link } from "react-router-dom";
import "./Theme/Navbar.scss";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";

import * as Avatar from "@radix-ui/react-avatar";

const Navbar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const auth = useSelector((state) => state.auth);
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
        {isLogged ? (
          <>
            <Link className="NavbarLink" to="/Filter/New">
              New
            </Link>
            <Link
              className="NavbarLink"
              to="/Profile"
              onClick={() => dispatch(logout())}
            >
              <div className="NavbarProfile">
                <Avatar.Root className="NavbarProfileImage">
                  <Avatar.Image
                    src={auth.profile_picture}
                    className="Image"
                    alt="Profile Picture"
                  />
                  <Avatar.Fallback delayMs={600} className="Fallback">
                    {auth.username.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <span>Profile</span>
              </div>
            </Link>
          </>
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
