import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    pin: {
      type: String,
      required: [true, "Pin is required"],
    },
    avatar: {
      type: Number,
      default: 0,
    },
    // lastName: {
    //   type: String,
    //   required: false,
    // },
    // image: {
    //   type: String,
    //   required: false,
    // },
    // color: {
    //   type: Number,
    //   required: false,
    // },
    // profileSetup: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.pin = await hash(this.pin, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
