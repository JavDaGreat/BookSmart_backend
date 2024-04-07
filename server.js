const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/ConnectDB");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3500;
connectDB();

app.use(cors({ origin: "*" })); // allow all origin to access

mongoose.connection.once("open", () => {
  console.log("connected to mango");

  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});
