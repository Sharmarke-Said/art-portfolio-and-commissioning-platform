// services/emailService.ts
import logger from "../../utils/logger";

interface EmailData {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

/**
 * Simulates sending an email by logging it.
 * Later, replace with real provider integration (e.g., SES, SendGrid).
 */
export const sendEmail = async ({
  to,
  subject,
  body,
  from = "noreply@yourapp.com",
}: EmailData) => {
  logger.debug({ to, subject }, "Simulating email send");

  await new Promise((res) => setTimeout(res, 1000)); // simulate network latency

  logger.info(
    {
      from,
      to,
      subject,
      bodyPreview:
        body.substring(0, 100) + (body.length > 100 ? "..." : ""),
    },
    "Email sent (simulated)"
  );

  return { success: true };
};
