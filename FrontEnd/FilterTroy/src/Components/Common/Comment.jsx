import React from "react";
import Axios from "axios";

const Comment = ({ filter_id, comment_id, UserName }) => {
  const [comment, setComment] = React.useState(
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu"
  );
  return (
    <div>
      <div>
        <h3>{UserName}</h3>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default Comment;
