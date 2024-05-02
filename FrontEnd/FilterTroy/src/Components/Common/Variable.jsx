import React, { useEffect, useState } from "react";
import Text from "./Text";
import Color from "./Color";
import SelectComp from "./Select";
import Checkbox from "./Checkbox";
import Slider from "./Slider";

import "./Variable.scss";
import { useSelector, useDispatch } from "react-redux";
import { setVariablesValues } from "../../Redux/filterSlice";

const Variable = ({ id, label, type, dtype, val, other }) => {
  const dispatch = useDispatch();
  const variables = useSelector((state) => state.filter.variablesValues);
  const [value, setValue] = useState(variables[id] || val);
  useEffect(() => {
    dispatch(
      setVariablesValues({
        ...variables,
        [id]: value,
      })
    );
  }, [value]);
  console.log(variables);
  return (
    <div className="Variable">
      <label htmlFor={id}>{label}</label>
      <div>
        {type == "text" ? (
          <Text id={id} type={dtype} value={value} onChange={setValue} />
        ) : type == "color" ? (
          <Color id={id} value={value} onChange={setValue} />
        ) : type == "select" ? (
          <SelectComp
            id={id}
            value={value}
            options={other.options}
            onChange={setValue}
          />
        ) : type == "checkbox" ? (
          <Checkbox id={id} value={value} onChange={setValue} />
        ) : type == "slider" ? (
          <Slider
            id={id}
            value={value}
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
