import { Types } from "mongoose";

export type UserRole = "user" | "artist" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
