import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignUp = () => {
  const success = (successMsg) =>
    toast.success(successMsg, {
      theme: "colored",
    });
  const error = (errMsg) =>
    toast.error(errMsg, {
      theme: "dark",
    });
  // const fetchData = async () => {
  //   const fetchedData = await fetch(process.env.REACT_APP_URL + "/");
  //   const response = await fetchedData.json();
  //   console.log(response);
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  function formData() {
    // console.log(name, username, email, password);

    // email validation
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      error("Type email in correct format.");
      return;
    } else if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(password)
    ) {
      error(
        "Password should be [6 to 20 characters which contain at least 1 numeric digit, 1 uppercase, 1 lowercase letter and a special character]."
      );
      return;
    }
    fetch(process.env.REACT_APP_URL + "/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
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
          navigate("/signin");
        }
      });
  }
  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
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
            id="submit-btn"
            value="Sign Up"
            onClick={() => {
              formData();
            }}
          />
        </div>
        <div className="form2">
          Already have an account ?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}> Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
