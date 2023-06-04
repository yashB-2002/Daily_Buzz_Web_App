import React, { useContext } from "react";
import { Link } from "react-router-dom";
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
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/createpost">
            <li>Create Post</li>
          </Link>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link>
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
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  }
  return (
    <div className="navbar">
      <Link to="/">
        <p className="nav-brand">DailyBuzzz</p>
      </Link>
      <ul className="nav">{navbarChanging()}</ul>
    </div>
  );
};

export default Navbar;
