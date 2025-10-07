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

const commissionRoutes = new Hono();

// Admin routes
commissionRoutes.get("/", getCommissions);
commissionRoutes.get("/:id", getCommission);
commissionRoutes.delete("/:id", deleteCommission);

// Client routes
commissionRoutes.post("/", createCommission);
commissionRoutes.get("/client/:id", getMyCommissions);
commissionRoutes.post("/:id/respond", respondToRenegotiation);

// Artist routes
commissionRoutes.get("/artist/:id", getAssignedCommissions);
commissionRoutes.post("/:id/accept", acceptCommission);
commissionRoutes.post("/:id/decline", declineCommission);
commissionRoutes.post("/:id/renegotiate", renegotiateCommission);
commissionRoutes.post("/:id/complete", completeCommission);

export default commissionRoutes;
