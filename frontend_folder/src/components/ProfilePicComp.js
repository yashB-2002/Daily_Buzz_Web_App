import React, { useEffect, useState, useRef } from "react";

const ProfileComp = (props) => {
  let fileRef = useRef();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  function details() {
    // console.log(desc, img);
    // post request in cloudinary
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", process.env.REACT_APP_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUDNAME);
    fetch(process.env.REACT_APP_CLOUDURL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((d) => setUrl(d.url)) // it gives us object which gets details of image stored in cloudinary website
      .catch((err) => console.log(err));
  }
  const uploadpic = () => {
    fetch(process.env.REACT_APP_URL + "/upload", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((ans) => {
        // console.log(ans);
        props.changePicState();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  function handleClick() {
    fileRef.current.click();
  }
  useEffect(() => {
    if (image) {
      details();
    }
  }, [image]);
  useEffect(() => {
    if (url) {
      uploadpic();
    }
  }, [url]);
  return (
    <div className="profile-pic gray ">
      <div className="change  ">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid gray" }}>
          <button
            onClick={handleClick}
            className="upload"
            style={{ color: "#009566" }}
          >
            {" "}
            Upload Profile Photo
          </button>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ borderTop: "1px solid gray" }}>
          <button
            className="upload"
            onClick={() => {
              setUrl(null);
              uploadpic();
            }}
            style={{ color: "#ED4956" }}
          >
            Remove Profile Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid gray" }}>
          <button className="upload" onClick={props.changePicState}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
