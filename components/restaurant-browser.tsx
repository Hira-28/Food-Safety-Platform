"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, MapPin, Search, ShieldCheck, Utensils } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { Restaurant, FoodCategory } from "@/lib/types";

type RestaurantWithReportCount = Restaurant & { reportCount: number };

const ALL_CATEGORIES: FoodCategory[] = [
  "Bengali",
  "Fast Food",
  "Chinese",
  "Cafe",
  "Street Food",
  "Bakery",
];

const HERO_PHRASES = ["feeling good", "feeling safe", "knowing more"];

function RotatingHeroPhrase() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setPhraseIndex((currentIndex) => (currentIndex + 1) % HERO_PHRASES.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      key={HERO_PHRASES[phraseIndex]}
      aria-live="off"
      className="home-headline__part home-rotating-phrase text-[#D7F36B]"
    >
      {HERO_PHRASES[phraseIndex]}
    </span>
  );
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function RestaurantBrowser({
  restaurants,
}: {
  restaurants: RestaurantWithReportCount[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(
    null
  );

  const filteredRestaurants = useMemo(() => {
    const queryWords = normalizeSearchText(search).split(/\s+/).filter(Boolean);

    return restaurants.filter((r) => {
      const searchableWords = [
        r.name,
        r.location,
        ...r.categories,
        ...r.searchTerms,
      ]
        .flatMap((value) => normalizeSearchText(value).split(/\s+/))
        .filter(Boolean);
      const matchesSearch = queryWords.every((queryWord) =>
        searchableWords.some((word) => word.includes(queryWord))
      );
      const matchesCategory =
        !activeCategory || r.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, restaurants]);

  const topHotels = useMemo(
    () =>
      [...restaurants]
        .filter((restaurant) => restaurant.rating > 0)
        .sort(
          (a, b) =>
            b.rating - a.rating ||
            a.reportCount - b.reportCount ||
            b.reviewCount - a.reviewCount
        )
        .slice(0, 3),
    [restaurants]
  );

  const openCount = restaurants.filter((restaurant) => restaurant.openNow).length;
  const reviewedCount = restaurants.filter(
    (restaurant) => restaurant.hasActiveComplaint
  ).length;

  return (
    <>
      <section className="home-hero relative isolate overflow-hidden rounded-[2rem] bg-[#172B23] shadow-[0_24px_70px_rgba(23,43,35,0.2)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_40%,rgba(215,243,107,0.20),transparent_42%),linear-gradient(110deg,#172B23_0%,#203B2E_55%,#34533D_100%)]" />
        <div className="grid min-h-[430px] grid-cols-1 items-center lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <div className="home-hero-copy px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
            <span className="home-reveal home-reveal--badge inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-[#D7F36B]">
              <ShieldCheck size={14} aria-hidden="true" />
              Student-powered food safety
            </span>
            <h1 className="home-headline mt-6 max-w-2xl font-display text-4xl leading-[1.07] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="home-headline__part home-headline__part--one">
                Good food starts with
              </span>{" "}
              <RotatingHeroPhrase />{" "}
              <span className="home-headline__part home-headline__part--three">
                about where you eat.
              </span>
            </h1>
            <p className="home-reveal home-reveal--supporting mt-5 max-w-lg text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
              Find campus favorites, check what students are saying, and help
              make every meal a safer one.
            </p>
            <div className="home-hero-actions mt-7 flex flex-wrap gap-3">
              <a
                href="#restaurant-list"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D7F36B] px-5 py-3 text-sm font-bold text-[#172B23] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#E3FA8B]"
              >
                Explore restaurants <ArrowDown size={16} aria-hidden="true" />
              </a>
              <Link
                href="/reports/new"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Share a report <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-hero-stats mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-5">
              <div>
                <p className="font-display text-2xl text-white">
                  {restaurants.length}
                </p>
                <p className="mt-0.5 text-xs text-white/50">Places to explore</p>
              </div>
              <div>
                <p className="font-display text-2xl text-white">{openCount}</p>
                <p className="mt-0.5 text-xs text-white/50">Open now</p>
              </div>
              <div>
                <p className="font-display text-2xl text-white">
                  {reviewedCount}
                </p>
                <p className="mt-0.5 text-xs text-white/50">With open reports</p>
              </div>
            </div>
          </div>
          <div className="home-hero-image relative h-[260px] p-3 sm:h-[340px] sm:p-5 lg:h-full lg:min-h-[500px]">
            <div className="absolute inset-3 overflow-hidden rounded-[1.5rem] bg-[#263B30] sm:inset-5">
              <Image
                src="/hotels/dhaka.jpeg"
                alt="Dhaka Hotel and Restaurant"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="home-hero-image__photo object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172B23]/80 via-[#172B23]/5 to-[#172B23]/10" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[#172B23]/55 p-4 text-white backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[#D7F36B]">
                  <MapPin size={15} aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Your campus, your community
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl">
                  Make every meal a more confident choice.
                </p>
              </div>
            </div>
            <div className="home-hero-float absolute right-1 top-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#D7F36B] text-[#172B23] shadow-xl">
              <Utensils size={22} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="top-hotels-heading" className="pt-12 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
              Community favorites
            </p>
            <h2
              id="top-hotels-heading"
              className="mt-1 font-display text-3xl tracking-tight text-[#172B23] sm:text-4xl"
            >
              Top Hotels
            </h2>
            <p className="mt-2 text-sm text-[#718078]">
              Ranked by rating, with fewer public safety reports as the tie-breaker.
            </p>
          </div>
        </div>

        {topHotels.length ? (
          <div className="home-card-stagger mt-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {topHotels.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{
                  ...restaurant,
                  imageUrl: restaurant.imageUrl ?? "",
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-[#DCE5DC] bg-white px-5 py-8 text-center text-sm text-[#718078]">
            Top hotels will appear here as students add ratings.
          </p>
        )}
      </section>

      <section id="restaurant-list" className="scroll-mt-8 pt-12 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2F6F4E]">
              Find your next favorite
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight text-[#172B23] sm:text-4xl">
              Explore restaurants
            </h2>
          </div>
          <p className="text-sm text-[#718078]">
            {filteredRestaurants.length}{" "}
            {filteredRestaurants.length === 1 ? "place" : "places"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#E3EAE2] bg-white p-4 shadow-[0_8px_30px_rgba(23,43,35,0.045)] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-sm">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#89958C]"
            />
            <input
              type="search"
              placeholder="Search in English, বাংলা, or Banglish..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#E3EAE2] bg-[#F8FAF7] py-3 pl-11 pr-4 text-sm text-[#1C2B24] outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
            />
          </label>
          <div
            aria-label="Filter by cuisine"
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:pb-0"
          >
            {[null, ...ALL_CATEGORIES].map((category) => {
              const label = category ?? "All cuisines";
              const isActive = activeCategory === category;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#203B2E] text-white shadow-sm"
                      : "bg-[#F1F5EF] text-[#627067] hover:bg-[#E5EDE3] hover:text-[#263B30]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredRestaurants.length ? (
          <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{
                  ...restaurant,
                  imageUrl: restaurant.imageUrl ?? "",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-3xl border border-dashed border-[#DCE5DC] bg-white px-5 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4E9] text-[#2F6F4E]">
              <Search size={21} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-xl text-[#263B30]">
              No matches just yet
            </h3>
            <p className="mt-1 text-sm text-[#718078]">
              Try another name or choose a different cuisine.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
              className="mt-4 text-sm font-semibold text-[#2F6F4E] hover:text-[#214F38]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}