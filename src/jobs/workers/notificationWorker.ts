import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import { sendEmail } from "../services/emailService";

interface NotificationJob {
  to: string;
  subject: string;
  body: string;
}

export const notificationWorker = new Worker<NotificationJob>(
  "notification-queue",
  async (job) => {
    console.log(`🚀 Processing notification job [${job.id}]...`);
    const { to, subject, body } = job.data;

    await sendEmail({ to, subject, body });
    console.log(`✅ Notification sent successfully to ${to}`);
  },
  { connection: redisConnection }
);

// Handle worker errors
notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Notification job failed [${job?.id}]:`, err);
});
