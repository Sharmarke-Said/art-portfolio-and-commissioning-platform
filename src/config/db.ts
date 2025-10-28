import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
    });
    logger.info("Database connected successfully");
  } catch (err: any) {
    logger.error(
      { error: err.message },
      "Database connection failed"
    );
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
