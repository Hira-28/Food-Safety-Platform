import Image from "next/image";

type Restaurant = {
  imageUrl: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  openNow: boolean;
  categories: string[];
  hasActiveComplaint: boolean;
};

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-sm text-white">
          <span className="text-[#E8A33D]">★</span>
          <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
          <span className="text-white/70">({restaurant.reviewCount})</span>
        </div>
      </div>

      <div className="pt-3 pb-4 border-b border-[#1C2B24]/10 group-hover:border-[#1C2B24]/25 transition-colors">
        <h3 className="font-display text-lg leading-snug text-[#1C2B24]">
          {restaurant.name}
        </h3>
        <p className="text-sm text-[#1C2B24]/60 mt-0.5">
          {restaurant.location}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-[#1C2B24]/70">
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
          <p className="text-sm text-[#B54E3D] mt-2">
            A report on this restaurant is under review
          </p>
        )}
      </div>
    </div>
  );
}