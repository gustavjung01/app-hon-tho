import { loadAiProviderSettings } from "./aiSettings.js";
import { getDialogflowAccessToken } from "./dialogflowCxAuth.js";
import { dialogflowCredentialRef, loadDialogflowCredentialsForAgent } from "./dialogflowCxCredentials.js";

type ChatRole = "system" | "user" | "assistant" | "tool";
type AgentRuntimeConfig = { id: string; app_key: string; name: string; provider?: string | null; model: string; system_prompt: string; temperature: number | string; max_tokens: number; allowed_tools?: unknown; allowed_data?: unknown; metadata?: Record<string, unknown> | null };
type RuntimeMessage = { role: ChatRole; content: string };
type AppRunContext = { id: string; app_key: string; input_json: unknown; result_json: unknown; created_at: string } | null;
type AiRuntimeInput = { agent: AgentRuntimeConfig; messages: RuntimeMessage[]; appRun: AppRunContext; extraInstruction?: string; conversationId?: string };
type AiRuntimeResult = { content: string; provider: string; model: string; providerResponseId: string | null; tokenInput: number; tokenOutput: number; responseJson: unknown; requestJson: unknown; cost: number };

class RuntimeProviderError extends Error { constructor(message: string, public requestJson: unknown, public responseJson: unknown) { super(message); this.name = "RuntimeProviderError"; } }

function compactJson(value: unknown, maxLength = 2200) { if (!value) return "null"; const text = JSON.stringify(value, null, 2); return text.length > maxLength ? `${text.slice(0, maxLength)}\n... [truncated]` : text; }
function trimText(value: string, maxLength = 1200) { return value.length > maxLength ? `${value.slice(0, maxLength)}\n... [truncated]` : value; }
function asNumber(value: number | string | null | undefined, fallback: number) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function estimateCost(tokenInput: number, tokenOutput: number, inputPer1K: number, outputPer1K: number) { return Number(((tokenInput / 1000) * inputPer1K + (tokenOutput / 1000) * outputPer1K).toFixed(6)); }
function providerKey(value: string | null | undefined) { const normalized = String(value || "stub").trim().toLowerCase().replace(/[-\s]+/g, "_"); return normalized || "stub"; }
function isOpenAiProvider(provider: string) { return provider === "openai" || provider === "openai_chat"; }
function isDialogflowPath(model: string | null | undefined) { return String(model || "").trim().startsWith("projects/"); }
function normalizeMessage(message: RuntimeMessage) { if (message.role === "tool") return { role: "user", content: `[Dữ liệu công cụ]\n${message.content}` }; if (message.role === "system") return { role: "user", content: `[Ghi chú hệ thống]\n${message.content}` }; return { role: message.role, content: message.content }; }
function latestUserMessage(messages: RuntimeMessage[]) { return [...messages].reverse().find((item) => item.role === "user")?.content?.trim() || ""; }
function cleanSessionId(value: string) { return value.trim().replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 120) || `session_${Date.now()}`; }
function parseCxPath(model: string) { const match = /^projects\/([^/]+)\/locations\/([^/]+)\/agents\/([^/]+)$/.exec(model.trim()); if (!match) throw new Error("Dialogflow CX agent path phải có dạng projects/{project}/locations/{location}/agents/{agent}."); return { project: match[1], location: match[2], agent: match[3], path: model.trim() }; }
function cxBaseUrl(location: string) { const override = process.env.DIALOGFLOW_CX_API_BASE_URL?.trim(); if (override) return override.replace(/\/$/, ""); return location && location !== "global" ? `https://${location}-dialogflow.googleapis.com` : "https://dialogflow.googleapis.com"; }

export function buildAgentSystemPrompt(input: AiRuntimeInput) {
  const appRun = input.appRun ? `\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nApp run ID: ${input.appRun.id}\nApp: ${input.appRun.app_key}\nCreated: ${input.appRun.created_at}\nInput JSON:\n${compactJson(input.appRun.input_json, 1800)}\nResult JSON:\n${compactJson(input.appRun.result_json, 2200)}` : "\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nChưa có app_run gắn với hội thoại này. Không tự tính thay engine, không bịa dữ liệu chưa có.";
  const guardrail = "\n\n[QUY TẮC HỆ THỐNG CỔ HỌC]\n- Engine/app_run là nguồn sự thật.\n- Thiếu dữ liệu thì nói rõ thiếu dữ liệu và hỏi thêm.\n- Trả lời bằng tiếng Việt, rõ ràng, có cấu trúc ngắn gọn.";
  const extra = input.extraInstruction ? `\n\n[CHỈ DẪN BỔ SUNG]\n${input.extraInstruction}` : "";
  return `${input.agent.system_prompt}${guardrail}${appRun}${extra}`;
}

function stubResponse(input: AiRuntimeInput, systemPrompt: string, provider: string, note: string): AiRuntimeResult {
  const lastUser = latestUserMessage(input.messages);
  const content = [`Agent ${input.agent.name} đã nhận hội thoại.`, `App key: ${input.agent.app_key}.`, `Provider: ${provider}.`, `Model/path: ${input.agent.model || "(chưa cấu hình)"}.`, input.appRun ? `Đã gắn dữ liệu engine app_run ${input.appRun.id}.` : "Hội thoại này chưa có dữ liệu engine/app_run gắn kèm.", lastUser ? `Tin nhắn mới nhất: ${lastUser.slice(0, 500)}` : "Chưa có tin nhắn user để diễn giải.", note].join("\n");
  const tokenInput = Math.ceil((systemPrompt.length + input.messages.map((m) => m.content).join(" ").length) / 4);
  const tokenOutput = Math.ceil(content.length / 4);
  return { content, provider, model: input.agent.model, providerResponseId: null, tokenInput, tokenOutput, cost: 0, requestJson: { mode: "stub", provider, appKey: input.agent.app_key, agentId: input.agent.id, model: input.agent.model, note }, responseJson: { mode: "stub", provider, content } };
}

