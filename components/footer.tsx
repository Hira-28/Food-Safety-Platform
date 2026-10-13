import Link from "next/link";
import { ArrowUpRight, UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E3EAE2] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172B23] text-[#D7F36B]">
            <UtensilsCrossed size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg text-[#20342A]">Campus Eats</p>
            <p className="mt-0.5 text-sm text-[#718078]">
              Helping students eat safely, together.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EDF0EC] pt-5 text-xs text-[#87928A] md:border-0 md:pt-0">
          <p>Reports are reviewed by the university proctorial team.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-semibold text-[#2F6F4E] hover:text-[#214F38]"
          >
            Explore directory <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <p>&copy; {new Date().getFullYear()} Campus Eats.</p>
        </div>
      </div>
    </footer>
  );
}