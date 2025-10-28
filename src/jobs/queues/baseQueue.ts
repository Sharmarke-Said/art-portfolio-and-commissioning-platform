import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis";

export const createQueue = (queueName: string) => {
  const queue = new Queue(queueName, { connection: redisConnection });

  console.log(`✅ Queue initialized: ${queueName}`);
  return queue;
};
