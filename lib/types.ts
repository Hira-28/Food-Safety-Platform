import { restaurants } from "@/lib/db/schema";

export type Restaurant = typeof restaurants.$inferSelect;

export type FoodCategory =
  | "Bengali"
  | "Fast Food"
  | "Chinese"
  | "Cafe"
  | "Street Food"
  | "Bakery";