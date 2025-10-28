import "./notificationWorker";
import "./paymentWorker";
import connectDB from "../../config/db";
import logger from "../../utils/logger";

// Connect to database
connectDB().then(() => {
  logger.info("All workers are running");
  logger.info(
    { queues: ["payment-queue", "notification-queue"] },
    "Monitoring payment and notification queues"
  );
});

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.warn(
    { signal },
    "Received shutdown signal. Shutting down workers gracefully..."
  );
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
