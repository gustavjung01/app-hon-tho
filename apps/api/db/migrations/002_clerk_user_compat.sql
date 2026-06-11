ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_user_id_uidx ON users(clerk_user_id) WHERE clerk_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uidx ON users(lower(email)) WHERE email IS NOT NULL;

ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS provider_message_id text;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS error text;
