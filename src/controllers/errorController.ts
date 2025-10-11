import type { Context } from "hono";
import { AppError } from "../utils/appError";

const handleCastErrorDB = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.keyValue
    ? JSON.stringify(err.keyValue)
    : "Duplicate field value";
  return new AppError(
    `Duplicate field value: ${value}. Please use another!`,
    400
  );
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors || {}).map(
    (el: any) => el.message || "Invalid input"
  );
  return new AppError(
    `Invalid input data. ${errors.join(". ")}`,
    400
  );
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

export const globalErrorHandler = (err: any, c: Context) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = Bun.env.NODE_ENV || "development";

  if (env === "development") {
    console.error("💥 ERROR:", err);
    return c.json(
      {
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      },
      err.statusCode
    );
  }

  // Production
  let error = { ...err, message: err.message };

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError")
    error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError")
    error = handleJWTExpiredError();

  if (error.isOperational) {
    return c.json(
      {
        status: error.status,
        message: error.message,
      },
      error.statusCode
    );
  }

  console.error("💥 UNKNOWN ERROR:", error);
  return c.json(
    {
      status: "error",
      message: "Something went very wrong!",
    },
    500
  );
};
