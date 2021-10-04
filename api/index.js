const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const roomRoute = require("./routes/room");
const messageRoute = require("./routes/message");
const router = express.Router();
const path = require("path");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/messages", messageRoute);

app.listen(8080, () => {
  console.log("Backend server is running!");
});
