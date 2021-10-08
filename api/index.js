const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const roomRoute = require("./routes/room");
const messageRoute = require("./routes/message");
const cors = require("cors");
const http = require("http").createServer(app);
const PORT = process.env.PORT || 8000;

const {
  get_Current_User,
  user_Disconnect,
  join_User,
  get_All_Users,
} = require("./roomFunctions");


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


const io = require("socket.io")(http);
app.use(cors());

//initializing the socket io connection
io.on("connection", (socket) => {

  //for a new user joining the room
  socket.on("joinRoom", (data) => {
    //* create user
    console.log("JOIN ROOM", data)

    let p_user = get_Current_User(socket.id);

    if (p_user) {
      socket.leave(p_user.room);
      p_user = user_Disconnect(socket.id);
      console.log("disconnected")
    }

    p_user = join_User(socket.id, data.username, data.topic);
    socket.join(p_user.room);
  });

  //user sending message
  socket.on("chat", async (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);
    // console.log(p_user)
    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text.text,
    });

  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
    console.log("DISCONNECT");
  });
});

let server = http.listen(PORT, () => {
  console.log("Backend server is running!");
});

