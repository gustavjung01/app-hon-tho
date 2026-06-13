import fs from "node:fs/promises";
import crypto from "node:crypto";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
  project_id?: string;
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedServiceAccount: ServiceAccount | null = null;
let serviceAccountLoaded = false;

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function loadServiceAccount(): Promise<ServiceAccount | null> {
  if (serviceAccountLoaded) return cachedServiceAccount;

  const rawJson = process.env.DIALOGFLOW_CX_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    cachedServiceAccount = JSON.parse(rawJson);
    return cachedServiceAccount;
  }

  const rawBase64 = process.env.DIALOGFLOW_CX_SERVICE_ACCOUNT_BASE64?.trim();
  if (rawBase64) {
    cachedServiceAccount = JSON.parse(Buffer.from(rawBase64, "base64").toString("utf8"));
    return cachedServiceAccount;
  }

  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (filePath) {
    cachedServiceAccount = JSON.parse(await fs.readFile(filePath, "utf8"));
    return cachedServiceAccount;
  }

  cachedServiceAccount = null;
  return null;
}

function assertServiceAccount(value: ServiceAccount | null): asserts value is ServiceAccount {
  if (!value?.client_email || !value?.private_key) {
    throw new Error("Thiếu Dialogflow credentials. Cấu hình GOOGLE_APPLICATION_CREDENTIALS, DIALOGFLOW_CX_SERVICE_ACCOUNT_JSON hoặc DIALOGFLOW_CX_SERVICE_ACCOUNT_BASE64.");
  }
}

export async function getDialogflowAccessToken() {
  const manualToken = process.env.DIALOGFLOW_CX_ACCESS_TOKEN?.trim();
  if (manualToken) return manualToken;

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token;

  const serviceAccount = await loadServiceAccount();
  assertServiceAccount(serviceAccount);

  const now = Math.floor(Date.now() / 1000);
  const tokenUri = serviceAccount.token_uri || "https://oauth2.googleapis.com/token";
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: tokenUri,
    iat: now,
    exp: now + 3600
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(serviceAccount.private_key);
  const assertion = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });

  const json = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Không lấy được Google access token.");
  }

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + Number(json.expires_in || 3600) * 1000
  };
  return cachedToken.token;
}