function cxPrompt(input: AiRuntimeInput, systemPrompt: string) {
  const history = input.messages.slice(-6).map((m) => `${m.role}: ${trimText(m.content, 380)}`).join("\n");
  const user = latestUserMessage(input.messages) || "Tiếp tục hội thoại.";
  const prompt = ["[SYSTEM]", trimText(systemPrompt, 2400), "", "[APP_RUN]", input.appRun ? compactJson(input.appRun, 2600) : "null", "", "[HISTORY]", trimText(history, 1200), "", "[USER]", trimText(user, 700)].join("\n");
  return trimText(prompt, 6900);
}
function cxOutput(json: any) { const msgs = json?.queryResult?.responseMessages || []; const parts = msgs.flatMap((m: any) => m?.text?.text || []).filter(Boolean); return parts.join("\n").trim() || String(json?.queryResult?.fulfillmentText || "").trim(); }

async function runDialogflowCx(input: AiRuntimeInput, systemPrompt: string): Promise<AiRuntimeResult> {
  const parsed = parseCxPath(input.agent.model || "");
  const serviceAccount = await loadDialogflowCredentialsForAgent({ appKey: input.agent.app_key, agentPath: parsed.path, metadata: input.agent.metadata || null });
  const token = await getDialogflowAccessToken({ serviceAccount, cacheKey: serviceAccount ? dialogflowCredentialRef(serviceAccount) : undefined });
  const session = `${parsed.path}/sessions/${cleanSessionId(input.conversationId || input.appRun?.id || input.agent.id)}`;
  const endpoint = `${cxBaseUrl(parsed.location)}/v3/${session}:detectIntent`;
  const requestJson = { queryInput: { text: { text: cxPrompt(input, systemPrompt) }, languageCode: process.env.DIALOGFLOW_CX_LANGUAGE_CODE || "vi" }, queryParams: { parameters: { appKey: input.agent.app_key, agentId: input.agent.id, appRunId: input.appRun?.id || null } } };
  const requestLog = { endpoint, session, credentialSource: serviceAccount ? "admin_settings" : "env", promptChars: requestJson.queryInput.text.text.length, ...requestJson };
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(requestJson) });
  const responseJson = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) throw new RuntimeProviderError(responseJson?.error?.message || response.statusText || "Dialogflow CX error", requestLog, responseJson);
  const content = cxOutput(responseJson);
  if (!content) throw new RuntimeProviderError("Dialogflow CX trả về nội dung rỗng.", requestLog, responseJson);
  return { content, provider: "dialogflow_cx", model: input.agent.model, providerResponseId: responseJson?.responseId || null, tokenInput: 0, tokenOutput: 0, cost: 0, requestJson: requestLog, responseJson };
}

export async function runAgentRuntime(input: AiRuntimeInput): Promise<AiRuntimeResult> {
  const systemPrompt = buildAgentSystemPrompt(input);
  const agentProvider = providerKey(input.agent.provider);
  if (agentProvider === "stub") return stubResponse(input, systemPrompt, "stub", "Agent provider đang là stub hoặc chưa cấu hình, nên runtime không gọi OpenAI.");
  if (agentProvider === "dialogflow_cx") return runDialogflowCx(input, systemPrompt);
  if (!isOpenAiProvider(agentProvider)) return stubResponse(input, systemPrompt, agentProvider, `Provider ${agentProvider} chưa được runtime hỗ trợ.`);
  const settings = await loadAiProviderSettings();
  const settingsProvider = providerKey(settings.provider);
  const apiKey = settings.apiKey;
  if (!settings.enabled || !apiKey) return stubResponse(input, systemPrompt, "stub", "OpenAI chưa bật hoặc thiếu API key trong admin settings.");
  if (settingsProvider !== "stub" && !isOpenAiProvider(settingsProvider)) return stubResponse(input, systemPrompt, settingsProvider, `System provider ${settingsProvider} không phải openai/openai_chat.`);
  let model = input.agent.model || settings.model || "gpt-4.1-mini";
  if (isDialogflowPath(model)) model = settings.model || "gpt-4.1-mini";
  const requestJson = { model, temperature: asNumber(input.agent.temperature, 0.3), max_tokens: Number(input.agent.max_tokens || 1200), messages: [{ role: "system", content: systemPrompt }, ...input.messages.map(normalizeMessage)] };
  const endpoint = settings.baseUrl || "https://api.openai.com/v1/chat/completions";
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(requestJson) });
  const responseJson = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) throw new RuntimeProviderError(responseJson?.error?.message || response.statusText || "AI provider error", requestJson, responseJson);
  const content = responseJson?.choices?.[0]?.message?.content || "";
  if (!content.trim()) throw new RuntimeProviderError("AI provider trả về nội dung rỗng.", requestJson, responseJson);
  const tokenInput = Number(responseJson?.usage?.prompt_tokens || 0);
  const tokenOutput = Number(responseJson?.usage?.completion_tokens || 0);
  return { content, provider: agentProvider, model, providerResponseId: responseJson?.id || null, tokenInput, tokenOutput, cost: estimateCost(tokenInput, tokenOutput, settings.costInputPer1K, settings.costOutputPer1K), requestJson, responseJson };
}
