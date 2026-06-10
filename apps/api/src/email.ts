import { query } from "./db.js";

export async function sendEmail(params: { to: string; subject: string; html: string; userId?: string }) {
  const provider = process.env.EMAIL_PROVIDER || "stub";
  await query(
    `INSERT INTO email_logs(user_id, to_email, subject, provider, status)
     VALUES($1, $2, $3, $4, $5)`,
    [params.userId || null, params.to, params.subject, provider, provider === "stub" ? "stubbed" : "queued"]
  );
  console.log("[email stub]", params.to, params.subject);
  return { ok: true, provider, status: "stubbed" };
}
