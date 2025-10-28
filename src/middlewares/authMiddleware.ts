import type { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt.ts";
import { User } from "../models/User.ts";
import logger from "../utils/logger";

// Protect middleware — verifies token and attaches user
export const protect = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return c.json({ message: "Not authorized, token missing" }, 401);
  }

  try {
    const decoded = verifyToken(token) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return c.json({ message: "User no longer exists" }, 401);
    }

    // Attach user to context
    c.set("user", user);
    await next();
  } catch (err: any) {
    logger.error({ error: err.message }, "Auth error");
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};

// Role-based authorization
export const restrictTo =
  (...roles: string[]) =>
  async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user || !roles.includes(user.role)) {
      return c.json(
        { message: "You're not authorized to perform this action" },
        403
      );
    }
    await next();
  };
