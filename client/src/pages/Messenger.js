import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import Message from "../components/Message";
import { to_Decrypt, to_Encrypt } from "../secret.js";

export default function Messenger() {
  const socket = useContext(SocketContext);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const blue = { color: "blue" };

  // GET NEW MESSAGE  
  useEffect(() => {

    socket.on("message", function(data) {

      const socketMessage = {
        senderId: data.userId,
        senderUsername: data.username,
        text: to_Decrypt(data.text)
      };

      setMessages([...messages, socketMessage]);
  
    });
  }, [socket, messages]);


// GET ALL ROOMS
  useEffect(() => {
    const getrooms = async () => {
      try {
        const res = await axios.get("api/rooms");
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
        const res = await axios.get("api/messages/" + currentRoom?._id);

        const decryp_messages = res.data.map(function(message) {
          let obj = {...message};
          const decryp_message = to_Decrypt(message.text);
          obj.text = decryp_message;
          return obj;
        });

        setMessages([...decryp_messages]);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
    console.log(currentRoom);
  }, [currentRoom]);


  // SEND NEW MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      senderId: user._id,
      senderUsername: user.username,
      text: to_Encrypt(newMessage),
      roomId: currentRoom._id,
    };

    if (message !== "") {
      socket.emit("chat", message);
      setNewMessage("");

      try {
        const res = await axios.post("api/messages", message);

        res.data.text = to_Decrypt(res.data.text);
        setMessages([...messages, res.data]);
      } catch (err) {
        console.log(err);
      }

    }

  };

  // CREATE NEW ROOM
  const handleSubmitRoom = async (e) => {
      e.preventDefault();

      const room = {
        topic: newRoom
      };

      try {
        const res = await axios.post("api/rooms", room);
        setRooms([...rooms, res.data]);
        setNewRoom("");
        setCurrentRoom(res.data);

        const username = user.username;
        const topic = currentRoom.topic;
        socket.emit("joinRoom", { username, topic });

      } catch (err) {
        console.log(err);
      }
  };

  function joinRoom(room) {
    setCurrentRoom(room);
    const username = user.username;
    const topic = room.topic;
    socket.emit("joinRoom", { username, topic });

  }

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
        <h1>{user.username}</h1>
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
              <div onClick={() => joinRoom(room)}>
                <p style={blue}>{room.topic}</p>
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
