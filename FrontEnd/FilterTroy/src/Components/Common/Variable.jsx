import React, { useEffect, useState, useRef } from "react";
import Text from "./Text";
import Color from "./Color";
import SelectComp from "./Select";
import Checkbox from "./Checkbox";
import Slider from "./Slider";

import "./Theme/Variable.scss";

const Variable = ({ id, label, type, dtype, val, other, value, setValue }) => {
  return (
    <div className="Variable">
      <label htmlFor={id} className="varLabel">
        {label}
      </label>
      <div className="outerContainer">
        {type == "text" ? (
          <Text id={id} type={dtype} value={value} onChange={setValue} />
        ) : type == "color" ? (
          <Color
            id={id}
            value={value == "" ? "#fff" : value}
            onChange={setValue}
          />
        ) : type == "select" ? (
          <SelectComp
            id={id}
            value={value}
            options={other.options}
            onChange={setValue}
          />
        ) : type == "checkbox" ? (
          <Checkbox
            id={id}
            value={value == "" ? false : value}
            onChange={setValue}
          />
        ) : type == "slider" ? (
          <Slider
            id={id}
            value={value == "" ? "0" : value}
            onChange={setValue}
            min={other.min}
            max={other.max}
            step={other.step}
          />
        ) : (
          <div>Invalid Type</div>
        )}
      </div>
    </div>
  );
};

export default Variable;
