import assert from "node:assert/strict";
import { pool } from "@workspace/db";
import { hash } from "./lib/security";

type Request = (path: string, method?: string, cookie?: string, body?: unknown) => Promise<Response>;
export async function testPrivacy(request: Request, admin: string, owner: string, id: number, reference: string, ids: number[]) {
  const proofHashes: string[] = [];
  try {
  const actionPath = "/api/admin/privacy/action";
  const action = (extra: Record<string, unknown> = {}) => ({
    conversationId: id, action: "access", verification: "session", reference,
    confirmation: `ACESSAR ${id}`, ...extra,
  });
  const proof = async (cookie = owner) => {
    const res = await request("/api/privacy/proof", "POST", cookie);
    assert.equal(res.status, 201);
    const code = (await res.json() as { code: string }).code;
    proofHashes.push(hash(code));
    return code;
  };
  assert.equal((await request("/api/admin/privacy")).status, 401);
  assert.equal((await request(actionPath, "POST", "", action())).status, 401);
  assert.equal((await request(actionPath, "POST", admin, action({ conversationId: -1 }))).status, 400);
  assert.equal((await request(actionPath, "POST", admin, action({ conversationId: 1.5, confirmation: "ACESSAR 1.5" }))).status, 400);
  assert.equal((await request(actionPath, "POST", admin, action({ confirmation: "" }))).status, 400);
  const wrongCode = await proof("");
  assert.equal((await request(actionPath, "POST", admin, action({ code: wrongCode }))).status, 403);
  const code = await proof();
  const responses = await Promise.all([
    request(actionPath, "POST", admin, action({ code })),
    request(actionPath, "POST", admin, action({ code })),
  ]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 403]);
  const exportCode = await proof();
  const exported = await request(actionPath, "POST", admin, action({ code: exportCode, action: "export", confirmation: `EXPORTAR ${id}` }));
  assert.equal(exported.status, 200);
  const data = await exported.json() as { conversation: { id: number }; messages: unknown[] };
  assert.equal(data.conversation.id, id);
  assert(Array.isArray(data.messages));
  const expiringCode = await proof();
  await pool.query("UPDATE markito_privacy_proofs SET expires_at=now()-interval '1 minute' WHERE code_hash=$1", [hash(expiringCode)]);
  assert.equal((await request(actionPath, "POST", admin, action({ code: expiringCode }))).status, 403);
  // Legacy conversations remain unclaimed, even with a valid code from a new browser.
  const legacy = (await pool.query("INSERT INTO conversations(title) VALUES ('LGPD test legacy') RETURNING id")).rows[0].id;
  ids.push(legacy);
  const legacyAction = action({ conversationId: legacy, confirmation: `ACESSAR ${legacy}`, code: wrongCode });
  assert.equal((await request(actionPath, "POST", admin, legacyAction)).status, 403);
  assert.equal((await request(actionPath, "POST", admin, { ...legacyAction, verification: "independent" })).status, 403);
  assert.equal((await request(actionPath, "POST", admin, { ...legacyAction, verification: "independent", independentVerified: true })).status, 200);
  assert.equal((await pool.query("SELECT 1 FROM markito_conversation_owners WHERE conversation_id=$1", [legacy])).rowCount, 0);
  assert.equal((await request(`/api/openai/conversations/${legacy}`, "GET", owner)).status, 404);
  const deletion = action({ action: "delete", verification: "retention", confirmation: `EXCLUIR ${id}` });
  assert.equal((await request(actionPath, "POST", admin, deletion)).status, 409);
  await pool.query("UPDATE conversations SET created_at=now()-interval '91 days' WHERE id=$1", [id]);
  await pool.query("INSERT INTO messages(conversation_id,role,content) VALUES ($1,'user','test recent activity')", [id]);
  assert.equal((await request(actionPath, "POST", admin, deletion)).status, 409);
  await pool.query("UPDATE messages SET created_at=now()-interval '91 days' WHERE conversation_id=$1", [id]);
  const listing = await (await request("/api/admin/privacy", "GET", admin)).json() as { expired: { id: number }[] };
  assert(listing.expired.some(row => row.id === id));
  // No automatic deletion occurs merely by listing expired records.
  assert.equal((await pool.query("SELECT 1 FROM conversations WHERE id=$1", [id])).rowCount, 1);
  await pool.query("INSERT INTO markito_request_leases VALUES ($1,'test',now()+interval '1 minute')", [`conversation:${id}`]);
  assert.equal((await request(actionPath, "POST", admin, deletion)).status, 409);
  await pool.query("DELETE FROM markito_request_leases WHERE key=$1", [`conversation:${id}`]);
  assert.equal((await request(actionPath, "POST", admin, deletion)).status, 200);
  assert.equal((await pool.query("SELECT 1 FROM conversations WHERE id=$1", [id])).rowCount, 0);
  assert.equal((await pool.query("SELECT 1 FROM messages WHERE conversation_id=$1", [id])).rowCount, 0);
  assert.equal((await pool.query("SELECT 1 FROM markito_conversation_owners WHERE conversation_id=$1", [id])).rowCount, 0);
  assert.equal((await pool.query("SELECT 1 FROM markito_privacy_audit WHERE conversation_id=$1 AND action='delete' AND reference=$2", [id, reference])).rowCount, 1);
  assert.equal((await request(actionPath, "POST", admin, deletion)).status, 404);
  assert.equal((await request("/api/admin/privacy/purge-audit", "POST", admin, { confirmation: "wrong" })).status, 400);
  } finally {
    await pool.query("DELETE FROM markito_privacy_proofs WHERE code_hash=ANY($1::text[])", [proofHashes]);
  }
}
