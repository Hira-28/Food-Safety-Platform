import { pgTable, uuid, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

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