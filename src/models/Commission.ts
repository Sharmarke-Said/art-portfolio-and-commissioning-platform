import { Schema, model } from "mongoose";
import type { ICommission } from "../types/commission";

const CommissionSchema = new Schema<ICommission>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: [true, "User reference is required"],
      ref: "User",
    },
    artistId: {
      type: Schema.Types.ObjectId,
      required: [true, "Artist reference is required"],
      ref: "Artist",
    },
    description: {
      type: String,
      required: [true, "Commission description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Commission budget is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Commission due date is required"],
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
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
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
