import { Types } from "mongoose";

export interface IRenegotiation {
  message: string;
  budget?: number;
  dueDate?: Date;
  createdAt: Date;
}

export type CommissionStatus =
  | "Pending_Approval"
  | "In_Progress"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Failed";

export interface ICommission {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  artistId: Types.ObjectId;
  description: string;
  budget: number;
  dueDate: Date;
  status: CommissionStatus;
  paymentStatus: PaymentStatus;
  renegotiations: IRenegotiation[];
  createdAt: Date;
  updatedAt: Date;
}
