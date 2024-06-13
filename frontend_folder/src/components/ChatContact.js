import React, { useEffect, useState } from "react";
import "./Chat.css";
import profile from "./kurta.jpg";
import ChatContainer from "./ChatContainer";
import { useNavigate } from "react-router-dom";
const ChatContact = () => {
  const [apidata, setApiData] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [currentchatuser, setcurrentuser] = useState();

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
        setId(data.user._id);
      });
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }
    fetch(process.env.REACT_APP_URL + "/getposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleUser = (item) => {
    // console.log(item);
    setcurrentuser(item);
  };
  let uniqueUsernamesArray = [];

  // Loop through the posts and add only unique usernames to the new array
  apidata.forEach((post) => {
    if (
      !uniqueUsernamesArray.some(
        (item) => item.postedBy.name === post.postedBy.name
      )
    ) {
      uniqueUsernamesArray.push(post);
    }
  });
  uniqueUsernamesArray = uniqueUsernamesArray.filter(
    (names) => names.postedBy._id !== id
  );
  // console.log("uniquenames", uniqueUsernamesArray);
  // console.log("currid", id);
  return (
    <div className="contact-outer-container">
      <div>
        <div style={{ width: "20pc" }}>
          <input
            type="text"
            placeholder="Search Your Friend"
            className="searchbar"
          />
        </div>
        <div className="userDetailsCont">
          {uniqueUsernamesArray.map((user) => {
            return (
              <div
                className="user-container"
                key={user._id}
                onClick={() => handleUser(user)}
              >
                <img
                  className="user-image"
                  src={
                    user.postedBy.profilepic
                      ? user.postedBy.profilepic
                      : profile
                  }
                  alt="profiler"
                />
                <div>
                  <p
                    style={{
                      color: "black",
                      textAlign: "start",
                      marginTop: "0px",
                      marginLeft: "5px",
                    }}
                  >
                    {user.postedBy.name}
                  </p>
                  <p
                    style={{
                      color: "black",
                      textAlign: "start",
                      marginTop: "-2px",
                      fontSize: "13px",
                      marginLeft: "5px",
                    }}
                  >
                    Open Your Message
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {currentchatuser === undefined ? (
        <h3
          style={{
            marginLeft: "20px",
            color: "Red",
            marginTop: "20px",
            fontSize: "30px",
            opacity: 0.6,
          }}
        >
          Click At Your Contacts To Start Chatting
        </h3>
      ) : (
        <ChatContainer currentchatuser={currentchatuser} />
      )}
    </div>
  );
};

export default ChatContact;
