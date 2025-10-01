import { Schema, model } from "mongoose";
import type { ICommission } from "../types/commission";

const CommissionSchema = new Schema<ICommission>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    artistId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Artist",
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending_Approval",
        "In_Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending_Approval",
    },
    renegotiations: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

export const Commission = model<ICommission>(
  "Commission",
  CommissionSchema
);
