import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
function FollowingPosts() {
  const navigate = useNavigate();
  const [apidata, setApiData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [post, setPost] = useState([]);
  // when user is not signed in only show signup and signin page
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }
    fetch(process.env.REACT_APP_URL + "/follwingposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        // console.log(apidata);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function likefn(id) {
    fetch(process.env.REACT_APP_URL + "/likepost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        const postsdata = apidata.map((post) => {
          if (post._id === data._id) return data;
          else return post;
        });
        setApiData(postsdata);
        // console.log(data);
      });
  }

  function unlikefn(id) {
    fetch(process.env.REACT_APP_URL + "/unlikepost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        const postsdata = apidata.map((post) => {
          if (post._id === data._id) return data;
          else return post;
        });
        setApiData(postsdata);
        // console.log(data);
      });
  }

  function addComment(postComment, id) {
    fetch(process.env.REACT_APP_URL + "/commentpost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: postComment,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const postsdata = apidata.map((post) => {
          if (post._id === data._id) return data;
          else return post;
        });
        setApiData(postsdata);
        setComment("");
        console.log(data);
      });
  }
  return (
    <div className="Home">
      {apidata.length > 0 ? (
        apidata.map((p) => {
          // console.log(p);
          return (
            <div className="card">
              <div className="card_header">
                <div className="card_pic">
                  <img
                    src={
                      p.postedBy.profilepic
                        ? p.postedBy.profilepic
                        : "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    }
                    alt=""
                  />
                </div>
                <h5>
                  <Link to={`/profile/${p.postedBy._id}`}>
                    {p.postedBy.name}
                  </Link>
                </h5>
              </div>
              <div className="card_image">
                <img src={p.image} alt="" />
              </div>
              <div className="card_content">
                {p.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <span
                    class="material-symbols-outlined red-color"
                    onClick={() => unlikefn(p._id)}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    class="material-symbols-outlined"
                    onClick={() => likefn(p._id)}
                  >
                    favorite
                  </span>
                )}

                <p>
                  <em>
                    <b>Likes</b> {p.likes.length > 0 ? p.likes.length : ""}
                  </em>
                </p>
                <p>
                  <em>{p.description}</em>
                </p>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShow(!show);
                    setPost(p);
                  }}
                >
                  <b>View All Comments</b>
                </p>
              </div>
              <div className="card_add_comment">
                <input
                  type="text"
                  placeholder="Add a comment.."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="post_btn"
                  onClick={() => {
                    addComment(comment, p._id);
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="msg-h2">
          <h2>Start Following others to see their posts...</h2>
        </div>
      )}

      {show && (
        <div className="main-container ">
          <div className="inner-container">
            <div className="photo-div">
              <img
                width="500px"
                alt="post_image"
                src={post.image}
                // src="http://res.cloudinary.com/yash547/image/upload/v1667637763/sn5ghxihc971ps3lhldj.png"
              />
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
                <input
                  type="text"
                  placeholder="Add a comment.."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="post_btn"
                  onClick={() => {
                    addComment(comment, post._id);
                    setShow(!show);
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div className="close" onClick={() => setShow(!show)}>
            <p>Close</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowingPosts;
