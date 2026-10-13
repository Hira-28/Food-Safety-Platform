import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { RestaurantBrowser } from "@/components/restaurant-browser";

export default async function HomePage() {
  const allRestaurants = await db.select().from(restaurants);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <RestaurantBrowser restaurants={allRestaurants} />
    </main>
  );
}