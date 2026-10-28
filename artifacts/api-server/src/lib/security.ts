import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { RequestHandler, Request, Response } from "express";
import { pool } from "@workspace/db";
import { initializePrivacy } from "./privacy";

const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
export const sessionSecret = secret;
const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/api" };
export const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));
}
export function adminConfigured() {
  return adminConfigurationIssue() === null;
}
// Report validation outcomes only: never log credentials or their lengths.
export function adminConfigurationIssue() {
  if (!process.env.ADMIN_USERNAME) return "ADMIN_USERNAME_MISSING";
  if (!process.env.ADMIN_PASSWORD) return "ADMIN_PASSWORD_MISSING";
  if (process.env.ADMIN_PASSWORD.length < 16) return "ADMIN_PASSWORD_BELOW_MINIMUM";
  return null;
}
function credentialVersion() {
  return createHmac("sha256", sessionSecret)
    .update(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).digest("hex");
}

// Additive, idempotent bootstrap: deploys do not depend on a manual production push.
export async function initializeSecurity() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(74028319)");
    await client.query(`
    CREATE TABLE IF NOT EXISTS markito_conversation_owners (
      conversation_id integer PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
      owner_hash text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS markito_owner_idx ON markito_conversation_owners(owner_hash);
    CREATE TABLE IF NOT EXISTS markito_admin_sessions (
      token_hash text PRIMARY KEY, credential_version text NOT NULL,
      expires_at timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS markito_rate_limits (
      key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS markito_request_leases (
      key text PRIMARY KEY, token text NOT NULL, expires_at timestamptz NOT NULL
    );
  `);
    await initializePrivacy(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}
export const browserSession: RequestHandler = (req, res, next) => {
  let id = req.signedCookies?.markito_session;
  if (typeof id !== "string" || !/^[a-f0-9]{64}$/.test(id)) {
    id = randomBytes(32).toString("hex");
    res.cookie("markito_session", id, { ...cookieOptions, signed: true, maxAge: 86400000 });
  }
  res.locals.ownerHash = hash(id);
  next();
};
export const requireConversation: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({ error: "ID inválido" }); return;
  }
  const result = await pool.query(
    "SELECT 1 FROM markito_conversation_owners WHERE conversation_id=$1 AND owner_hash=$2",
    [id, res.locals.ownerHash],
  );
  if (!result.rowCount) { res.status(404).json({ error: "Conversa não encontrada nesta sessão" }); return; }
  next();
};
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.markito_admin;
  if (!adminConfigured() || typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    res.status(401).json({ error: "Não autorizado" }); return;
  }
  const found = await pool.query(
    "SELECT 1 FROM markito_admin_sessions WHERE token_hash=$1 AND credential_version=$2 AND expires_at > now()",
    [hash(token), credentialVersion()],
  );
  if (!found.rowCount) { res.status(401).json({ error: "Sessão expirada" }); return; }
  next();
};
export async function startAdminSession(req: Request, res: Response) {
  await endAdminSession(req, res);
  const token = randomBytes(32).toString("hex");
  await pool.query(
    "INSERT INTO markito_admin_sessions VALUES ($1,$2,now() + interval '2 hours')",
    [hash(token), credentialVersion()],
  );
  res.cookie("markito_admin", token, { ...cookieOptions, maxAge: 7200000 });
}
export async function endAdminSession(req: Request, res: Response) {
  if (typeof req.cookies?.markito_admin === "string") {
    await pool.query("DELETE FROM markito_admin_sessions WHERE token_hash=$1", [hash(req.cookies.markito_admin)]);
  }
  res.clearCookie("markito_admin", cookieOptions);
}

export function rateLimit(name: string, max: number, seconds: number, scope: "ip" | "session" | "global" = "ip"): RequestHandler {
  return async (req, res, next) => {
    const subject = scope === "global" ? "all" : scope === "session" ? res.locals.ownerHash : hash(req.ip ?? "unknown");
    const key = `${name}:${subject}`;
    const result = await pool.query(
      `INSERT INTO markito_rate_limits AS r VALUES ($1,1,now()+$2*interval '1 second')
       ON CONFLICT (key) DO UPDATE SET
       count=CASE WHEN r.expires_at<=now() THEN 1 ELSE r.count+1 END,
       expires_at=CASE WHEN r.expires_at<=now() THEN EXCLUDED.expires_at ELSE r.expires_at END
       RETURNING count`, [key, seconds],
    );
    if (result.rows[0].count > max) {
      res.setHeader("Retry-After", String(seconds));
      res.status(429).json({ error: "Limite de uso atingido. Aguarde alguns minutos e tente novamente." }); return;
    }
    next();
  };
}

export const messageLease: RequestHandler = async (req, res, next) => {
  const token = randomBytes(16).toString("hex");
  const acquire = async (key: string) => (await pool.query(
    `INSERT INTO markito_request_leases AS l VALUES ($1,$2,now()+interval '120 seconds')
     ON CONFLICT (key) DO UPDATE SET token=EXCLUDED.token,expires_at=EXCLUDED.expires_at
     WHERE l.expires_at<=now() RETURNING key`, [key, token],
  )).rowCount;
  const release = () => pool.query("DELETE FROM markito_request_leases WHERE token=$1", [token]);
  if (!await acquire(`conversation:${req.params.id}`)) {
    res.status(429).json({ error: "Aguarde a resposta anterior." }); return;
  }
  let slot = false;
  try {
    for (let i = 0; i < 5; i++) { if (await acquire(`global:${i}`)) { slot = true; break; } }
    if (!slot) {
      await release();
      res.status(429).json({ error: "Muitas perguntas em andamento. Tente novamente em instantes." }); return;
    }
  } catch (error) { await release(); throw error; }
  res.locals.releaseLease = release;
  next();
};

export const originGuard: RequestHandler = (req, res, next) => {
  const origins = (process.env.ALLOWED_ORIGINS ?? "").split(",").filter(Boolean);
  if (process.env.NODE_ENV !== "production" && process.env.REPLIT_DEV_DOMAIN) {
    origins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }
  const origin = req.get("origin");
  if ((origin && !origins.includes(origin)) || (!origin && req.get("sec-fetch-site") === "cross-site")) {
    res.status(403).json({ error: "Origem não autorizada" }); return;
  }
  // State-changing browser calls require an explicit trusted origin, including logout.
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && !origin) {
    res.status(403).json({ error: "Origem obrigatória" }); return;
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.vary("Origin");
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204); return;
  }
  res.setHeader("Cache-Control", "no-store");
  next();
};

export async function cleanupSecurity() {
  await pool.query("DELETE FROM markito_admin_sessions WHERE expires_at < now()");
  await pool.query("DELETE FROM markito_rate_limits WHERE expires_at < now()");
  await pool.query("DELETE FROM markito_request_leases WHERE expires_at < now()");
}
