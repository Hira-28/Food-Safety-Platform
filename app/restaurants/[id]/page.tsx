import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id));

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="text-sm text-[#1C2B24]/60 hover:text-[#1C2B24] transition-colors"
      >
        ← Back to restaurants
      </Link>

      <div className="relative aspect-[16/9] mt-4 rounded-2xl overflow-hidden">
        <Image
          src={restaurant.imageUrl ?? ""}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-white">
          <span className="text-[#E8A33D]">★</span>
          <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
          <span className="text-white/70 text-sm">
            ({restaurant.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="font-display text-3xl text-[#1C2B24]">
          {restaurant.name}
        </h1>
        <p className="text-[#1C2B24]/60 mt-1">{restaurant.location}</p>

        <div className="flex items-center gap-2 mt-3 text-sm text-[#1C2B24]/70">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              restaurant.openNow ? "bg-[#2F6F4E]" : "bg-[#1C2B24]/20"
            }`}
          />
          <span>{restaurant.openNow ? "Open now" : "Closed"}</span>
          <span className="text-[#1C2B24]/30">·</span>
          <span>{restaurant.categories.join(", ")}</span>
        </div>

        {restaurant.hasActiveComplaint && (
          <div className="mt-4 rounded-xl border border-[#B54E3D]/30 bg-[#B54E3D]/5 px-4 py-3">
            <p className="text-sm text-[#B54E3D]">
              A report on this restaurant is currently under review by the
              proctorial team. This does not confirm the issue — it means
              it&apos;s being looked into.
            </p>
          </div>
        )}

        <Link
          href={`/reports/new?restaurant=${restaurant.id}`}
          className="inline-block mt-6 rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#255a3f] transition-colors"
        >
          Report an issue here
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-[#1C2B24]/10">
        <h2 className="font-display text-xl text-[#1C2B24] mb-4">
          Recent Feedback
        </h2>
        <p className="text-[#1C2B24]/50 text-sm">
          No reports yet for this restaurant. Be the first to share your
          experience.
        </p>
      </div>
    </main>
  );
}