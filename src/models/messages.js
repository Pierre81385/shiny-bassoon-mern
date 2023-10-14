import React from "react";

const Message = ({ user, content }) => (
  <div>
    <strong>{user}:</strong> {content}
  </div>
);

const Messages = ({ messages }) => (
  <div>
    {messages.map((message) => (
      <Message
        key={message._id}
        user={message.user}
        content={message.content}
      />
    ))}
  </div>
);

export default Messages;
