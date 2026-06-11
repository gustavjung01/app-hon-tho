CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  secret_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_settings_updated_idx ON admin_settings(updated_at DESC);

INSERT INTO admin_settings(key, value_json, secret_json)
VALUES (
  'ai_provider',
  jsonb_build_object(
    'provider', COALESCE(NULLIF(current_setting('app.ai_provider', true), ''), 'stub'),
    'baseUrl', 'https://api.openai.com/v1/chat/completions',
    'model', 'gpt-4.1-mini',
    'costInputPer1K', 0,
    'costOutputPer1K', 0,
    'enabled', false
  ),
  '{}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
