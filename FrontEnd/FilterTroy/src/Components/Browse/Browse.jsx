import React, { useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const Browse = () => {
  const [filters, setFilters] = React.useState([]);
  useEffect(() => {
    Axios.get("http://localhost:8000/filter/")
      .then((res) => {
        setFilters(res.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <div>
      {filters.map((filter) => {
        return (
          <div key={filter}>
            <Link to={"/filter/" + filter}>{filter}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Browse;
