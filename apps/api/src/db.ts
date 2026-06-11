import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const pool = new pg.Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
      }
    : {
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT || 5432),
        database: process.env.POSTGRES_DB || "hontho_app",
        user: process.env.POSTGRES_USER || "hontho",
        password: process.env.POSTGRES_PASSWORD || "change_me"
      }
);

export async function query<T = unknown>(text: string, params: unknown[] = []) {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function closePool() {
  await pool.end();
}
