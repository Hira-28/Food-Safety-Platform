import { pgTable, pgEnum, uuid, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  categories: text("categories").array().notNull(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  openNow: boolean("open_now").notNull().default(true),
  hasActiveComplaint: boolean("has_active_complaint").notNull().default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reportTypeEnum = pgEnum("report_type", [
  "contamination",
  "insects",
  "spoiled_food",
  "bad_smell_taste",
  "hygiene",
  "cleanliness",
  "poor_quality",
  "service",
  "pricing",
  "positive",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "submitted",
  "under_review",
  "requires_info",
  "verified",
  "unverified",
  "resolved",
  "action_taken",
  "closed",
]);

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id),
  type: reportTypeEnum("type").notNull(),
  description: text("description").notNull(),
  status: reportStatusEnum("status").notNull().default("submitted"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});