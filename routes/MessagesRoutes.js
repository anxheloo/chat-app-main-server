import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";

import multer from "multer";

const upload = multer({ dest: "uploads/files" });

// 1. initialize route
const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken,  getMessages);
messagesRoutes.post("/upload-files", verifyToken,  upload.single("file"), uploadFiles);

export default messagesRoutes;
