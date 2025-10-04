import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";

const userRoutes = new Hono();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);

userRoutes.get("/:id", getUser);
userRoutes.patch("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
