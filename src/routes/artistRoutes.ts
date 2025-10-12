import { Hono } from "hono";
import {
  createArtist,
  deleteArtist,
  getArtist,
  getArtists,
  updateArtist,
} from "../controllers/artistController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const artistRoutes = new Hono();

artistRoutes.get("/", getArtists);

artistRoutes.use("*", protect);
artistRoutes.use("*", restrictTo("admin"));

artistRoutes.post("/", createArtist);

artistRoutes.get("/:id", getArtist);
artistRoutes.patch("/:id", updateArtist);
artistRoutes.delete("/:id", deleteArtist);

export default artistRoutes;
