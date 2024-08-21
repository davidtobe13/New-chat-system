const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

mongoose.connect('database link',)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json());

app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
  res.json(messages);
});
io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  socket.on("message", async (messageText) => {
    const newMessage = new Message({ text: messageText, senderId: socket.id });
    await newMessage.save();

    // Broadcast to all sockets except the sender
    socket.broadcast.emit("newMessage", newMessage);
    
    // Send to the sender without triggering a notification
    socket.emit("ownMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

