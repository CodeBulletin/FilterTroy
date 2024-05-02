import React from "react";
import "./Checkbox.scss";

const Checkbox = (props) => {
  return (
    <div className="checkboxContainer">
      <input
        type="checkbox"
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

export default Checkbox;
