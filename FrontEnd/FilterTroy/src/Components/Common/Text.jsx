import React from "react";
import "./Theme/Text.scss";

const Text = (props) => {
  return (
    <div className="TextContainer">
      <input
        type={props.type}
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

export default Text;
