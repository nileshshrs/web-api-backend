import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

let users = [];

const addusers = (userID, socketID) => {
  // Remove any existing entries for this user before adding a new one
  users = users.filter((user) => user.userID !== userID);
  users.push({ userID, socketID });
};

const removeuser = (socketID) => {
  // This ensures we remove the correct user by matching the socketID
  users = users.filter((user) => user.socketID !== socketID);
};

const getuser = (userID) => {
  console.log("inside getuser function", userID);
  return users.find((user) => user.userID === userID);
};

// Socket.IO event handlers
io.on("connect", (socket) => {
  console.log(`Client connected: Socket ID ${socket.id}`);

  io.emit("connection", "implementing socket connection.");

  // Handle adding a user
  socket.on("adduser", (userID) => {
    addusers(userID, socket.id);
    io.emit("getusers", users);
    console.log("users after being added", users);
  });

  // Handle sending a message
  socket.on("send", (message) => {
    console.log("users after sending message", users);
    const recieverID = message?.newMessage?.recipient._id;
    const user = getuser(recieverID);

    console.log(user);

    if (user) {
      // Send message to the recipient's socket
      io.to(user.socketID).emit("get", message.newMessage);
    }
  });

  // Handle disconnecting a user
  socket.on("disconnect", () => {
    console.log(`Client disconnected: Socket ID ${socket.id}`);
    removeuser(socket.id);
    io.emit("getusers", users);
  });
});

export { io, app, server };
