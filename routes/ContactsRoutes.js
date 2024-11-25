import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { Search } from "../controllers/ContactsController.js";

// 1. initialize route
const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken,  Search);

export default contactsRoutes;
