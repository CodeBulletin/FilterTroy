import React from "react";
import "./Theme/Checkbox.scss";

const Checkbox = (props) => {
  return (
    <div className="checkboxContainer">
      <input
        type="checkbox"
        id={props.id}
        name={props.id}
        checked={props.value}
        onChange={(e) => {
          props.onChange(props.value);
        }}
      />
    </div>
  );
};

export default Checkbox;
