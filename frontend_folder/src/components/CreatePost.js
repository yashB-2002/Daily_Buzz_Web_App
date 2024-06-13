import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const success = (successMsg) =>
    toast.success(successMsg, {
      theme: "colored",
    });
  const error = (errMsg) =>
    toast.error(errMsg, {
      theme: "dark",
    });
  useEffect(() => {
    if (url) {
      // post req in mongoDb
      fetch(process.env.REACT_APP_URL + "/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          description: description,
          image: url,
        }),
      })
        .then((res) => res.json())
        .then((ans) => {
          if (ans.error) {
            error(ans.error);
          } else {
            success("Your post is successfully posted..");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);
  function details() {
    // console.log(desc, img);
    // post request in cloudinary
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "obabukli");
    data.append("cloud_name", "yash547");
    fetch("https://api.cloudinary.com/v1_1/yash547/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((d) => setUrl(d.url)) // it gives us object which gets details of image stored in cloudinary website
      .catch((err) => console.log(err));
  }
  return (
    <div className="createpost">
      <div className="header">
        <h2>Create New Post</h2>
        <button id="post" onClick={() => details()}>
          Share Now
        </button>
      </div>
      <div className="middle_section">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <textarea
        placeholder="Write caption here..."
        cols="40"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  );
}

export default CreatePost;
