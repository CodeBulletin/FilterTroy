import React, { useEffect } from "react";
import FilterTabs from "./FilterTabs";
import "./Theme/Filter.scss";
import { useSelector, useDispatch } from "react-redux";
import * as Tabs from "@radix-ui/react-tabs";
import {
  HeartIcon,
  HeartFilledIcon,
  StarIcon,
  StarFilledIcon,
  ExclamationTriangleIcon,
  PaperPlaneIcon,
  Cross2Icon,
  Cross1Icon,
} from "@radix-ui/react-icons";

import { validate_fn } from "../../Redux/authSlice";
import {
  setFilterName,
  setFilterDescription,
  saveFilter,
  getFilter,
  toggleLike,
  toggleSave,
  makeFork,
  clearData,
  apply as applyFilter,
  editFilter,
} from "../../Redux/filterSlice";
import {
  setEditorLocalOrientation,
  setVariablesValue,
  clearLocalData,
} from "../../Redux/localSlice";

import { useParams, useLocation } from "react-router-dom";
import DialogCard from "../Common/Dialog";

import { useNavigate, Link } from "react-router-dom";

import forkIcon from "../../assets/fork.svg";
import Spinner from "../Common/spinner";
import NotFoundPage from "../Common/notfound";
import Comment from "../Common/Comment";

import axios from "axios";

