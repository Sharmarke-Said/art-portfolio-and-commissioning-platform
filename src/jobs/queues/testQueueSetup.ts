import { createQueue } from "./baseQueue";

const queue = createQueue("test-queue");

async function run() {
  console.log("🚀 Adding dummy job to test-queue...");
  await queue.add("dummy-job", { hello: "world" });
  console.log(
    "✅ Job added successfully. Check Redis with `redis-cli`."
  );
  process.exit(0);
}

run();
