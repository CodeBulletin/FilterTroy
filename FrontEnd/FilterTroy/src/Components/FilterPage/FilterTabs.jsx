import * as Tabs from "@radix-ui/react-tabs";
import React, { useEffect } from "react";
import "./Theme/FilterTabs.scss";
import Editor from "./Editor";
import FilterView from "./FilterView";
import { useDispatch, useSelector } from "react-redux";
import { setCode, setVariables } from "../../Redux/filterSlice";
import { setVariablesValue, setEditorFontSize } from "../../Redux/localSlice";
import Console from "./Console";

const FilterTabs = ({ mode, handleApply }) => {
  const code = useSelector((state) => state.filter.code);
  const variables = useSelector((state) => state.filter.variables);
  const fontSize = useSelector((state) => state.local.editorFontSize);
  const consoleError = useSelector((state) => state.filter.consoleError);
  const dispatch = useDispatch();
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
          Console{" "}
          {consoleError !== null && <span className="errorBadge">!</span>}
        </Tabs.Trigger>
      </Tabs.List>
      <div className="filterWindow">
        <Tabs.Content value="Console" className="TabContent">
          <Console />
        </Tabs.Content>
        <Tabs.Content value="View" className="TabContent">
          <FilterView handleApply={handleApply} />
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
            readOnly={mode === "View"}
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
            onSave={null}
            onRun={null}
            readOnly={mode === "View"}
            fontSize={fontSize}
          />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

export default FilterTabs;
