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

const agentStatusSchema = z.enum(["draft", "active", "disabled", "archived"]);
const appStatusSchema = z.enum(["draft", "active", "disabled", "archived"]);
const userRoleSchema = z.enum(["super_admin", "admin", "operator", "reviewer", "user"]);
const userStatusSchema = z.enum(["active", "disabled", "deleted"]);

const agentInputSchema = z.object({
  appKey: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  provider: z.string().min(1).max(80).default("openai"),
  model: z.string().min(1).max(120).default("gpt-4.1-mini"),
  systemPromptKey: z.string().min(1).max(120).optional(),
  systemPrompt: z.string().min(1).max(80000),
  persona: z.string().max(20000).optional(),
  playbook: z.unknown().optional(),
  dataStore: z.unknown().optional(),
  importedJson: z.unknown().optional(),
  allowedTools: z.array(z.string()).default([]),
  allowedData: z.array(z.string()).default([]),
  status: agentStatusSchema.default("draft"),
  temperature: z.number().min(0).max(2).default(0.3),
  maxTokens: z.number().int().min(100).max(12000).default(1600)
});

function textOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function limitFrom(value: unknown, fallback = 100, max = 300) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function keyFromName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90) || "agent";
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

async function ensureAppExists(appKey: string) {
  const rows = await query<{ key: string }>(`SELECT key FROM apps WHERE key=$1`, [appKey]);
  return !!rows[0];
}

function buildAgentMetadata(data: z.infer<typeof agentInputSchema>) {
  return {
    persona: data.persona || "",
    playbook: data.playbook ?? null,
    dataStore: data.dataStore ?? null,
    importedJson: data.importedJson ?? null,
    managerVersion: 1
  };
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

function registerAppRoutes(app: Express) {
  app.get("/api/admin/apps-with-agents", requireAuth, requireAdmin, async (_req, res) => {
    const rows = await query(
      `SELECT app.key, app.name, app.category, app.status, app.description, app.default_credit_cost, app.metadata,
              active_agent.id AS active_agent_id,
              active_agent.name AS active_agent_name,
              active_agent.status AS active_agent_status,
              COALESCE(agent_count.total, 0)::integer AS agent_count
       FROM apps app
       LEFT JOIN LATERAL (
         SELECT id, name, status
         FROM ai_agents
         WHERE app_key=app.key AND status='active'
         ORDER BY version DESC, created_at DESC
         LIMIT 1
       ) active_agent ON true
       LEFT JOIN LATERAL (
         SELECT count(*) AS total FROM ai_agents WHERE app_key=app.key
       ) agent_count ON true
       ORDER BY app.category, app.name`
    );
    res.json({ items: rows });
  });

  app.patch("/api/admin/apps/:key", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = z.object({
      name: z.string().min(1).max(160).optional(),
      description: z.string().max(2000).optional(),
      status: appStatusSchema.optional(),
      defaultCreditCost: z.number().int().min(0).max(100000).optional(),
      metadata: z.record(z.unknown()).optional()
    }).parse(req.body);

    const before = await query(`SELECT * FROM apps WHERE key=$1`, [req.params.key]);
    if (!before[0]) return res.status(404).json({ error: "Không tìm thấy app." });

    const rows = await query(
      `UPDATE apps
       SET name=COALESCE($2, name),
           description=COALESCE($3, description),
           status=COALESCE($4, status),
           default_credit_cost=COALESCE($5, default_credit_cost),
           metadata=CASE WHEN $6::jsonb IS NULL THEN metadata ELSE metadata || $6::jsonb END,
           updated_at=now()
       WHERE key=$1
       RETURNING *`,
      [
        req.params.key,
        data.name ?? null,
        data.description ?? null,
        data.status ?? null,
        data.defaultCreditCost ?? null,
        data.metadata ? JSON.stringify(data.metadata) : null
      ]
    );
    await writeAudit({ actorUserId: req.user!.id, action: "app.update", targetType: "app", targetId: req.params.key, before: before[0], after: rows[0] });
    res.json({ app: rows[0] });
  });
}

