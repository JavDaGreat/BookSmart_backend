const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/ConnectDB");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3500;
connectDB();

mongoose.connection.once("open", () => {
  console.log("connected to mango");

  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});
