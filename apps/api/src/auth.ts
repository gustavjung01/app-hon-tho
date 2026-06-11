import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";
import { query } from "./db.js";

export type UserRole = "super_admin" | "admin" | "operator" | "reviewer" | "user";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string | null; role: UserRole; clerkUserId?: string | null };
}

type DbUser = { id: string; email: string | null; role: UserRole; clerk_user_id: string | null };

type ClerkPayload = {
  sub?: string;
  email?: string;
  primary_email_address?: string;
  email_address?: string;
  [key: string]: unknown;
};

function listEnv(name: string) {
  return (process.env[name] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isBootstrappedAdmin(clerkUserId: string, email: string | null) {
  const adminIds = listEnv("ADMIN_CLERK_USER_IDS");
  const adminEmails = listEnv("ADMIN_EMAILS").map((item) => item.toLowerCase());
  return adminIds.includes(clerkUserId) || (email ? adminEmails.includes(email.toLowerCase()) : false);
}

export function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

async function syncClerkUser(clerkUserId: string, email: string | null): Promise<DbUser> {
  const desiredRole: UserRole = isBootstrappedAdmin(clerkUserId, email) ? "super_admin" : "user";
  const existing = await query<DbUser>(
    `SELECT id, email, role, clerk_user_id FROM users WHERE clerk_user_id=$1 OR ($2::text IS NOT NULL AND email=$2) LIMIT 1`,
    [clerkUserId, email]
  );

  if (existing[0]) {
    const role = existing[0].role === "user" && desiredRole !== "user" ? desiredRole : existing[0].role;
    const rows = await query<DbUser>(
      `UPDATE users
       SET clerk_user_id=COALESCE(clerk_user_id, $1),
           email=COALESCE(email, $2),
           role=$3,
           updated_at=now()
       WHERE id=$4
       RETURNING id, email, role, clerk_user_id`,
      [clerkUserId, email, role, existing[0].id]
    );
    return rows[0];
  }

  const rows = await query<DbUser>(
    `INSERT INTO users(clerk_user_id, email, role, status)
     VALUES($1, $2, $3, 'active')
     RETURNING id, email, role, clerk_user_id`,
    [clerkUserId, email, desiredRole]
  );

  await query(`INSERT INTO credit_balances(user_id, balance) VALUES($1, 0) ON CONFLICT (user_id) DO NOTHING`, [rows[0].id]);
  return rows[0];
}

async function tryClerkAuth(req: AuthedRequest) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const header = req.headers.authorization;
  if (!secretKey || !header?.startsWith("Bearer ")) return false;

  const token = header.slice("Bearer ".length);
  const payload = (await verifyToken(token, { secretKey })) as ClerkPayload;
  if (!payload.sub) return false;

  const email = (payload.email || payload.primary_email_address || payload.email_address || null) as string | null;
  const user = await syncClerkUser(payload.sub, email);
  req.user = { id: user.id, email: user.email, role: user.role, clerkUserId: user.clerk_user_id };
  return true;
}

function tryLegacyJwtAuth(req: AuthedRequest) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice("Bearer ".length);
  const user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as { id: string; email: string; role: UserRole };
  req.user = { id: user.id, email: user.email, role: user.role };
  return true;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (await tryClerkAuth(req)) return next();
    if (tryLegacyJwtAuth(req)) return next();
    return res.status(401).json({ error: "Chưa đăng nhập." });
  } catch {
    return res.status(401).json({ error: "Phiên đăng nhập không hợp lệ." });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (!role || !["super_admin", "admin", "operator", "reviewer"].includes(role)) {
    return res.status(403).json({ error: "Chỉ admin được thao tác." });
  }
  next();
}

export function requireSuperAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "super_admin") return res.status(403).json({ error: "Chỉ super admin được thao tác." });
  next();
}

export async function register(email: string, password: string, displayName?: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await query<{ id: string; email: string; role: UserRole }>(
    `INSERT INTO users(email, password_hash, display_name)
     VALUES($1, $2, $3)
     RETURNING id, email, role`,
    [email.toLowerCase(), passwordHash, displayName || null]
  );
  await query(`INSERT INTO credit_balances(user_id, balance) VALUES($1, 0) ON CONFLICT (user_id) DO NOTHING`, [rows[0].id]);
  return rows[0];
}

export async function login(email: string, password: string) {
  const rows = await query<{ id: string; email: string; role: UserRole; password_hash: string | null }>(
    `SELECT id, email, role, password_hash FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user?.password_hash) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, role: user.role };
}
