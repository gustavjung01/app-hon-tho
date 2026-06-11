import { loadAiProviderSettings } from "./aiSettings.js";

type ChatRole = "system" | "user" | "assistant" | "tool";

type AgentRuntimeConfig = {
  id: string;
  app_key: string;
  name: string;
  provider?: string | null;
  model: string;
  system_prompt: string;
  temperature: number | string;
  max_tokens: number;
  allowed_tools?: unknown;
  allowed_data?: unknown;
};

type RuntimeMessage = {
  role: ChatRole;
  content: string;
};

type AppRunContext = {
  id: string;
  app_key: string;
  input_json: unknown;
  result_json: unknown;
  created_at: string;
} | null;

type AiRuntimeInput = {
  agent: AgentRuntimeConfig;
  messages: RuntimeMessage[];
  appRun: AppRunContext;
  extraInstruction?: string;
};

type AiRuntimeResult = {
  content: string;
  provider: string;
  model: string;
  providerResponseId: string | null;
  tokenInput: number;
  tokenOutput: number;
  responseJson: unknown;
  requestJson: unknown;
  cost: number;
};

function compactJson(value: unknown, maxLength = 14000) {
  if (!value) return "null";
  const text = JSON.stringify(value, null, 2);
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n... [truncated]` : text;
}

function asNumber(value: number | string | null | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function estimateCost(tokenInput: number, tokenOutput: number, inputPer1K: number, outputPer1K: number) {
  return Number(((tokenInput / 1000) * inputPer1K + (tokenOutput / 1000) * outputPer1K).toFixed(6));
}

function normalizeMessage(message: RuntimeMessage) {
  if (message.role === "tool") {
    return { role: "user", content: `[Dữ liệu công cụ]\n${message.content}` };
  }
  if (message.role === "system") {
    return { role: "user", content: `[Ghi chú hệ thống]\n${message.content}` };
  }
  return { role: message.role, content: message.content };
}

function providerKey(value: string | null | undefined) {
  const normalized = String(value || "stub").trim().toLowerCase().replace(/[-\s]+/g, "_");
  return normalized || "stub";
}

function isOpenAiProvider(provider: string) {
  return provider === "openai" || provider === "openai_chat";
}

function isDialogflowPath(model: string | null | undefined) {
  return String(model || "").trim().startsWith("projects/");
}

export function buildAgentSystemPrompt(input: AiRuntimeInput) {
  const allowedTools = compactJson(input.agent.allowed_tools || []);
  const allowedData = compactJson(input.agent.allowed_data || []);
  const appRun = input.appRun
    ? `\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nApp run ID: ${input.appRun.id}\nApp: ${input.appRun.app_key}\nCreated: ${input.appRun.created_at}\nInput JSON:\n${compactJson(input.appRun.input_json)}\nResult JSON:\n${compactJson(input.appRun.result_json)}`
    : "\n\n[DỮ LIỆU ENGINE ĐÃ LƯU]\nChưa có app_run gắn với hội thoại này. Không tự tính thay engine, không bịa dữ liệu chưa có.";

  const guardrail = `\n\n[QUY TẮC HỆ THỐNG CỔ HỌC]\n- Engine/app_run là nguồn sự thật. AI chỉ diễn giải dữ liệu đã lưu hoặc nội dung user cung cấp.\n- Không tự bịa lá số, quẻ, dụng thần, vượng suy, lưu niên, chẩn đoán y khoa hoặc kết luận cực đoan khi engine chưa cung cấp.\n- Thiếu dữ liệu thì nói rõ thiếu dữ liệu và hỏi thêm.\n- Trả lời bằng tiếng Việt, rõ ràng, có cấu trúc ngắn gọn.\n- Allowed tools: ${allowedTools}\n- Allowed data: ${allowedData}`;

  const extra = input.extraInstruction ? `\n\n[CHỈ DẪN BỔ SUNG]\n${input.extraInstruction}` : "";
  return `${input.agent.system_prompt}${guardrail}${appRun}${extra}`;
}

function stubResponse(input: AiRuntimeInput, systemPrompt: string, provider: string, note: string): AiRuntimeResult {
  const lastUser = [...input.messages].reverse().find((item) => item.role === "user")?.content || "";
  const content = [
    `Agent ${input.agent.name} đã nhận hội thoại.`,
    `App key: ${input.agent.app_key}.`,
    `Provider: ${provider}.`,
    `Model/path: ${input.agent.model || "(chưa cấu hình)"}.`,
    input.appRun ? `Đã gắn dữ liệu engine app_run ${input.appRun.id}.` : "Hội thoại này chưa có dữ liệu engine/app_run gắn kèm.",
    `System prompt preview: ${input.agent.system_prompt.slice(0, 500)}`,
    lastUser ? `Tin nhắn mới nhất: ${lastUser.slice(0, 500)}` : "Chưa có tin nhắn user để diễn giải.",
    note
  ].join("\n");
  const tokenInput = Math.ceil((systemPrompt.length + input.messages.map((m) => m.content).join(" ").length) / 4);
  const tokenOutput = Math.ceil(content.length / 4);

  return {
    content,
    provider,
    model: input.agent.model,
    providerResponseId: null,
    tokenInput,
    tokenOutput,
    cost: 0,
    requestJson: {
      mode: "stub",
      provider,
      appKey: input.agent.app_key,
      agentId: input.agent.id,
      model: input.agent.model,
      messageCount: input.messages.length,
      note
    },
    responseJson: { mode: "stub", provider, content }
  };
}

export async function runAgentRuntime(input: AiRuntimeInput): Promise<AiRuntimeResult> {
  const systemPrompt = buildAgentSystemPrompt(input);
  const agentProvider = providerKey(input.agent.provider);

  if (agentProvider === "stub") {
    return stubResponse(input, systemPrompt, "stub", "Agent provider đang là stub hoặc chưa cấu hình, nên runtime không gọi OpenAI.");
  }

  if (agentProvider === "dialogflow_cx") {
    return stubResponse(
      input,
      systemPrompt,
      "dialogflow_cx",
      "Dialogflow CX chỉ được test/binding trong runtime hiện tại. Runtime không gọi OpenAI và không dùng model/path dạng projects/.../agents/... làm OpenAI model."
    );
  }

  if (!isOpenAiProvider(agentProvider)) {
    return stubResponse(
      input,
      systemPrompt,
      agentProvider,
      `Provider ${agentProvider} chỉ test/binding trong runtime hiện tại. Runtime không gọi OpenAI cho provider không phải openai/openai_chat.`
    );
  }

  const settings = await loadAiProviderSettings();
  const settingsProvider = providerKey(settings.provider);
  const apiKey = settings.apiKey;

  if (!settings.enabled || !apiKey) {
    return stubResponse(input, systemPrompt, "stub", "OpenAI chưa bật hoặc thiếu API key trong admin settings, nên runtime trả stub.");
  }

  if (settingsProvider !== "stub" && !isOpenAiProvider(settingsProvider)) {
    return stubResponse(
      input,
      systemPrompt,
      settingsProvider,
      `System provider ${settingsProvider} không phải openai/openai_chat, nên runtime không gọi OpenAI.`
    );
  }

  let model = input.agent.model || settings.model || "gpt-4.1-mini";
  if (isDialogflowPath(model)) {
    model = settings.model || "gpt-4.1-mini";
  }

  const temperature = asNumber(input.agent.temperature, 0.3);
  const maxTokens = Number(input.agent.max_tokens || 1200);
  const endpoint = settings.baseUrl || "https://api.openai.com/v1/chat/completions";

  const requestJson = {
    model,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...input.messages.map(normalizeMessage)
    ]
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestJson)
  });

  const responseJson = (await response.json().catch(() => ({}))) as any;
  if (!response.ok) {
    const detail = responseJson?.error?.message || response.statusText || "AI provider error";
    throw new Error(detail);
  }

  const content = responseJson?.choices?.[0]?.message?.content || "";
  if (!content.trim()) throw new Error("AI provider trả về nội dung rỗng.");

  const tokenInput = Number(responseJson?.usage?.prompt_tokens || 0);
  const tokenOutput = Number(responseJson?.usage?.completion_tokens || 0);

  return {
    content,
    provider: agentProvider,
    model,
    providerResponseId: responseJson?.id || null,
    tokenInput,
    tokenOutput,
    cost: estimateCost(tokenInput, tokenOutput, settings.costInputPer1K, settings.costOutputPer1K),
    requestJson,
    responseJson
  };
}
