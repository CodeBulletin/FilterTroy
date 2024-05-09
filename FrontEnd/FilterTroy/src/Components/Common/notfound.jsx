import React from "react";
import "./Theme/notfound.scss";
import { useNavigate } from "react-router-dom";

const NotFoundPage = ({ message }) => {
  const navigate = useNavigate(); // Hook for navigation

  const goToHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="not-found-container">
      <div className="not-found-message">
        <h1 className="not-found-heading">404</h1>
        <p className="not-found-text">
          {message || "The page you're looking for can't be found."}
        </p>
        <button onClick={goToHome} className="home-button">
          Go Back Home
        </button>{" "}
        {/* Button to go back home */}
      </div>
    </div>
  );
};

export default NotFoundPage;
