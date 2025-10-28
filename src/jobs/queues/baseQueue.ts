import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis";
import logger from "../../utils/logger";

export const createQueue = (queueName: string) => {
  const queue = new Queue(queueName, { connection: redisConnection });

  logger.info({ queueName }, "Queue initialized");
  return queue;
};
