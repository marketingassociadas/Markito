import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminAccessLog = pgTable("admin_access_log", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  accessedAt: timestamp("accessed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertAdminAccessLogSchema = createInsertSchema(adminAccessLog).omit({
  id: true,
  accessedAt: true,
});

export type AdminAccessLog = typeof adminAccessLog.$inferSelect;
export type InsertAdminAccessLog = z.infer<typeof insertAdminAccessLogSchema>;
