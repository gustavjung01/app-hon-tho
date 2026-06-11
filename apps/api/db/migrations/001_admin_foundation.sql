CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE,
  email text UNIQUE,
  password_hash text,
  display_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'operator', 'reviewer', 'user')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'deleted')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_user_id_uidx ON users(clerk_user_id) WHERE clerk_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uidx ON users(lower(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS credit_balances (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount integer NOT NULL,
  note text,
  ref_id uuid,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_vnd integer NOT NULL,
  credit_amount integer NOT NULL,
  transfer_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  provider text,
  status text NOT NULL DEFAULT 'queued',
  provider_message_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  app_key text NOT NULL,
  action text NOT NULL,
  credit_cost integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS apps (
  key text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'disabled', 'archived')),
  description text,
  default_credit_cost integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_key text NOT NULL REFERENCES apps(key) ON DELETE CASCADE,
  name text NOT NULL,
  model text NOT NULL,
  system_prompt_key text NOT NULL,
  system_prompt text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'disabled', 'archived')),
  temperature numeric(3,2) NOT NULL DEFAULT 0.30,
  max_tokens integer NOT NULL DEFAULT 1200,
  allowed_tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(app_key, system_prompt_key, version)
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_key text NOT NULL REFERENCES apps(key) ON DELETE RESTRICT,
  agent_id uuid REFERENCES ai_agents(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Cuộc hội thoại mới',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived', 'flagged')),
  source_app_run_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'tool')),
  content text NOT NULL,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  token_input integer NOT NULL DEFAULT 0,
  token_output integer NOT NULL DEFAULT 0,
  cost numeric(12,6) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  app_key text NOT NULL REFERENCES apps(key) ON DELETE RESTRICT,
  source_type text NOT NULL DEFAULT 'engine',
  input_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tool_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  app_key text NOT NULL REFERENCES apps(key) ON DELETE RESTRICT,
  tool_name text NOT NULL,
  input_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'skipped')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  app_key text REFERENCES apps(key) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  tokens integer NOT NULL DEFAULT 0,
  cost numeric(12,6) NOT NULL DEFAULT 0,
  credits_delta integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS conversations_user_idx ON conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS conversations_app_idx ON conversations(app_key, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS ai_agents_app_idx ON ai_agents(app_key, status);
CREATE INDEX IF NOT EXISTS usage_ledger_user_idx ON usage_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs(actor_user_id, created_at DESC);

INSERT INTO apps(key, name, category, status, description, default_credit_cost)
VALUES
  ('tu_tru', 'Tứ Trụ', 'nguthuat.menh', 'active', 'Lập mệnh bàn Tứ Trụ và diễn giải có kiểm soát.', 1),
  ('mai_hoa', 'Mai Hoa Dịch Số', 'nguthuat.boc', 'draft', 'Lập quẻ và đọc tượng số theo Mai Hoa.', 1),
  ('y_hoc', 'Y học cổ học', 'nguthuat.y', 'draft', 'Dưỡng sinh, tiết khí, khí huyết và tham khảo y học cổ học.', 1),
  ('phong_thuy', 'Phong thủy an cư', 'nguthuat.son', 'draft', 'Bát trạch, hướng nhà và bố cục không gian.', 1),
  ('ky_mon', 'Kỳ Môn', 'tamthuc', 'draft', 'Kỳ Môn Độn Giáp theo cục bàn thời không.', 1),
  ('thai_at', 'Thái Ất', 'tamthuc', 'draft', 'Thái Ất Thần Số.', 1),
  ('luc_nham', 'Lục Nhâm', 'tamthuc', 'draft', 'Đại Lục Nhâm.', 1)
ON CONFLICT (key) DO UPDATE SET
  name=EXCLUDED.name,
  category=EXCLUDED.category,
  description=EXCLUDED.description,
  updated_at=now();

INSERT INTO ai_agents(app_key, name, model, system_prompt_key, system_prompt, version, status, temperature, max_tokens, allowed_tools)
VALUES
  ('tu_tru', 'Tứ Trụ Agent', 'gpt-4.1-mini', 'tu_tru_v1', 'Bạn là agent Tứ Trụ của Cổ học. Chỉ diễn giải dựa trên dữ liệu engine đã lưu. Không tự bịa dụng thần, vượng suy, lưu niên khi engine chưa cung cấp.', 1, 'active', 0.25, 1600, '["read_tu_tru_chart", "read_major_luck"]'::jsonb),
  ('mai_hoa', 'Mai Hoa Agent', 'gpt-4.1-mini', 'mai_hoa_v1', 'Bạn là agent Mai Hoa. Chỉ đọc quẻ và hào từ dữ liệu engine đã lưu, không phán đoán cực đoan.', 1, 'draft', 0.30, 1400, '["read_hexagram", "read_changed_hexagram"]'::jsonb),
  ('y_hoc', 'Y học cổ học Agent', 'gpt-4.1-mini', 'y_hoc_v1', 'Bạn là agent Y học cổ học. Chỉ cung cấp thông tin tham khảo, không chẩn đoán hoặc thay thế bác sĩ.', 1, 'draft', 0.20, 1400, '["read_seasonal_health", "lookup_terms"]'::jsonb)
ON CONFLICT (app_key, system_prompt_key, version) DO UPDATE SET
  name=EXCLUDED.name,
  model=EXCLUDED.model,
  system_prompt=EXCLUDED.system_prompt,
  status=EXCLUDED.status,
  allowed_tools=EXCLUDED.allowed_tools,
  updated_at=now();
