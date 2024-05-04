import * as Tabs from "@radix-ui/react-tabs";
import React, { useEffect } from "react";
import "./Theme/FilterTabs.scss";
import Editor from "./Editor";
import FilterView from "./FilterView";
import { useDispatch, useSelector } from "react-redux";
import {
  setCode,
  setVariables,
  setEditorFontSize,
  setVariablesValues,
} from "../../Redux/filterSlice";

const FilterTabs = () => {
  const code = useSelector((state) => state.filter.code);
  const variables = useSelector((state) => state.filter.variables);
  const fontSize = useSelector((state) => state.filter.editorFontSize);
  const dispatch = useDispatch();

  const onVariablesSave = (value) => {
    console.log("saving variables");
    const vars = JSON.parse(value);
    const keys = Object.keys(vars);
    const vals = keys.reduce((acc, key) => {
      acc[key] = vars[key].value;
      return acc;
    }, {});
    dispatch(setVariablesValues(vals));
  };

  return (
    <Tabs.Root className="TabRoot" defaultValue="View">
      <Tabs.List aria-label="Filters" className="TabList">
        <Tabs.Trigger value="View" className="TabTrigger">
          View
        </Tabs.Trigger>
        <Tabs.Trigger value="Code" className="TabTrigger">
          Code
        </Tabs.Trigger>
        <Tabs.Trigger value="Variables" className="TabTrigger">
          Variables
        </Tabs.Trigger>
        <Tabs.Trigger value="Console" className="TabTrigger">
          Console
        </Tabs.Trigger>
      </Tabs.List>
      <div className="filterWindow">
        <Tabs.Content value="View" className="TabContent">
          <FilterView />
        </Tabs.Content>
        <Tabs.Content value="Code" className="TabContent">
          <Editor
            mode={"python"}
            desc={"write your filter code here"}
            title={"Code Editor"}
            code={code}
            onChange={(value) => dispatch(setCode(value))}
            onFontSizeChange={(value) => dispatch(setEditorFontSize(value))}
            fontSize={fontSize}
            onSave={null}
            onRun={null}
            includeTime
          />
        </Tabs.Content>
        <Tabs.Content value="Variables" className="TabContent">
          <Editor
            mode={"json"}
            desc={"write your variables here"}
            title={"Variable Editor"}
            code={variables}
            onChange={(value) => dispatch(setVariables(value))}
            onFontSizeChange={(value) => dispatch(setEditorFontSize(value))}
            onSave={onVariablesSave}
            onRun={null}
            fontSize={fontSize}
          />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

export default FilterTabs;
