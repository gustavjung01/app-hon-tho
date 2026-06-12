import type { Express } from "express";
import { z } from "zod";
import { query } from "./db.js";
import { requireAuth, type AuthedRequest } from "./auth.js";

const TU_TRU_APP_KEY = "tu_tru";
const TU_TRU_SOURCE_TYPE = "engine.client.tutru";
const TU_TRU_ENGINE_VERSION = 2;

const tuTruAppRunSchema = z.object({
  input: z.record(z.unknown()),
  result: z.record(z.unknown()),
  contentLayer: z.record(z.unknown()).optional(),
  title: z.string().trim().min(1).max(180).optional()
});

type TuTruAppRunRow = {
  id: string;
  user_id: string;
  app_key: string;
  source_type: string;
  input_json: unknown;
  result_json: unknown;
  created_at: string;
};

function requireNonEmptyObject(value: Record<string, unknown>, fieldName: string) {
  if (Object.keys(value).length === 0) {
    throw new Error(`${fieldName} không được rỗng.`);
  }
}

function buildResultJson(data: z.infer<typeof tuTruAppRunSchema>) {
  return {
    app: TU_TRU_APP_KEY,
    appKey: TU_TRU_APP_KEY,
    sourceType: TU_TRU_SOURCE_TYPE,
    engine: "client-tu-tru-engine",
    engineVersion: TU_TRU_ENGINE_VERSION,
    title: data.title || "Mệnh bàn Tứ Trụ",
    chart: data.result,
    contentLayer: data.contentLayer || null,
    guardrails: {
      engineIsSourceOfTruth: true,
      aiMustNotRecalculateChart: true,
      aiMustSayMissingData: true
    },
    savedAt: new Date().toISOString()
  };
}

export function registerTuTruRoutes(app: Express) {
  app.post(["/api/nguthuat/tutru/app-runs", "/nguthuat/tutru/app-runs"], requireAuth, async (req: AuthedRequest, res) => {
    const data = tuTruAppRunSchema.parse(req.body);
    requireNonEmptyObject(data.input, "input");
    requireNonEmptyObject(data.result, "result");

    const inputJson = {
      ...data.input,
      appKey: TU_TRU_APP_KEY,
      sourceType: TU_TRU_SOURCE_TYPE,
      engineVersion: TU_TRU_ENGINE_VERSION
    };
    const resultJson = buildResultJson(data);

    const rows = await query<TuTruAppRunRow>(
      `INSERT INTO app_runs(user_id, app_key, source_type, input_json, result_json)
       VALUES($1, $2, $3, $4::jsonb, $5::jsonb)
       RETURNING id, user_id, app_key, source_type, input_json, result_json, created_at`,
      [req.user!.id, TU_TRU_APP_KEY, TU_TRU_SOURCE_TYPE, JSON.stringify(inputJson), JSON.stringify(resultJson)]
    );

    await query(
      `INSERT INTO app_usage_logs(user_id, app_key, action, credit_cost, metadata)
       VALUES($1, $2, 'save_app_run', 0, $3::jsonb)`,
      [
        req.user!.id,
        TU_TRU_APP_KEY,
        JSON.stringify({
          appRunId: rows[0]?.id,
          sourceType: TU_TRU_SOURCE_TYPE,
          engineVersion: TU_TRU_ENGINE_VERSION,
          title: resultJson.title
        })
      ]
    );

    res.status(201).json({ appRun: rows[0] });
  });
}
