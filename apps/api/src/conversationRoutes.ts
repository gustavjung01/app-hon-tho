import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest, type UserRole } from "./auth.js";

type QueryClient = Pick<typeof pool, "query">;

const adminRoles: UserRole[] = ["super_admin", "admin", "operator", "reviewer"];
const statusSchema = z.enum(["open", "closed", "archived", "flagged"]);
const messageRoleSchema = z.enum(["system", "user", "assistant", "tool"]);
const appKeySchema = z.string().trim().min(1).max(80).transform((value) => value.toLowerCase());
const uuidQuerySchema = z.string().uuid();

const conversationCreateSchema = z.object({
  appKey: appKeySchema,
  title: z.string().trim().min(1).max(160).optional(),
  agentId: z.string().uuid().optional(),
  sourceAppRunId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
  initialMessage: z.string().trim().min(1).max(20000).optional()
});

const conversationPatchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  status: statusSchema.optional(),
  metadata: z.record(z.unknown()).optional()
});

const userMessageSchema = z.object({
  content: z.string().trim().min(1).max(20000),
  metadata: z.record(z.unknown()).optional()
});

const adminMessageSchema = z.object({
  role: messageRoleSchema.default("assistant"),
  content: z.string().trim().min(1).max(20000),
  visibleToUser: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

function isAdminRole(role?: UserRole) {
  return !!role && adminRoles.includes(role);
}

function limitFrom(value: unknown, fallback = 50, max = 200) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function offsetFrom(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

function queryString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function queryAppKey(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().toLowerCase() : null;
}

function queryStatus(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = statusSchema.safeParse(value.trim());
  return parsed.success ? parsed.data : null;
}

function queryUuid(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = uuidQuerySchema.safeParse(value.trim());
  return parsed.success ? parsed.data : null;
}

function preview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 180);
}

type ConversationAccess = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  app_key: string;
  agent_id: string | null;
  source_app_run_id: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
  app_name: string | null;
  agent_name: string | null;
  user_email?: string | null;
  clerk_user_id?: string | null;
};

type AppRunRef = { id: string; user_id: string; app_key: string };
type ActiveApp = { key: string; status: string };
type ActiveAgent = { id: string; app_key: string; name: string };

async function loadConversation(id: string) {
  const rows = await query<ConversationAccess>(
    `SELECT c.*, app.name AS app_name, a.name AS agent_name, u.email AS user_email, u.clerk_user_id
     FROM conversations c
     LEFT JOIN apps app ON app.key = c.app_key
     LEFT JOIN ai_agents a ON a.id = c.agent_id AND a.app_key = c.app_key
     LEFT JOIN users u ON u.id = c.user_id
     WHERE c.id=$1`,
    [id]
  );
  return rows[0] || null;
}

function canReadConversation(req: AuthedRequest, conversation: ConversationAccess | null, adminAllowed = false) {
  if (!conversation || !req.user) return false;
  return conversation.user_id === req.user.id || (adminAllowed && isAdminRole(req.user.role));
}

async function listMessages(conversationId: string, includeHidden = false) {
  return query(
    `SELECT id, conversation_id, role, content, metadata_json, token_input, token_output, cost,
            visible_to_user, created_by, sequence, created_at
     FROM messages
     WHERE conversation_id=$1 AND ($2::boolean = true OR visible_to_user = true)
     ORDER BY COALESCE(sequence, 999999), created_at ASC, id ASC`,
    [conversationId, includeHidden]
  );
}

async function touchConversation(conversationId: string, content: string, client: QueryClient = pool) {
  await client.query(
    `UPDATE conversations
     SET updated_at=now(), last_message_at=now(), last_message_preview=$2, message_count = message_count + 1
     WHERE id=$1`,
    [conversationId, preview(content)]
  );
}

async function nextMessageSequence(conversationId: string, client: QueryClient = pool) {
  const result = await client.query<{ next_sequence: number }>(
    `SELECT COALESCE(max(sequence), 0) + 1 AS next_sequence FROM messages WHERE conversation_id=$1`,
    [conversationId]
  );
  return result.rows[0]?.next_sequence ?? 1;
}

async function loadActiveApp(appKey: string) {
  const rows = await query<ActiveApp>(`SELECT key, status FROM apps WHERE key=$1 AND status='active' LIMIT 1`, [appKey]);
  return rows[0] || null;
}

async function loadBoundAgent(appKey: string, agentId?: string) {
  if (agentId) {
    const rows = await query<ActiveAgent>(
      `SELECT id, app_key, name FROM ai_agents WHERE id=$1 AND app_key=$2 AND status='active' LIMIT 1`,
      [agentId, appKey]
    );
    return rows[0] || null;
  }
  const rows = await query<ActiveAgent>(
    `SELECT id, app_key, name
     FROM ai_agents
     WHERE app_key=$1 AND status='active'
     ORDER BY version DESC, created_at DESC, id DESC
     LIMIT 1`,
    [appKey]
  );
  return rows[0] || null;
}

