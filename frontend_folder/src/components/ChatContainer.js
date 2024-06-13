import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import profile from "./kurta.jpg";
import profile2 from "./menshirt1.jpg";
import { io } from "socket.io-client";
const ChatContainer = ({ currentchatuser }) => {
  const scrollRef = useRef();
  const socket = useRef();
  const [loggedinuser, setuser] = useState();
  const [arrMsg, setArrMsg] = useState();
  const [ipmsg, setIpmsg] = useState();
  const [id, setId] = useState();
  const [messages, setMessage] = useState();
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
        setuser(data.user);
        setId(data.user._id);
      });
  }, []);
  // console.log(loggedinuser);

  useEffect(() => {
    if (currentchatuser !== undefined && !socket.current) {
      socket.current = io(process.env.REACT_APP_URL + "");
      socket.current.emit("addUser", id);
    }
  }, [currentchatuser, id]);
  // console.log(socket);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_URL}/get/msg/${id}/${currentchatuser?.postedBy?._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data[0]);
        setMessage(data);
      });
  }, [currentchatuser?.postedBy?._id]);

  const sendMsg = () => {
    const messagess = {
      myself: true,
      message: ipmsg,
    };
    if (!id || !currentchatuser?.postedBy?._id) {
      console.error("Invalid 'from' or 'to' values");
      return;
    }
    socket.current.emit("send-msg", {
      to: currentchatuser.postedBy._id,
      from: id,
      message: ipmsg,
    });
    try {
      fetch(`${process.env.REACT_APP_URL}/msg`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: id,
          message: ipmsg,
          to: currentchatuser.postedBy._id,
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          console.log(res);
          setMessage((prevMessages) => [
            ...prevMessages,
            { myself: true, message: ipmsg },
          ]);

          // Clear the input field
          setIpmsg("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (messa) => {
        setMessage((prevMessages) => [
          ...prevMessages,
          { myself: false, message: messa },
        ]);
      });
    }
  }, [arrMsg]);

  useEffect(() => {
    arrMsg && setMessage((pre) => [...pre, arrMsg]);
  }, [arrMsg]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // console.log(" id of currentchatuser", currentchatuser?.postedBy?._id);
  // console.log("current id ", id);
  return (
    <div className="cont-outer-container">
      <div>
        <div
          style={{
            display: "flex",
            marginLeft: "10px",
            marginTop: "10px",
            backgroundColor: "rgb(241, 223, 238)",
            width: "64pc",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <img
            className="user-image"
            src={
              currentchatuser?.postedBy?.profilepic
                ? currentchatuser?.postedBy?.profilepic
                : profile
            }
            alt="profiler"
          />
          <p style={{ marginTop: "10px", marginLeft: "10px" }}>
            {currentchatuser?.postedBy?.name
              ? currentchatuser?.postedBy?.name
              : "current user"}
          </p>
        </div>
        <div className="msg-container">
          {messages?.map((msg) => {
            return (
              <div ref={scrollRef}>
                {msg.myself === false ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "18px",
                      width: "40%",
                      marginTop: "20px",
                      backgroundColor: "rgb(241,243,241)",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={
                        currentchatuser?.postedBy?.profilepic
                          ? currentchatuser?.postedBy?.profilepic
                          : profile
                      }
                      className="user-image-2"
                      alt="profiler2"
                    />
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: "10px",
                      }}
                    >
                      {msg?.message}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "600px",
                      width: "40%",
                      marginTop: "20px",
                      color: "black",
                      backgroundColor: "rgb(241,243,241)",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={profile2}
                      className="user-image-2"
                      alt="profiler2"
                    />
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: "10px",
                      }}
                    >
                      {msg?.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="msg-sender-cont">
          <input
            type="text"
            className="msg-input"
            placeholder="Enter Your Message"
            value={ipmsg}
            onChange={(e) => setIpmsg(e.target.value)}
          />
          <button className="msg-send-btn" onClick={sendMsg}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
