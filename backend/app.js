const express = require("express");
const app = express();
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
app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
