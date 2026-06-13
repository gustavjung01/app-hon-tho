import crypto from "node:crypto";
import { pool, query } from "./db.js";

type QueryClient = Pick<typeof pool, "query">;

export type DialogflowServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
  project_id?: string;
  [key: string]: unknown;
};

type SettingRow = {
  value_json: Record<string, unknown> | null;
  secret_json: Record<string, unknown> | null;
};

type UploadTicket = {
  credentials: DialogflowServiceAccount;
  expiresAt: number;
};

const uploadTickets = new Map<string, UploadTicket>();
const uploadTtlMs = 15 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordAt(value: unknown, key: string) {
  return isRecord(value) && isRecord(value[key]) ? (value[key] as Record<string, unknown>) : {};
}

function cleanExpiredTickets() {
  const now = Date.now();
  for (const [token, item] of uploadTickets.entries()) {
    if (item.expiresAt <= now) uploadTickets.delete(token);
  }
}

export function parseDialogflowServiceAccount(input: unknown): DialogflowServiceAccount {
  if (!isRecord(input)) throw new Error("Dialogflow credentials phải là JSON object service_account.");
  const clientEmail = text(input.client_email);
  const privateKey = text(input.private_key);
  if (!clientEmail || !privateKey) throw new Error("Credentials JSON thiếu: client_email, private_key");
  return {
    ...input,
    client_email: clientEmail,
    private_key: privateKey,
    token_uri: text(input.token_uri) || "https://oauth2.googleapis.com/token",
    project_id: text(input.project_id) || undefined
  };
}

export function createDialogflowCredentialUpload(input: unknown) {
  const credentials = parseDialogflowServiceAccount(input);
  cleanExpiredTickets();
  const token = crypto.randomBytes(24).toString("hex");
  uploadTickets.set(token, { credentials, expiresAt: Date.now() + uploadTtlMs });
  return token;
}

export function takeDialogflowCredentialUpload(token: unknown) {
  const value = text(token);
  if (!value) return null;
  cleanExpiredTickets();
  const item = uploadTickets.get(value);
  if (!item) return null;
  uploadTickets.delete(value);
  return item.credentials;
}

export function dialogflowCredentialRef(credentials: DialogflowServiceAccount) {
  const stable = `${credentials.project_id || "unknown"}:${credentials.client_email}`;
  return `sa_${crypto.createHash("sha256").update(stable).digest("hex").slice(0, 24)}`;
}

export function publicDialogflowCredential(credentials: DialogflowServiceAccount) {
  return {
    projectId: credentials.project_id || null,
    clientEmail: credentials.client_email,
    tokenUri: credentials.token_uri || "https://oauth2.googleapis.com/token",
    hasPrivateKey: true
  };
}

export function stripDialogflowSecretsFromImportedJson(importedJson: unknown) {
  if (!isRecord(importedJson)) return importedJson ?? null;
  const copy: Record<string, unknown> = { ...importedJson };
  const externalAgent = isRecord(copy.externalAgent) ? { ...copy.externalAgent } : null;
  if (externalAgent) {
    delete externalAgent.credentials;
    delete externalAgent.serviceAccount;
    delete externalAgent.credential;
    delete externalAgent.credentialUploadToken;
    copy.externalAgent = externalAgent;
  }
  delete copy.credentials;
  delete copy.serviceAccount;
  delete copy.dialogflowCredentials;
  delete copy.credentialUploadToken;
  return copy;
}

export function readCredentialInput(importedJson: unknown, explicitCredentials?: unknown) {
  if (explicitCredentials) return parseDialogflowServiceAccount(explicitCredentials);
  if (!isRecord(importedJson)) return null;
  const externalAgent = isRecord(importedJson.externalAgent) ? importedJson.externalAgent : {};
  const uploadToken = text(externalAgent.credentialUploadToken) || text(importedJson.credentialUploadToken);
  const uploaded = takeDialogflowCredentialUpload(uploadToken);
  if (uploaded) return uploaded;
  const candidates = [
    externalAgent.credentials,
    externalAgent.serviceAccount,
    recordAt(externalAgent.credential, "serviceAccount"),
    importedJson.credentials,
    importedJson.serviceAccount,
    importedJson.dialogflowCredentials
  ];
  for (const candidate of candidates) {
    if (candidate) return parseDialogflowServiceAccount(candidate);
  }
  return null;
}

