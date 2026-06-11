import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "./auth.js";

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

const agentStatusSchema = z.enum(["draft", "active", "disabled", "archived"]);
const appStatusSchema = z.enum(["draft", "active", "disabled", "archived"]);

type BuiltInApp = {
  key: string;
  name: string;
  category: string;
  status: z.infer<typeof appStatusSchema>;
  description: string;
  defaultCreditCost: number;
};

const builtInApps: BuiltInApp[] = [
  { key: "tu_tru", name: "Tứ Trụ", category: "nguthuat.menh", status: "active", description: "Lập mệnh bàn Tứ Trụ và diễn giải có kiểm soát.", defaultCreditCost: 1 },
  { key: "mai_hoa", name: "Mai Hoa Dịch Số", category: "nguthuat.boc", status: "active", description: "Lập quẻ và đọc tượng số theo Mai Hoa.", defaultCreditCost: 1 },
  { key: "y_hoc", name: "Y học cổ học", category: "nguthuat.y", status: "active", description: "Dưỡng sinh, tiết khí, khí huyết và tham khảo y học cổ học.", defaultCreditCost: 1 },
  { key: "phong_thuy", name: "Phong thủy an cư", category: "nguthuat.son", status: "draft", description: "Bát trạch, hướng nhà và bố cục không gian.", defaultCreditCost: 1 },
  { key: "ky_mon", name: "Kỳ Môn", category: "tamthuc", status: "draft", description: "Kỳ Môn Độn Giáp theo cục bàn thời không.", defaultCreditCost: 1 },
  { key: "thai_at", name: "Thái Ất", category: "tamthuc", status: "draft", description: "Thái Ất Thần Số.", defaultCreditCost: 1 },
  { key: "luc_nham", name: "Lục Nhâm", category: "tamthuc", status: "draft", description: "Đại Lục Nhâm.", defaultCreditCost: 1 }
];

const agentInputSchema = z.object({
  appKey: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(200),
  provider: z.string().trim().min(1).max(80).default("openai"),
  model: z.string().trim().min(1).max(2000).default("gpt-4.1-mini"),
  systemPromptKey: z.string().trim().min(1).max(120).optional(),
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

function keyFromName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90) || "agent";
}

function builtInAppFor(appKey: string) {
  const normalizedKey = appKey.trim();
  return builtInApps.find((item) => item.key === normalizedKey) || null;
}

async function upsertBuiltInApp(appDef: BuiltInApp, client: QueryClient = pool) {
  await client.query(
    `INSERT INTO apps(key, name, category, status, description, default_credit_cost, metadata)
     VALUES($1, $2, $3, $4, $5, $6, jsonb_build_object('builtin', true, 'seededBy', 'adminBuiltinAgentRoutes'))
     ON CONFLICT (key) DO UPDATE SET
       name=EXCLUDED.name,
       category=EXCLUDED.category,
       status=CASE WHEN apps.status IN ('disabled', 'archived') THEN apps.status ELSE EXCLUDED.status END,
       description=EXCLUDED.description,
       default_credit_cost=EXCLUDED.default_credit_cost,
       metadata=apps.metadata || jsonb_build_object('builtin', true, 'seededBy', 'adminBuiltinAgentRoutes'),
       updated_at=now()`,
    [appDef.key, appDef.name, appDef.category, appDef.status, appDef.description, appDef.defaultCreditCost]
  );
}

async function ensureBuiltInApps(client: QueryClient = pool) {
  for (const appDef of builtInApps) {
    await upsertBuiltInApp(appDef, client);
  }
}

async function ensureAppExists(appKey: string) {
  const normalizedKey = appKey.trim();
  const rows = await query<{ key: string }>(`SELECT key FROM apps WHERE key=$1`, [normalizedKey]);
  if (rows[0]) return true;

  const builtInApp = builtInAppFor(normalizedKey);
  if (!builtInApp) return false;

  await upsertBuiltInApp(builtInApp);
  return true;
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

function buildAgentMetadata(data: z.infer<typeof agentInputSchema>) {
  return {
    persona: data.persona || "",
    playbook: data.playbook ?? null,
    dataStore: data.dataStore ?? null,
    importedJson: data.importedJson ?? null,
    managerVersion: 2,
    appBinding: "explicit_app_key"
  };
}

function registerAppsWithAgentsOverride(app: Express) {
  app.get("/api/admin/apps-with-agents", requireAuth, requireAdmin, async (_req, res) => {
    await ensureBuiltInApps();
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
    res.json({ items: rows, seededBuiltInApps: builtInApps.map((item) => item.key) });
  });
}

function registerAgentWriteOverrides(app: Express) {
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
      res.status(201).json({ agent: inserted.rows[0], appKeySource: "payload.appKey" });
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
      res.json({ agent: updated.rows[0], appKeySource: "payload.appKey" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}

export function registerBuiltinAdminAgentRoutes(app: Express) {
  registerAppsWithAgentsOverride(app);
  registerAgentWriteOverrides(app);
}
