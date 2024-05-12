import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterDisplay from "../Common/FilterDisplay";
import { useSelector } from "react-redux";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

import "./Theme/HomePage.scss";

const HomePage = () => {
  const user = useSelector((state) => state.auth.jwt);
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/browse/top")
      .then((res) => {
        setFilters(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
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
          height: "70%",
          display: "flex",
        }}
      >
        {filters[0] ? (
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              padding: "3rem",
              boxSizing: "border-box",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "10%",
                width: "100%",
                fontSize: "3rem",
                fontWeight: "bold",
                fontFamily: "Lobster, Tahoma, Arial",
              }}
            >
              Filter of the week
            </div>
            <div
              style={{
                height: "90%",
                width: "100%",
                display: "flex",
              }}
            >
              <FilterDisplay
                filter_id={filters[0]}
                initial_pos={50}
                enable_slider={true}
                variant="full"
                globalFontSizeInRem={1.5}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              fontWeight: "bold",
              fontFamily: "Lobster, Tahoma, Arial",
              color: "#FC8020",
              marginBottom: "2rem",
            }}
          >
            FilterTroy
          </div>
          <div
            style={{
              width: "70%",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            FilterTroy invites you to dive into the dynamic world of
            Python-based image processing. Here, you can learn, create, and
            share custom filters with a vibrant community of enthusiasts and
            experts.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "50%",
            }}
          >
            <button
              style={{ marginTop: "2rem" }}
              className="largeButton"
              onClick={() => navigate("/browse")}
            >
              Explore
              <ExternalLinkIcon
                style={{ marginLeft: "0.5rem" }}
                className="svgIcon"
              />
            </button>
            {user ? (
              <button
                style={{ marginTop: "2rem" }}
                className="largeButton"
                onClick={() => navigate("/filter/new")}
              >
                Create
                <ExternalLinkIcon
                  style={{ marginLeft: "0.5rem" }}
                  className="svgIcon"
                />
              </button>
            ) : (
              <button
                style={{ marginTop: "2rem" }}
                className="largeButton"
                onClick={() => navigate("/login")}
              >
                Login
                <ExternalLinkIcon
                  style={{ marginLeft: "0.5rem" }}
                  className="svgIcon"
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {filters.slice(1).map((filter_id, index) => (
          <div
            style={{
              width: "25%",
              height: "100%",
              display: "flex",
              paddingLeft: "3rem",
              paddingRight: "3rem",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              boxSizing: "border-box",
            }}
          >
            <FilterDisplay
              key={index}
              filter_id={filter_id}
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

export default HomePage;
