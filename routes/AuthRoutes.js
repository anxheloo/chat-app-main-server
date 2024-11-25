import { Router } from "express";
import {
  Login,
  Signup,
  UserInfo,
  UpdateProfile,
  UpdateImage,
  RemoveProfileImage,
  Logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/profiles/" });

// 1. initialize route
const authRoutes = Router();

// 2. create routes
authRoutes.post("/signup", Signup);
authRoutes.post("/login", Login);
authRoutes.get("/user_info", verifyToken, UserInfo);
authRoutes.post("/update-profile", verifyToken, UpdateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  UpdateImage
);
authRoutes.delete("/remove-profile-image", verifyToken, RemoveProfileImage);
authRoutes.post("/logout", Logout);

export default authRoutes;
