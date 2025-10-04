import { Hono } from "hono";
import {
  createArtist,
  deleteArtist,
  getArtist,
  getArtists,
  updateArtist,
} from "../controllers/artistController";

const artistRoutes = new Hono();

artistRoutes.get("/", getArtists);
artistRoutes.post("/", createArtist);

artistRoutes.get("/:id", getArtist);
artistRoutes.patch("/:id", updateArtist);
artistRoutes.delete("/:id", deleteArtist);

export default artistRoutes;
