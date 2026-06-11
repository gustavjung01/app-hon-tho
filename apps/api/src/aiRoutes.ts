import type { Express } from "express";
import { z } from "zod";
import { pool, query } from "./db.js";
import { requireAdmin, requireAuth, type AuthedRequest, type UserRole } from "./auth.js";
import { runAgentRuntime } from "./aiRuntime.js";

type QueryClient = Pick<typeof pool, "query">;

type ConversationRow = {
  id: string;
  user_id: string;
  app_key: string;
  agent_id: string | null;
  title: string;
  status: string;
  source_app_run_id: string | null;
  metadata: unknown;
};

type AgentRow = {
  id: string;
  app_key: string;
  name: string;
  provider: string | null;
  model: string;
  system_prompt: string;
  temperature: string | number;
  max_tokens: number;
  allowed_tools: unknown;
  allowed_data: unknown;
  status: string;
};

type AppRunRow = {
  id: string;
  app_key: string;
  input_json: unknown;
  result_json: unknown;
  created_at: string;
};

type RuntimeMessageRow = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

const adminRoles: UserRole[] = ["super_admin", "admin", "operator", "reviewer"];
const aiReplySchema = z.object({
  message: z.string().min(1).max(20000).optional(),
  extraInstruction: z.string().max(4000).optional(),
  visibleToUser: z.boolean().optional()
});

function isAdminRole(role?: UserRole) {
  return !!role && adminRoles.includes(role);
}

function preview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 180);
}

