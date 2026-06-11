import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "./auth.js";
import { runAgentRuntime } from "./aiRuntime.js";

type QueryClient = Pick<typeof pool, "query">;

type AgentRow = {
  id: string;
  app_key: string;
  name: string;
  provider: string | null;
  model: string;
  system_prompt_key: string;
  system_prompt: string;
  version: number;
  status: string;
  temperature: string | number;
  max_tokens: number;
  allowed_tools: unknown;
  allowed_data: unknown;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type AppRunRow = {
  id: string;
  app_key: string;
  input_json: unknown;
  result_json: unknown;
  created_at: string;
};

const userRoleSchema = z.enum(["super_admin", "admin", "operator", "reviewer", "user"]);
const userStatusSchema = z.enum(["active", "disabled", "deleted"]);

function textOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function limitFrom(value: unknown, fallback = 100, max = 300) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

async function writeAudit(args: {
  actorUserId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  before?: unknown;
  after?: unknown;
  client?: QueryClient;
}) {
  const client = args.client || pool;
  await client.query(
    `INSERT INTO audit_logs(actor_user_id, action, target_type, target_id, before_json, after_json)
     VALUES($1, $2, $3, $4, $5::jsonb, $6::jsonb)`,
    [
      args.actorUserId || null,
      args.action,
      args.targetType,
      args.targetId || null,
      args.before === undefined ? null : JSON.stringify(args.before),
      args.after === undefined ? null : JSON.stringify(args.after)
    ]
  );
}

async function loadAgent(id: string) {
  const rows = await query<AgentRow>(
    `SELECT id, app_key, name, provider, model, system_prompt_key, system_prompt, version, status,
            temperature, max_tokens, allowed_tools, allowed_data, metadata, created_at, updated_at
     FROM ai_agents
     WHERE id=$1`,
    [id]
  );
  return rows[0] || null;
}

function registerDashboardRoutes(app: Express) {
  app.get("/api/admin/dashboard", requireAuth, requireAdmin, async (_req, res) => {
    const [users, apps, agents, runs, errors, conversations] = await Promise.all([
      query<{ count: string }>(`SELECT count(*) FROM users WHERE status <> 'deleted'`),
      query<{ count: string }>(`SELECT count(*) FROM apps`),
      query<{ count: string }>(`SELECT count(*) FROM ai_agents WHERE status='active'`),
      query<{ count: string }>(`SELECT count(*) FROM ai_agent_runs WHERE created_at >= now() - interval '30 days'`),
      query<{ count: string }>(`SELECT count(*) FROM ai_agent_runs WHERE status='error' AND created_at >= now() - interval '30 days'`),
      query<{ count: string }>(`SELECT count(*) FROM conversations WHERE created_at >= now() - interval '30 days'`)
    ]);
    res.json({
      totals: {
        users: Number(users[0]?.count || 0),
        apps: Number(apps[0]?.count || 0),
        activeAgents: Number(agents[0]?.count || 0),
        aiRuns30d: Number(runs[0]?.count || 0),
        aiErrors30d: Number(errors[0]?.count || 0),
        conversations30d: Number(conversations[0]?.count || 0)
      }
    });
  });
}

function registerAgentReadAndActionRoutes(app: Express) {
  app.get("/api/admin/agents", requireAuth, requireAdmin, async (req, res) => {
    const appKey = textOrNull(req.query.appKey);
    const status = textOrNull(req.query.status);
    const q = textOrNull(req.query.q);
    const rows = await query<AgentRow>(
      `SELECT id, app_key, name, provider, model, system_prompt_key, system_prompt, version, status,
              temperature, max_tokens, allowed_tools, allowed_data, metadata, created_at, updated_at
       FROM ai_agents
       WHERE ($1::text IS NULL OR app_key=$1)
         AND ($2::text IS NULL OR status=$2)
         AND ($3::text IS NULL OR name ILIKE '%' || $3 || '%' OR system_prompt ILIKE '%' || $3 || '%')
       ORDER BY app_key, status='active' DESC, version DESC, name`,
      [appKey, status, q]
    );
    res.json({ items: rows });
  });

  app.get("/api/admin/agents/:id", requireAuth, requireAdmin, async (req, res) => {
    const agent = await loadAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: "Không tìm thấy agent." });
    res.json({ agent });
  });

  app.post("/api/admin/agents/:id/activate", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const before = await loadAgent(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy agent." });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE ai_agents SET status='disabled', updated_at=now() WHERE app_key=$1 AND status='active' AND id<>$2`, [before.app_key, before.id]);
      const rows = await client.query<AgentRow>(`UPDATE ai_agents SET status='active', updated_at=now() WHERE id=$1 RETURNING *`, [before.id]);
      await writeAudit({ actorUserId: req.user!.id, action: "agent.activate", targetType: "ai_agent", targetId: before.id, before, after: rows.rows[0], client });
      await client.query("COMMIT");
      res.json({ agent: rows.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/api/admin/agents/:id/disable", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const before = await loadAgent(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy agent." });
    const rows = await query<AgentRow>(`UPDATE ai_agents SET status='disabled', updated_at=now() WHERE id=$1 RETURNING *`, [req.params.id]);
    await writeAudit({ actorUserId: req.user!.id, action: "agent.disable", targetType: "ai_agent", targetId: req.params.id, before, after: rows[0] });
    res.json({ agent: rows[0] });
  });

  app.post("/api/admin/agents/:id/test", requireAuth, requireAdmin, async (req, res) => {
    const body = z.object({ message: z.string().min(1).max(12000), appRunId: z.string().uuid().optional() }).parse(req.body);
    const agent = await loadAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: "Không tìm thấy agent." });
    let appRun: AppRunRow | null = null;
    if (body.appRunId) {
      const rows = await query<AppRunRow>(`SELECT id, app_key, input_json, result_json, created_at FROM app_runs WHERE id=$1 AND app_key=$2 LIMIT 1`, [body.appRunId, agent.app_key]);
      appRun = rows[0] || null;
    }
    const result = await runAgentRuntime({
      agent,
      appRun,
      messages: [{ role: "user", content: body.message }],
      extraInstruction: "Đây là lượt test agent trong admin. Trả lời ngắn, nêu rõ agent/app đang dùng."
    });
    res.json({ ok: true, agent: { id: agent.id, name: agent.name, appKey: agent.app_key }, result });
  });
}

