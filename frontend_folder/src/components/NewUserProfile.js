import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfilePost from "./ProfilePost";
import { useParams } from "react-router-dom";
function NewUserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [post, setPost] = useState();
  const [posts, setPosts] = useState([]);
  const [btnvalue, setBtnValue] = useState(false);
  const [show, setShow] = useState(false);
  function followAUser(id) {
    fetch(process.env.REACT_APP_URL + "/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setBtnValue(false), window.location.reload())
      .catch((error) => console.error("Fetch error:", error));
  }

  function UnfollowAUser(id) {
    fetch(process.env.REACT_APP_URL + "/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => setBtnValue(false));
  }
  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setPhotos(data);
        setUser(data.user);
        setPosts(data.posts);
        if (
          data.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setBtnValue(true);
        }
      });
  }, [btnvalue]);

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_pic">
          <img
            src={
              user?.profilepic
                ? user?.profilepic
                : "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            }
            alt=""
          />
        </div>
        <div className="profile_data">
          <h1>{user.name}</h1>
          {/* {btnvalue === false ? (
            <button className="followbtn" onClick={() => followAUser(user._id)}>
              Follow
            </button>
          ) : (
            <button
              className="followbtn"
              onClick={() => UnfollowAUser(user._id)}
            >
              Unfollow
            </button>
          )} */}
          {user._id === JSON.parse(localStorage.getItem("user"))._id ? null : (
            <button
              className="followbtn"
              onClick={() => {
                if (btnvalue) {
                  UnfollowAUser(user._id);
                } else {
                  followAUser(user._id);
                }
              }}
            >
              {btnvalue ? "Unfollow" : "Follow"}
            </button>
          )}

          <div className="profile_stats">
            <p>{posts.length} posts</p>
            <p>{user?.followers?.length} followers</p>
            <p>{user?.following?.length} following</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="profile_posts">
        {posts.map((photo) => (
          <img
            key={photo._id}
            src={photo.image}
            alt="profile_pic"
            onClick={() => {
              setShow(!show);
              setPost(photo);
            }}
          />
        ))}
      </div>
      {show && <ProfilePost post={post} setShow={setShow} show={show} />}
    </div>
  );
}

export default NewUserProfile;
