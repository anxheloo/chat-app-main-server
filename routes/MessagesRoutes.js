import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

// 1. initialize route
const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken,  getMessages);

export default messagesRoutes;
