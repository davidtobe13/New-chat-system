import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import NotificationIcon from './components/NotificationIcon';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      if (!isChatOpen) {
        setUnreadCount(prevCount => prevCount + 1);
      }
    });

    socket.on("ownMessage", (message) => {
      setMessages(prevMessages => [...prevMessages, { ...message, isOwn: true }]);
    });

    // Fetch initial messages
    fetch('http://localhost:5000/api/messages')
      .then(response => response.json())
      .then(data => setMessages(data.map(msg => ({ ...msg, isOwn: msg.senderId === socket.id }))));

    return () => {
      socket.off("newMessage");
      socket.off("ownMessage");
    };
  }, [isChatOpen]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-blue-300 to-blue-200">
      {!isChatOpen ? (
        <div className="text-center">
          <h1 className="text-4xl mb-4">Welcome to Chat App</h1>
          <NotificationIcon unreadCount={unreadCount} onOpen={handleOpenChat} />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <button
            onClick={() => setIsChatOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded m-4 self-start"
          >
            Home
          </button>
          <Chat messages={messages} setMessages={setMessages} />
        </div>
      )}
    </div>
  );
}

export default App;