const Filter = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const auth = useSelector((state) => state.auth);
  const userImage = useSelector((state) => state.auth.profile_picture);
  const isLogged = useSelector((state) => state.auth.isLogged);
  const filterData = useSelector((state) => state.filter);
  const localInputImage = useSelector(
    (state) => state.localNoPresist.localInputImage
  );
  const localOutputImage = useSelector(
    (state) => state.localNoPresist.localOutputImage
  );

  const inputImage = localInputImage || filterData.InputImagePath || null;
  const outputImage = localOutputImage || filterData.OutputImagePath || null;

  const localOrientation = useSelector(
    (state) => state.localNoPresist.editorLocalOrientation
  );

  const vars = useSelector((state) => state.localNoPresist.variablesValue);
  const variables = useSelector((state) => state.filter.variables);

  const editorOrientation =
    localOrientation || filterData.editorOrientation || "0";

  const location = useLocation();
  const { filterid } = useParams();

  const isEdit = location.pathname.toLowerCase().includes("edit");
  const isView = filterid && !isEdit;

  const mode = isEdit ? "Edit" : isView ? "View" : "New";

  const forkError = useSelector((state) => state.filter.fork_error);

  const [copyModal, setCopyModal] = React.useState(false);
  const [forkname, setForkName] = React.useState(
    "Fork_" + filterData.filterName
  );

  const [comment, setComment] = React.useState("");
  const [addComment, setAddComment] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      validate_fn({
        token: jwt,
      })
    );
    dispatch(setEditorLocalOrientation(null));
    if (mode !== "View" && !jwt) {
      navigate("/login");
    }
  }, [jwt]);

  useEffect(() => {
    try {
      const vars_parsed = JSON.parse(variables);
      const keys = Object.keys(vars_parsed);
      const vals = keys.reduce((acc, key) => {
        acc[key] = vars_parsed[key].value;
        return acc;
      }, {});
      dispatch(setVariablesValue(vals));
    } catch (e) {}
  }, [variables]);

  useEffect(() => {
    const switch_view = filterData.switch_to_view;
    const id = filterData.filterId;
    setCopyModal(false);
    dispatch(clearData());
    dispatch(clearLocalData());
    if (switch_view === "view") {
      navigate("/filter/" + id + "/");
    } else if (switch_view === "edit") {
      navigate("/filter/edit/" + filterData.fork_id + "/");
    }
  }, [filterData.switch_to_view]);

  useEffect(() => {
    if ((mode === "View" || mode === "Edit") && !filterData.switch_to_view) {
      dispatch(
        getFilter({
          filter_id: filterid,
          token: jwt,
        })
      );
    }
  }, [filterid, filterData.switch_to_view]);

  const handleSave = () => {
    const data = {
      filter_name: filterData.filterName,
      filter_desc: filterData.filterDescription,
      initial_orientation: parseInt(editorOrientation),
      code: filterData.code,
      variables: filterData.variables,
      image_input: inputImage,
      image_output: outputImage,
      token: jwt,
    };
    dispatch(saveFilter(data));
  };

  const handleEdit = () => {
    const data = {
      filter_id: filterid,
      filter_desc: filterData.filterDescription,
      initial_orientation: parseInt(editorOrientation),
      code: filterData.code,
      variables: filterData.variables,
      image_input: inputImage,
      image_output: outputImage,
      token: jwt,
    };
    dispatch(editFilter(data));
  };

  const handleApply = () => {
    dispatch(
      applyFilter({
        code: filterData.code,
        vars: JSON.stringify(vars),
        image: inputImage,
      })
    );
  };
  const [comments, setComments] = React.useState([]);

  const postComment = () => {
    const form = new FormData();
    form.append("comment", comment);
    form.append("token", jwt);
    axios
      .post(`http://localhost:8000/comment/${filterid}/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setComment("");
        setAddComment(false);
        axios
          .get(`http://localhost:8000/comment/all/${filterid}/`)
          .then((res) => {
            setComments(res.data);
          });
      });
  };
  useEffect(() => {
    if (!filterid) return;
    if (mode !== "View") return;
    axios.get(`http://localhost:8000/comment/all/${filterid}/`).then((res) => {
      setComments(res.data);
    });
  }, []);
  if (filterData.loading) {
    return (
      <div
        style={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size="250px" thickness="3rem" />
      </div>
    );
  }

  if (filterData.get_error) {
    return (
      <NotFoundPage message={"The filter you are looking for is not found"} />
    );
  }

  return (
    <div className="filterMainArea">
      {(mode === "New" || mode === "Edit") && !isLogged ? (
        <div>Login to create a new filter or clone an existing one</div>
      ) : (
        <>
          <Tabs.Root className="TabRoot2" defaultValue="Info">
            <Tabs.List aria-label="Filters" className="TabList">
              {mode === "View" && (
                <>
                  <Tabs.Trigger value="Info" className="TabTrigger">
                    Info
                  </Tabs.Trigger>
                  <Tabs.Trigger value="Comment" className="TabTrigger">
                    Comments
                  </Tabs.Trigger>
                </>
              )}
            </Tabs.List>
            <div className="filterWindow">
              <Tabs.Content value="Info" className="TabContent">
                <div className="filterDetails">
                  <div className="filterDetailsPanel">
                    {mode === "New" && (
                      <div className="inputView">
                        <div className="headerView">
                          <input
                            type="text"
                            placeholder="Filter Name"
                            onChange={(e) =>
                              dispatch(setFilterName(e.target.value))
                            }
                            value={filterData.filterName}
                          />
                          <button onClick={handleSave}>Save</button>
                        </div>
                        {filterData.save_error && (
                          <div
                            className="filterErrorDiv"
                            style={{
                              marginBottom: "1rem",
                            }}
                          >
                            <ExclamationTriangleIcon color="red" />
                            <span>{filterData.save_error}</span>
                          </div>
                        )}
                        <textarea
                          placeholder="Filter Description"
                          onChange={(e) =>
                            dispatch(setFilterDescription(e.target.value))
                          }
                          value={filterData.filterDescription}
                        />
                      </div>
                    )}
                    {mode === "View" && (
                      <div className="normalView">
                        <div className="normalViewHeader">
                          <div className="filterName">
                            {filterData.filterName}
                          </div>
                          <div>
                            by <span>{filterData.userName}</span>
                          </div>
                        </div>
                        {filterData.fork_view_id && (
                          <div className="forkInfo">
                            <img src={forkIcon} alt="fork" />
                            <span>Forked From </span>
                            <Link
                              to={`/Filter/${filterData.fork_view_id}`}
                              className="link"
                            >
                              {filterData.fork_view_name}
                            </Link>
                          </div>
                        )}
                        <div className="infoButtons">
                          {isLogged ? (
                            <button
                              onClick={() =>
                                dispatch(
                                  toggleLike({
                                    filter_id: filterid,
                                    token: jwt,
                                  })
                                )
                              }
                            >
                              {filterData.liked ? (
                                <HeartFilledIcon color="red" />
                              ) : (
                                <HeartIcon color="black" />
                              )}
                              <span>{filterData.likes}</span>
                            </button>
                          ) : (
                            <button onClick={() => navigate("/login")}>
                              {filterData.liked ? (
                                <HeartFilledIcon color="red" />
                              ) : (
                                <HeartIcon color="black" />
                              )}
                              <span>{filterData.likes}</span>
                            </button>
                          )}
                          {isLogged ? (
                            <button
                              onClick={() =>
                                dispatch(
                                  toggleSave({
                                    filter_id: filterid,
                                    token: jwt,
                                  })
                                )
                              }
                            >
                              {filterData.saved ? (
                                <StarFilledIcon color="red" />
                              ) : (
                                <StarIcon color="black" />
                              )}
                              <span>{filterData.saves}</span>
                            </button>
                          ) : (
                            <button onClick={() => navigate("/login")}>
                              {filterData.saved ? (
                                <StarFilledIcon color="red" />
                              ) : (
                                <StarIcon color="black" />
                              )}
                              <span>{filterData.saves}</span>
                            </button>
                          )}
                          {isLogged ? (
                            <button
                              onClick={() => {
                                setForkName(
                                  (s) => "Fork_" + filterData.filterName
                                );
                                setCopyModal(true);
                              }}
                            >
                              <img src={forkIcon} alt="fork" />
                              <span>{filterData.forks}</span>
                            </button>
                          ) : (
                            <button onClick={() => navigate("/login")}>
                              <img src={forkIcon} alt="fork" />
                              <span>{filterData.forks}</span>
                            </button>
                          )}
                        </div>
                        <div className="viewDesc">
                          Description: <br />
                          {filterData.filterDescription}
                        </div>
                        {/* <div>{filterData.created_on}</div> */}

                        {isLogged && filterData.userName === auth.username && (
                          <button
                            onClick={() => {
                              navigate("/filter/edit/" + filterid + "/");
                            }}
                            className="editButton"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                    {mode === "Edit" && (
                      <>
                        <div className="normalView">
                          <div className="normalViewHeader">
                            <div className="filterName">
                              {filterData.filterName}
                            </div>
                            <button
                              onClick={handleEdit}
                              className="editButton saveButton"
                            >
                              Save
                            </button>
                          </div>
                          {filterData.fork_view_id && (
                            <div className="forkInfo">
                              <img src={forkIcon} alt="fork" />
                              <span>Forked From </span>
                              <Link
                                to={`/Filter/${filterData.fork_view_id}`}
                                className="link"
                              >
                                {filterData.fork_view_name}
                              </Link>
                            </div>
                          )}
                          {filterData.save_error && (
                            <div
                              className="filterErrorDiv"
                              style={{
                                marginTop: "1rem",
                              }}
                            >
                              <ExclamationTriangleIcon color="red" />
                              <span>{filterData.save_error}</span>
                            </div>
                          )}
                          <span
                            style={{
                              marginTop: "1rem",
                            }}
                          >
                            Description: <br />
                          </span>
                          <textarea
                            placeholder="Filter Description"
                            onChange={(e) =>
                              dispatch(setFilterDescription(e.target.value))
                            }
                            value={filterData.filterDescription}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Tabs.Content>
              <Tabs.Content value="Comment" className="TabContent TabLimit">
                <div className="commentViewPort">
                  {addComment && jwt && (
                    <div className="commentInput">
                      <textarea
                        placeholder="Add a comment"
                        onChange={(e) => {
                          if (e.target.value.length > 250) return;
                          setComment(e.target.value);
                        }}
                        value={comment}
                        style={{
                          width: "100%",
                          height: "110px",
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
                          {comment.length} / 250
                          {comment.length === 250 && (
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
                              setComment("");
                              setAddComment(false);
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
                            onClick={postComment}
                          >
                            <PaperPlaneIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {!addComment && jwt && (
                    <button
                      onClick={() => setAddComment(true)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span>Add Comment</span>
                      <PaperPlaneIcon />
                    </button>
                  )}
                  <div
                    style={{
                      flexGrow: 1,
                      flexBasis: 0,
                      minHeight: 0,
                      overflowY: "auto",
                    }}
                    className="hide-scrollbar"
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {comments.map((comment, index) => (
                        <Comment
                          key={index}
                          comment={comment.Comment}
                          comment_id={comment.CommentID}
                          UserName={comment.UserName}
                          On={comment.CreatedOn}
                          UserPic={comment.ProfilePicPath}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>

          <FilterTabs mode={mode} handleApply={handleApply} />
          {mode === "View" && (
            <DialogCard
              open={copyModal}
              onOpenChange={() => setCopyModal(false)}
              heading={"Fork Filter: " + filterData.filterName}
              info={
                "Make Changes to the filter and share it with the community. build on top of existing filters."
              }
              label={"Filter Name"}
              value={forkname}
              onChange={(e) => setForkName(e.target.value)}
              buttonText={"Fork"}
              onEventSucess={() => {
                dispatch(
                  makeFork({
                    filter_id: filterid,
                    token: jwt,
                    filter_name: forkname,
                  })
                );
              }}
              error={forkError}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Filter;
