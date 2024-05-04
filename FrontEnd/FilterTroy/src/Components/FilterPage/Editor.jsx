import React, { useState } from "react";
import AceEditor from "react-ace";
import "./Theme/Editor.scss";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/python";
import SelectComp from "../Common/Select";

import { useDispatch, useSelector } from "react-redux";

const Editor = (props) => {
  return (
    <div className="Editor">
      <div className="EditorHeader">
        <div className="EditorTitle">{props.title}</div>
        <div className="EditorHeaderButtonContainer">
          {props.onSave !== null && (
            <button
              className="EditorButton"
              onClick={() => {
                if (props.onSave !== null) props.onSave(props.code);
              }}
            >
              Save
            </button>
          )}
          {props.onRun !== null && (
            <button className="EditorButton">Run</button>
          )}
        </div>
      </div>
      <div className="EditorContainer">
        <AceEditor
          mode={props.mode}
          theme="solarized_light"
          name="editor"
          placeholder={props.desc}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          width="100%"
          height="100%"
          value={props.code}
          onChange={(value) => props.onChange(value)}
          setOptions={{
            useWorker: props.mode === "python",
          }}
          fontSize={`${props.fontSize}px`}
          lineHeight={`${parseInt(props.fontSize) + 2}px`}
        />
      </div>
      <div className="EditorInfoContainer">
        <div className="EditorInfo">Number of Chars: {props.code.length}</div>
        <SelectComp
          value={props.fontSize}
          onChange={props.onFontSizeChange}
          options={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((size) => ({
            value: size,
            label: size,
          }))}
        />
        {props.includeTime && (
          <div className="EditorInfo">Compilation Time: 1s</div>
        )}
      </div>
    </div>
  );
};

export default Editor;
