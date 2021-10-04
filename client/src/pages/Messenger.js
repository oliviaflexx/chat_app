import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import Message from "../components/Message";
// import { io } from "socket.io-client";

export default function Messenger() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
const [newRoom, setNewRoom] = useState("");
//   const [arrivalMessage, setArrivalMessage] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

//   useEffect(() => {
//     socket.current = io("ws://localhost:8900");
//     socket.current.on("getMessage", (data) => {
//       setArrivalMessage({
//         sender: data.senderId,
//         text: data.text,
//         createdAt: Date.now(),
//       });
//     });
//   }, []);

//   useEffect(() => {
//     arrivalMessage &&
//       currentRoom?.members.includes(arrivalMessage.sender) &&
//       setMessages((prev) => [...prev, arrivalMessage]);
//   }, [arrivalMessage, currentRoom]);

//   useEffect(() => {
//     socket.current.emit("addUser", user._id);
//     socket.current.on("getUsers", (users) => {
//       setOnlineUsers(
//         user.followings.filter((f) => users.some((u) => u.userId === f))
//       );
//     });
//   }, [user]);

// GET ALL ROOMS
  useEffect(() => {
    const getrooms = async () => {
      try {
        const res = await axios.get("/rooms/");
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getrooms();
  }, []);

  // GET ALL MESSAGES
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentRoom?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentRoom]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      senderId: user._id,
      senderUsername: user.username,
      text: newMessage,
      roomId: currentRoom._id,
    };

    // const receiverId = currentRoom.members.find(
    //   (member) => member !== user._id
    // );

    // socket.current.emit("sendMessage", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage,
    // });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitRoom = async (e) => {
      e.preventDefault();
      const room = {
        topic: newRoom
      };

      try {
        const res = await axios.post("/rooms", room);
        setRooms([...rooms, res.data]);
        setNewRoom("");
        setCurrentRoom(res.data)
      } catch (err) {
        console.log(err);
      }
  };

  const handleEnter = ([e, selectedFunction]) => {
      if(e.key === "Enter") {
        selectedFunction(e);
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMessageInput"
              placeholder="New Room Topic"
              onChange={(e) => setNewRoom(e.target.value)}
              onKeyPress={(e) => handleEnter([e, handleSubmitRoom])}
              value={newRoom}
            ></input>
            <button className="" onClick={handleSubmitRoom}>
              Create New Room
            </button>
            {rooms.map((room) => (
              <div onClick={() => setCurrentRoom(room)}>
                <p>{room.topic}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentRoom ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((message) => (
                    <div ref={scrollRef}>
                      <Message
                        message={message}
                        own={message.senderId === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => handleEnter([e, handleSubmit])}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a room to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
