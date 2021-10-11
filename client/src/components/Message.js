import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.text}</p>
        <p className="messageSide">{format(message.createdAt)}</p>
      </div>
      <p className="messageSender">{message.senderUsername}</p>
    </div>
  );
}
