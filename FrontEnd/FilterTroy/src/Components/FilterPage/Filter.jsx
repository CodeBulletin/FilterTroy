import React, { useEffect } from "react";
import FilterTabs from "./FilterTabs";
import "./Theme/Filter.scss";
import { useSelector, useDispatch } from "react-redux";

import { setOpenMode } from "../../Redux/filterSlice";
import { validate_fn } from "../../Redux/authSlice";

const Filter = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const isLogged = useSelector((state) => state.auth.isLogged);

  const openMode = useSelector((state) => state.filter.openMode);

  useEffect(() => {
    dispatch(
      validate_fn({
        token: jwt,
      })
    );
  }, []);

  return (
    <div className="filterMainArea">
      {(openMode === "New" || openMode === "Clone") && !isLogged ? (
        <div>Login to create a new filter or clone an existing one</div>
      ) : (
        <>
          <div className="filterDetails">
            <div className="filterDetailsPanel">
              <input type="text" placeholder="Filter Name" />
              <textarea placeholder="Filter Description" />
              <button>Save</button>
            </div>
          </div>
          <FilterTabs />
        </>
      )}
    </div>
  );
};

export default Filter;
