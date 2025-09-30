import app from "./app";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  await connectDB();

  Bun.serve({
    fetch: app.fetch,
    port: PORT,
    error(err: Error) {
      console.error("Failed to start server:", err);
      return new Response("Internal Server Error", { status: 500 });
    },
  });

  console.log(`🚀 Server running at http://localhost:${PORT}`);
};

startServer();
