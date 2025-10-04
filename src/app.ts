import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import artistRoutes from "./routes/artistRoutes";
import artworkRoutes from "./routes/artworkRoutes";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

// Mount routes
app.route("/api/v1/users", userRoutes);
app.route("/api/v1/artists", artistRoutes);
app.route("/api/v1/artworks", artworkRoutes);

export default app;
