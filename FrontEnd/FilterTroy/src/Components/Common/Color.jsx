import React from "react";
import "./Color.scss";

const Color = (props) => {
  return (
    <div className="ColorContainer">
      <input
        type="color"
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default Color;
