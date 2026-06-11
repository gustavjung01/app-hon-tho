CREATE TABLE IF NOT EXISTS ai_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_key text NOT NULL REFERENCES apps(key) ON DELETE CASCADE,
  prompt_key text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  archived_at timestamptz,
  UNIQUE(app_key, prompt_key, version)
);

ALTER TABLE ai_agents ADD COLUMN IF NOT EXISTS prompt_id uuid REFERENCES ai_prompts(id) ON DELETE SET NULL;

INSERT INTO ai_prompts(app_key, prompt_key, title, content, version, status, metadata, activated_at)
SELECT app_key,
       system_prompt_key,
       name || ' prompt v' || version,
       system_prompt,
       version,
       CASE WHEN status='active' THEN 'active' ELSE 'draft' END,
       jsonb_build_object('seededFromAgentId', id),
       CASE WHEN status='active' THEN now() ELSE NULL END
FROM ai_agents
ON CONFLICT (app_key, prompt_key, version) DO NOTHING;

UPDATE ai_agents a
SET prompt_id = p.id
FROM ai_prompts p
WHERE p.app_key = a.app_key
  AND p.prompt_key = a.system_prompt_key
  AND p.version = a.version
  AND a.prompt_id IS NULL;

CREATE INDEX IF NOT EXISTS ai_prompts_app_key_idx ON ai_prompts(app_key, prompt_key, version DESC);
CREATE INDEX IF NOT EXISTS ai_prompts_status_idx ON ai_prompts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_agent_runs_app_created_idx ON ai_agent_runs(app_key, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_agent_runs_status_created_idx ON ai_agent_runs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS usage_ledger_app_created_idx ON usage_ledger(app_key, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_created_idx ON audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_target_idx ON audit_logs(target_type, target_id, created_at DESC);
