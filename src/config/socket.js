import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://10.0.2.2:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

let users = [];

const addusers = (userID, socketID) => {
  // Ensure no duplicate entries for the same socket
  if (!users.some((user) => user.socketID === socketID)) {
    users.push({ userID, socketID });
  }
};

const removeuser = (socketID) => {
  // This ensures we remove the correct user by matching the socketID
  users = users.filter((user) => user.socketID !== socketID);
};

const getuser = (userID) => {
  // console.log("inside getuser function", userID);
  return users.find((user) => user.userID === userID);
};

// Socket.IO event handlers
io.on("connect", (socket) => {
  console.log(`Client connected: Socket ID ${socket.id}`);

  // Emit initial connection event (optional)
  io.emit("connection", "implementing socket connection.");

  // Add a user when they connect
  socket.on("adduser", (userID) => {
    if (userID) {
      addusers(userID, socket.id);
      io.emit("getusers", users); // Broadcast updated users
      // console.log("Users after addition:", users);
    }
  });

  // Handle sending a message
  socket.on("send", (message) => {
    console.log("Message received:", message);

    const recipientID = message?.newMessage?.recipient._id;
    console.log(recipientID);
    const recipient = getuser(recipientID);

    // console.log("Recipient found:", recipient);

    if (recipient) {
      // Emit message to recipient's socket
      io.to(recipient.socketID).emit("get", message.newMessage);
    } else {
      console.log("Recipient not found or offline");
    }
  });

  socket.on("notify", (message)=>{
    const recipient = message.recipient;
    const notificationRecipient = getuser(recipient)

    if(notificationRecipient){
      io.to(notificationRecipient.socketID).emit("notification", message)
    }
  })

  // Remove a user on disconnect
  socket.on("disconnect", () => {
    // console.log(`Client disconnected: Socket ID ${socket.id}`);
    removeuser(socket.id);
    io.emit("getusers", users); // Broadcast updated users
    // console.log("Users after disconnection:", users);
  });
});

export { io, app, server };
