import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "./auth.js";
import { getPublicAiProviderSettings } from "./aiSettings.js";

type QueryClient = Pick<typeof pool, "query">;

type PromptRow = {
  id: string;
  app_key: string;
  prompt_key: string;
  title: string;
  content: string;
  version: number;
  status: "draft" | "active" | "archived";
  metadata: unknown;
  created_by: string | null;
  created_at: string;
  activated_at: string | null;
  archived_at: string | null;
};

const promptStatusSchema = z.enum(["draft", "active", "archived"]);
const aiSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.enum(["stub", "openai"]).default("stub"),
  baseUrl: z.string().url().default("https://api.openai.com/v1/chat/completions"),
  model: z.string().min(1).max(120).default("gpt-4.1-mini"),
  apiKey: z.string().max(4000).optional(),
  costInputPer1K: z.number().min(0).default(0),
  costOutputPer1K: z.number().min(0).default(0)
});

function limitFrom(value: unknown, fallback = 100, max = 250) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function daysFrom(value: unknown, fallback = 30, max = 365) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function textOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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

async function loadPrompt(id: string) {
  const rows = await query<PromptRow>(`SELECT * FROM ai_prompts WHERE id=$1`, [id]);
  return rows[0] || null;
}

function publicAiSettingsAudit(value: Record<string, unknown>, hasApiKey: boolean) {
  return { ...value, hasApiKey, apiKey: undefined };
}

function registerAiSettingsRoutes(app: Express) {
  app.get("/api/admin/ai-settings", requireAuth, requireAdmin, async (_req, res) => {
    res.json({ settings: await getPublicAiProviderSettings() });
  });

  app.put("/api/admin/ai-settings", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = aiSettingsSchema.parse(req.body);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const before = await client.query(`SELECT value_json, secret_json FROM admin_settings WHERE key='ai_provider' LIMIT 1`);
      const existingSecret = (before.rows[0]?.secret_json || {}) as Record<string, unknown>;
      const keepExistingKey = data.apiKey === undefined || data.apiKey === "";
      const nextSecret = keepExistingKey ? existingSecret : { ...existingSecret, apiKey: data.apiKey };
      const valueJson = {
        enabled: data.enabled,
        provider: data.provider,
        baseUrl: data.baseUrl,
        model: data.model,
        costInputPer1K: data.costInputPer1K,
        costOutputPer1K: data.costOutputPer1K
      };

      await client.query(
        `INSERT INTO admin_settings(key, value_json, secret_json, updated_by, updated_at)
         VALUES('ai_provider', $1::jsonb, $2::jsonb, $3, now())
         ON CONFLICT (key) DO UPDATE SET
           value_json=EXCLUDED.value_json,
           secret_json=EXCLUDED.secret_json,
           updated_by=EXCLUDED.updated_by,
           updated_at=now()`,
        [JSON.stringify(valueJson), JSON.stringify(nextSecret), req.user!.id]
      );

      await writeAudit({
        actorUserId: req.user!.id,
        action: "ai_settings.update",
        targetType: "admin_settings",
        targetId: "ai_provider",
        before: before.rows[0] ? { value_json: before.rows[0].value_json, hasSecret: !!before.rows[0].secret_json?.apiKey } : null,
        after: publicAiSettingsAudit(valueJson, !!nextSecret.apiKey),
        client
      });

      await client.query("COMMIT");
      res.json({ settings: await getPublicAiProviderSettings() });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/api/admin/ai-settings/test", requireAuth, requireAdmin, async (_req, res) => {
    const settings = await getPublicAiProviderSettings();
    if (settings.provider === "stub" || !settings.enabled) {
      return res.json({ ok: true, mode: "stub", message: "AI đang ở chế độ stub. Flow chạy được, chưa gọi provider thật.", settings });
    }
    if (!settings.hasApiKey) return res.status(400).json({ error: "Chưa nhập API key AI trong admin." });
    return res.json({ ok: true, mode: settings.provider, message: "Đã có cấu hình AI provider. Dùng nút Luận AI để test end-to-end.", settings });
  });
}

