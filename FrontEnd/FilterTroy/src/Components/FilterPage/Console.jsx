import React from "react";
import "./Theme/Console.scss";
import { useSelector, useDispatch } from "react-redux";
import { clearConsoleError } from "../../Redux/filterSlice";

const Console = () => {
  const consoleError = useSelector((state) => state.filter.consoleError);
  const editorFontSize = useSelector((state) => state.local.editorFontSize);
  const dispatch = useDispatch();
  return (
    <div className="consoleContainer">
      <div className="errorContainer">
        <div className="errorHeader">Console</div>
        <pre className="errorBody" style={{ fontSize: `${editorFontSize}px` }}>
          {consoleError === null ? "" : consoleError}
        </pre>
        <button
          className="clearButton"
          onClick={() => dispatch(clearConsoleError())}
        >
          Clear Console
        </button>
      </div>
    </div>
  );
};

export default Console;
