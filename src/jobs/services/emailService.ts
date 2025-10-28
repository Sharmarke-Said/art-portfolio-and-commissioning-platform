// services/emailService.ts

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
  console.log("📧 Simulating email send...");
  await new Promise((res) => setTimeout(res, 1000)); // simulate network latency

  console.log(`
===========================
📩 Email Sent (Simulated)
---------------------------
From: ${from}
To:   ${to}
Subject: ${subject}
---------------------------
${body}
===========================
  `);

  return { success: true };
};
