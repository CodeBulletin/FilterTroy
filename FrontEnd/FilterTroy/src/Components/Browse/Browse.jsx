import React, { useEffect } from "react";
import Axios from "axios";
import FilterDisplay from "../Common/FilterDisplay";
import SelectComp from "../Common/Select";
import useMediaQuery from "../../Hooks/useMediaQuery";
import "./Theme/Browse.scss";
import {
  MagnifyingGlassIcon,
  ThickArrowLeftIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";

const Browse = () => {
  const [browseFilters, setBrowseFilters] = React.useState({
    id: "",
    nameLike: "",
    byUser: "",
    forkedFrom: "",
    sortBy: "",
    sortOrder: "",
  });
  const [filters, setFilters] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const q_w = useMediaQuery("(min-width: 1850px)");
  const q_h = useMediaQuery("(min-height: 1150px)");
  const rows = q_h ? 3 : 2;
  const cols = q_w ? 3 : 2;
  const per_page = rows * cols;
  const pages = Math.ceil(filters.length / per_page);

  useEffect(() => {
    Axios.post("http://localhost:8000/browse/", {
      id: "",
      nameLike: "",
      byUser: "",
      forkedFrom: "",
      sortBy: "",
      sortOrder: "",
    })
      .then((res) => {
        setFilters(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      style={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#FDF6E3",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          height: "100%",
          backgroundColor: "#FBF1D3",
          padding: "2rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          position: "relative",
        }}
        className="browse_container"
      >
        <div>
          <h1>Search Filters</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label htmlFor="b_id">#ID</label>
          <input
            type="text"
            value={browseFilters.id}
            id="b_id"
            name="b_id"
            onChange={(e) =>
              setBrowseFilters({ ...browseFilters, id: e.target.value })
            }
            className="browse_input"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label htmlFor="b_nameLike">Name</label>
          <input
            type="text"
            value={browseFilters.nameLike}
            id="b_nameLike"
            name="b_nameLike"
            onChange={(e) =>
              setBrowseFilters({ ...browseFilters, nameLike: e.target.value })
            }
            className="browse_input"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label htmlFor="b_byUser">By User</label>
          <input
            type="text"
            value={browseFilters.byUser}
            id="b_byUser"
            name="b_byUser"
            onChange={(e) =>
              setBrowseFilters({ ...browseFilters, byUser: e.target.value })
            }
            className="browse_input"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label htmlFor="b_forkedFrom">Forked From #ID</label>
          <input
            type="text"
            value={browseFilters.forkedFrom}
            id="b_forkedFrom"
            name="b_forkedFrom"
            onChange={(e) =>
              setBrowseFilters({ ...browseFilters, forkedFrom: e.target.value })
            }
            className="browse_input"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <label
            htmlFor="b_sortBy"
            style={{
              textAlign: "center",
            }}
          >
            Sort By
          </label>
          <SelectComp
            onChange={(val) =>
              setBrowseFilters({ ...browseFilters, sortBy: val })
            }
            value={browseFilters.sortBy}
            options={[
              { value: "", label: "none" },
              { value: "LikeCount", label: "likes" },
              { value: "SaveCount", label: "stars" },
              { value: "ForkCount", label: "forks" },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <label
            htmlFor="b_sortOrder"
            style={{
              textAlign: "center",
            }}
          >
            Sort Order
          </label>
          <SelectComp
            onChange={(val) =>
              setBrowseFilters({ ...browseFilters, sortOrder: val })
            }
            value={browseFilters.sortOrder}
            options={[
              { value: "asc", label: "ascending" },
              { value: "desc", label: "descending" },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <button
            onClick={() => {
              Axios.post("http://localhost:8000/browse/", browseFilters)
                .then((res) => setFilters(res.data))
                .catch((err) => console.log(err));
            }}
            className="browse_button"
          >
            <MagnifyingGlassIcon style={{ width: "20px", height: "20px" }} />
            <span>Search</span>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            position: "absolute",
            bottom: "0",
            justifyContent: "center",
            gap: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: page === 0 || page === pages - 1 ? "gray" : "black",
            }}
          >
            <ThickArrowLeftIcon style={{ width: "30px", height: "30px" }} />
          </button>
          <span>
            {page + 1}/{pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pages - 1}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: page === 0 || page === pages - 1 ? "gray" : "black",
            }}
          >
            <ThickArrowRightIcon style={{ width: "30px", height: "30px" }} />
          </button>
        </div>
      </div>
      <div
        style={{
          width: "85%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {filters.slice(page * per_page, (page + 1) * per_page).map((fid) => (
          <div
            style={{
              width: "500px",
              height: "350px",
              display: "flex",
              alignSelf: "center",
              justifySelf: "center",
            }}
            key={fid}
          >
            <FilterDisplay
              filter_id={fid}
              initial_pos={50}
              enable_slider={true}
              variant="full"
              globalFontSizeInRem={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
