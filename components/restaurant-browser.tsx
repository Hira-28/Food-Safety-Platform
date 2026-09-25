"use client";

import { useState, useMemo } from "react";
import { RestaurantCard } from "@/components/restaurant-card";
import { Restaurant, FoodCategory } from "@/lib/types";

const ALL_CATEGORIES: FoodCategory[] = [
  "Bengali",
  "Fast Food",
  "Chinese",
  "Cafe",
  "Street Food",
  "Bakery",
];

export function RestaurantBrowser({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(
    null
  );

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch = r.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        !activeCategory || r.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, restaurants]);

  return (
    <>
      <div className="max-w-xl mb-10">
        <h1 className="font-display text-4xl sm:text-5xl leading-tight text-[#1C2B24]">
          Eat smart around campus.
        </h1>
        <p className="mt-3 text-[#1C2B24]/70 text-lg">
          Real reports from students, before the food gets to you.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-full border border-[#1C2B24]/15 bg-white px-5 py-3 text-[#1C2B24] placeholder:text-[#1C2B24]/40 focus:outline-none focus:border-[#2F6F4E] transition-colors"
      />

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 mb-10 border-b border-[#1C2B24]/10 pb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-sm pb-1 border-b-2 transition-colors ${
            activeCategory === null
              ? "border-[#2F6F4E] text-[#1C2B24]"
              : "border-transparent text-[#1C2B24]/50 hover:text-[#1C2B24]"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm pb-1 border-b-2 transition-colors ${
              activeCategory === cat
                ? "border-[#2F6F4E] text-[#1C2B24]"
                : "border-transparent text-[#1C2B24]/50 hover:text-[#1C2B24]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={{ ...restaurant, imageUrl: restaurant.imageUrl ?? "" }}
          />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <p className="text-center text-[#1C2B24]/50 mt-12">
          No restaurants match your search.
        </p>
      )}
    </>
  );
}