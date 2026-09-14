import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey(), // Matches Supabase auth.users id
  email: text("email").notNull(),
  fullName: text("full_name").notNull().default(""),
  avatarUrl: text("avatar_url"),
  college: text("college"),
  degree: text("degree"),
  yearOfStudy: text("year_of_study"),
  cgpa: text("cgpa"),
  location: text("location"),
  bio: text("bio"),
  targetRole: text("target_role"),
  targetCompanies: text("target_companies").array(),
  preferredLocations: text("preferred_locations").array(),
  resumeUrl: text("resume_url"),
  resumeName: text("resume_name"),
  githubUsername: text("github_username"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  readinessScore: integer("readiness_score").default(60),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable);
export const selectProfileSchema = createSelectSchema(profilesTable);

export type Profile = typeof profilesTable.$inferSelect;
export type InsertProfile = typeof profilesTable.$inferInsert;
