import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePost.css";
const ProfilePost = ({ post, setShow, show }) => {
  const navigate = useNavigate();
  function removePost(id) {
    console.log(id);
    fetch(`http://localhost:5000/delpost/${id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => navigate("/"))
      .catch((err) => console.log("error occurs here"));
  }
  return (
    <div className="main-container ">
      <div className="inner-container">
        <div className="photo-div">
          <img width="500px" alt="post_image" src={post.image} />
        </div>
        <div className="sidebar-comments">
          <div className="card_header">
            <div className="card_pic">
              <img
                src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <h5>{post.postedBy.name} </h5>
            <div className="deletepost" onClick={() => removePost(post._id)}>
              <p>Delete</p>
            </div>
          </div>
          <div className="show-comments">
            {post.comments.map((item) => {
              return (
                <p className="commentt">
                  <span className="by">{item.postedBy.name} </span>
                  <span className="is">{item.comment}</span>
                </p>
              );
            })}
          </div>
          <div className="card_content">
            <p>
              <em>
                <b>Likes</b>
              </em>
              : {post.likes.length}
            </p>
            <p>{post.description}</p>
          </div>
          <div className="card_add_comment">
            <input type="text" placeholder="Add a comment.." />
            <button className="post_btn">Post</button>
          </div>
        </div>
      </div>
      <div className="closee" onClick={() => setShow(!show)}>
        <p>Close</p>
      </div>
    </div>
  );
};

export default ProfilePost;
