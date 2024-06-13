import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfilePost from "./ProfilePost";
import ProfilePicComp from "./ProfilePicComp";
function Profile() {
  const [photos, setPhotos] = useState([]);
  const [pic, setPic] = useState(false);
  const [post, setPost] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState();

  function changePicState() {
    if (pic) {
      setPic(false);
    } else {
      setPic(true);
    }
  }
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_URL}/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setPhotos(data.posts);
        setUser(data.user);
      });
  }, []);

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_pic">
          <img
            onClick={changePicState}
            src={
              user?.profilepic
                ? user?.profilepic
                : "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            }
            alt=""
          />
        </div>
        <div className="profile_data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile_stats">
            <p>{photos.length} posts</p>
            <p>{user?.followers?.length} followers</p>
            <p>{user?.following?.length} following</p>
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
      {pic && <ProfilePicComp changePicState={changePicState} />}
    </div>
  );
}

export default Profile;
