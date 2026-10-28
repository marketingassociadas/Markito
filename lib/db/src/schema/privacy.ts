import { pgTable, text, integer, bigserial, timestamp, index } from "drizzle-orm/pg-core";

export const privacyProofs = pgTable("markito_privacy_proofs", {
  codeHash: text("code_hash").primaryKey(),
  ownerHash: text("owner_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, table => [index("markito_privacy_proofs_owner").on(table.ownerHash)]);

// Deliberately no FK: minimal audit must survive conversation deletion.
export const privacyAudit = pgTable("markito_privacy_audit", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  conversationId: integer("conversation_id"),
  verification: text("verification").notNull(),
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, table => [index("markito_privacy_audit_date").on(table.createdAt)]);
