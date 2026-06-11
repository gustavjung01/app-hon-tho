import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { query } from "./db.js";
import { register, login, signToken, requireAuth, requireAdmin, type AuthedRequest } from "./auth.js";
import { registerConversationRoutes } from "./conversationRoutes.js";
import { registerAiRoutes } from "./aiRoutes.js";
import { sendEmail } from "./email.js";

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || true;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));

function publicHealthPayload() {
  return { ok: true, service: "hontho-app-api", phase: "ai-agent-runtime", time: new Date().toISOString() };
}

app.get("/health", (_req, res) => res.json(publicHealthPayload()));
app.get("/api/health", (_req, res) => res.json(publicHealthPayload()));

app.post("/auth/register", async (req, res) => {
  const data = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().optional()
  }).parse(req.body);
  const user = await register(data.email, data.password, data.displayName);
  res.json({ user, token: signToken(user) });
});

app.post("/auth/login", async (req, res) => {
  const data = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await login(data.email, data.password);
  if (!user) return res.status(401).json({ error: "Email hoặc mật khẩu không đúng." });
  res.json({ user, token: signToken(user) });
});

app.get("/account/me", requireAuth, async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT u.id, u.clerk_user_id, u.email, u.display_name, u.role, u.status, cb.balance
     FROM users u
     LEFT JOIN credit_balances cb ON cb.user_id = u.id
     WHERE u.id=$1`,
    [req.user!.id]
  );
  res.json({ user: rows[0] });
});

app.get("/api/auth/me", requireAuth, async (req: AuthedRequest, res) => {
  const rows = await query(
    `SELECT u.id, u.clerk_user_id, u.email, u.display_name, u.role, u.status, cb.balance
     FROM users u
     LEFT JOIN credit_balances cb ON cb.user_id = u.id
     WHERE u.id=$1`,
    [req.user!.id]
  );
  res.json({ user: rows[0] });
});

app.post("/api/auth/sync", requireAuth, async (req: AuthedRequest, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/credits/balance", requireAuth, async (req: AuthedRequest, res) => {
  const rows = await query<{ balance: number }>(`SELECT balance FROM credit_balances WHERE user_id=$1`, [req.user!.id]);
  res.json({ balance: rows[0]?.balance ?? 0 });
});

app.post("/credits/topup-request", requireAuth, async (req: AuthedRequest, res) => {
  const data = z.object({
    amountVnd: z.number().int().min(10000),
    creditAmount: z.number().int().min(1)
  }).parse(req.body);
  const prefix = process.env.BANK_TRANSFER_PREFIX || "HT";
  const code = `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const rows = await query(
    `INSERT INTO payment_requests(user_id, amount_vnd, credit_amount, transfer_code)
     VALUES($1, $2, $3, $4)
     RETURNING *`,
    [req.user!.id, data.amountVnd, data.creditAmount, code]
  );
  res.json({
    paymentRequest: rows[0],
    instruction: `Chuyển khoản ${data.amountVnd.toLocaleString("vi-VN")}đ với nội dung: ${code}`
  });
});

app.get("/admin/payment-requests", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await query(
    `SELECT pr.*, u.email
     FROM payment_requests pr
     LEFT JOIN users u ON u.id = pr.user_id
     ORDER BY pr.created_at DESC
     LIMIT 100`
  );
  res.json({ items: rows });
});

app.post("/admin/payment-requests/:id/approve", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  const rows = await query<{ id: string; user_id: string; credit_amount: number; status: string }>(
    `SELECT id, user_id, credit_amount, status FROM payment_requests WHERE id=$1`,
    [req.params.id]
  );
  const pr = rows[0];
  if (!pr) return res.status(404).json({ error: "Không tìm thấy yêu cầu nạp." });
  if (pr.status !== "pending") return res.status(400).json({ error: "Yêu cầu này không còn ở trạng thái chờ." });

  await query("BEGIN");
  try {
    await query(`UPDATE payment_requests SET status='approved', approved_by=$1, approved_at=now() WHERE id=$2`, [req.user!.id, pr.id]);
    await query(`UPDATE credit_balances SET balance = balance + $1, updated_at=now() WHERE user_id=$2`, [pr.credit_amount, pr.user_id]);
    await query(
      `INSERT INTO credit_transactions(user_id, type, amount, note, ref_id, created_by)
       VALUES($1, 'topup_approved', $2, $3, $4, $5)`,
      [pr.user_id, pr.credit_amount, "Admin duyệt chuyển khoản", pr.id, req.user!.id]
    );
    await query("COMMIT");
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
  res.json({ ok: true });
});

app.post("/email/test", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  const data = z.object({ to: z.string().email() }).parse(req.body);
  const result = await sendEmail({
    to: data.to,
    subject: "Test email Hồn Thơ App",
    html: "<p>Email test từ hệ thống app.hontho.com</p>",
    userId: req.user!.id
  });
  res.json(result);
});

app.post("/nguthuat/tutru/calculate", requireAuth, async (req: AuthedRequest, res) => {
  await query(
    `INSERT INTO app_usage_logs(user_id, app_key, action, credit_cost, metadata)
     VALUES($1, 'tu_tru', 'calculate', 0, $2)`,
    [req.user!.id, JSON.stringify(req.body)]
  );
  res.json({
    ok: true,
    result: {
      message: "API placeholder. Gắn engine Tứ Trụ thật vào endpoint này ở phase sau.",
      input: req.body
    }
  });
});

app.get("/api/admin/overview", requireAuth, requireAdmin, async (_req, res) => {
  const [users, conversations, messages, apps, agents] = await Promise.all([
    query<{ count: string }>(`SELECT count(*) FROM users`),
    query<{ count: string }>(`SELECT count(*) FROM conversations`),
    query<{ count: string }>(`SELECT count(*) FROM messages`),
    query(`SELECT key, name, category, status, default_credit_cost FROM apps ORDER BY category, name`),
    query(`SELECT id, app_key, name, model, system_prompt_key, version, status FROM ai_agents ORDER BY app_key, version DESC`)
  ]);
  res.json({
    totals: {
      users: Number(users[0]?.count ?? 0),
      conversations: Number(conversations[0]?.count ?? 0),
      messages: Number(messages[0]?.count ?? 0)
    },
    apps,
    agents
  });
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await query(
    `SELECT u.id, u.clerk_user_id, u.email, u.display_name, u.role, u.status, cb.balance, u.created_at
     FROM users u
     LEFT JOIN credit_balances cb ON cb.user_id = u.id
     ORDER BY u.created_at DESC
     LIMIT 200`
  );
  res.json({ items: rows });
});

app.get("/api/admin/apps", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await query(`SELECT * FROM apps ORDER BY category, name`);
  res.json({ items: rows });
});

app.get("/api/admin/ai-agents", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await query(`SELECT * FROM ai_agents ORDER BY app_key, version DESC, name`);
  res.json({ items: rows });
});

registerConversationRoutes(app);
registerAiRoutes(app);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error instanceof z.ZodError) return res.status(400).json({ error: "Dữ liệu không hợp lệ.", details: error.flatten() });
  return res.status(500).json({ error: "Lỗi hệ thống API." });
});

const port = Number(process.env.API_PORT || process.env.PORT || 4000);
app.listen(port, () => console.log(`Hồn Thơ API listening on ${port}`));
