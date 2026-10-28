import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const suggestionClicks = pgTable("suggestion_clicks", {
  id: serial("id").primaryKey(),
  suggestionText: text("suggestion_text").notNull(),
  clickedAt: timestamp("clicked_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSuggestionClickSchema = createInsertSchema(suggestionClicks).omit({
  id: true,
  clickedAt: true,
});

export type SuggestionClick = typeof suggestionClicks.$inferSelect;
export type InsertSuggestionClick = z.infer<typeof insertSuggestionClickSchema>;
