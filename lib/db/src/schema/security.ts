import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { conversations } from "./conversations";

export const conversationOwners = pgTable("markito_conversation_owners", {
  conversationId: integer("conversation_id").primaryKey().references(() => conversations.id, { onDelete: "cascade" }),
  ownerHash: text("owner_hash").notNull(),
}, (table) => [index("markito_owner_idx").on(table.ownerHash)]);
export const adminSessions = pgTable("markito_admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  credentialVersion: text("credential_version").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const rateLimits = pgTable("markito_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const requestLeases = pgTable("markito_request_leases", {
  key: text("key").primaryKey(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
