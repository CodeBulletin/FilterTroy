import { CornerBottomLeftIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import React from "react";

const Reply = ({ reply, UserName, On, UserPic }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%) translateX(-100%)",
          left: "-1rem",
        }}
      >
        <CornerBottomLeftIcon
          style={{
            marginTop: "-0.25rem",
          }}
        />
        <TriangleRightIcon
          style={{
            marginLeft: "-0.563rem",
          }}
        />
      </div>
      <div
        style={{
          alignItems: "center",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          margin: "10px 0",
          backgroundColor: "#FCF5E2",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            marginRight: "1rem",
            float: "left",
          }}
        >
          <img
            src={UserPic}
            alt=""
            style={{
              width: "55px",
              height: "55px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "1rem",
            }}
          >
            {UserName}
          </h3>
          <h3
            style={{
              margin: "0",
              fontSize: "0.875rem",
              fontWeight: "normal",
            }}
          >
            {On}
          </h3>
        </div>
        <p
          style={{
            margin: "0",
            fontSize: "0.875rem",
          }}
        >
          {reply}
        </p>
      </div>
    </div>
  );
};

export default Reply;
