import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import { sendEmail } from "../services/emailService";
import logger from "../../utils/logger";

interface NotificationJob {
  to: string;
  subject: string;
  body: string;
}

export const notificationWorker = new Worker<NotificationJob>(
  "notification-queue",
  async (job) => {
    logger.info(
      { jobId: job.id, to: job.data.to, subject: job.data.subject },
      "Processing notification job"
    );
    const { to, subject, body } = job.data;

    await sendEmail({ to, subject, body });
    logger.info(
      { jobId: job.id, to },
      "Notification sent successfully"
    );
  },
  { connection: redisConnection }
);

// Handle worker errors
notificationWorker.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      to: job?.data.to,
      error: err.message,
    },
    "Notification job failed"
  );
});

notificationWorker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, to: job.data.to },
    "Notification job completed successfully"
  );
});

notificationWorker.on("error", (err) => {
  logger.error({ error: err.message }, "Notification worker error");
});
