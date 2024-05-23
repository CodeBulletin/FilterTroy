import react, { useEffect, useState } from "react";
import "./LoginSignup.scss";

import {
  CropIcon,
  EnvelopeClosedIcon,
  PersonIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";

import * as Tabs from "@radix-ui/react-tabs";

import { signup_fn, login_fn } from "../../Redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [photo, setPhoto] = useState(null);
  const [selectedTab, setSelectedTab] = useState("login");

  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isLogged = useSelector((state) => state.auth.isLogged);
  const loading = useSelector((state) => state.auth.loading);

  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const editLogin = (key) => {
    return (event) => {
      setLoginData({ ...loginData, [key]: event.target.value });
    };
  };

  const editSignUp = (key) => {
    return (event) => {
      setSignUpData({ ...signUpData, [key]: event.target.value });
    };
  };

  const changeFile = (event) => {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      setPhoto(fileInput.files[0]);
    } else {
      setPhoto(null);
    }
  };

  const submit = () => {
    if (selectedTab === "login") {
      dispatch(
        login_fn({
          username: loginData.userName,
          password: loginData.password,
        })
      );
    } else {
      dispatch(
        signup_fn({
          username: signUpData.userName,
          email: signUpData.email,
          password: signUpData.password,
          confirm_password: signUpData.confirmPassword,
          profile_picture: photo,
        })
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  return (
    <Tabs.Root
      defaultValue="login"
      className="container"
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value)}
    >
      <Tabs.Content value="login" className="inputs">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
          {error && error !== "Invalid token" && (
            <div className="error">{error}</div>
          )}
        </div>
        <div className="input">
          <PersonIcon className="LoginIcon" />
          <input
            type="text"
            placeholder="UserName"
            onChange={editLogin("userName")}
            value={loginData.userName}
            required
          />
        </div>
        <div className="input">
          <LockClosedIcon className="LoginIcon" />
          <input
            type="password"
            placeholder="Password"
            onChange={editLogin("password")}
            value={loginData.password}
            required
          />
        </div>
      </Tabs.Content>
      <Tabs.Content value="signup" className="inputs">
        <div className="header">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
          {error && error !== "Invalid token" && (
            <div className="error">{error}</div>
          )}
        </div>

        <div className="input">
          <PersonIcon className="LoginIcon" />
          <input
            type="text"
            placeholder="UserName"
            onChange={editSignUp("userName")}
            value={signUpData.userName}
            required
          />
        </div>

        <div className="input">
          <CropIcon className="LoginIcon file-input-logo" />
          <label htmlFor="fileInput" className="file-input">
            Select Photo
            <input type="file" id="fileInput" onChange={changeFile} />
          </label>
          {photo && (
            <span id="photo" className="file-input-span">
              {photo.name}
            </span>
          )}
        </div>

        <div className="input">
          <EnvelopeClosedIcon className="LoginIcon" />
          <input
            type="email"
            placeholder="Email Id"
            onChange={editSignUp("email")}
            value={signUpData.email}
            required
          />
        </div>

        <div className="input">
          <LockClosedIcon className="LoginIcon" />
          <input
            type="password"
            placeholder="Password"
            onChange={editSignUp("password")}
            value={signUpData.password}
            required
          />
        </div>

        <div className="input">
          <LockClosedIcon className="LoginIcon" />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={editSignUp("confirmPassword")}
            value={signUpData.confirmPassword}
            required
          />
        </div>
      </Tabs.Content>
      <Tabs.List aria-label="Tabs" className="submit-container">
        <Tabs.Trigger value="login" className={"submit"}>
          Login
        </Tabs.Trigger>
        <button className="submit btn" onClick={submit}>
          Submit
        </button>
        <Tabs.Trigger value="signup" className={"submit"}>
          Sign Up
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default LoginSignup;
