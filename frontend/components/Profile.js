import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfilePost from "./ProfilePost";
function Profile() {
  const [photos, setPhotos] = useState([]);
  const [post, setPost] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    fetch("http://localhost:5000/profileposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        setPhotos(data);
      });
  }, []);

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_pic">
          <img
            src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
        </div>
        <div className="profile_data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile_stats">
            <p>3 posts</p>
            <p>105 followers</p>
            <p>85 following</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="profile_posts">
        {photos.map((photo) => (
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

export default Profile;
