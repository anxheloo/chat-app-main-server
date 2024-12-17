import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllContacts,
  getContactsForDm,
  Search,
} from "../controllers/ContactsController.js";

// 1. initialize route
const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, Search);
// contactsRoutes.post("/search", Search);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDm);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactsRoutes;
