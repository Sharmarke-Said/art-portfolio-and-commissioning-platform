import { Hono } from "hono";
import {
  signup,
  login,
  logout,
} from "../controllers/authController.ts";

const authRoutes = new Hono();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
