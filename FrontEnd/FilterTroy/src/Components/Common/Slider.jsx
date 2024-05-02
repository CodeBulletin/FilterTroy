import React from "react";
import "./Slider.scss";

const Slider = (props) => {
  return (
    <div className="SliderContainer">
      <input
        type="range"
        id={props.id}
        name={props.id}
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      <label
        htmlFor={props.id}
        style={{
          paddingLeft: "1rem",
        }}
      >
        {props.value}
      </label>
    </div>
  );
};

export default Slider;
