import { Hono } from "hono";
import userRoutes from "./routes/userRoutes";
import artistRoutes from "./routes/artistRoutes";
import artworkRoutes from "./routes/artworkRoutes";
import commissionRoutes from "./routes/commissionRoutes";
import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./controllers/errorController";

const app = new Hono();

app.get("/", (c) => c.text("Hello Bun!"));

// Mount routes
app.route("/api/v1/users", userRoutes);
app.route("/api/v1/artists", artistRoutes);
app.route("/api/v1/artworks", artworkRoutes);
app.route("/api/v1/commissions", commissionRoutes);

// 404 handler
app.notFound((c) => {
  throw new AppError(`Can't find ${c.req.path} on this server!`, 404);
});

// Global error handler
app.onError((err, c) => globalErrorHandler(err, c));

export default app;
