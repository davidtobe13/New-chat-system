

import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ messages, setMessages }) {
  const [messageInput, setMessageInput] = useState("");

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="bg-white rounded-lg w-full h-full p-4 shadow-md flex flex-col">
      <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} mb-2`}>
            <div
              className={`${msg.isOwn ? 'bg-green-500' : 'bg-blue-500'} 
               text-white p-2 rounded-md max-w-[70%]`}
            >
              {msg.text}
            </div>
            <span className="text-gray-500 text-xs mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            className="w-full px-2 py-1 border rounded-l-md outline-none"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;