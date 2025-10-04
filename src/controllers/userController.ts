import type { Context } from "hono";
import { User } from "../models/User";

export const createUser = async (c: Context) => {
  try {
    const { username, email, password, role } = await c.req.json();

    if (!username || !email || !password || !role) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    return c.json(
      {
        status: "success",
        data: { user },
      },
      201
    );
  } catch (err) {
    console.error("Error creating user:", err);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch users",
      },
      500
    );
  }
};

export const getUsers = async (c: Context) => {
  try {
    const users = await User.find();

    return c.json(
      {
        status: "success",
        results: users.length,
        data: { users },
      },
      200
    );
  } catch (err) {
    console.error("Error fetching users:", err);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch users",
      },
      500
    );
  }
};

export const getUser = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const user = await User.findById(id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ status: "success", data: { user } }, 200);
  } catch (err) {
    console.error("Error fetching user:", err);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch user",
      },
      500
    );
  }
};

export const updateUser = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { username, email, password, role } = await c.req.json();

    const user = await User.findByIdAndUpdate(
      id,
      { username, email, password, role },
      { new: true }
    );

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ status: "success", data: { user } }, 200);
  } catch (err) {
    console.error("Error updating user:", err);
    return c.json(
      {
        status: "error",
        message: "Failed to update user",
      },
      500
    );
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(
      {
        status: "success",
        data: null,
      },
      200
    );
  } catch (err) {
    console.error("Error deleting user:", err);
    return c.json(
      {
        status: "error",
        message: "Failed to delete user",
      },
      500
    );
  }
};
