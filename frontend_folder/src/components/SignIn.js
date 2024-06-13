import React, { useState, useContext } from "react";
import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../Context";
const SignIn = () => {
  const { setLogin } = useContext(Context);
  const success = (successMsg) =>
    toast.success(successMsg, {
      theme: "colored",
    });
  const error = (errMsg) =>
    toast.error(errMsg, {
      theme: "dark",
    });
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  function formData() {
    // console.log(name, username, email, password);

    // email validation
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      error("Type email in correct format.");
      return;
    }
    fetch(process.env.REACT_APP_URL + "/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          error(data.error);
        } else {
          success(data.msg);
          // console.log(data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setLogin(true);
          navigate("/");
        }
        // console.log(data);
      });
  }
  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <input
            type="submit"
            id="login-btn"
            onClick={() => {
              formData();
            }}
            value="Sign In"
          />
        </div>
        <div className="loginForm2">
          Don't have an account ?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}> Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
