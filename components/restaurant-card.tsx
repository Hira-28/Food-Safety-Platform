import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { normalizePublicImageUrl } from "@/lib/utils";
type Restaurant = {
  id: string | number;
  imageUrl: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  openNow: boolean;
  categories: string[];
  hasActiveComplaint?: boolean;
};

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group block overflow-hidden rounded-3xl border border-[#E3EAE2] bg-white shadow-[0_6px_24px_rgba(23,43,35,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9D8CA] hover:shadow-[0_18px_38px_rgba(23,43,35,0.11)]"
    >
      <div className="relative aspect-[1.55] overflow-hidden bg-[#E8EEE6]">
        <Image
          src={normalizePublicImageUrl(restaurant.imageUrl)}
          alt={restaurant.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12241C]/35 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md ${
              restaurant.openNow
                ? "border-white/30 bg-white/90 text-[#2F6F4E]"
                : "border-white/25 bg-[#172B23]/75 text-white"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                restaurant.openNow ? "bg-[#2F6F4E]" : "bg-white/60"
              }`}
            />
            {restaurant.openNow ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#172B23]/65 px-3 py-1.5 text-sm text-white backdrop-blur-md">
          <span className="text-[#F4C95D]">★</span>
          <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
          <span className="text-xs text-white/65">
            ({restaurant.reviewCount} reviews)
          </span>
        </div>
        <span className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#D7F36B] text-[#172B23] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl leading-snug text-[#20342A]">
              {restaurant.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#718078]">
              <MapPin size={14} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{restaurant.location}</span>
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {restaurant.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="rounded-full bg-[#F2F5F1] px-2.5 py-1 text-[11px] font-medium text-[#66736A]"
            >
              {category}
            </span>
          ))}
        </div>
        {restaurant.hasActiveComplaint && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-[#F0D9C9] bg-[#FFF8F2] px-3 py-2 text-xs leading-5 text-[#9A6039]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#D78D51]" />
            Open student report
          </p>
        )}
      </div>
    </Link>
  );
}