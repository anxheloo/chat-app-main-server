import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      return res.status(400).json({
        message: "Admin user not found",
      });
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).json({
        message: "Some members are not valid users",
      });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    return res.status(201).json({
      channel: newChannel,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    // const userId = req.userId;

    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({
      channels: channels,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName image _id color",
      },
    });

    console.log("This is channel:", channel)

    if(!channel){
        return res.status(404).json({
            message: "Message not found",
          });
    }

    const messages = channel.messages;

    console.log("These are messages:", messages);

    return res.status(200).json({
      messages,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
