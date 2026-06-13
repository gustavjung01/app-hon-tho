-- Keep only one active AI agent per app_key, then enforce it at the database level.
-- The winner is the newest/highest-version active agent for each app.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (PARTITION BY app_key ORDER BY version DESC, created_at DESC, id DESC) AS rn
  FROM ai_agents
  WHERE status = 'active'
)
UPDATE ai_agents
SET status = 'disabled', updated_at = now()
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

CREATE UNIQUE INDEX IF NOT EXISTS ai_agents_one_active_per_app_idx
ON ai_agents(app_key)
WHERE status = 'active';
