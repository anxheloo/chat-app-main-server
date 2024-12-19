import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    const page = req.body.page;

    console.log("This is page:", page);

    const limit = 20;
    const skip = page * limit;

    if (!user1 || !user2) {
      return res.status(400).json({
        message: "Both user Ids are required",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    // Check if there are more messages to fetch
    // const totalMessages = await Message.countDocuments({
    //   $or: [
    //     { sender: user1, recipient: user2 },
    //     { sender: user2, recipient: user1 },
    //   ],
    // });

    // const hasMore = (page + 1) * limit < totalMessages;

    // const hasMoreMessages = await Message.find({
    //   $or: [
    //     { sender: user1, recipient: user2 },
    //     { sender: user2, recipient: user1 },
    //   ],
    // })
    //   .sort({ timestamp: -1 })
    //   .skip((page + 1) * limit)
    //   .limit(1);

    // const hasMore = hasMoreMessages.length > 0;

    // Check if there are more messages
    const nextBatch = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    })
      .sort({ timestamp: -1 })
      .skip(skip + limit)
      .limit(1);

    const hasMore = nextBatch.length > 0;

    return res.status(200).json({
      messages: messages.reverse(),
      // messages: messages,
      hasMore,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File required",
      });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        message: "File size exceeds the maximum allowed limit of 10MB.",
      });
    }

    const date = Date.now();

    let fileDir = `uploads/files`;
    let filename = `${fileDir}/${date}` + `${req.file.originalname}`;

    // let fileDir = `uploads/files/${date}`;
    // let filename = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path, filename);

    return res.status(200).json({
      filePath: filename,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
