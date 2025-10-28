import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";

const PORT = Number(Bun.env.PORT) || 3000;

// 🧩 Handle uncaught exceptions (synchronous)
process.on("uncaughtException", (err) => {
  logger.fatal(
    {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    },
    "Uncaught Exception! Shutting down..."
  );
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const server = Bun.serve({
      fetch: app.fetch,
      port: PORT,
      error(err) {
        logger.error(
          { error: err.message, stack: err.stack },
          "Server Error"
        );
        return new Response("Internal Server Error", { status: 500 });
      },
    });

    logger.info({ port: PORT }, "Server running");

    // 🧩 Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      logger.error(
        { reason },
        "Unhandled Rejection! Shutting down..."
      );
      server.stop(true);
      process.exit(1);
    });

    // 🧩 Graceful shutdown (SIGINT & SIGTERM)
    const gracefulShutdown = async (signal: string) => {
      logger.warn(
        { signal },
        "Received shutdown signal. Shutting down gracefully..."
      );
      try {
        // If you have DB connections or background jobs, close them here
        await new Promise((resolve) => setTimeout(resolve, 500));
        logger.info("Cleanup complete. Exiting now...");
        server.stop(true);
        process.exit(0);
      } catch (err: any) {
        logger.error({ error: err.message }, "Error during shutdown");
        process.exit(1);
      }
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
