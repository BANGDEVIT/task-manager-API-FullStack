import mongoose from "mongoose";
import { generateRandomString } from "../helpers/generate.helper.js";

const usersSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    tokenUser: {
      type: String,
      default: () => generateRandomString(20),
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", usersSchema);
export default User;