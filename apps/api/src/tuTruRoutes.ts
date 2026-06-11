import type { Express } from "express";
import { z } from "zod";
import { query } from "./db.js";
import { requireAuth, type AuthedRequest } from "./auth.js";

const tuTruAppRunSchema = z.object({
  input: z.record(z.unknown()),
  result: z.record(z.unknown()),
  contentLayer: z.record(z.unknown()).optional(),
  title: z.string().max(180).optional()
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

function buildResultJson(data: z.infer<typeof tuTruAppRunSchema>) {
  return {
    app: "tu_tru",
    engine: "client-tu-tru-engine",
    title: data.title || "Mệnh bàn Tứ Trụ",
    chart: data.result,
    contentLayer: data.contentLayer || null,
    savedAt: new Date().toISOString()
  };
}

export function registerTuTruRoutes(app: Express) {
  app.post(["/api/nguthuat/tutru/app-runs", "/nguthuat/tutru/app-runs"], requireAuth, async (req: AuthedRequest, res) => {
    const data = tuTruAppRunSchema.parse(req.body);
    const inputJson = data.input;
    const resultJson = buildResultJson(data);

    const rows = await query<TuTruAppRunRow>(
      `INSERT INTO app_runs(user_id, app_key, source_type, input_json, result_json)
       VALUES($1, 'tu_tru', 'engine.client.tutru', $2::jsonb, $3::jsonb)
       RETURNING id, user_id, app_key, source_type, input_json, result_json, created_at`,
      [req.user!.id, JSON.stringify(inputJson), JSON.stringify(resultJson)]
    );

    await query(
      `INSERT INTO app_usage_logs(user_id, app_key, action, credit_cost, metadata)
       VALUES($1, 'tu_tru', 'save_app_run', 0, $2::jsonb)`,
      [req.user!.id, JSON.stringify({ appRunId: rows[0]?.id, sourceType: "engine.client.tutru" })]
    );

    res.status(201).json({ appRun: rows[0] });
  });
}
