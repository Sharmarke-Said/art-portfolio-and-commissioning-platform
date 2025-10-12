import { Hono } from "hono";
import {
  // Admin routes
  getCommissions,
  getCommission,
  deleteCommission,
  // Client routes
  createCommission,
  getMyCommissions,
  respondToRenegotiation,
  // Artist routes
  getAssignedCommissions,
  acceptCommission,
  declineCommission,
  renegotiateCommission,
  completeCommission,
} from "../controllers/commissionController";
import {
  protect,
  restrictTo,
} from "../middlewares/authMiddleware.ts";

const commissionRoutes = new Hono();

commissionRoutes.use("*", protect);

// Admin routes
const adminRoutes = new Hono();
adminRoutes.use("*", restrictTo("admin"));
adminRoutes.get("/", getCommissions);
adminRoutes.get("/:id", getCommission);
adminRoutes.delete("/:id", deleteCommission);

// Client routes
const clientRoutes = new Hono();
clientRoutes.use("*", restrictTo("user"));
clientRoutes.post("/", createCommission);
clientRoutes.get("/client/:id", getMyCommissions);
clientRoutes.post("/:id/respond", respondToRenegotiation);

// Artist routes
const artistRoutes = new Hono();
artistRoutes.use("*", restrictTo("artist"));
artistRoutes.get("/artist/:id", getAssignedCommissions);
artistRoutes.post("/:id/accept", acceptCommission);
artistRoutes.post("/:id/decline", declineCommission);
artistRoutes.post("/:id/renegotiate", renegotiateCommission);
artistRoutes.post("/:id/complete", completeCommission);

commissionRoutes.route("/", adminRoutes);
commissionRoutes.route("/", clientRoutes);
commissionRoutes.route("/", artistRoutes);

export default commissionRoutes;
