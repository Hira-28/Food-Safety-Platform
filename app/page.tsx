import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { RestaurantBrowser } from "@/components/restaurant-browser";

export default async function HomePage() {
  const allRestaurants = await db.select().from(restaurants);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <RestaurantBrowser restaurants={allRestaurants} />
    </main>
  );
}