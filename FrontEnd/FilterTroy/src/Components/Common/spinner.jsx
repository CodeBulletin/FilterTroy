import React from "react";
import "./Theme/spinner.scss"; // Ensure this path is correct

const Spinner = ({ size = "120px", thickness = "8px" }) => {
  return (
    <div
      className="spinner"
      style={{
        "--spinner-size": size,
        "--spinner-thickness": thickness,
      }}
    ></div>
  );
};

export default Spinner;
