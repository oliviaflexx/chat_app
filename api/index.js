const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
// const postRoute = require("./routes/posts");
// const roomRoute = require("./routes/rooms");
// const messageRoute = require("./routes/messages");
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
// app.use("/api/users", userRoute);
// app.use("/api/conversations", roomRoute);
// app.use("/api/messages", messageRoute);

app.listen(8080, () => {
  console.log("Backend server is running!");
});
