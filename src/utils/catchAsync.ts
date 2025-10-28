import type { Context } from "hono";
import logger from "./logger";

/**
 * Utility to catch async route errors and pass them to the error handler.
 */
export const catchAsync =
  (fn: (c: Context) => Promise<Response>) => async (c: Context) => {
    try {
      return await fn(c);
    } catch (err: any) {
      logger.error(
        { error: err.message, stack: err.stack },
        "Caught async error"
      );
      // Re-throw so Hono's error handler or middleware can catch it
      throw err;
    }
  };

//   import type { Context } from "hono";

// /**
//  * A lightweight async wrapper for route handlers in Hono.
//  * It ensures all async errors are caught and passed to Hono’s error handling flow.
//  */
// export const asyncHandler =
//   (fn: (c: Context) => Promise<Response>) =>
//   async (c: Context): Promise<Response> => {
//     try {
//       return await fn(c);
//     } catch (err) {
//       console.error("🔥 AsyncHandler caught an error:", err);
//       // Hono automatically passes thrown errors to its onError handler
//       throw err;
//     }
//   };
