import React from "react";
import FilterTabs from "./FilterTabs";
import "./Theme/Filter.scss";

const Filter = () => {
  return (
    <div className="filterMainArea">
      <div className="filterDetails"></div>
      <FilterTabs />
    </div>
  );
};

export default Filter;
