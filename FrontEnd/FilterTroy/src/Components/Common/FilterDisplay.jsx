import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Theme/FilterDisplay.scss";
import { useSelector } from "react-redux";
import {
  HeartIcon,
  HeartFilledIcon,
  StarIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import forkIcon from "../../assets/fork.svg";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./spinner";

const FilterDisplay = ({
  filter_id,
  initial_pos,
  enable_slider,
  variant = "full",
  globalFontSizeInRem = 1,
}) => {
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [silderValue, setSliderValue] = useState(
    variant === "full" ? initial_pos : 0
  );
  const token = useSelector((state) => state.auth.jwt);

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/filter/${filter_id}`
      );

      const extra_response = await axios.get(
        `http://localhost:8000/filter/info/${filter_id}?token=${token}`
      );

      const data = { ...response.data, ...extra_response.data };

      console.log(data);
      setFilter(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(err));
      setLoading(false);
      setFilter(null);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: variant === "full" ? "80%" : "90%",
          width: "100%",
        }}
      >
        <Spinner
          size={globalFontSizeInRem * 5 + "rem"}
          thickness={globalFontSizeInRem + "rem"}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      <div
        style={{
          width: "100%",
          // height: variant === "full" ? "80%" : "90%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "black",
          borderRadius: variant === "full" ? "0.5rem" : "1rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            clipPath: `polygon(0 0, ${silderValue}% 0, ${silderValue}% 100%, 0 100%)`,
            cursor: "pointer",
          }}
          onClick={() => {
            if (filter) {
              navigate(`/filter/${filter_id}`);
            }
          }}
        >
          {variant === "full" && (
            <span
              style={{
                color: "black",
                position: "absolute",
                top: 0,
                left: 0,
                margin: "10px",
                fontSize: globalFontSizeInRem * 0.75 + "rem",
                backgroundColor: "#FFFFFFA0",
                padding: "5px",
                paddingTop: "2px",
                paddingBottom: "2px",
                borderRadius: "1rem",
                zIndex: 3,
              }}
            >
              {" "}
              Original
            </span>
          )}
          <img
            src={filter.input_image_path}
            alt=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 2,
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${silderValue}% 100%, ${silderValue}% 0, 0 0)`,
            cursor: "pointer",
          }}
          onClick={() => {
            if (filter) {
              navigate(`/filter/${filter_id}`);
            }
          }}
        >
          {variant === "full" && (
            <span
              style={{
                color: "black",
                position: "absolute",
                top: 0,
                right: 0,
                margin: "10px",
                fontSize: globalFontSizeInRem * 0.75 + "rem",
                backgroundColor: "#FFFFFFA0",
                padding: "5px",
                paddingTop: "2px",
                paddingBottom: "2px",
                borderRadius: "1rem",
                zIndex: 3,
              }}
            >
              {" "}
              Filtered
            </span>
          )}
          <img
            src={filter.output_image_path}
            alt=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "fill",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
        {enable_slider && variant === "full" && (
          <>
            <div
              style={{
                position: "absolute",
                left: `${silderValue}%`,
                marginLeft: "-1px",
                backgroundColor: "#FBF1D3",
                height: "100%",
                width: "2px",
                zIndex: 3,
              }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={silderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "calc(100% + 10px)",
                zIndex: 3,
                height: "0%",
              }}
              className="FilterDisplay__slider"
            />
          </>
        )}
      </div>

      <div className="FilterDisplay__info">
        <div className="FilterDisplay__info__header">
          <h1
            style={{
              fontSize: globalFontSizeInRem * 1.125 + "rem",
              width: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filter.filter_name}
          </h1>
          <span
            style={{
              fontSize: globalFontSizeInRem + "rem",
              flexGrow: 1,
              paddingLeft: "1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            by <b>{filter.user_name}</b>
          </span>
        </div>
        {variant === "full" && (
          <div className="FilterDisplay__info__description">
            <div className="FilterDisplay__info__description__left">
              <div className="FilterDisplay__info__description__left__item">
                {filter.is_saved ? (
                  <StarFilledIcon
                    color="red"
                    style={{
                      fontSize: globalFontSizeInRem * 0.875 + "rem",
                      width: globalFontSizeInRem * 0.875 + "rem",
                      height: globalFontSizeInRem * 0.875 + "rem",
                    }}
                  />
                ) : (
                  <StarIcon
                    style={{
                      fontSize: globalFontSizeInRem * 0.875 + "rem",
                      width: globalFontSizeInRem * 0.875 + "rem",
                      height: globalFontSizeInRem * 0.875 + "rem",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: globalFontSizeInRem * 0.75 + "rem",
                  }}
                >
                  {filter.saves}
                </span>
              </div>
              <div className="FilterDisplay__info__description__left__item">
                {filter.is_liked ? (
                  <HeartFilledIcon
                    color="red"
                    style={{
                      fontSize: globalFontSizeInRem * 0.875 + "rem",
                      width: globalFontSizeInRem * 0.875 + "rem",
                      height: globalFontSizeInRem * 0.875 + "rem",
                    }}
                  />
                ) : (
                  <HeartIcon
                    style={{
                      fontSize: globalFontSizeInRem * 0.875 + "rem",
                      width: globalFontSizeInRem * 0.875 + "rem",
                      height: globalFontSizeInRem * 0.875 + "rem",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: globalFontSizeInRem * 0.75 + "rem",
                  }}
                >
                  {filter.likes}
                </span>
              </div>
              <div className="FilterDisplay__info__description__left__item">
                <img
                  src={forkIcon}
                  alt=""
                  style={{
                    width: globalFontSizeInRem * 0.875 + "rem",
                    height: globalFontSizeInRem * 0.875 + "rem",
                  }}
                />
                <span
                  style={{
                    fontSize: globalFontSizeInRem * 0.75 + "rem",
                  }}
                >
                  {filter.forks}
                </span>
              </div>
            </div>
            {filter.is_forked && (
              <div className="FilterDisplay__info__description__right">
                <span
                  style={{
                    fontSize: globalFontSizeInRem * 0.75 + "rem",
                  }}
                >
                  forked from{" "}
                  <Link to={`/filter/${filter.is_forked}`} className="link">
                    {filter.forkname}
                  </Link>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterDisplay;
