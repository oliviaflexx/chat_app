import React from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const ENDPOINT = "http://localhost:8000/";
  const socket = io(ENDPOINT,  {  
        cors: {
        origin: "http://localhost:8000/",
        credentials: true
      }, transports: ["websocket"] });
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
