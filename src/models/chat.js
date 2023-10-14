import React from "react";
import Messages from "./messages"; // Import the Messages component

const ChatComponent = ({ chatData }) => {
  return (
    <div>
      <h1>Chat Room</h1>
      <Messages messages={chatData.messages} />
    </div>
  );
};

export default ChatComponent;
