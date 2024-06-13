const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Jwt_secret_token } = require("../mongo");
const user_model = mongoose.model("user_model");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Login first to create post." });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, Jwt_secret_token, (err, payload) => {
    if (err) {
      res.status(401).json({ error: "Login first to create post." });
    }
    const { _id } = payload;
    user_model.findById(_id).then((userData) => {
      // console.log(userData);
      req.user = userData; // this we have written because we have stored postedBy key in our db so when user authorizes req.user should have details of current user so when we create postSchema object and write {postedBy: req.user} in createpost post req in auth.js so postedBy should be filled with id  of curr user
      next();
    });
  });
};
