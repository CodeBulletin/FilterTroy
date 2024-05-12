import React, { useEffect } from "react";
import Axios from "axios";
import {
  ChatBubbleIcon,
  Cross1Icon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import Reply from "./Reply";

const Comment = ({ comment, comment_id, UserName, On, UserPic }) => {
  const [showReply, setShowReply] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const [addReply, setAddReply] = React.useState(false);
  const jwt = useSelector((state) => state.auth.jwt);
  const [replies, setReplies] = React.useState([]);
  const postReply = () => {
    const form = new FormData();
    form.append("reply", reply);
    form.append("token", jwt);
    Axios.post(`http://localhost:8000/comment/reply/${comment_id}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((_) => {
      Axios.get(`http://localhost:8000/comment/reply/all/${comment_id}`).then(
        (res) => {
          setReplies(res.data);
          setReply("");
          setAddReply(false);
        }
      );
    });
  };

  useEffect(() => {
    Axios.get(`http://localhost:8000/comment/reply/all/${comment_id}`).then(
      (res) => {
        setReplies(res.data);
      }
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
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
          {comment}
        </p>
        <div
          style={{
            float: "right",
            boxSizing: "border-box",
          }}
        >
          <a
            onClick={() => {
              setShowReply(!showReply);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              boxSizing: "border-box",
            }}
          >
            <ChatBubbleIcon />
          </a>
        </div>
      </div>
      {showReply && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "3rem",
          }}
        >
          {addReply && jwt && (
            <div className="commentInput">
              <textarea
                placeholder="Add a reply"
                onChange={(e) => {
                  if (e.target.value.length > 200) return;
                  setReply(e.target.value);
                }}
                value={reply}
                style={{
                  width: "100%",
                  height: "74px",
                  padding: "10px",
                  boxSizing: "border-box",
                  borderRadius: "10px",
                  border: "none",
                  marginBottom: "10px",
                }}
              ></textarea>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {reply.length} / 200
                  {reply.length === 200 && (
                    <span style={{ color: "red" }}> (Max)</span>
                  )}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setReply("");
                      setAddReply(false);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    <Cross1Icon />
                  </button>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                    }}
                    onClick={postReply}
                  >
                    <PaperPlaneIcon />
                  </button>
                </div>
              </div>
            </div>
          )}
          {!addReply && jwt && (
            <button
              onClick={() => setAddReply(true)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <span>Add Reply</span>
              <PaperPlaneIcon />
            </button>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {replies.map((reply, index) => (
              <Reply
                key={index}
                reply={reply.Reply}
                UserName={reply.UserName}
                UserPic={reply.ProfilePicPath}
                On={reply.CreatedOn}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
