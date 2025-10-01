import { model, Schema } from "mongoose";
import type { IAuditLog } from "../types/auditLog";

const AuditLogSchema = new Schema<IAuditLog>({
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  actorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AuditLog = model<IAuditLog>("AuditLog", AuditLogSchema);
