const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const message = new mongoose.Schema(
  {
    users: {
      type: Array,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("message_model", message);
