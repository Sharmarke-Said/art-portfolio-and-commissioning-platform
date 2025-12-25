import { createQueue } from "./baseQueue";

export const notificationQueue = createQueue("notification-queue");

/**
 * Convenience helpers to enqueue common notification actions.
 * Controllers can still call `notificationQueue.add(name, data)` directly.
 */
export const notifyCommissionCompleted = async (params: {
  to: string;
  commissionId: string;
  artistId: string;
  artistName?: string;
  clientName?: string;
}) => {
  return notificationQueue.add("complete-commission", params);
};

export const notifyCommissionDeclined = async (params: {
  to: string;
  commissionId: string;
  artistId: string;
  artistName?: string;
  clientName?: string;
  reason?: string;
}) => {
  return notificationQueue.add("decline-commission", params);
};

export const notifyRenegotiationProposal = async (params: {
  to: string;
  commissionId?: string;
  artistName?: string;
  clientName?: string;
  message?: string;
  newBudget?: number;
  newDueDate?: string;
}) => {
  return notificationQueue.add("renegotiate-commission", params);
};
