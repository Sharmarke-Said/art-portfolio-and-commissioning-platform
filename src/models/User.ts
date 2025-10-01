import { Schema, model } from "mongoose";
import type { IUser } from "../types/user";

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "artist", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