function registerPromptRoutes(app: Express) {
  app.get("/api/admin/prompts", requireAuth, requireAdmin, async (req, res) => {
    const appKey = textOrNull(req.query.appKey);
    const promptKey = textOrNull(req.query.promptKey);
    const status = textOrNull(req.query.status);
    const q = textOrNull(req.query.q);
    const limit = limitFrom(req.query.limit, 100, 300);

    const rows = await query(
      `SELECT p.id, p.app_key, app.name AS app_name, p.prompt_key, p.title, p.version, p.status,
              p.created_by, u.email AS created_by_email, p.created_at, p.activated_at, p.archived_at,
              left(p.content, 260) AS preview
       FROM ai_prompts p
       LEFT JOIN apps app ON app.key = p.app_key
       LEFT JOIN users u ON u.id = p.created_by
       WHERE ($1::text IS NULL OR p.app_key=$1)
         AND ($2::text IS NULL OR p.prompt_key=$2)
         AND ($3::text IS NULL OR p.status=$3)
         AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%' OR p.content ILIKE '%' || $4 || '%')
       ORDER BY p.app_key, p.prompt_key, p.version DESC
       LIMIT $5`,
      [appKey, promptKey, status, q, limit]
    );
    res.json({ items: rows });
  });

  app.get("/api/admin/prompts/:id", requireAuth, requireAdmin, async (req, res) => {
    const prompt = await loadPrompt(req.params.id);
    if (!prompt) return res.status(404).json({ error: "Không tìm thấy prompt." });
    res.json({ prompt });
  });

  app.post("/api/admin/prompts", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = z.object({
      appKey: z.string().min(1).max(80),
      promptKey: z.string().min(1).max(120),
      title: z.string().min(1).max(200),
      content: z.string().min(10).max(50000),
      status: promptStatusSchema.default("draft"),
      metadata: z.record(z.unknown()).optional()
    }).parse(req.body);

    const apps = await query<{ key: string }>(`SELECT key FROM apps WHERE key=$1`, [data.appKey]);
    if (!apps[0]) return res.status(400).json({ error: "App key không tồn tại." });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const versionRows = await client.query<{ next_version: number }>(
        `SELECT COALESCE(max(version), 0) + 1 AS next_version FROM ai_prompts WHERE app_key=$1 AND prompt_key=$2`,
        [data.appKey, data.promptKey]
      );
      const nextVersion = versionRows.rows[0]?.next_version || 1;
      if (data.status === "active") {
        await client.query(
          `UPDATE ai_prompts SET status='archived', archived_at=COALESCE(archived_at, now()) WHERE app_key=$1 AND prompt_key=$2 AND status='active'`,
          [data.appKey, data.promptKey]
        );
      }
      const inserted = await client.query<PromptRow>(
        `INSERT INTO ai_prompts(app_key, prompt_key, title, content, version, status, metadata, created_by, activated_at)
         VALUES($1, $2, $3, $4, $5, $6, $7::jsonb, $8, CASE WHEN $6='active' THEN now() ELSE NULL END)
         RETURNING *`,
        [data.appKey, data.promptKey, data.title, data.content, nextVersion, data.status, JSON.stringify(data.metadata || {}), req.user!.id]
      );
      await writeAudit({ actorUserId: req.user!.id, action: "prompt.create_version", targetType: "ai_prompt", targetId: inserted.rows[0].id, after: inserted.rows[0], client });
      await client.query("COMMIT");
      res.status(201).json({ prompt: inserted.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.patch("/api/admin/prompts/:id", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = z.object({
      title: z.string().min(1).max(200).optional(),
      status: promptStatusSchema.optional(),
      metadata: z.record(z.unknown()).optional()
    }).parse(req.body);

    const before = await loadPrompt(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy prompt." });

    const rows = await query<PromptRow>(
      `UPDATE ai_prompts
       SET title=COALESCE($2, title),
           status=COALESCE($3, status),
           metadata=COALESCE($4::jsonb, metadata),
           archived_at=CASE WHEN $3='archived' THEN now() ELSE archived_at END
       WHERE id=$1
       RETURNING *`,
      [req.params.id, data.title ?? null, data.status ?? null, data.metadata ? JSON.stringify(data.metadata) : null]
    );
    await writeAudit({ actorUserId: req.user!.id, action: "prompt.patch_metadata", targetType: "ai_prompt", targetId: req.params.id, before, after: rows[0] });
    res.json({ prompt: rows[0] });
  });

  app.post("/api/admin/prompts/:id/activate", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const prompt = await loadPrompt(req.params.id);
    if (!prompt) return res.status(404).json({ error: "Không tìm thấy prompt." });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const beforeAgents = await client.query(
        `SELECT id, app_key, name, system_prompt_key, version, prompt_id FROM ai_agents WHERE app_key=$1 AND system_prompt_key=$2`,
        [prompt.app_key, prompt.prompt_key]
      );
      await client.query(
        `UPDATE ai_prompts
         SET status='archived', archived_at=COALESCE(archived_at, now())
         WHERE app_key=$1 AND prompt_key=$2 AND status='active' AND id<>$3`,
        [prompt.app_key, prompt.prompt_key, prompt.id]
      );
      const activePrompt = await client.query<PromptRow>(
        `UPDATE ai_prompts
         SET status='active', activated_at=now(), archived_at=NULL
         WHERE id=$1
         RETURNING *`,
        [prompt.id]
      );
      const updatedAgents = await client.query(
        `UPDATE ai_agents
         SET system_prompt=$1,
             version=$2,
             prompt_id=$3,
             status='active',
             updated_at=now()
         WHERE app_key=$4 AND system_prompt_key=$5
         RETURNING id, app_key, name, system_prompt_key, version, prompt_id`,
        [prompt.content, prompt.version, prompt.id, prompt.app_key, prompt.prompt_key]
      );
      await writeAudit({
        actorUserId: req.user!.id,
        action: "prompt.activate",
        targetType: "ai_prompt",
        targetId: prompt.id,
        before: { prompt, agents: beforeAgents.rows },
        after: { prompt: activePrompt.rows[0], agents: updatedAgents.rows },
        client
      });
      await client.query("COMMIT");
      res.json({ prompt: activePrompt.rows[0], updatedAgents: updatedAgents.rows });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/api/admin/prompts/:id/archive", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const before = await loadPrompt(req.params.id);
    if (!before) return res.status(404).json({ error: "Không tìm thấy prompt." });
    const rows = await query<PromptRow>(
      `UPDATE ai_prompts SET status='archived', archived_at=now() WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    await writeAudit({ actorUserId: req.user!.id, action: "prompt.archive", targetType: "ai_prompt", targetId: req.params.id, before, after: rows[0] });
    res.json({ prompt: rows[0] });
  });
}

function registerUsageRoutes(app: Express) {
  app.get("/api/admin/usage/summary", requireAuth, requireAdmin, async (req, res) => {
    const days = daysFrom(req.query.days, 30, 365);
    const appKey = textOrNull(req.query.appKey);
    const sinceExpr = `${days} days`;

    const [ledgerTotals, aiTotals, dailyLedger, dailyAi, byApp, byModel, latestRuns] = await Promise.all([
      query(
        `SELECT COALESCE(sum(tokens),0)::integer AS tokens,
                COALESCE(sum(cost),0)::numeric(12,6) AS cost,
                COALESCE(sum(credits_delta),0)::integer AS credits_delta,
                count(*)::integer AS events
         FROM usage_ledger
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT count(*)::integer AS runs,
                COALESCE(sum(token_input),0)::integer AS token_input,
                COALESCE(sum(token_output),0)::integer AS token_output,
                COALESCE(sum(cost),0)::numeric(12,6) AS cost,
                COALESCE(avg(latency_ms),0)::integer AS avg_latency_ms,
                count(*) FILTER (WHERE status='error')::integer AS errors
         FROM ai_agent_runs
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT date_trunc('day', created_at)::date AS day,
                COALESCE(sum(tokens),0)::integer AS tokens,
                COALESCE(sum(cost),0)::numeric(12,6) AS cost,
                count(*)::integer AS events
         FROM usage_ledger
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)
         GROUP BY 1
         ORDER BY 1 DESC`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT date_trunc('day', created_at)::date AS day,
                count(*)::integer AS runs,
                COALESCE(sum(token_input + token_output),0)::integer AS tokens,
                count(*) FILTER (WHERE status='error')::integer AS errors
         FROM ai_agent_runs
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)
         GROUP BY 1
         ORDER BY 1 DESC`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT app_key,
                count(*)::integer AS runs,
                COALESCE(sum(token_input + token_output),0)::integer AS tokens,
                COALESCE(sum(cost),0)::numeric(12,6) AS cost,
                count(*) FILTER (WHERE status='error')::integer AS errors
         FROM ai_agent_runs
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)
         GROUP BY app_key
         ORDER BY tokens DESC, runs DESC`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT provider, model,
                count(*)::integer AS runs,
                COALESCE(sum(token_input + token_output),0)::integer AS tokens,
                count(*) FILTER (WHERE status='error')::integer AS errors
         FROM ai_agent_runs
         WHERE created_at >= now() - $1::interval
           AND ($2::text IS NULL OR app_key=$2)
         GROUP BY provider, model
         ORDER BY tokens DESC, runs DESC`,
        [sinceExpr, appKey]
      ),
      query(
        `SELECT r.id, r.conversation_id, r.app_key, r.provider, r.model, r.status,
                r.token_input, r.token_output, r.cost, r.latency_ms, r.error, r.created_at,
                a.name AS agent_name, u.email AS user_email
         FROM ai_agent_runs r
         LEFT JOIN ai_agents a ON a.id = r.agent_id
         LEFT JOIN users u ON u.id = r.user_id
         WHERE r.created_at >= now() - $1::interval
           AND ($2::text IS NULL OR r.app_key=$2)
         ORDER BY r.created_at DESC
         LIMIT 80`,
        [sinceExpr, appKey]
      )
    ]);

    res.json({
      filters: { days, appKey },
      ledgerTotals: ledgerTotals[0],
      aiTotals: aiTotals[0],
      dailyLedger,
      dailyAi,
      byApp,
      byModel,
      latestRuns
    });
  });
}

function registerAuditRoutes(app: Express) {
  app.get("/api/admin/audit-logs", requireAuth, requireAdmin, async (req, res) => {
    const limit = limitFrom(req.query.limit, 100, 300);
    const action = textOrNull(req.query.action);
    const targetType = textOrNull(req.query.targetType);
    const actorUserId = textOrNull(req.query.actorUserId);
    const rows = await query(
      `SELECT l.id, l.actor_user_id, u.email AS actor_email, l.action, l.target_type, l.target_id,
              l.before_json, l.after_json, l.created_at
       FROM audit_logs l
       LEFT JOIN users u ON u.id = l.actor_user_id
       WHERE ($1::text IS NULL OR l.action=$1)
         AND ($2::text IS NULL OR l.target_type=$2)
         AND ($3::uuid IS NULL OR l.actor_user_id=$3::uuid)
       ORDER BY l.created_at DESC
       LIMIT $4`,
      [action, targetType, actorUserId, limit]
    );
    res.json({ items: rows });
  });
}

export function registerAdminPromptUsageRoutes(app: Express) {
  registerAiSettingsRoutes(app);
  registerPromptRoutes(app);
  registerUsageRoutes(app);
  registerAuditRoutes(app);
}
