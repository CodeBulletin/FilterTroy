import React, { useEffect, useState } from "react";
import "./Theme/FilterView.scss";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Dialog from "@radix-ui/react-dialog";
import SelectComp from "../Common/Select";
import Variable from "../Common/Variable";

import { Cross2Icon, DownloadIcon, UploadIcon } from "@radix-ui/react-icons";

import { useSelector, useDispatch } from "react-redux";
import {
  setEditorOrientation,
  setInputImagePath,
  setOutputImagePath,
} from "../../Redux/filterSlice";
import {
  setInputImage,
  setOutputImage,
  setVariablesValue,
} from "../../Redux/localSlice";
import { setEditorLocalOrientation } from "../../Redux/localSlice";

import axios from "axios";

import { strtojson } from "../../Utils/utils";
import Spinner from "../Common/spinner";

const FilterView = ({ handleApply }) => {
  const filterSettingsCode = useSelector((state) => state.filter.variables);

  const code = useSelector((state) => state.filter.code);

  const filterSettings = strtojson(filterSettingsCode);

  const InputImagePath = useSelector((state) => state.filter.InputImagePath);
  const OutputImagePath = useSelector((state) => state.filter.OutputImagePath);
  const localInputImage = useSelector(
    (state) => state.localNoPresist.localInputImage
  );
  const localOutputImage = useSelector(
    (state) => state.localNoPresist.localOutputImage
  );

  const localOrientation = useSelector(
    (state) => state.localNoPresist.editorLocalOrientation
  );

  const globalOrientation = useSelector(
    (state) => state.filter.editorOrientation
  );

  const orientation = localOrientation || globalOrientation || "0";

  const inputPath =
    localInputImage || (InputImagePath !== "" ? InputImagePath : null);
  const outputPath =
    localOutputImage || (OutputImagePath !== "" ? OutputImagePath : null);

  const variablesValue = useSelector(
    (state) => state.localNoPresist.variablesValue
  );

  const processing = useSelector((state) => state.filter.processing);
  const dispatch = useDispatch();

  const handleVariableChange = (id) => {
    return (value) => {
      dispatch(setVariablesValue({ ...variablesValue, [id]: value }));
    };
  };
  return (
    <div
      className="filterView"
      style={{
        display: "flex",
        flexDirection:
          orientation === "0" || orientation == "2" ? "column" : "row",
      }}
    >
      <div
        className="ImagePanel"
        style={{
          flexDirection:
            orientation === "0" || orientation == "1" ? "row" : "column",
        }}
      >
        <div
          className="ImageOuterContainer"
          style={{
            width: orientation === "0" || orientation == "1" ? "50%" : "100%",
            height: orientation === "0" || orientation == "1" ? "100%" : "50%",
          }}
        >
          {inputPath !== null && inputPath !== "null" ? (
            <div className="ImageInnerContainer">
              <div className="heading">
                <div className="badge">Original Image</div>
                <div className="functions">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = inputPath;
                      link.download = "inputImage.png";
                      link.click();
                    }}
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    onClick={() => {
                      dispatch(setInputImage(null));
                      dispatch(setInputImagePath(""));
                      dispatch(setOutputImagePath(""));
                    }}
                  >
                    <Cross2Icon />
                  </button>
                </div>
              </div>
              <img src={inputPath} alt="Input Image" />
            </div>
          ) : (
            <div className="Uploadable">
              <label htmlFor="f_inputfile">
                <UploadIcon />
              </label>
              <span style={{ color: "white" }}>
                Upload Image to Apply Filter
              </span>
              <input
                type="file"
                id="f_inputfile"
                name="f_inputfile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const arraybuffer = new FileReader();
                  arraybuffer.onload = function () {
                    const data = arraybuffer.result;
                    dispatch(setInputImage(data));
                  };
                  arraybuffer.readAsDataURL(file);
                }}
              />
            </div>
          )}
        </div>
        <div
          className="ImageOuterContainer"
          style={{
            width: orientation === "0" || orientation == "1" ? "50%" : "100%",
            height: orientation === "0" || orientation == "1" ? "100%" : "50%",
          }}
        >
          {processing === false &&
          outputPath !== null &&
          outputPath !== "null" ? (
            <div className="ImageInnerContainer">
              <div className="heading">
                <div className="badge">Filtered Image</div>
                <div className="functions">
                  <button>
                    <DownloadIcon />
                  </button>
                  <button onClick={() => dispatch(setOutputImage(null))}>
                    <Cross2Icon />
                  </button>
                </div>
              </div>
              <img src={outputPath} alt="Output Image" />
            </div>
          ) : processing === true ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner thickness="8px" size="50px" />
            </div>
          ) : (
            <div className="Uploadable">
              <span>Apply Filter to see the Output Image</span>
            </div>
          )}
        </div>
      </div>
      <div
        className="FilterSettings"
        style={{
          flex:
            orientation === "0"
              ? "0 0 60%"
              : orientation === "1"
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
            value={orientation}
            onChange={(v) => {
              dispatch(setEditorLocalOrientation(v));
            }}
          />
          <button
            onClick={() => {
              handleApply();
            }}
          >
            Apply
          </button>
          {/* Send Code to Backend For Testing */}
          {/* A Simple FIle Input */}
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
                  value={variablesValue[key] || ""}
                  setValue={handleVariableChange(key)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FilterView;
