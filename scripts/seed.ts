import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { restaurants } from "@/lib/db/schema";
import { mockRestaurants } from "@/lib/mock-data";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding restaurants...");
  for (const r of mockRestaurants) {
    await db.insert(restaurants).values({
      name: r.name,
      location: r.location,
      categories: r.categories,
      rating: r.rating,
      reviewCount: r.reviewCount,
      openNow: r.openNow,
      hasActiveComplaint: r.hasActiveComplaint,
      imageUrl: r.imageUrl,
    });
  }
  console.log("Done — 5 restaurants inserted.");
  process.exit(0);
}

seed();