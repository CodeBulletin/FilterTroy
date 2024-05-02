import React, { useEffect, useState } from "react";
import "./Theme/FilterView.scss";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Dialog from "@radix-ui/react-dialog";
import SelectComp from "../Common/Select";
import Variable from "../Common/Variable";

import { Cross2Icon } from "@radix-ui/react-icons";

import { useSelector, useDispatch } from "react-redux";
import { setEditorOrientation } from "../../Redux/filterSlice";

import axios from "axios";

const strtojson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const FilterView = () => {
  const [viewType, setViewType] = useState("0"); // 0 = Landscape, 1 = Portrait, 2 = ultraWide
  const filterSettingsCode = useSelector((state) => state.filter.variables);
  const code = useSelector((state) => state.filter.code);
  const filterSettings = strtojson(filterSettingsCode);
  const variablesValues = useSelector((state) => state.filter.variablesValues);
  const [imgSrc, setImgSrc] = useState(null);
  const dispatch = useDispatch();
  return (
    <div
      className="filterView"
      style={{
        display: "flex",
        flexDirection: viewType === "0" || viewType == "2" ? "column" : "row",
      }}
    >
      <div
        className="ImagePanel"
        style={{
          display: "flex",
          flexDirection: viewType === "0" || viewType == "1" ? "row" : "column",
          minHeight: 0,
          flexGrow: 1,
          flexBasis: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexShrink: 0,
            flexGrow: 1,
            flexBasis: 0,
            flexDirection:
              viewType === "0" || viewType === "1" ? "row" : "column",
          }}
        >
          {/* <div className="FilterImagePannel">
            <img src="/images.jpg" alt="Input Image" />
          </div>
          <div className="FilterImagePannel">
            <img src="/Image1.jpg" alt="Input Image" />
          </div> */}
          {imgSrc !== null ? (
            <div className="FilterImagePannel">
              <img src={imgSrc} alt="Input Image" />
            </div>
          ) : null}
        </div>
      </div>
      <div
        className="FilterSettings"
        style={{
          flex:
            viewType === "0"
              ? "0 0 60%"
              : viewType === "1"
              ? "0 0 33%"
              : "0 0 33%",
        }}
      >
        <div className="FilterSettingsHeader">
          <div className="FilterSettingsTitle">Filter Settings</div>
          <SelectComp
            id="FilterType"
            options={[
              {
                value: "0",
                label: "Landscape",
              },
              {
                value: "1",
                label: "Portrait",
              },
              {
                value: "2",
                label: "Ultra Wide",
              },
            ]}
            value={viewType}
            onChange={setViewType}
          />
          {/* Send Code to Backend For Testing */}
          {/* A Simple FIle Input */}
          <input type="file" id="test" />
          <button
            onClick={() => {
              // Convert json to string
              const vars = JSON.stringify(variablesValues);
              // Get File From Input
              const file = document.getElementById("test").files[0];
              const formData = new FormData();
              formData.append("image", file);
              formData.append("code", code);
              formData.append("vars", vars);

              axios
                .post("http://localhost:8000/filter", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  responseType: "blob",
                })
                .then((res) => {
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  setImgSrc(url);
                });
            }}
            className="ApplyButton"
          >
            Apply
          </button>
        </div>
        <div className="FilterSettingsBody">
          {filterSettings !== null &&
            Object.keys(filterSettings).map((key) => {
              const settings = filterSettings[key];
              return (
                <Variable
                  label={key}
                  id={key}
                  key={key}
                  type={settings["type"]}
                  dtype={settings["dtype"]}
                  val={settings["value"]}
                  other={{
                    options: settings["options"],
                    min: settings["min"],
                    max: settings["max"],
                    step: settings["step"],
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FilterView;