function registerUserQuotaRoutes(app: Express) {
  app.get("/api/admin/users-quota", requireAuth, requireAdmin, async (req, res) => {
    const q = textOrNull(req.query.q);
    const limit = limitFrom(req.query.limit, 200, 500);
    const rows = await query(
      `SELECT u.id, u.clerk_user_id, u.email, u.display_name, u.role, u.status, u.metadata, u.created_at,
              COALESCE(cb.balance, 0)::integer AS balance,
              COALESCE(ai.total_runs, 0)::integer AS ai_runs,
              COALESCE(ai.total_tokens, 0)::integer AS ai_tokens
       FROM users u
       LEFT JOIN credit_balances cb ON cb.user_id=u.id
       LEFT JOIN LATERAL (
         SELECT count(*) AS total_runs, COALESCE(sum(token_input + token_output), 0) AS total_tokens
         FROM ai_agent_runs r WHERE r.user_id=u.id
       ) ai ON true
       WHERE ($1::text IS NULL OR u.email ILIKE '%' || $1 || '%' OR u.display_name ILIKE '%' || $1 || '%')
       ORDER BY u.created_at DESC
       LIMIT $2`,
      [q, limit]
    );
    res.json({ items: rows });
  });

  app.patch("/api/admin/users/:id/quota", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = z.object({
      role: userRoleSchema.optional(),
      status: userStatusSchema.optional(),
      balance: z.number().int().min(0).max(100000000).optional(),
      dailyQuota: z.number().int().min(0).max(1000000).optional(),
      monthlyQuota: z.number().int().min(0).max(10000000).optional(),
      note: z.string().max(1000).optional()
    }).parse(req.body);
    const beforeRows = await query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
    if (!beforeRows[0]) return res.status(404).json({ error: "Không tìm thấy user." });
    const quotaMeta = {
      quota: {
        ...(data.dailyQuota !== undefined ? { daily: data.dailyQuota } : {}),
        ...(data.monthlyQuota !== undefined ? { monthly: data.monthlyQuota } : {})
      },
      ...(data.note ? { adminNote: data.note } : {})
    };
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const userRows = await client.query(
        `UPDATE users SET role=COALESCE($2, role), status=COALESCE($3, status), metadata=metadata || $4::jsonb, updated_at=now() WHERE id=$1 RETURNING *`,
        [req.params.id, data.role ?? null, data.status ?? null, JSON.stringify(quotaMeta)]
      );
      if (data.balance !== undefined) {
        await client.query(
          `INSERT INTO credit_balances(user_id, balance, updated_at) VALUES($1, $2, now()) ON CONFLICT (user_id) DO UPDATE SET balance=EXCLUDED.balance, updated_at=now()`,
          [req.params.id, data.balance]
        );
        await client.query(`INSERT INTO credit_transactions(user_id, type, amount, note, created_by) VALUES($1, 'admin_set_balance', $2, $3, $4)`, [req.params.id, data.balance, data.note || "Admin set quota balance", req.user!.id]);
      }
      await writeAudit({ actorUserId: req.user!.id, action: "user.quota_update", targetType: "user", targetId: req.params.id, before: beforeRows[0], after: { user: userRows.rows[0], balance: data.balance }, client });
      await client.query("COMMIT");
      res.json({ user: userRows.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}

export function registerAdminAgentExtrasRoutes(app: Express) {
  registerDashboardRoutes(app);
  registerAgentReadAndActionRoutes(app);
  registerUserQuotaRoutes(app);
}
