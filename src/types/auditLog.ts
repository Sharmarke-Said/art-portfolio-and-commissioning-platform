import { Types } from "mongoose";

export interface IAuditLog {
  _id: Types.ObjectId;
  entityType: string;
  entityId: Types.ObjectId;
  action: string;
  actorId?: Types.ObjectId;
  details?: Record<string, any>;
  createdAt: Date;
}
