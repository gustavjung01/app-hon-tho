ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at timestamptz;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_preview text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS message_count integer NOT NULL DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS closed_at timestamptz;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS archived_at timestamptz;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS visible_to_user boolean NOT NULL DEFAULT true;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sequence integer;

WITH ordered AS (
  SELECT
    id,
    row_number() OVER (PARTITION BY conversation_id ORDER BY created_at ASC, id ASC)::integer AS seq
  FROM messages
  WHERE sequence IS NULL
)
UPDATE messages m
SET sequence = ordered.seq
FROM ordered
WHERE m.id = ordered.id;

WITH stats AS (
  SELECT DISTINCT ON (conversation_id)
    conversation_id,
    count(*) OVER (PARTITION BY conversation_id)::integer AS cnt,
    created_at AS last_at,
    left(content, 180) AS preview
  FROM messages
  ORDER BY conversation_id, created_at DESC, id DESC
)
UPDATE conversations c
SET
  message_count = stats.cnt,
  last_message_at = stats.last_at,
  last_message_preview = stats.preview,
  updated_at = GREATEST(c.updated_at, stats.last_at)
FROM stats
WHERE c.id = stats.conversation_id;

CREATE INDEX IF NOT EXISTS conversations_status_idx ON conversations(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS conversations_user_app_status_idx ON conversations(user_id, app_key, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_sequence_idx ON messages(conversation_id, sequence ASC, created_at ASC);
CREATE INDEX IF NOT EXISTS messages_created_by_idx ON messages(created_by, created_at DESC);
