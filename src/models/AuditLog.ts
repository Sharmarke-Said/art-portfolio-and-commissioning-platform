import { model, Schema } from "mongoose";
import type { IAuditLog } from "../types/auditLog";

const AuditLogSchema = new Schema<IAuditLog>({
  entityType: {
    type: String,
    required: [true, "Entity type is required"],
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: [true, "Entity ID is required"],
  },
  action: {
    type: String,
    required: [true, "Action is required"],
  },
  actorId: {
    type: Schema.Types.ObjectId,
    required: [true, "Actor ID is required"],
  },
  details: {
    type: Schema.Types.Mixed,
    required: [true, "Details are required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AuditLog = model<IAuditLog>("AuditLog", AuditLogSchema);
