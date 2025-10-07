import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import artistRoutes from "./routes/artistRoutes";
import artworkRoutes from "./routes/artworkRoutes";
import commissionRoutes from "./routes/commissionRoutes";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

// Mount routes
app.route("/api/v1/users", userRoutes);
app.route("/api/v1/artists", artistRoutes);
app.route("/api/v1/artworks", artworkRoutes);
app.route("/api/v1/commissions", commissionRoutes);

export default app;
