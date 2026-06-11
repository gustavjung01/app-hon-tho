# Hồn Thơ Admin API

Phase 1 dựng nền admin:

- Node/Express API trong `apps/api`
- Neon/Postgres qua `DATABASE_URL`
- Clerk server-side auth qua `CLERK_SECRET_KEY`
- DB tables: `users`, `apps`, `ai_agents`, `conversations`, `messages`
- thêm các bảng nền: `app_runs`, `tool_runs`, `usage_ledger`, `audit_logs`, `credit_*`
- static admin shell ở `/admin/`

## Local

```bash
cd apps/api
cp .env.example .env
npm install
npm run migrate
npm run build
npm run dev
```

Không commit `.env`. Đặt Neon URL thật ở `.env`.

## Env tối thiểu

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
CLERK_SECRET_KEY=sk_test_xxx
ADMIN_CLERK_USER_IDS=user_xxx
```

`ADMIN_CLERK_USER_IDS` dùng để bootstrap super admin khi user đầu tiên gọi `/api/auth/sync` bằng Clerk token.

## Admin shell

Sau khi build `apps/web`, mở:

```text
/admin/
```

Admin shell hiện là khung quản trị Phase 1. Nó kiểm API health và overview. UI login Clerk đầy đủ sẽ nối ở phase sau hoặc dùng token Clerk từ app login hiện có.

## API chính

```text
GET  /api/health
GET  /api/auth/me
POST /api/auth/sync
GET  /api/admin/overview
GET  /api/admin/users
GET  /api/admin/apps
GET  /api/admin/ai-agents
GET  /api/admin/conversations
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

Phase 1 chỉ lưu conversation/message. Chưa gọi AI.
