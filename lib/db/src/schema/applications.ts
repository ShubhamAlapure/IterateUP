import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { profilesTable } from "./profiles";

export const applicationsTable = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profilesTable.id, { onDelete: "cascade" })
    .notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("Saved"), // Saved | Applied | Assessment | Interview | Offer | Rejected
  salary: text("salary"),
  location: text("location"),
  appliedDate: timestamp("applied_date", { withTimezone: true }),
  nextAction: text("next_action"),
  nextActionDate: timestamp("next_action_date", { withTimezone: true }),
  notes: text("notes"),
  applicationUrl: text("application_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable);
export const selectApplicationSchema = createSelectSchema(applicationsTable);

export type Application = typeof applicationsTable.$inferSelect;
export type InsertApplication = typeof applicationsTable.$inferInsert;
