CREATE TABLE IF NOT EXISTS ai_agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  app_key text REFERENCES apps(key) ON DELETE SET NULL,
  agent_id uuid REFERENCES ai_agents(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'openai',
  model text NOT NULL,
  status text NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'skipped')),
  request_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  response_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  token_input integer NOT NULL DEFAULT 0,
  token_output integer NOT NULL DEFAULT 0,
  cost numeric(12,6) NOT NULL DEFAULT 0,
  latency_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS ai_run_id uuid REFERENCES ai_agent_runs(id) ON DELETE SET NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS provider text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS provider_response_id text;

ALTER TABLE ai_agents ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'openai';
ALTER TABLE ai_agents ADD COLUMN IF NOT EXISTS allowed_data jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE ai_agents
SET allowed_data = CASE app_key
  WHEN 'tu_tru' THEN '["app_runs.result_json", "tu_tru_chart", "major_luck"]'::jsonb
  WHEN 'mai_hoa' THEN '["app_runs.result_json", "hexagram"]'::jsonb
  WHEN 'y_hoc' THEN '["app_runs.result_json", "seasonal_health"]'::jsonb
  ELSE allowed_data
END
WHERE allowed_data = '[]'::jsonb;

CREATE INDEX IF NOT EXISTS ai_agent_runs_conversation_idx ON ai_agent_runs(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_agent_runs_agent_idx ON ai_agent_runs(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_ai_run_idx ON messages(ai_run_id) WHERE ai_run_id IS NOT NULL;
