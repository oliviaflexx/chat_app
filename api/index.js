const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const roomRoute = require("./routes/room");
const messageRoute = require("./routes/message");
const socket = require("socket.io");
const cors = require("cors");
const http = require("http").createServer(app);
const PORT = process.env.PORT || 8000;
const Message = require("./models/Message");

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

  socket.on("tester", (data) => {
    console.log(data);
    console.log(data.data2)
  })
  //for a new user joining the room
  socket.on("joinRoom", (data) => {
    //* create user
    console.log("JOIN ROOM", data)

    let p_user = get_Current_User(socket.id);

    if (p_user) {
      const p_user = user_Disconnect(socket.id);
    }

    p_user = join_User(socket.id, data.username, data.topic);
    // console.log(socket.id, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    // socket.emit("message", {
    //   userId: p_user.id,
    //   username: p_user.username,
    //   text: `Welcome ${p_user.username}`,
    // });

    // //displays a joined room message to all other room users except that particular user
    // socket.broadcast.to(p_user.room).emit("message", {
    //   userId: p_user.id,
    //   username: p_user.username,
    //   text: `${p_user.username} has joined the chat`,
    // });
  });

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text
    });

    console.log("CHAT", text);
    // io.to(p_user.room).emit("message", {p_user});
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

