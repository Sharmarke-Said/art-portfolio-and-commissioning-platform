import { Hono } from "hono";
import {
  createArtwork,
  getArtworks,
  getArtwork,
  updateArtwork,
  deleteArtwork,
} from "../controllers/artworkController";

const artworkRoutes = new Hono();

artworkRoutes.get("/", getArtworks);
artworkRoutes.post("/", createArtwork);

artworkRoutes.get("/:id", getArtwork);
artworkRoutes.patch("/:id", updateArtwork);
artworkRoutes.delete("/:id", deleteArtwork);

export default artworkRoutes;
