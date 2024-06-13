const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "user_model",
  },
  likes: [{ type: ObjectId, ref: "user_model" }],
  comments: [
    {
      comment: {
        type: String,
      },
      postedBy: {
        type: ObjectId,
        ref: "user_model",
      },
    },
  ],
});
mongoose.model("post_model", postSchema);
