import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { query } from "./db.js";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Chưa đăng nhập." });
    const token = header.slice("Bearer ".length);
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as AuthedRequest["user"];
    next();
  } catch {
    return res.status(401).json({ error: "Phiên đăng nhập không hợp lệ." });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Chỉ admin được thao tác." });
  next();
}

export async function register(email: string, password: string, displayName?: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await query<{ id: string; email: string; role: string }>(
    `INSERT INTO users(email, password_hash, display_name)
     VALUES($1, $2, $3)
     RETURNING id, email, role`,
    [email.toLowerCase(), passwordHash, displayName || null]
  );
  await query(`INSERT INTO credit_balances(user_id, balance) VALUES($1, 0)`, [rows[0].id]);
  return rows[0];
}

export async function login(email: string, password: string) {
  const rows = await query<{ id: string; email: string; role: string; password_hash: string }>(
    `SELECT id, email, role, password_hash FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, role: user.role };
}
