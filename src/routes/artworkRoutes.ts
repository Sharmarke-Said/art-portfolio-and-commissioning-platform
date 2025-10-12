import { Hono } from "hono";
import {
  createArtwork,
  getArtworks,
  getArtwork,
  updateArtwork,
  deleteArtwork,
  getMyArtworks,
  updateMyArtwork,
  deleteMyArtwork,
} from "../controllers/artworkController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const artworkRoutes = new Hono();

// Public routes
artworkRoutes.get("/", getArtworks);
artworkRoutes.get("/:id", getArtwork);

// Artist routes
const artistRoutes = new Hono();
artistRoutes.use("*", protect);
artistRoutes.use("*", restrictTo("artist"));
artistRoutes.post("/", createArtwork);
artistRoutes.get("/my/artworks", getMyArtworks);
artistRoutes.patch("/my/:id", updateMyArtwork);
artistRoutes.delete("/my/:id", deleteMyArtwork);

// Admin routes
const adminRoutes = new Hono();
adminRoutes.use("*", protect);
adminRoutes.use("*", restrictTo("admin"));
adminRoutes.patch("/:id", updateArtwork);
adminRoutes.delete("/:id", deleteArtwork);

artworkRoutes.route("/", artistRoutes);
artworkRoutes.route("/", adminRoutes);

export default artworkRoutes;
