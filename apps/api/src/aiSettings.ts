import { query } from "./db.js";

export type AiProviderSettings = {
  enabled: boolean;
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  costInputPer1K: number;
  costOutputPer1K: number;
  hasApiKey: boolean;
};

type SettingRow = {
  value_json: Record<string, unknown>;
  secret_json: Record<string, unknown>;
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function maskSecret(value?: string | null) {
  if (!value) return "";
  if (value.length <= 10) return "••••";
  return `${value.slice(0, 6)}••••${value.slice(-4)}`;
}

export async function loadAiProviderSettings(): Promise<AiProviderSettings> {
  const rows = await query<SettingRow>(`SELECT value_json, secret_json FROM admin_settings WHERE key='ai_provider' LIMIT 1`);
  const value = rows[0]?.value_json || {};
  const secret = rows[0]?.secret_json || {};
  const apiKey = asString(secret.apiKey, process.env.OPENAI_API_KEY || "");
  const provider = asString(value.provider, process.env.AI_PROVIDER || "stub");

  return {
    enabled: asBoolean(value.enabled, provider !== "stub" && !!apiKey),
    provider,
    baseUrl: asString(value.baseUrl, process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions"),
    model: asString(value.model, process.env.OPENAI_MODEL || "gpt-4.1-mini"),
    apiKey,
    costInputPer1K: asNumber(value.costInputPer1K, Number(process.env.AI_COST_INPUT_PER_1K || 0)),
    costOutputPer1K: asNumber(value.costOutputPer1K, Number(process.env.AI_COST_OUTPUT_PER_1K || 0)),
    hasApiKey: !!apiKey
  };
}

export async function getPublicAiProviderSettings() {
  const settings = await loadAiProviderSettings();
  return {
    enabled: settings.enabled,
    provider: settings.provider,
    baseUrl: settings.baseUrl,
    model: settings.model,
    costInputPer1K: settings.costInputPer1K,
    costOutputPer1K: settings.costOutputPer1K,
    hasApiKey: settings.hasApiKey,
    apiKeyMasked: maskSecret(settings.apiKey)
  };
}
