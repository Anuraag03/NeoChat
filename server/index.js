require('dotenv').config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/chatapp";
const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let activeUsers = new Set();

// Mongoose message schema
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
// TTL index for 1 hour expiry
messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3600 });
const Message = mongoose.model("Message", messageSchema);

mongoose.connect(MONGO_URL)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    io.on("connection", (socket) => {
      let currentUsername = null;

      // Handle username registration
      socket.on("register username", async (username, callback) => {
        if (activeUsers.has(username)) {
          callback({ success: false, error: "Username taken" });
        } else {
          activeUsers.add(username);
          currentUsername = username;
          callback({ success: true });
          // Send last 100 messages (not older than 1 hour) after registration
          Message.find({ timestamp: { $gte: new Date(Date.now() - 3600 * 1000) } })
            .sort({ timestamp: -1 })
            .limit(100)
            .then(msgs => {
              socket.emit("chat history", msgs.reverse());
            });
        }
      });


      // Handle incoming chat messages
      socket.on("chat message", async (msg) => {
        if (!currentUsername || !msg.message) return;
        const chatMsg = {
          username: currentUsername,
          message: msg.message,
          timestamp: new Date()
        };
        await Message.create(chatMsg);
        io.emit("chat message", chatMsg);
      });

      // Remove username on disconnect
      socket.on("disconnect", () => {
        if (currentUsername) {
          activeUsers.delete(currentUsername);
        }
      });
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });