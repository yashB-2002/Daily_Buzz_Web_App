const express = require("express");
const app = express();
const socket = require("socket.io");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const { url } = require("./mongo");
require("./models/model");
require("./models/userpost");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));

mongoose.connect(url);
mongoose.connection.on("connected", () => {
  console.log("connected to atlas");
});
mongoose.connection.on("error", () => {
  console.log("not connected to atlas");
});
const server = app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
const io = socket(server, {
  cors: {
    origin: process.env.FRONTURL,
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatsocket = socket;
  socket.on("addUser", (id) => {
    onlineUsers.set(id, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
