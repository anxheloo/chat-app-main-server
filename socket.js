import { disconnect } from "mongoose";
import { Server as ServerIOSocket } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

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
      .populate("sender", "_id email firstName lastName image color")
      .populate("recipient", "_id email firstName lastName image color");

    //
      if(recipientSocketId){
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if(senderSocketId){
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
  };

  const sendChannelMessage = async(message) =>{
    const {channelId, sender, content, messageType, fileUrl} = message

    // 1.created the message
    const createdMessage = await Message.create({sender, recipient: null, content, messageType, timestamp: new Date(), fileUrl});
    // 2. we get message data with sender details
    const messageData = await Message.findById(createdMessage._id).populate("sender", "_id email firstName lastName image color").exec();
    
    console.log("Created message:", messageData);
    
    // 3. updating the channel by adding the new created message
    await Channel.findByIdAndUpdate(channelId, {
      $push: {messages: createdMessage._id}
    })
    // 4. get the channel with all the members
    const channel = await Channel.findById(channelId).populate("members")
    // 5. object to be sent to the user
    const finalData = {...messageData._doc, channelId: channel._id}

    if(channel && channel.members){
      channel.members.forEach(member => {
        const memberSocketId = userSocketMap.get(member._id.toString());

        if(memberSocketId){
          console.log("Message sent to recipient:", memberSocketId);
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      })

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if(adminSocketId){
        console.log("Message sent to recipient:", adminSocketId);
        io.to(adminSocketId).emit("receiveChannelMessage", finalData)
      }
    }

  }

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
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
