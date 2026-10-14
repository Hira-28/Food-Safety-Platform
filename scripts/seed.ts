import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { restaurants } from "@/lib/db/schema";
import { mockRestaurants } from "@/lib/mock-data";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log(`Seeding ${mockRestaurants.length} restaurants...`);
  let inserted = 0;
  let updated = 0;

  for (const r of mockRestaurants) {
    const [existingRestaurant] = await db
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.name, r.name))
      .limit(1);

    const values = {
      name: r.name,
      location: r.location,
      categories: r.categories,
      searchTerms: r.searchTerms,
      rating: 0,
      reviewCount: 0,
      openNow: r.openNow,
      imageUrl: r.imageUrl,
    };

    if (existingRestaurant) {
      await db
        .update(restaurants)
        .set(values)
        .where(eq(restaurants.id, existingRestaurant.id));
      updated += 1;
    } else {
      await db.insert(restaurants).values(values);
      inserted += 1;
    }
  }

  console.log(`Done — ${inserted} inserted, ${updated} updated.`);
  process.exit(0);
}

seed();