function envNumber(name: string, fallback = 0) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function estimateAiCost(tokenInput: number, tokenOutput: number) {
  const inputPer1k = envNumber("AI_COST_INPUT_PER_1K", envNumber("OPENAI_COST_INPUT_PER_1K", 0));
  const outputPer1k = envNumber("AI_COST_OUTPUT_PER_1K", envNumber("OPENAI_COST_OUTPUT_PER_1K", 0));
  return Number((((tokenInput || 0) / 1000) * inputPer1k + ((tokenOutput || 0) / 1000) * outputPer1k).toFixed(6));
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

async function nextMessageSequence(conversationId: string, client: QueryClient = pool) {
  const result = await client.query<{ next_sequence: number }>(
    `SELECT COALESCE(max(sequence), 0) + 1 AS next_sequence FROM messages WHERE conversation_id=$1`,
    [conversationId]
  );
  return result.rows[0]?.next_sequence ?? 1;
}

async function loadConversation(id: string) {
  const rows = await query<ConversationRow>(
    `SELECT id, user_id, app_key, agent_id, title, status, source_app_run_id, metadata
     FROM conversations
     WHERE id=$1`,
    [id]
  );
  return rows[0] || null;
}

function canAccess(req: AuthedRequest, conversation: ConversationRow | null, adminAllowed = false) {
  if (!conversation || !req.user) return false;
  return conversation.user_id === req.user.id || (adminAllowed && isAdminRole(req.user.role));
}

async function loadAgent(conversation: ConversationRow) {
  if (conversation.agent_id) {
    const rows = await query<AgentRow>(
      `SELECT id, app_key, name, provider, model, system_prompt, temperature, max_tokens, allowed_tools, allowed_data, status
       FROM ai_agents
       WHERE id=$1 AND app_key=$2 AND status='active'
       LIMIT 1`,
      [conversation.agent_id, conversation.app_key]
    );
    if (rows[0]) return rows[0];
  }

  const rows = await query<AgentRow>(
    `SELECT id, app_key, name, provider, model, system_prompt, temperature, max_tokens, allowed_tools, allowed_data, status
     FROM ai_agents
     WHERE app_key=$1 AND status='active'
     ORDER BY version DESC, created_at DESC
     LIMIT 1`,
    [conversation.app_key]
  );
  return rows[0] || null;
}

async function ensureConversationAgent(conversation: ConversationRow, agent: AgentRow) {
  if (conversation.agent_id === agent.id) return;
  await query(`UPDATE conversations SET agent_id=$2, updated_at=now() WHERE id=$1`, [conversation.id, agent.id]);
  conversation.agent_id = agent.id;
}

async function loadAppRun(conversation: ConversationRow, req: AuthedRequest, adminAllowed = false) {
  if (!conversation.source_app_run_id) return null;
  const rows = await query<AppRunRow>(
    `SELECT id, app_key, input_json, result_json, created_at
     FROM app_runs
     WHERE id=$1
       AND app_key=$2
       AND ($3::boolean = true OR user_id=$4)
     LIMIT 1`,
    [conversation.source_app_run_id, conversation.app_key, adminAllowed && isAdminRole(req.user?.role), req.user!.id]
  );
  return rows[0] || null;
}

async function loadRuntimeMessages(conversationId: string, includeHidden = false) {
  const rows = await query<RuntimeMessageRow>(
    `SELECT role, content
     FROM messages
     WHERE conversation_id=$1 AND ($2::boolean = true OR visible_to_user = true)
     ORDER BY COALESCE(sequence, 999999) DESC, created_at DESC, id DESC
     LIMIT 24`,
    [conversationId, includeHidden]
  );
  return rows.reverse();
}

async function insertUserMessage(conversationId: string, userId: string, content: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const sequence = await nextMessageSequence(conversationId, client);
    const inserted = await client.query(
      `INSERT INTO messages(conversation_id, role, content, metadata_json, visible_to_user, created_by, sequence)
       VALUES($1, 'user', $2, $3::jsonb, true, $4, $5)
       RETURNING *`,
      [conversationId, content, JSON.stringify({ source: "ai_reply_request" }), userId, sequence]
    );
    await touchConversation(conversationId, content, client);
    await client.query("COMMIT");
    return inserted.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function persistAiSuccess(args: {
  conversation: ConversationRow;
  agent: AgentRow;
  userId: string;
  result: Awaited<ReturnType<typeof runAgentRuntime>>;
  visibleToUser: boolean;
  startedAt: number;
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const latencyMs = Math.max(0, Date.now() - args.startedAt);
    const estimatedCost = estimateAiCost(args.result.tokenInput, args.result.tokenOutput);
    const aiRun = await client.query(
      `INSERT INTO ai_agent_runs(conversation_id, user_id, app_key, agent_id, provider, model, status,
                                 request_json, response_json, token_input, token_output, cost, latency_ms)
       VALUES($1, $2, $3, $4, $5, $6, 'ok', $7::jsonb, $8::jsonb, $9, $10, $11, $12)
       RETURNING *`,
      [
        args.conversation.id,
        args.userId,
        args.conversation.app_key,
        args.agent.id,
        args.result.provider,
        args.result.model,
        JSON.stringify(args.result.requestJson || {}),
        JSON.stringify(args.result.responseJson || {}),
        args.result.tokenInput,
        args.result.tokenOutput,
        estimatedCost,
        latencyMs
      ]
    );

    const sequence = await nextMessageSequence(args.conversation.id, client);
    const metadata = {
      aiGenerated: true,
      provider: args.result.provider,
      model: args.result.model,
      agentId: args.agent.id,
      agentName: args.agent.name
    };
    const message = await client.query(
      `INSERT INTO messages(conversation_id, role, content, metadata_json, token_input, token_output, cost,
                            visible_to_user, created_by, sequence, ai_run_id, provider, model, provider_response_id)
       VALUES($1, 'assistant', $2, $3::jsonb, $4, $5, $6, $7, NULL, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        args.conversation.id,
        args.result.content,
        JSON.stringify(metadata),
        args.result.tokenInput,
        args.result.tokenOutput,
        estimatedCost,
        args.visibleToUser,
        sequence,
        aiRun.rows[0].id,
        args.result.provider,
        args.result.model,
        args.result.providerResponseId
      ]
    );

    const totalTokens = args.result.tokenInput + args.result.tokenOutput;
    await client.query(
      `INSERT INTO usage_ledger(user_id, app_key, conversation_id, tokens, cost, credits_delta, reason)
       VALUES($1, $2, $3, $4, $5, 0, 'ai_reply')`,
      [args.userId, args.conversation.app_key, args.conversation.id, totalTokens, estimatedCost]
    );
    await touchConversation(args.conversation.id, args.result.content, client);
    await client.query("COMMIT");
    return { aiRun: aiRun.rows[0], message: message.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function persistAiError(args: {
  conversation: ConversationRow;
  agent: AgentRow | null;
  userId: string;
  error: unknown;
  startedAt: number;
}) {
  const message = args.error instanceof Error ? args.error.message : String(args.error);
  await query(
    `INSERT INTO ai_agent_runs(conversation_id, user_id, app_key, agent_id, provider, model, status,
                               request_json, response_json, error, latency_ms)
     VALUES($1, $2, $3, $4, $5, $6, 'error', '{}'::jsonb, '{}'::jsonb, $7, $8)`,
    [
      args.conversation.id,
      args.userId,
      args.conversation.app_key,
      args.agent?.id || null,
      args.agent?.provider || process.env.AI_PROVIDER || "openai",
      args.agent?.model || process.env.OPENAI_MODEL || "unknown",
      message,
      Math.max(0, Date.now() - args.startedAt)
    ]
  );
}

function registerAgentReadRoutes(app: Express) {
  app.get("/api/ai/agents", requireAuth, async (req, res) => {
    const appKey = typeof req.query.appKey === "string" && req.query.appKey ? req.query.appKey : null;
    const rows = await query(
      `SELECT id, app_key, name, provider, model, system_prompt_key, version, status,
              temperature, max_tokens, allowed_tools, allowed_data, metadata
       FROM ai_agents
       WHERE ($1::text IS NULL OR app_key=$1)
         AND status='active'
       ORDER BY app_key, version DESC`,
      [appKey]
    );
    res.json({ items: rows });
  });

  app.get("/api/admin/ai-runs", requireAuth, requireAdmin, async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 250);
    const rows = await query(
      `SELECT r.id, r.conversation_id, r.user_id, r.app_key, r.agent_id, r.provider, r.model,
              r.status, r.token_input, r.token_output, r.cost, r.latency_ms, r.error, r.created_at,
              a.name AS agent_name, u.email AS user_email
       FROM ai_agent_runs r
       LEFT JOIN ai_agents a ON a.id = r.agent_id
       LEFT JOIN users u ON u.id = r.user_id
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ items: rows });
  });
}

