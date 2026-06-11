import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAuth, type AuthedRequest } from "./auth.js";

type QueryClient = Pick<typeof pool, "query">;

type ActiveAgentRow = {
  id: string;
  app_key: string;
  name: string;
};

type AppRunGuardRow = {
  id: string;
  app_key: string;
  source_type: string;
  created_at: string;
};

const createConversationSchema = z.object({
  appKey: z.string().min(1).max(80),
  title: z.string().min(1).max(160).optional(),
  agentId: z.string().uuid().optional(),
  sourceAppRunId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
  initialMessage: z.string().min(1).max(20000).optional()
});

const appsRequiringSavedRun = new Set(["tu_tru"]);

function preview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 180);
}

function missingAgentError(appKey: string) {
  return `Chưa có agent active cho app ${appKey}.`;
}

function invalidAppRunError(appKey: string) {
  return `Không tìm thấy app_run hợp lệ cho app ${appKey}.`;
}

async function nextMessageSequence(conversationId: string, client: QueryClient = pool) {
  const result = await client.query<{ next_sequence: number }>(
    `SELECT COALESCE(max(sequence), 0) + 1 AS next_sequence FROM messages WHERE conversation_id=$1`,
    [conversationId]
  );
  return result.rows[0]?.next_sequence ?? 1;
}

async function touchConversation(conversationId: string, content: string, client: QueryClient = pool) {
  await client.query(
    `UPDATE conversations
     SET updated_at=now(),
         last_message_at=now(),
         last_message_preview=$2,
         message_count = message_count + 1
     WHERE id=$1`,
    [conversationId, preview(content)]
  );
}

async function loadSourceAppRun(appRunId: string, appKey: string, userId: string) {
  const rows = await query<AppRunGuardRow>(
    `SELECT id, app_key, source_type, created_at
     FROM app_runs
     WHERE id=$1 AND app_key=$2 AND user_id=$3
     LIMIT 1`,
    [appRunId, appKey, userId]
  );
  return rows[0] || null;
}

async function loadActiveAgent(appKey: string, agentId?: string) {
  if (agentId) {
    const rows = await query<ActiveAgentRow>(
      `SELECT id, app_key, name
       FROM ai_agents
       WHERE id=$1 AND app_key=$2 AND status='active'
       LIMIT 1`,
      [agentId, appKey]
    );
    return rows[0] || null;
  }

  const rows = await query<ActiveAgentRow>(
    `SELECT id, app_key, name
     FROM ai_agents
     WHERE app_key=$1 AND status='active'
     ORDER BY version DESC, created_at DESC
     LIMIT 1`,
    [appKey]
  );
  return rows[0] || null;
}

export function registerStrictConversationCreateRoute(app: Express) {
  app.post("/api/conversations", requireAuth, async (req: AuthedRequest, res) => {
    const data = createConversationSchema.parse(req.body);

    const apps = await query<{ key: string; status: string }>(
      `SELECT key, status FROM apps WHERE key=$1`,
      [data.appKey]
    );
    if (!apps[0] || apps[0].status !== "active") {
      return res.status(400).json({ error: `Ứng dụng ${data.appKey} chưa sẵn sàng để tạo hội thoại.` });
    }

    if (appsRequiringSavedRun.has(data.appKey) && !data.sourceAppRunId) {
      return res.status(400).json({
        error: `App ${data.appKey} cần lưu dữ liệu trước khi gọi Luận. Hãy tạo app_run rồi gửi sourceAppRunId.`
      });
    }

    const appRun = data.sourceAppRunId
      ? await loadSourceAppRun(data.sourceAppRunId, data.appKey, req.user!.id)
      : null;
    if (data.sourceAppRunId && !appRun) {
      return res.status(400).json({ error: invalidAppRunError(data.appKey) });
    }

    const activeAgent = await loadActiveAgent(data.appKey, data.agentId);
    if (!activeAgent) {
      return res.status(400).json({
        error: data.agentId ? "AI agent không thuộc ứng dụng này hoặc chưa active." : missingAgentError(data.appKey)
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const metadata = {
        ...(data.metadata || {}),
        appKey: data.appKey,
        agentBinding: "active_agent_by_app_key",
        sourceAppRunValidated: Boolean(appRun),
        sourceAppRunId: data.sourceAppRunId || null,
        sourceAppRunAppKey: appRun?.app_key || null,
        sourceAppRunType: appRun?.source_type || null
      };

      const inserted = await client.query(
        `INSERT INTO conversations(user_id, app_key, agent_id, title, source_app_run_id, metadata)
         VALUES($1, $2, $3, $4, $5, $6::jsonb)
         RETURNING *`,
        [
          req.user!.id,
          data.appKey,
          activeAgent.id,
          data.title || "Cuộc hội thoại mới",
          data.sourceAppRunId || null,
          JSON.stringify(metadata)
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
          [
            conversation.id,
            data.initialMessage,
            JSON.stringify({
              source: "app_luan_request",
              appKey: data.appKey,
              sourceAppRunId: data.sourceAppRunId || null,
              agentId: activeAgent.id
            }),
            req.user!.id,
            sequence
          ]
        );
        message = messageResult.rows[0];
        await touchConversation(conversation.id, data.initialMessage, client);
      }

      await client.query("COMMIT");
      res.status(201).json({
        conversation,
        message,
        activeAgent,
        appRun: appRun ? { id: appRun.id, app_key: appRun.app_key, source_type: appRun.source_type, created_at: appRun.created_at } : null
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}