async function validateSourceAppRun(appKey: string, sourceAppRunId: string | undefined, userId: string) {
  if (!sourceAppRunId) return null;
  const rows = await query<AppRunRef>(
    `SELECT id, user_id, app_key FROM app_runs WHERE id=$1 AND app_key=$2 AND user_id=$3 LIMIT 1`,
    [sourceAppRunId, appKey, userId]
  );
  return rows[0] || null;
}

function conversationMetadata(data: z.infer<typeof conversationCreateSchema>, sourceAppRun: AppRunRef | null, agent: ActiveAgent | null) {
  return {
    ...(data.metadata || {}),
    appBinding: "explicit_app_key",
    agentBinding: agent ? "active_agent_for_app" : "none",
    ...(sourceAppRun ? { sourceAppRunAppKey: sourceAppRun.app_key } : {})
  };
}

async function patchConversation(id: string, data: z.infer<typeof conversationPatchSchema>) {
  const rows = await query(
    `UPDATE conversations
     SET title=COALESCE($2, title),
         status=COALESCE($3, status),
         metadata=CASE WHEN $4::jsonb IS NULL THEN metadata ELSE COALESCE(metadata, '{}'::jsonb) || $4::jsonb END,
         closed_at=CASE WHEN $3='closed' THEN now() ELSE closed_at END,
         archived_at=CASE WHEN $3='archived' THEN now() ELSE archived_at END,
         updated_at=now()
     WHERE id=$1
     RETURNING *`,
    [id, data.title ?? null, data.status ?? null, data.metadata ? JSON.stringify(data.metadata) : null]
  );
  return rows[0];
}

