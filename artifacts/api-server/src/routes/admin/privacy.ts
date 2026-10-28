import { Router } from "express";
import { pool } from "@workspace/db";
import { ExecutePrivacyActionBody, PurgeExpiredPrivacyAuditBody } from "@workspace/api-zod";
import { hash, requireAdmin, rateLimit } from "../../lib/security";
import { retentionPolicy } from "../../lib/privacy";

const router = Router();
router.use(requireAdmin);
router.get("/", async (_req, res) => {
  const [expired, audit, count] = await Promise.all([
    pool.query(`SELECT c.id, COALESCE(MAX(m.created_at),c.created_at) AS last_activity
      FROM conversations c LEFT JOIN messages m ON m.conversation_id=c.id
      GROUP BY c.id HAVING COALESCE(MAX(m.created_at),c.created_at) <= now()-interval '90 days'
      ORDER BY last_activity LIMIT 100`),
    pool.query("SELECT * FROM markito_privacy_audit ORDER BY id DESC LIMIT 100"),
    pool.query("SELECT count(*)::int AS count FROM markito_privacy_audit WHERE created_at <= now()-interval '365 days'"),
  ]);
  res.json({ policy: retentionPolicy, expired: expired.rows, audit: audit.rows, expiredAuditCount: count.rows[0].count });
});

router.post("/action", rateLimit("privacy-admin", 30, 900), async (req, res) => {
  const parsed = ExecutePrivacyActionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Dados inválidos." }); return; }
  const input = parsed.data;
  const { conversationId: id, action, verification, reference } = input;
  const confirmation = `${action === "delete" ? "EXCLUIR" : action === "export" ? "EXPORTAR" : "ACESSAR"} ${id}`;
  if (!Number.isSafeInteger(id) || input.confirmation !== confirmation || !/^[A-Za-z0-9._/-]{5,120}$/.test(reference)) {
    res.status(400).json({ error: "Confirme a operação e informe apenas o protocolo alfanumérico, sem dados pessoais." }); return;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Serialize administrative operations and block concurrent message inserts through the FK.
    const conv = await client.query("SELECT id,title,created_at FROM conversations WHERE id=$1 FOR UPDATE", [id]);
    if (!conv.rowCount) { await client.query("ROLLBACK"); res.status(404).json({ error: "Conversa não encontrada." }); return; }
    if (action === "delete") {
      const active = await client.query("SELECT 1 FROM markito_request_leases WHERE key=$1 AND expires_at>now()", [`conversation:${id}`]);
      if (active.rowCount) { await client.query("ROLLBACK"); res.status(409).json({ error: "Conversa em uso. Aguarde a resposta terminar." }); return; }
    }
    if (verification === "session") {
      const proof = await client.query(`DELETE FROM markito_privacy_proofs p
        USING markito_conversation_owners o WHERE p.code_hash=$1 AND p.expires_at>now()
        AND o.owner_hash=p.owner_hash AND o.conversation_id=$2 RETURNING p.code_hash`, [hash(input.code ?? ""), id]);
      if (!proof.rowCount) { await client.query("ROLLBACK"); res.status(403).json({ error: "Código inválido, utilizado, expirado ou sem vínculo com esta conversa." }); return; }
    } else if (verification === "independent") {
      if (input.independentVerified !== true) {
        await client.query("ROLLBACK"); res.status(403).json({ error: "Comprovação independente documentada obrigatória. Um ID não comprova titularidade." }); return;
      }
    } else {
      const expired = await client.query(`SELECT 1 FROM conversations c WHERE c.id=$1
        AND COALESCE((SELECT MAX(created_at) FROM messages WHERE conversation_id=c.id),c.created_at)
        <= now()-interval '90 days'`, [id]);
      if (action !== "delete" || !expired.rowCount) {
        await client.query("ROLLBACK"); res.status(409).json({ error: "Retenção só permite excluir conversas vencidas há 90 dias." }); return;
      }
    }
    const msgs = action === "delete" ? [] : (await client.query(
      "SELECT id,role,content,created_at FROM messages WHERE conversation_id=$1 ORDER BY created_at,id", [id],
    )).rows;
    // Audit and mutation commit together; never record message text or proof codes.
    await client.query(`INSERT INTO markito_privacy_audit
      (actor,action,conversation_id,verification,reference) VALUES ($1,$2,$3,$4,$5)`,
    [process.env.ADMIN_USERNAME, action, id, verification, reference]);
    if (action === "delete") await client.query("DELETE FROM conversations WHERE id=$1", [id]);
    await client.query("COMMIT");
    res.json(action === "delete" ? { ok: true, conversationId: id } : {
      conversation: conv.rows[0], messages: msgs, exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    req.log.error({ err: error }, "Privacy operation failed");
    res.status(500).json({ error: "Operação não concluída. Nenhuma alteração foi confirmada." });
  } finally { client.release(); }
});

router.post("/purge-audit", async (req, res) => {
  if (!PurgeExpiredPrivacyAuditBody.safeParse(req.body).success) {
    res.status(400).json({ error: "Confirmação obrigatória." }); return;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const deleted = await client.query("DELETE FROM markito_privacy_audit WHERE created_at <= now()-interval '365 days'");
    await client.query(`INSERT INTO markito_privacy_audit (actor,action,verification,reference)
      VALUES ($1,'purge-audit','retention',$2)`, [process.env.ADMIN_USERNAME, `removed-${deleted.rowCount}`]);
    await client.query("COMMIT");
    res.json({ removed: deleted.rowCount });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
});
export default router;
