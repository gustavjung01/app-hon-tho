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

function compactJson(value: unknown, maxLength = 1200) { if (!value) return "null"; const text = JSON.stringify(value, null, 2); return text.length > maxLength ? `${text.slice(0, maxLength)}\n... [truncated]` : text; }
function trimText(value: string, maxLength = 900) { return value.length > maxLength ? `${value.slice(0, maxLength)}\n... [truncated]` : value; }
function asNumber(value: number | string | null | undefined, fallback: number) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function estimateCost(tokenInput: number, tokenOutput: number, inputPer1K: number, outputPer1K: number) { return Number(((tokenInput / 1000) * inputPer1K + (tokenOutput / 1000) * outputPer1K).toFixed(6)); }
function providerKey(value: string | null | undefined) { const normalized = String(value || "stub").trim().toLowerCase().replace(/[-\s]+/g, "_"); return normalized || "stub"; }
function isOpenAiProvider(provider: string) { return provider === "openai" || provider === "openai_chat"; }
function isDialogflowPath(model: string | null | undefined) { return String(model || "").trim().startsWith("projects/"); }
function normalizeMessage(message: RuntimeMessage) { if (message.role === "tool") return { role: "user", content: `[Dữ liệu công cụ]\n${message.content}` }; if (message.role === "system") return { role: "user", content: `[Ghi chú hệ thống]\n${message.content}` }; return { role: message.role, content: message.content }; }
function latestUserMessage(messages: RuntimeMessage[]) { return [...messages].reverse().find((item) => item.role === "user")?.content?.trim() || ""; }
function cleanSessionId(value: string) { return value.trim().replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 120) || `session_${Date.now()}`; }
function parseCxPath(model: string) { const match = /^projects\/([^/]+)\/locations\/([^/]+)\/agents\/([^/]+)$/.exec(model.trim()); if (!match) throw new Error("Đường dẫn Cố vấn Tứ Trụ chưa đúng định dạng."); return { project: match[1], location: match[2], agent: match[3], path: model.trim() }; }
function cxBaseUrl(location: string) { const override = process.env.DIALOGFLOW_CX_API_BASE_URL?.trim(); if (override) return override.replace(/\/$/, ""); return location && location !== "global" ? `https://${location}-dialogflow.googleapis.com` : "https://dialogflow.googleapis.com"; }
function isRecord(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
function rec(value: unknown) { return isRecord(value) ? value : {}; }
function arr(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function str(value: unknown) { return typeof value === "string" ? value : ""; }

function isFollowupTurn(input: AiRuntimeInput) {
  const userCount = input.messages.filter((m) => m.role === "user").length;
  const assistantCount = input.messages.filter((m) => m.role === "assistant").length;
  const extra = String(input.extraInstruction || "").toLowerCase();
  return userCount > 1 || assistantCount > 0 || extra.includes("nối tiếp") || extra.includes("hỏi tiếp");
}

export function buildAgentSystemPrompt(input: AiRuntimeInput) {
  const appRun = input.appRun ? `\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nApp: ${input.appRun.app_key}\nCreated: ${input.appRun.created_at}\nResult JSON:\n${compactJson(input.appRun.result_json, 700)}` : "\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nChưa có app_run gắn với hội thoại này. Không tự tính thay engine, không bịa dữ liệu chưa có.";
  const guardrail = "\n\n[QUY TẮC]\n- Lá số engine là nguồn sự thật.\n- Thiếu dữ liệu thì nói rõ thiếu.\n- Không nhắc App run/Conversation/model/path/JSON.\n- Không đọc lại bảng dữ liệu, không giải thích tên trường.\n- Hỏi tiếp trả lời đúng câu hỏi, không lặp tổng luận.\n- Không phán định tuyệt đối.";
  const extra = input.extraInstruction ? `\n\n[CHỈ DẪN BỔ SUNG]\n${input.extraInstruction}` : "";
  return `${input.agent.system_prompt}${guardrail}${appRun}${extra}`;
}

function stubResponse(input: AiRuntimeInput, systemPrompt: string, provider: string, note: string): AiRuntimeResult {
  const lastUser = latestUserMessage(input.messages);
  const content = [`Cố vấn Tứ Trụ đã nhận hội thoại.`, input.appRun ? `Đã gắn dữ liệu lá phiếu đã an.` : "Hội thoại này chưa có dữ liệu lá phiếu gắn kèm.", lastUser ? `Tin nhắn mới nhất: ${lastUser.slice(0, 500)}` : "Chưa có tin nhắn user để diễn giải.", note].join("\n");
  const tokenInput = Math.ceil((systemPrompt.length + input.messages.map((m) => m.content).join(" ").length) / 4);
  const tokenOutput = Math.ceil(content.length / 4);
  return { content, provider, model: input.agent.model, providerResponseId: null, tokenInput, tokenOutput, cost: 0, requestJson: { mode: "stub", provider, appKey: input.agent.app_key, agentId: input.agent.id, model: input.agent.model, note }, responseJson: { mode: "stub", provider, content } };
}

function tuTruBrief(input: AiRuntimeInput) {
  if (!input.appRun) return "Chưa có lá số gắn kèm.";
  const resultJson = rec(input.appRun.result_json);
  const layer = rec(resultJson.contentLayer || resultJson);
  const inputSummary = rec(layer.inputSummary);
  const dayMaster = rec(layer.dayMasterSummary);
  const elementBalance = rec(layer.elementBalance);
  const majorLuck = rec(layer.majorLuck);
  const pillars = arr(layer.pillars).map(rec).map((p) => `${str(p.label)} ${str(p.pillar)} ${str(p.pillarHan)} (${str(p.tenGod)})`).filter(Boolean).join("; ");
  const tenGods = arr(layer.tenGodOverview).map(rec).filter((x) => Number(x.count || 0) > 0).slice(0, 8).map((x) => `${str(x.name)} ${x.count} ở ${str(x.positions)}`).join("; ");
  const cycles = arr(majorLuck.cycles).map(rec).slice(0, 4).map((x) => `${str(x.pillar)} ${str(x.ageLabel)} ${str(x.years)}`).join("; ");
  return trimText([
    `Sinh: ${str(inputSummary.birthDate)} ${str(inputSummary.birthTime)}, ${str(inputSummary.birthPlace)}, ${str(inputSummary.gender)}.`,
    `Nhật chủ: ${str(dayMaster.name)} ${str(dayMaster.han)}, hành ${str(dayMaster.element)}. ${str(dayMaster.note)}`,
    `Bốn trụ: ${pillars}.`,
    `Ngũ hành: ${JSON.stringify(elementBalance.counts || {})}.`,
    tenGods ? `Thập thần nổi bật: ${tenGods}.` : "Thập thần nổi bật: chưa có mục nào đủ nổi bật trong lớp hiện tại.",
    `Đại vận: ${str(majorLuck.directionLabel)}, khởi ${str(majorLuck.startAgeLabel)}. Các vận đầu: ${cycles}.`,
    `Giới hạn: ${str(layer.guardrail || resultJson.guardrail) || "chỉ tham khảo cổ học, thiếu lớp vượng suy/dụng thần/lưu niên thì phải nói rõ."}`
  ].join("\n"), 1500);
}

function firstInterpretationPrompt(input: AiRuntimeInput, user: string) {
  return [
    "[CHE_DO] LUAN_TU_NHIEN",
    "Bạn là Cố vấn Tứ Trụ trong app. Hãy trả lời như một người đang luận trực tiếp cho người dùng, tự nhiên và mạch lạc.",
    "Lá số đã được app an sẵn trong LA_SO_NEN. Không yêu cầu người dùng nhập lại năm tháng ngày giờ.",
    "Không chào hỏi. Không đọc lại dữ liệu. Không giải thích các trường như trụ năm, trụ tháng là gì. Không biến câu trả lời thành báo cáo kỹ thuật hay checklist khô.",
    "Hãy bám vào lá số nền bên dưới để luận: nhìn tổng thể, nêu điểm nổi bật, liên hệ các lớp đã có, nói rõ phần chưa đủ dữ liệu, rồi gợi ý 2-3 câu hỏi tiếp rất ngắn.",
    "Nếu thiếu lớp vượng suy, dụng thần, hỷ kỵ hay lưu niên thì nói đó là giới hạn, đừng tự bịa kết luận chắc chắn.",
    "[LA_SO_NEN]", tuTruBrief(input),
    "[NGUOI_DUNG_HOI]", trimText(user || "Luận lá phiếu này giúp tôi.", 260)
  ].join("\n");
}

function followupPrompt(input: AiRuntimeInput, user: string) {
  return [
    "[CHE_DO] HOI_TIEP_TU_NHIEN",
    "Lá số vẫn nằm trong LA_SO_NEN dưới đây. Không yêu cầu người dùng cung cấp lại ngày giờ sinh. Trả lời câu hỏi mới nhất như đang chat, không viết lại tổng luận, không nhắc kỹ thuật.",
    "Nếu thiếu lớp chuyên sâu như vượng suy, dụng thần, hỷ kỵ, lưu niên thì nói thiếu lớp đó, không nói thiếu ngày giờ sinh.",
    "[LA_SO_NEN]", tuTruBrief(input),
    "[CAU_HOI]", trimText(user, 420)
  ].join("\n");
}

function cxPrompt(input: AiRuntimeInput, systemPrompt: string) {
  const user = latestUserMessage(input.messages) || "Luận lá phiếu này giúp tôi.";
  const prompt = isFollowupTurn(input) ? followupPrompt(input, user) : firstInterpretationPrompt(input, user);
  return trimText(prompt, isFollowupTurn(input) ? 2500 : 2900);
}

function cxOutput(json: any) { const msgs = json?.queryResult?.responseMessages || []; const parts = msgs.flatMap((m: any) => m?.text?.text || []).filter(Boolean); return parts.join("\n").trim() || String(json?.queryResult?.fulfillmentText || "").trim(); }

function isDialogflowEcho(content: string) {
  const normalized = content.toLowerCase();
  return normalized.includes("app run:") || normalized.includes("conversation:") || normalized.includes("projects/dialog") || normalized.includes("tôi đã nhận") || normalized.includes("xác nhận thông tin") || normalized.includes("thông tin đầu vào") || normalized.includes("bảng tứ trụ của bạn được lập như sau") || normalized.includes("dưới đây là phần phân tích tổng quan về cấu trúc lá số") || normalized.includes("vui lòng cung cấp thông tin sinh") || normalized.includes("cung cấp thông tin năm, tháng, ngày") || normalized.includes("cần có dữ liệu lá số") || normalized.includes("chưa nhận được thông tin về năm") || (normalized.includes("cần có dữ liệu") && normalized.includes("giờ sinh")) || (normalized.includes("giới tính") && normalized.includes("ngày sinh") && normalized.includes("ngũ hành tổng quan"));
}

async function runDialogflowCx(input: AiRuntimeInput, systemPrompt: string): Promise<AiRuntimeResult> {
  const parsed = parseCxPath(input.agent.model || "");
  const serviceAccount = await loadDialogflowCredentialsForAgent({ appKey: input.agent.app_key, agentPath: parsed.path, metadata: input.agent.metadata || null });
  const token = await getDialogflowAccessToken({ serviceAccount, cacheKey: serviceAccount ? dialogflowCredentialRef(serviceAccount) : undefined });
  const session = `${parsed.path}/sessions/${cleanSessionId(input.conversationId || input.appRun?.id || input.agent.id)}`;
  const endpoint = `${cxBaseUrl(parsed.location)}/v3/${session}:detectIntent`;
  const promptMode = isFollowupTurn(input) ? "followup" : "initial";
  const requestJson = { queryInput: { text: { text: cxPrompt(input, systemPrompt) }, languageCode: process.env.DIALOGFLOW_CX_LANGUAGE_CODE || "vi" }, queryParams: { parameters: { appKey: input.agent.app_key, agentId: input.agent.id, appRunId: input.appRun?.id || null, promptMode } } };
  const requestLog = { endpoint, session, credentialSource: serviceAccount ? "admin_settings" : "env", promptMode, promptChars: requestJson.queryInput.text.text.length, ...requestJson };
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(requestJson) });
  const responseJson = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) throw new RuntimeProviderError(responseJson?.error?.message || response.statusText || "Cố vấn Tứ Trụ chưa trả lời được.", requestLog, responseJson);
  const content = cxOutput(responseJson);
  if (!content) throw new RuntimeProviderError("Cố vấn Tứ Trụ trả về nội dung rỗng.", requestLog, responseJson);
  if (input.appRun && isDialogflowEcho(content)) throw new RuntimeProviderError("Cố vấn Tứ Trụ chưa bám lá số đã an. Backend đã có lá số, nhưng Playbook vẫn yêu cầu nhập lại dữ liệu. Hãy thử lại sau khi deploy bản mới hoặc tạo hội thoại mới.", requestLog, { ...responseJson, rawContentPreview: content.slice(0, 800), promptMode });
  return { content, provider: "dialogflow_cx", model: input.agent.model, providerResponseId: responseJson?.responseId || null, tokenInput: 0, tokenOutput: 0, cost: 0, requestJson: requestLog, responseJson: { ...responseJson, promptMode } };
}

export async function runAgentRuntime(input: AiRuntimeInput): Promise<AiRuntimeResult> {
  const systemPrompt = buildAgentSystemPrompt(input);
  const agentProvider = providerKey(input.agent.provider);
  if (agentProvider === "stub") return stubResponse(input, systemPrompt, "stub", "Cố vấn Tứ Trụ chưa được cấu hình để gọi mô hình luận giải.");
  if (agentProvider === "dialogflow_cx") return runDialogflowCx(input, systemPrompt);
  if (!isOpenAiProvider(agentProvider)) return stubResponse(input, systemPrompt, agentProvider, `Cố vấn ${agentProvider} chưa được runtime hỗ trợ.`);
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