function registerReplyRoutes(app: Express) {
  app.post("/api/conversations/:id/ai-reply", requireAuth, async (req: AuthedRequest, res) => {
    const body = aiReplySchema.parse(req.body);
    const startedAt = Date.now();
    const conversation = await loadConversation(req.params.id);
    if (!canAccess(req, conversation)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });
    if (conversation!.status !== "open") return res.status(400).json({ error: "Hội thoại này không còn mở." });

    if (body.message) await insertUserMessage(conversation!.id, req.user!.id, body.message);

    const agent = await loadAgent(conversation!);
    if (!agent) return res.status(400).json({ error: "Chưa có AI agent active cho app này." });
    await ensureConversationAgent(conversation!, agent);

    try {
      const appRun = await loadAppRun(conversation!, req, false);
      const messages = await loadRuntimeMessages(conversation!.id, false);
      const result = await runAgentRuntime({ agent, appRun, messages, extraInstruction: body.extraInstruction });
      const saved = await persistAiSuccess({ conversation: conversation!, agent, userId: req.user!.id, result, visibleToUser: true, startedAt });
      res.status(201).json({ ...saved, provider: result.provider, model: result.model });
    } catch (error) {
      await persistAiError({ conversation: conversation!, agent, userId: req.user!.id, error, startedAt });
      const detail = error instanceof Error ? error.message : String(error);
      res.status(502).json({ error: "AI provider lỗi hoặc chưa cấu hình.", detail });
    }
  });

  app.post("/api/admin/conversations/:id/ai-reply", requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const body = aiReplySchema.parse(req.body);
    const startedAt = Date.now();
    const conversation = await loadConversation(req.params.id);
    if (!canAccess(req, conversation, true)) return res.status(404).json({ error: "Không tìm thấy hội thoại." });

    if (body.message) await insertUserMessage(conversation!.id, req.user!.id, body.message);

    const agent = await loadAgent(conversation!);
    if (!agent) return res.status(400).json({ error: "Chưa có AI agent active cho app này." });
    await ensureConversationAgent(conversation!, agent);

    try {
      const appRun = await loadAppRun(conversation!, req, true);
      const messages = await loadRuntimeMessages(conversation!.id, true);
      const result = await runAgentRuntime({ agent, appRun, messages, extraInstruction: body.extraInstruction });
      const saved = await persistAiSuccess({
        conversation: conversation!,
        agent,
        userId: req.user!.id,
        result,
        visibleToUser: body.visibleToUser ?? true,
        startedAt
      });
      res.status(201).json({ ...saved, provider: result.provider, model: result.model });
    } catch (error) {
      await persistAiError({ conversation: conversation!, agent, userId: req.user!.id, error, startedAt });
      const detail = error instanceof Error ? error.message : String(error);
      res.status(502).json({ error: "AI provider lỗi hoặc chưa cấu hình.", detail });
    }
  });
}

export function registerAiRoutes(app: Express) {
  registerAgentReadRoutes(app);
  registerReplyRoutes(app);
}
