import React from "react";
import "./Select.scss";

const SelectComp = (props) => {
  return (
    <div className="SelectContainer">
      <select
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        className="Select"
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComp;
