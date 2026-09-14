import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { profilesTable } from "./profiles";

export const studentSkillsTable = pgTable("student_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profilesTable.id, { onDelete: "cascade" })
    .notNull(),
  skillName: text("skill_name").notNull(),
  category: text("category").notNull(),
  currentLevel: integer("current_level").default(1).notNull(), // 1 to 5
  targetLevel: integer("target_level").default(4).notNull(), // 1 to 5
  priority: text("priority").default("Medium"), // High | Medium | Low
  evidence: text("evidence"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSkillSchema = createInsertSchema(studentSkillsTable);
export const selectSkillSchema = createSelectSchema(studentSkillsTable);

export type StudentSkill = typeof studentSkillsTable.$inferSelect;
export type InsertStudentSkill = typeof studentSkillsTable.$inferInsert;
