import app from "./app";
import connectDB from "./config/db";

const PORT = Number(Bun.env.PORT) || 3000;

// 🧩 Handle uncaught exceptions (synchronous)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const server = Bun.serve({
      fetch: app.fetch,
      port: PORT,
      error(err) {
        console.error("Server Error:", err);
        return new Response("Internal Server Error", { status: 500 });
      },
    });

    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // 🧩 Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      console.error("⚠️ Unhandled Rejection! Shutting down...");
      console.error(reason);
      server.stop(true);
      process.exit(1);
    });

    // 🧩 Graceful shutdown (SIGINT & SIGTERM)
    const gracefulShutdown = async (signal: string) => {
      console.log(
        `\n📴 Received ${signal}. Shutting down gracefully...`
      );
      try {
        // If you have DB connections or background jobs, close them here
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("✅ Cleanup complete. Exiting now...");
        server.stop(true);
        process.exit(0);
      } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
