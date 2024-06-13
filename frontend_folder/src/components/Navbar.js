import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context";
const Navbar = (props) => {
  const navigate = useNavigate();
  const { setLogin } = useContext(Context);
  function navbarChanging() {
    const token = localStorage.getItem("jwt");
    if (token || props.login) {
      return [
        <>
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/follwingposts">
            <li>Personal Feed</li>
          </NavLink>
          <NavLink to="/createpost">
            <li>Add Post</li>
          </NavLink>
          <NavLink to="/chat">
            <li>Chat</li>
          </NavLink>
          <NavLink to="/profile">
            <li>Profile</li>
          </NavLink>

          <NavLink>
            <button
              className="btn"
              onClick={() => {
                localStorage.clear();
                navigate("/signin");
                setLogin(false);
              }}
            >
              Log Out
            </button>
          </NavLink>
        </>,
      ];
    } else {
      return [
        <>
          <NavLink to="/signup">
            <li>SignUp</li>
          </NavLink>
          <NavLink to="/signin">
            <li>SignIn</li>
          </NavLink>
        </>,
      ];
    }
  }
  return (
    <div className="navbar">
      <NavLink to="/">
        <p className="nav-brand">DailyBuzzz</p>
      </NavLink>
      <ul className="nav">{navbarChanging()}</ul>
    </div>
  );
};

export default Navbar;
