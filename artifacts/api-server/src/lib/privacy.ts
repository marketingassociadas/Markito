import { pool } from "@workspace/db";

export const retentionPolicy = {
  conversationDays: 90,
  auditDays: 365,
  automaticDeletion: false,
  basis: "Última mensagem ou criação da conversa quando vazia",
};

export async function initializePrivacy(client: Pick<typeof pool, "query">) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS markito_privacy_proofs (
      code_hash text PRIMARY KEY, owner_hash text NOT NULL, expires_at timestamptz NOT NULL
    );
    CREATE INDEX IF NOT EXISTS markito_privacy_proofs_owner ON markito_privacy_proofs(owner_hash);
    CREATE TABLE IF NOT EXISTS markito_privacy_audit (
      id bigserial PRIMARY KEY, actor text NOT NULL, action text NOT NULL,
      conversation_id integer, verification text NOT NULL, reference text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS markito_privacy_audit_date ON markito_privacy_audit(created_at);
  `);
}
