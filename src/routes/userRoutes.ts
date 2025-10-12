import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import {
  protect,
  restrictTo,
} from "../middlewares/authMiddleware.ts";

const userRoutes = new Hono();

userRoutes.use("*", protect);
userRoutes.use("*", restrictTo("admin"));

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);

userRoutes.get("/:id", getUser);
userRoutes.patch("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