function registerAgentRoutes(app: Express) {
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

  app.post("/api/admin/agents", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = agentInputSchema.parse(req.body);
    if (!(await ensureAppExists(data.appKey))) return res.status(400).json({ error: "App key không tồn tại." });

    const promptKey = data.systemPromptKey || `${keyFromName(data.appKey)}_${keyFromName(data.name)}`;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const versionRows = await client.query<{ next_version: number }>(
        `SELECT COALESCE(max(version), 0) + 1 AS next_version FROM ai_agents WHERE app_key=$1 AND system_prompt_key=$2`,
        [data.appKey, promptKey]
      );
      const version = versionRows.rows[0]?.next_version || 1;
      if (data.status === "active") {
        await client.query(`UPDATE ai_agents SET status='disabled', updated_at=now() WHERE app_key=$1 AND status='active'`, [data.appKey]);
      }
      const inserted = await client.query<AgentRow>(
        `INSERT INTO ai_agents(app_key, name, provider, model, system_prompt_key, system_prompt, version, status,
                               temperature, max_tokens, allowed_tools, allowed_data, metadata)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13::jsonb)
         RETURNING id, app_key, name, provider, model, system_prompt_key, system_prompt, version, status,
                   temperature, max_tokens, allowed_tools, allowed_data, metadata, created_at, updated_at`,
        [
          data.appKey,
          data.name,
          data.provider,
          data.model,
          promptKey,
          data.systemPrompt,
          version,
          data.status,
          data.temperature,
          data.maxTokens,
          JSON.stringify(data.allowedTools),
          JSON.stringify(data.allowedData),
          JSON.stringify(buildAgentMetadata(data))
        ]
      );
      await writeAudit({ actorUserId: req.user!.id, action: "agent.create", targetType: "ai_agent", targetId: inserted.rows[0].id, after: inserted.rows[0], client });
      await client.query("COMMIT");
      res.status(201).json({ agent: inserted.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.put("/api/admin/agents/:id", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = agentInputSchema.parse(req.body);
    const before = await loadAgent(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy agent." });
    if (!(await ensureAppExists(data.appKey))) return res.status(400).json({ error: "App key không tồn tại." });

    const promptKey = data.systemPromptKey || before.system_prompt_key || `${keyFromName(data.appKey)}_${keyFromName(data.name)}`;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      if (data.status === "active") {
        await client.query(`UPDATE ai_agents SET status='disabled', updated_at=now() WHERE app_key=$1 AND status='active' AND id<>$2`, [data.appKey, req.params.id]);
      }
      const updated = await client.query<AgentRow>(
        `UPDATE ai_agents
         SET app_key=$2,
             name=$3,
             provider=$4,
             model=$5,
             system_prompt_key=$6,
             system_prompt=$7,
             status=$8,
             temperature=$9,
             max_tokens=$10,
             allowed_tools=$11::jsonb,
             allowed_data=$12::jsonb,
             metadata=$13::jsonb,
             updated_at=now()
         WHERE id=$1
         RETURNING id, app_key, name, provider, model, system_prompt_key, system_prompt, version, status,
                   temperature, max_tokens, allowed_tools, allowed_data, metadata, created_at, updated_at`,
        [
          req.params.id,
          data.appKey,
          data.name,
          data.provider,
          data.model,
          promptKey,
          data.systemPrompt,
          data.status,
          data.temperature,
          data.maxTokens,
          JSON.stringify(data.allowedTools),
          JSON.stringify(data.allowedData),
          JSON.stringify(buildAgentMetadata(data))
        ]
      );
      await writeAudit({ actorUserId: req.user!.id, action: "agent.update", targetType: "ai_agent", targetId: req.params.id, before, after: updated.rows[0], client });
      await client.query("COMMIT");
      res.json({ agent: updated.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/api/admin/agents/:id/activate", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const before = await loadAgent(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy agent." });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE ai_agents SET status='disabled', updated_at=now() WHERE app_key=$1 AND status='active' AND id<>$2`, [before.app_key, before.id]);
      const rows = await client.query<AgentRow>(
        `UPDATE ai_agents SET status='active', updated_at=now() WHERE id=$1 RETURNING *`,
        [before.id]
      );
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
    const body = z.object({
      message: z.string().min(1).max(12000),
      appRunId: z.string().uuid().optional()
    }).parse(req.body);
    const agent = await loadAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: "Không tìm thấy agent." });
    let appRun: AppRunRow | null = null;
    if (body.appRunId) {
      const rows = await query<AppRunRow>(
        `SELECT id, app_key, input_json, result_json, created_at FROM app_runs WHERE id=$1 AND app_key=$2 LIMIT 1`,
        [body.appRunId, agent.app_key]
      );
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
        `UPDATE users
         SET role=COALESCE($2, role),
             status=COALESCE($3, status),
             metadata=metadata || $4::jsonb,
             updated_at=now()
         WHERE id=$1
         RETURNING *`,
        [req.params.id, data.role ?? null, data.status ?? null, JSON.stringify(quotaMeta)]
      );
      if (data.balance !== undefined) {
        await client.query(
          `INSERT INTO credit_balances(user_id, balance, updated_at)
           VALUES($1, $2, now())
           ON CONFLICT (user_id) DO UPDATE SET balance=EXCLUDED.balance, updated_at=now()`,
          [req.params.id, data.balance]
        );
        await client.query(
          `INSERT INTO credit_transactions(user_id, type, amount, note, created_by)
           VALUES($1, 'admin_set_balance', $2, $3, $4)`,
          [req.params.id, data.balance, data.note || "Admin set quota balance", req.user!.id]
        );
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

export function registerAdminAgentManagementRoutes(app: Express) {
  registerDashboardRoutes(app);
  registerAppRoutes(app);
  registerAgentRoutes(app);
  registerUserQuotaRoutes(app);
}
