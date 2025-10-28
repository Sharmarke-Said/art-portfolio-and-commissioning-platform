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

commissionRoutes.get("/", restrictTo("admin"), getCommissions);
commissionRoutes.get("/:id", restrictTo("admin"), getCommission);
commissionRoutes.delete(
  "/:id",
  restrictTo("admin"),
  deleteCommission
);

commissionRoutes.post("/", restrictTo("user"), createCommission);
commissionRoutes.get(
  "/client/:id",
  restrictTo("user"),
  getMyCommissions
);
commissionRoutes.post(
  "/:id/respond",
  restrictTo("user"),
  respondToRenegotiation
);

commissionRoutes.get(
  "/artist/:id",
  restrictTo("artist"),
  getAssignedCommissions
);
commissionRoutes.post(
  "/:id/accept",
  restrictTo("artist"),
  acceptCommission
);
commissionRoutes.post(
  "/:id/decline",
  restrictTo("artist"),
  declineCommission
);
commissionRoutes.post(
  "/:id/renegotiate",
  restrictTo("artist"),
  renegotiateCommission
);
commissionRoutes.post(
  "/:id/complete",
  restrictTo("artist"),
  completeCommission
);

export default commissionRoutes;
