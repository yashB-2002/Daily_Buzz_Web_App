import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "./components/CreatePost";
import { Context } from "./Context";
import NewUserProfile from "./components/NewUserProfile";
import FollowingPosts from "./components/FollowingPosts";
import Chat from "./components/Chat";
function App() {
  const [login, setLogin] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <Context.Provider value={{ setLogin }}>
          <Navbar login={login} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/profile/:id" element={<NewUserProfile />} />
            <Route path="/follwingposts" element={<FollowingPosts />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          <ToastContainer theme="colored" />
        </Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
