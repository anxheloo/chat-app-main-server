import { Router } from "express";
import {
  Login,
  Signup,
  UserInfo,
  Logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

// 1. initialize route
const authRoutes = Router();

// 2. create routes
authRoutes.post("/signup", Signup);
authRoutes.post("/login", Login);
authRoutes.get("/user_info", verifyToken, UserInfo);
authRoutes.post("/logout", Logout);

export default authRoutes;
