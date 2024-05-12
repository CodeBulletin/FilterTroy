import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validate_fn, logout } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import {
  StarFilledIcon,
  ThickArrowRightIcon,
  ThickArrowLeftIcon,
  ArrowBottomLeftIcon,
} from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import "./Theme/Profile.scss";
import useMediaQuery from "../../Hooks/useMediaQuery";
import Axios from "axios";
import FilterDisplay from "../Common/FilterDisplay";

const Profile = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const profile_pic = useSelector((state) => state.auth.profile_picture);
  const username = useSelector((state) => state.auth.username);
  const email = useSelector((state) => state.auth.email);
  const [filters, setFilters] = React.useState([]);
  const [tab, setTab] = React.useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(
      validate_fn({
        token: jwt,
      })
    );
    if (!username) {
      navigate("/login");
    }
  }, [username]);
  useEffect(() => {
    if (tab === 1) {
      const data = new FormData();
      data.append("token", jwt);
      Axios.post("http://localhost:8000/browse/saved", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          setFilters(res.data);
        })
        .catch((err) => console.log(err));
      setPage(0);
    } else if (tab === 2) {
      const data = new FormData();
      data.append("token", jwt);
      Axios.post("http://localhost:8000/browse/my", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          setFilters(res.data);
        })
        .catch((err) => console.log(err));
      setPage(0);
    }
  }, [tab]);
  console.log(filters);
  const [page, setPage] = React.useState(0);
  const q_w = useMediaQuery("(min-width: 1850px)");
  const q_h = useMediaQuery("(min-height: 1440px)");
  const rows = q_h ? 4 : 3;
  const cols = q_w ? 5 : 4;
  const per_page = rows * cols;
  const pages = Math.ceil(filters.length / per_page);
  return (
    <div
      style={{
        flexGrow: 1,
        backgroundColor: "#FDF6E3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          backgroundColor: "#FBF1D3",
          width: "100%",
          height: "20%",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={profile_pic}
              alt="Profile Picture"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "black",
                padding: "0",
                margin: "0",
              }}
            >
              {username}
            </h1>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "black",
                padding: "0",
                margin: "0",
              }}
            >
              {email}
            </h2>
          </div>
        </div>
        <button
          className="profileLogoutButton"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </div>
      <Tabs.Root
        defaultValue={`${tab}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          width: "100%",
        }}
        onValueChange={(value) => setTab(parseInt(value))}
      >
        <Tabs.List
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Tabs.Trigger
            value="1"
            className="profileTabButton"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            Stared
            <StarFilledIcon />
          </Tabs.Trigger>
          <Tabs.Trigger value="2" className="profileTabButton">
            My Filters
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="1"
          style={{
            display: tab === 1 ? "grid" : "none",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            flexGrow: 1,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            width: "100%",
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          {filters.slice(page * per_page, (page + 1) * per_page).map((fid) => (
            <div
              style={{
                width: "300px",
                height: "200px",
                display: "flex",
                alignSelf: "center",
                justifySelf: "center",
              }}
              key={fid}
            >
              <FilterDisplay
                filter_id={fid}
                initial_pos={0}
                enable_slider={false}
                variant="small"
                globalFontSizeInRem={1}
              />
            </div>
          ))}
        </Tabs.Content>
        <Tabs.Content
          value="2"
          style={{
            display: tab === 2 ? "grid" : "none",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            flexGrow: 1,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            width: "100%",
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          {filters.slice(page * per_page, (page + 1) * per_page).map((fid) => (
            <div
              style={{
                width: "300px",
                height: "200px",
                display: "flex",
                alignSelf: "center",
                justifySelf: "center",
              }}
              key={fid}
            >
              <FilterDisplay
                filter_id={fid}
                initial_pos={0}
                enable_slider={false}
                variant="small"
                globalFontSizeInRem={1}
              />
            </div>
          ))}
        </Tabs.Content>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <ThickArrowLeftIcon
              style={{
                width: "30px",
                height: "30px",
                color: page === 0 || page === pages - 1 ? "gray" : "black",
              }}
            />
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
      </Tabs.Root>
    </div>
  );
};

export default Profile;
