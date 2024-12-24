import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";

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
        dissappearingMessages: user.dissappearingMessages,
      },
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};
export const Login = async (req, res, next) => {
  console.log("Inside login");

  try {
    // 1. get username and pin than user has sent
    const { username, pin } = req.body;

    // 2. if something is missing return error
    if (!username || !pin) {
      return res.status(400).json({ message: "Username and Pin is required" });
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
        username: existingUser.username,
        avatar: existingUser.avatar,
        dissappearingMessages: existingUser.dissappearingMessages,
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

export const UpdateProfile = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        message: "Avatar is required!",
      });
    }

    const userdata = await User.findByIdAndUpdate(
      req.userId,
      { avatar: avatar },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      avatar: userdata.avatar,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const UpdateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username is required!",
      });
    }

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists!",
      });
    }

    const userdata = await User.findByIdAndUpdate(
      req.userId,
      { username: username },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      username: userdata.username,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const UpdatePin = async (req, res, next) => {
  try {
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
      return res.status(400).json({
        message: "Old Pin and New Pin is required!",
      });
    }

    const existingUser = await User.findOne({ _id: req.userId });
    console.log("This is existing user", existingUser);

    const passwordCompare = await compare(oldPin, existingUser.pin);

    console.log("This is password compare", passwordCompare);

    if (!passwordCompare) {
      return res.status(400).json({
        message: "Enter correct credentials",
      });
    }

    existingUser.pin = newPin;
    await existingUser.save();

    return res.status(200).json({
      message: "Pin Updated Successfully!",
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

export const UpdateDissapearingMessages = async (req, res, next) => {
  const { dissappearingMessages } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { dissappearingMessages: dissappearingMessages },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Disappearing messages updated successfully",
      dissappearingMessages: updatedUser.dissappearingMessages,
    });
  } catch (err) {
    console.log("this is err:", err);
    return res.status(500).send("Internal server error");
  }
};

// export const Logout = async (req, res, next) => {
//   try {
//     //  res.cookie("jwt","",{maxAge:1, secure:true, sameSite:"None"})
//     return res.status(200).json({
//       status: "success",
//       message: "Logged out successfully",
//     });
//   } catch (err) {
//     console.log("this is err:", err);
//     return res.status(500).send("Internal server error");
//   }
// };
