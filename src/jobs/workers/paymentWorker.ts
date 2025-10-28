import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import { Commission } from "../../models/Commission";
import { AuditLog } from "../../models/AuditLog";

interface PaymentJobData {
  commissionId: string;
  artistId: string;
}

// Simulate payment processing (placeholder function)
const simulatePayment = async (): Promise<{ success: boolean }> => {
  // Simulate random success/failure for demonstration
  const success = Math.random() > 0.3; // 70% success rate

  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  return { success };
};

export const paymentWorker = new Worker<PaymentJobData>(
  "payment-queue",
  async (job) => {
    const { commissionId, artistId } = job.data;

    console.log(
      `💳 Processing payment job [${job.id}] for commission ${commissionId}`
    );

    // Validate commission exists and is in correct state
    const commission = await Commission.findById(commissionId);
    if (!commission) {
      throw new Error(`Commission ${commissionId} not found`);
    }

    if (commission.status !== "Pending_Approval") {
      throw new Error(
        `Commission ${commissionId} is not in Pending_Approval status`
      );
    }

    if (commission.artistId.toString() !== artistId) {
      throw new Error(
        `Artist mismatch for commission ${commissionId}`
      );
    }

    // Process payment
    const { success } = await simulatePayment();

    if (success) {
      // ✅ Update both paymentStatus AND status on success
      commission.paymentStatus = "Paid";
      commission.status = "In_Progress";
      await commission.save();

      // Create audit log
      await AuditLog.create({
        entityType: "Commission",
        entityId: commission._id,
        action: "Payment Success",
        actorId: commission.clientId,
        details: {
          commissionId,
          budget: commission.budget,
          artistId: commission.artistId.toString(),
        },
      });

      console.log(
        `✅ Payment successful for commission ${commissionId}. Status updated to In_Progress.`
      );
    } else {
      // ❌ Only update paymentStatus on failure, keep status as Pending_Approval
      commission.paymentStatus = "Failed";
      await commission.save();

      // Create audit log
      await AuditLog.create({
        entityType: "Commission",
        entityId: commission._id,
        action: "Payment Failed",
        actorId: commission.clientId,
        details: {
          commissionId,
          budget: commission.budget,
          artistId: commission.artistId.toString(),
        },
      });

      console.log(
        `❌ Payment failed for commission ${commissionId}. Status remains Pending_Approval.`
      );
    }

    return { success, commissionId };
  },
  {
    connection: redisConnection,
    // Rate limiter: Process max 10 jobs per second
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// Handle worker events
paymentWorker.on("completed", (job) => {
  console.log(`✅ Payment job [${job.id}] completed successfully`);
});

paymentWorker.on("failed", (job, err) => {
  console.error(`❌ Payment job failed [${job?.id}]:`, err.message);
  if (job?.data.commissionId) {
    console.error(`Commission ID: ${job.data.commissionId}`);
  }
});

paymentWorker.on("error", (err) => {
  console.error("💥 Payment worker error:", err.message);
});
