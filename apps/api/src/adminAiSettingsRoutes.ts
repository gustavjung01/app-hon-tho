import type { Express } from "express";
import { z } from "zod";
import { pool } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "./auth.js";
import { getPublicAiProviderSettings } from "./aiSettings.js";

type QueryClient = Pick<typeof pool, "query">;

const aiSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.enum(["stub", "openai"]).default("stub"),
  baseUrl: z.string().url().default("https://api.openai.com/v1/chat/completions"),
  model: z.string().min(1).max(120).default("gpt-4.1-mini"),
  apiKey: z.string().max(4000).optional(),
  costInputPer1K: z.number().min(0).default(0),
  costOutputPer1K: z.number().min(0).default(0)
});

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

function publicAfter(value: Record<string, unknown>, hasApiKey: boolean) {
  return {
    ...value,
    hasApiKey,
    apiKey: undefined
  };
}

export function registerAdminAiSettingsRoutes(app: Express) {
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
        after: publicAfter(valueJson, !!nextSecret.apiKey),
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
