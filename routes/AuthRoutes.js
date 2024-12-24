import { Router } from "express";
import {
  Login,
  Signup,
  UserInfo,
  UpdateUsername,
  UpdateProfile,
  UpdatePin,
  UpdateDissapearingMessages,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

// 1. initialize route
const authRoutes = Router();

// 2. create routes
authRoutes.post("/signup", Signup);
authRoutes.post("/login", Login);
authRoutes.post("/update-profile-pic", verifyToken, UpdateProfile);
authRoutes.post("/update-username", verifyToken, UpdateUsername);
authRoutes.post("/update-pin", verifyToken, UpdatePin);
authRoutes.patch(
  "/update-dissappearing-messages",
  verifyToken,
  UpdateDissapearingMessages
);
authRoutes.get("/user_info", verifyToken, UserInfo);
// authRoutes.post("/logout", Logout);

export default authRoutes;