function registerUserConversationRoutes(app: Express) {
  app.get("/api/apps", requireAuth, async (_req, res) => {
    const rows = await query(
      `SELECT key, name, category, status, description, default_credit_cost FROM apps WHERE status='active' ORDER BY category, name`
    );
    res.json({ items: rows });
  });

  app.get("/api/conversations", requireAuth, async (req: AuthedRequest, res) => {
    const appKey = queryAppKey(req.query.appKey);
    const status = queryStatus(req.query.status);
    const q = queryString(req.query.q);
    const limit = limitFrom(req.query.limit, 50, 100);
    const offset = offsetFrom(req.query.offset);
    const rows = await query(
      `SELECT c.id, c.title, c.status, c.app_key, c.agent_id, c.source_app_run_id,
              c.message_count, c.last_message_at, c.last_message_preview, c.created_at, c.updated_at,
              app.name AS app_name, a.name AS agent_name
       FROM conversations c
       LEFT JOIN apps app ON app.key = c.app_key
       LEFT JOIN ai_agents a ON a.id = c.agent_id AND a.app_key = c.app_key
       WHERE c.user_id=$1
         AND ($2::text IS NULL OR c.app_key=$2)
         AND ($3::text IS NULL OR c.status=$3)
         AND ($4::text IS NULL OR c.title ILIKE '%' || $4 || '%' OR c.last_message_preview ILIKE '%' || $4 || '%')
       ORDER BY c.updated_at DESC
       LIMIT $5 OFFSET $6`,
      [req.user!.id, appKey, status, q, limit, offset]
    );
    res.json({ items: rows, paging: { limit, offset } });
  });

  app.post("/api/conversations", requireAuth, async (req: AuthedRequest, res) => {
    const data = conversationCreateSchema.parse(req.body);
    const appDef = await loadActiveApp(data.appKey);
    if (!appDef) return res.status(400).json({ error: "Ứng dụng chưa sẵn sàng để tạo hội thoại." });
    const sourceAppRun = await validateSourceAppRun(data.appKey, data.sourceAppRunId, req.user!.id);
    if (data.sourceAppRunId && !sourceAppRun) return res.status(400).json({ error: `Không tìm thấy app_run hợp lệ cho app ${data.appKey}.` });
    const agent = await loadBoundAgent(data.appKey, data.agentId);
    if (data.agentId && !agent) return res.status(400).json({ error: "AI agent không active hoặc không thuộc ứng dụng này." });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const inserted = await client.query(
        `INSERT INTO conversations(user_id, app_key, agent_id, title, source_app_run_id, metadata)
         VALUES($1, $2, $3, $4, $5, $6::jsonb)
         RETURNING *`,
        [
          req.user!.id,
          data.appKey,
          agent?.id ?? null,
          data.title || "Cuộc hội thoại mới",
          sourceAppRun?.id || null,
          JSON.stringify(conversationMetadata(data, sourceAppRun, agent))
        ]
      );
      const conversation = inserted.rows[0];
      let message = null;
      if (data.initialMessage) {
        const sequence = await nextMessageSequence(conversation.id, client);
        const messageResult = await client.query(
          `INSERT INTO messages(conversation_id, role, content, metadata_json, visible_to_user, created_by, sequence)
           VALUES($1, 'user', $2, $3::jsonb, true, $4, $5)
           RETURNING *`,
          [conversation.id, data.initialMessage, JSON.stringify({ source: "conversation_create" }), req.user!.id, sequence]
        );
        message = messageResult.rows[0];
        await touchConversation(conversation.id, data.initialMessage, client);
      }
      await client.query("COMMIT");
      res.status(201).json({ conversation, message });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.get("/api/conversations/:id", requireAuth, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    const messages = await listMessages(req.params.id, false);
    res.json({ conversation, messages });
  });

  app.patch("/api/conversations/:id", requireAuth, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    const data = conversationPatchSchema.parse(req.body);
    res.json({ conversation: await patchConversation(req.params.id, data) });
  });

  app.get("/api/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    res.json({ items: await listMessages(req.params.id, false) });
  });

  app.post("/api/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res) => {
    const data = userMessageSchema.parse(req.body);
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    if (conversation!.status !== "open") return res.status(400).json({ error: "Hội thoại này không còn mở." });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const sequence = await nextMessageSequence(req.params.id, client);
      const metadata = { ...(data.metadata || {}), appKey: conversation!.app_key, agentId: conversation!.agent_id };
      const inserted = await client.query(
        `INSERT INTO messages(conversation_id, role, content, metadata_json, visible_to_user, created_by, sequence)
         VALUES($1, 'user', $2, $3::jsonb, true, $4, $5)
         RETURNING *`,
        [req.params.id, data.content, JSON.stringify(metadata), req.user!.id, sequence]
      );
      await touchConversation(req.params.id, data.content, client);
      await client.query("COMMIT");
      res.status(201).json({ message: inserted.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}

function registerAdminConversationRoutes(app: Express) {
  app.get("/api/admin/conversations", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const appKey = queryAppKey(req.query.appKey);
    const status = queryStatus(req.query.status);
    const userId = queryUuid(req.query.userId);
    if (req.query.userId && !userId) return res.status(400).json({ error: "userId không hợp lệ." });
    const q = queryString(req.query.q);
    const limit = limitFrom(req.query.limit, 100, 250);
    const offset = offsetFrom(req.query.offset);
    const rows = await query(
      `SELECT c.id, c.title, c.status, c.app_key, c.agent_id, c.source_app_run_id,
              c.message_count, c.last_message_at, c.last_message_preview, c.created_at, c.updated_at,
              u.id AS user_id, u.email, u.display_name, u.clerk_user_id,
              app.name AS app_name, a.name AS agent_name
       FROM conversations c
       JOIN users u ON u.id = c.user_id
       LEFT JOIN apps app ON app.key = c.app_key
       LEFT JOIN ai_agents a ON a.id = c.agent_id AND a.app_key = c.app_key
       WHERE ($1::text IS NULL OR c.app_key=$1)
         AND ($2::text IS NULL OR c.status=$2)
         AND ($3::uuid IS NULL OR c.user_id=$3::uuid)
         AND ($4::text IS NULL OR c.title ILIKE '%' || $4 || '%' OR c.last_message_preview ILIKE '%' || $4 || '%' OR u.email ILIKE '%' || $4 || '%')
       ORDER BY c.updated_at DESC
       LIMIT $5 OFFSET $6`,
      [appKey, status, userId, q, limit, offset]
    );
    res.json({ items: rows, paging: { limit, offset } });
  });

  app.get("/api/admin/conversations/:id", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation, true)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    const messages = await listMessages(req.params.id, true);
    res.json({ conversation, messages });
  });

  app.patch("/api/admin/conversations/:id", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation, true)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    const data = conversationPatchSchema.parse(req.body);
    res.json({ conversation: await patchConversation(req.params.id, data) });
  });

  app.get("/api/admin/conversations/:id/messages", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation, true)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    res.json({ items: await listMessages(req.params.id, true) });
  });

  app.post("/api/admin/conversations/:id/messages", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const data = adminMessageSchema.parse(req.body);
    const conversation = await loadConversation(req.params.id);
    if (!canReadConversation(req, conversation, true)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const sequence = await nextMessageSequence(req.params.id, client);
      const metadata = { ...(data.metadata || {}), adminCreated: true, appKey: conversation!.app_key, agentId: conversation!.agent_id };
      const inserted = await client.query(
        `INSERT INTO messages(conversation_id, role, content, metadata_json, visible_to_user, created_by, sequence)
         VALUES($1, $2, $3, $4::jsonb, $5, $6, $7)
         RETURNING *`,
        [req.params.id, data.role, data.content, JSON.stringify(metadata), data.visibleToUser, req.user!.id, sequence]
      );
      await touchConversation(req.params.id, data.content, client);
      await client.query("COMMIT");
      res.status(201).json({ message: inserted.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}

export function registerConversationRoutes(app: Express) {
  registerUserConversationRoutes(app);
  registerAdminConversationRoutes(app);
}
