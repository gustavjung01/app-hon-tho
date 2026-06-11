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

function stubResponse(input: AiRuntimeInput, systemPrompt: string): AiRuntimeResult {
  const lastUser = [...input.messages].reverse().find((item) => item.role === "user")?.content || "";
  const content = [
    `Agent ${input.agent.name} đã nhận hội thoại.`,
    input.appRun ? `Đã gắn dữ liệu engine app_run ${input.appRun.id}.` : "Hội thoại này chưa có dữ liệu engine/app_run gắn kèm.",
    lastUser ? `Tin nhắn mới nhất: ${lastUser.slice(0, 500)}` : "Chưa có tin nhắn user để diễn giải.",
    "AI provider đang ở chế độ stub hoặc chưa bật/cấu hình API key trong admin, nên chưa gọi model thật."
  ].join("\n");
  const tokenInput = Math.ceil((systemPrompt.length + input.messages.map((m) => m.content).join(" ").length) / 4);
  const tokenOutput = Math.ceil(content.length / 4);

  return {
    content,
    provider: "stub",
    model: input.agent.model,
    providerResponseId: null,
    tokenInput,
    tokenOutput,
    cost: 0,
    requestJson: { mode: "stub", messageCount: input.messages.length },
    responseJson: { mode: "stub", content }
  };
}

export async function runAgentRuntime(input: AiRuntimeInput): Promise<AiRuntimeResult> {
  const systemPrompt = buildAgentSystemPrompt(input);
  const settings = await loadAiProviderSettings();
  const provider = settings.provider || input.agent.provider || "stub";
  const apiKey = settings.apiKey;
  const useStub = !settings.enabled || provider === "stub" || !apiKey;

  if (useStub) return stubResponse(input, systemPrompt);

  const model = input.agent.model || settings.model || "gpt-4.1-mini";
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
    provider,
    model,
    providerResponseId: responseJson?.id || null,
    tokenInput,
    tokenOutput,
    cost: estimateCost(tokenInput, tokenOutput, settings.costInputPer1K, settings.costOutputPer1K),
    requestJson,
    responseJson
  };
}
