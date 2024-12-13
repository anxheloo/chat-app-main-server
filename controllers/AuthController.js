import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (username, userId) => {
  return jwt.sign({ username, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const Signup = async (req, res, next) => {
  try {
    // 1. get username and pin than user has sent
    const { username, pin, avatar } = req.body;

    // 2. if something is missing return error
    if (!username || !pin) {
      return res.status(400).send("Username and Pin is required");
    }

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. else create the user with given details
    const user = await User.create({ username, pin, avatar });

    return res.status(201).json({
      message: "Registered successfully!",
      token: createToken(username, user._id), // Include token for mobile
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
export const Login = async (req, res, next) => {
  try {
    // 1. get username and pin than user has sent
    const { username, pin } = req.body;

    // 2. if something is missing return error
    if (!username || !pin) {
      return res.status(400).send("Username and Pin is required");
    }

    //   3. find if user exists
    const existingUser = await User.findOne({ username: username });

    //   4. if doesnt exist return 404
    if (!existingUser) {
      return res.status(404).json({
        message: "User doesn't exist",
      });
    }

    const passwordCompare = await compare(pin, existingUser.pin);

    if (!passwordCompare) {
      return res.status(400).json({
        message: "Enter correct credentials",
      });
    }

    return res.status(200).json({
      message: "Successfully logged in!",
      token: createToken(username, existingUser._id),
      user: {
        id: existingUser.id,
        username: existingUser.email,
        avatar: existingUser.avatar,
      },
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
export const UserInfo = async (req, res, next) => {
  try {
    const userdata = await User.findById(req.userId);

    if (!userdata) {
      return res.status(404).json({
        message: "User with the given id not found!",
      });
    }

    return res.status(200).json({
      id: userdata.id,
      username: userdata.username,
      avatar: userdata.avatar,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
// export const UpdateProfile = async (req, res, next) => {
//   try {
//     const { userId } = req;
//     const { firstName, lastName, color } = req.body;

//     if (!firstName || !lastName) {
//       return res.status(400).json({
//         message: "First name , last name or color is requred!",
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         firstName,
//         lastName,
//         color,
//         profileSetup: true,
//       },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       id: user.id,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       image: user.image,
//       profileSetup: user.profileSetup,
//       color: user.color,
//     });
//   } catch (err) {
//     console.log("this is err:", err);
//     return res.status(500).send("Internal server error");
//   }
// };
// export const UpdateImage = async (req, res, next) => {
//   try {
//     const { userId } = req;
//     const userdata = await User.findById(req.userId);

//     if (!userdata) {
//       return res.status(404).json({
//         message: "User with the given id not found!",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "File is requred!",
//       });
//     }

//     const date = Date.now();
//     let fileName = "uploads/profiles/" + date + req.file.originalname;
//     renameSync(req.file.path, fileName);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         image: fileName,
//       },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       image: updatedUser.image,
//       message: "Image Uploaded Successfully!",
//     });
//   } catch (err) {
//     console.log("this is err:", err);
//     return res.status(500).send("Internal server error");
//   }
// };
// export const RemoveProfileImage = async (req, res, next) => {
//   try {
//     const { userId } = req;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User with the given id not found!",
//       });
//     }

//     if (user.image) {
//       unlinkSync(user.image);
//     }

//     user.image = null;

//     await user.save();

//     return res.status(200).json({
//       message: "image removed",
//     });
//   } catch (err) {
//     console.log("this is err:", err);
//     return res.status(500).send("Internal server error");
//   }
// };
export const Logout = async (req, res, next) => {
  try {
    //  res.cookie("jwt","",{maxAge:1, secure:true, sameSite:"None"})
    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
