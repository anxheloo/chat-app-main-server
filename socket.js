import { disconnect } from "mongoose";
import { Server as ServerIOSocket } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new ServerIOSocket(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  // Functions for events.
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    // get sender and recipient socket id
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    // create message
    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    //
      if(recipientSocketId){
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if(senderSocketId){
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
  };

  // Connection
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        // populate the Map object with the user's socket id
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id : ${socket.id}`);
    } else {
      console.log("User id not provided during connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;