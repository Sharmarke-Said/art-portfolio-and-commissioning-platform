import type { Context } from "hono";
import { User } from "../models/User.ts";
import { signToken } from "../utils/jwt.ts";
import bcrypt from "bcryptjs";

export const signup = async (c: Context) => {
  try {
    const { username, email, password, role } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ message: "All fields are required" }, 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ message: "User already exists" }, 400);
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    const token = signToken(user._id.toString());

    return c.json(
      {
        status: "success",
        token,
        data: { user: { id: user._id, username, email, role } },
      },
      201
    );
  } catch (err) {
    console.error("Signup error:", err);
    return c.json({ message: "Failed to sign up" }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json(
        { message: "Please provide email and password" },
        400
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return c.json({ message: "Incorrect email or password" }, 401);
    }

    const token = signToken(user._id.toString());

    return c.json(
      {
        status: "success",
        token,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email,
            role: user.role,
          },
        },
      },
      200
    );
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ message: "Failed to log in" }, 500);
  }
};

export const logout = async (c: Context) => {
  return c.json({ status: "success", message: "Logged out" }, 200);
};
