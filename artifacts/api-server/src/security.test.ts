import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import app from "./app";
import { pool } from "@workspace/db";
import { initializeSecurity, hash, rateLimit } from "./lib/security";
import { testPrivacy } from "./privacy.test";

// Isolated test-process credentials, never stored in workspace settings.
process.env.ADMIN_USERNAME = `test-${randomBytes(8).toString("hex")}`;
process.env.ADMIN_PASSWORD = randomBytes(32).toString("hex");
process.env.ALLOWED_ORIGINS = "https://test.markito.invalid";
await initializeSecurity();
const rateKey = `regression-${randomBytes(8).toString("hex")}`;
app.get("/test-limit", rateLimit(rateKey, 2, 60, "global"), (_req, res) => res.json({ ok: true }));
const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
assert(address && typeof address !== "string");
const base = `http://127.0.0.1:${address.port}`;
const ids: number[] = [];
let adminCookie = "";
async function request(path: string, method = "GET", cookie = "", body?: unknown, origin = "https://test.markito.invalid") {
  return fetch(`${base}${path}`, {
    method, headers: { Origin: origin, Cookie: cookie, "Content-Type": "application/json", "User-Agent": rateKey },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const cookies = (res: Response) => res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
try {
  assert.equal((await request("/api/admin/me")).status, 401);
  assert.equal((await request("/api/openai/conversations", "POST", "", { title: "test" }, "https://evil.invalid")).status, 403);
  assert.equal((await request("/api/openai/conversations", "POST", "", { title: "" })).status, 400);
  const created = await request("/api/openai/conversations", "POST", "", { title: "Security regression test" });
  assert.equal(created.status, 201);
  const id = ((await created.json()) as { id: number }).id;
  ids.push(id);
  const owner = cookies(created);
  assert.match(created.headers.get("set-cookie") ?? "", /HttpOnly/);
  assert.match(created.headers.get("set-cookie") ?? "", /Secure/);
  assert.equal((await request(`/api/openai/conversations/${id}`, "GET", owner)).status, 200);
  assert.equal((await request(`/api/openai/conversations/${id}`)).status, 404);
  assert.equal((await request(`/api/openai/conversations/${id}`, "DELETE")).status, 404);
  assert.equal((await request(`/api/openai/conversations/${id}/messages`, "POST", "", { content: "test" })).status, 404);
  const otherList = await (await request("/api/openai/conversations")).json() as { id: number }[];
  assert(!otherList.some((row: { id: number }) => row.id === id));
  assert.equal((await request(`/api/openai/conversations/${id}/messages`, "POST", owner, { content: "x".repeat(4001) })).status, 400);
  const login = await request("/api/admin/login", "POST", "", {
    username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD,
  });
  assert.equal(login.status, 200);
  assert.equal(((await login.json()) as { token?: string }).token, undefined);
  adminCookie = cookies(login).split("; ").filter((c) => c.startsWith("markito_admin=")).at(-1)!;
  assert.equal((await request("/api/admin/me", "GET", adminCookie)).status, 200);
  await testPrivacy(request, adminCookie, owner, id, rateKey, ids);
  const tokenHash = hash(adminCookie.split("=")[1]);
  await pool.query("UPDATE markito_admin_sessions SET expires_at=now()-interval '1 second' WHERE token_hash=$1", [tokenHash]);
  assert.equal((await request("/api/admin/me", "GET", adminCookie)).status, 401);
  await pool.query("UPDATE markito_admin_sessions SET expires_at=now()+interval '1 hour' WHERE token_hash=$1", [tokenHash]);
  assert.equal((await request("/api/admin/logout", "POST", adminCookie)).status, 200);
  assert.equal((await request("/api/admin/me", "GET", adminCookie)).status, 401);
  assert.equal((await request("/test-limit")).status, 200);
  assert.equal((await request("/test-limit")).status, 200);
  assert.equal((await request("/test-limit")).status, 429);
  const csrf = await fetch(`${base}/api/admin/logout`, { method: "POST" });
  assert.equal(csrf.status, 403);
  process.env.ADMIN_PASSWORD = "";
  assert.equal((await request("/api/admin/login", "POST", "", { username: "x", password: "x" })).status, 503);
  console.log("PASS: ownership, CSRF, admin sessions, limits, LGPD access/export/delete, single-use/expired proofs, legacy isolation, retention and audit");
} finally {
  await pool.query("DELETE FROM markito_privacy_proofs WHERE owner_hash IN (SELECT owner_hash FROM markito_conversation_owners WHERE conversation_id=ANY($1::integer[]))", [ids]);
  await pool.query("DELETE FROM markito_privacy_audit WHERE reference=$1", [rateKey]);
  await pool.query("DELETE FROM markito_request_leases WHERE key=ANY($1::text[])", [ids.map(id => `conversation:${id}`)]);
  await pool.query("DELETE FROM conversations WHERE id=ANY($1::integer[])", [ids]);
  await pool.query("DELETE FROM markito_rate_limits WHERE key LIKE $1 OR key LIKE $2", [`${rateKey}:%`, "%:" + hash("127.0.0.1")]);
  await pool.query("DELETE FROM markito_admin_sessions WHERE token_hash=$1", [hash(adminCookie.split("=")[1] ?? "")]);
  await pool.query("DELETE FROM admin_access_log WHERE user_agent=$1", [rateKey]);
  server.close();
  await pool.end();
}
