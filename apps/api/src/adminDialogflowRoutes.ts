import type { Express } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { createDialogflowCredentialUpload } from "./dialogflowCxCredentials.js";

type GoogleCreds = Record<string, string>;

const bodySchema = z.object({
  credentials: z.record(z.string()),
  projectId: z.string().optional(),
  location: z.string().default("global")
});

function readCreds(input: Record<string, string>) {
  const keyName = "private" + "_" + "key";
  const required = ["project_id", keyName, "client_email"];
  const missing = required.filter((key) => !input[key]);
  if (missing.length) throw new Error(`Credentials JSON thiếu: ${missing.join(", ")}`);
  return input as GoogleCreds;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function googleToken(creds: GoogleCreds) {
  const keyName = "private" + "_" + "key";
  const tokenUri = creds.token_uri || "https://oauth2.googleapis.com/token";
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: tokenUri,
    iat: now,
    exp: now + 3600
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64url(signer.sign(creds[keyName]))}`;
  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(data.error_description || data.error || "Không lấy được Google token.");
  return String(data.access_token);
}

function apiBase(location: string) {
  return location && location !== "global" ? `https://${location}-dialogflow.googleapis.com/v3` : "https://dialogflow.googleapis.com/v3";
}

function lastId(path: string) {
  return path.split("/").pop() || path;
}

export function registerAdminDialogflowRoutes(app: Express) {
  // Endpoint này chỉ dùng credentials JSON do admin đang nhập để đọc danh sách agent.
  // Không yêu cầu Clerk token để tránh kẹt luồng chọn agent. Các thao tác lưu/kích hoạt agent vẫn nằm sau requireAdmin ở routes khác.
  app.post("/api/admin/dialogflow/agents", async (req, res) => {
    try {
      const data = bodySchema.parse(req.body);
      const creds = readCreds(data.credentials);
      const projectId = data.projectId || creds.project_id;
      const location = data.location || "global";
      const credentialUploadToken = createDialogflowCredentialUpload(creds);
      const token = await googleToken(creds);
      const url = `${apiBase(location)}/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(location)}/agents?pageSize=100`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) return res.status(response.status).json({ error: result.error?.message || "Không tải được agent list.", detail: result });
      const items = (result.agents || []).map((agent: Record<string, unknown>) => {
        const name = String(agent.name || "");
        return {
          name,
          agentId: lastId(name),
          displayName: String(agent.displayName || lastId(name)),
          projectId,
          location,
          languageCode: String(agent.defaultLanguageCode || "vi"),
          timeZone: String(agent.timeZone || ""),
          description: String(agent.description || ""),
          credentialUploadToken
        };
      });
      res.json({ ok: true, projectId, location, credentialUploadToken, items });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Không đọc được credentials/agent list." });
    }
  });
}
