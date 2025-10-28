import "./notificationWorker";
import "./paymentWorker";
import connectDB from "../../config/db";

// Connect to database
connectDB().then(() => {
  console.log("🚀 All workers are running...");
  console.log("📊 Monitoring payment and notification queues...");
});

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(
    `\n📴 Received ${signal}. Shutting down workers gracefully...`
  );
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