export async function saveDialogflowCredentials(args: {
  client: QueryClient;
  appKey: string;
  agentPath?: string | null;
  credentials: DialogflowServiceAccount;
  updatedBy?: string | null;
}) {
  const credentialRef = dialogflowCredentialRef(args.credentials);
  const before = await args.client.query<SettingRow>(`SELECT value_json, secret_json FROM admin_settings WHERE key='dialogflow_cx' LIMIT 1`);
  const value = before.rows[0]?.value_json || {};
  const secret = before.rows[0]?.secret_json || {};
  const credentialsMap = recordAt(secret, "credentials");
  const byApp = recordAt(value, "byApp");
  const byAgentPath = recordAt(value, "byAgentPath");
  const credentialRefs = recordAt(value, "credentialRefs");
  const appKey = args.appKey.trim();
  const agentPath = text(args.agentPath);

  const nextSecret = {
    ...secret,
    credentials: {
      ...credentialsMap,
      [credentialRef]: args.credentials
    }
  };
  const nextValue = {
    ...value,
    provider: "dialogflow_cx",
    byApp: {
      ...byApp,
      [appKey]: credentialRef
    },
    byAgentPath: agentPath ? { ...byAgentPath, [agentPath]: credentialRef } : byAgentPath,
    credentialRefs: {
      ...credentialRefs,
      [credentialRef]: publicDialogflowCredential(args.credentials)
    },
    updatedAt: new Date().toISOString()
  };

  await args.client.query(
    `INSERT INTO admin_settings(key, value_json, secret_json, updated_by, updated_at)
     VALUES('dialogflow_cx', $1::jsonb, $2::jsonb, $3, now())
     ON CONFLICT (key) DO UPDATE SET
       value_json=EXCLUDED.value_json,
       secret_json=EXCLUDED.secret_json,
       updated_by=EXCLUDED.updated_by,
       updated_at=now()`,
    [JSON.stringify(nextValue), JSON.stringify(nextSecret), args.updatedBy || null]
  );

  return {
    credentialRef,
    publicCredential: publicDialogflowCredential(args.credentials)
  };
}

function serviceAccountFromSecret(secret: Record<string, unknown>, ref: unknown) {
  const refText = text(ref);
  if (!refText) return null;
  const credentials = recordAt(secret, "credentials")[refText];
  if (!credentials) return null;
  return parseDialogflowServiceAccount(credentials);
}

export async function loadDialogflowCredentialsForAgent(args: {
  appKey: string;
  agentPath?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const rows = await query<SettingRow>(`SELECT value_json, secret_json FROM admin_settings WHERE key='dialogflow_cx' LIMIT 1`);
  const value = rows[0]?.value_json || {};
  const secret = rows[0]?.secret_json || {};
  const metadata = args.metadata || {};
  const importedJson = isRecord(metadata.importedJson) ? metadata.importedJson : {};
  const agentPath = text(args.agentPath);
  const refs = [
    metadata.dialogflowCredentialRef,
    importedJson.dialogflowCredentialRef,
    agentPath ? recordAt(value, "byAgentPath")[agentPath] : null,
    recordAt(value, "byApp")[args.appKey],
    value.defaultCredentialRef
  ];

  for (const ref of refs) {
    const serviceAccount = serviceAccountFromSecret(secret, ref);
    if (serviceAccount) return serviceAccount;
  }

  const legacyByApp = recordAt(secret, "credentialsByApp")[args.appKey];
  if (legacyByApp) return parseDialogflowServiceAccount(legacyByApp);
  const legacyDefault = secret.serviceAccount || secret.credentials || secret.defaultCredentials;
  if (legacyDefault) return parseDialogflowServiceAccount(legacyDefault);
  return null;
}
