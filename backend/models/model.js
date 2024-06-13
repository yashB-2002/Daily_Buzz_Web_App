const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
  },
  followers: [{ type: ObjectId, ref: "user_model" }],
  following: [{ type: ObjectId, ref: "user_model" }],
});
mongoose.model("user_model", schema);
