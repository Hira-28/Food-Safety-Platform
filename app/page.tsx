import { db } from "@/lib/db";
import { and, count, eq, avg, inArray, ne } from "drizzle-orm";
import { restaurants, reviews, reports } from "@/lib/db/schema";
import { PUBLIC_STATUSES } from "@/lib/report-status";
import { RestaurantBrowser } from "@/components/restaurant-browser";

export default async function HomePage() {
  const [restaurantRows, reportRows] = await Promise.all([
    db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        location: restaurants.location,
        categories: restaurants.categories,
        searchTerms: restaurants.searchTerms,
        openNow: restaurants.openNow,
        hasActiveComplaint: restaurants.hasActiveComplaint,
        imageUrl: restaurants.imageUrl,
        createdAt: restaurants.createdAt,
        rating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(restaurants)
      .leftJoin(reviews, eq(reviews.restaurantId, restaurants.id))
      .groupBy(restaurants.id),
    db
      .select({
        restaurantId: reports.restaurantId,
        reportCount: count(reports.id),
      })
      .from(reports)
      .where(
        and(
          inArray(reports.status, PUBLIC_STATUSES),
          ne(reports.type, "positive")
        )
      )
      .groupBy(reports.restaurantId),
  ]);

  const reportCounts = new Map(
    reportRows.map((report) => [report.restaurantId, report.reportCount])
  );

  const allRestaurants = restaurantRows.map((restaurant) => ({
    ...restaurant,
    rating: Number(restaurant.rating ?? 0),
    reportCount: reportCounts.get(restaurant.id) ?? 0,
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <RestaurantBrowser restaurants={allRestaurants} />
    </main>
  );
}