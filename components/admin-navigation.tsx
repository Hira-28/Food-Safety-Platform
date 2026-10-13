"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ClipboardList, LayoutDashboard, Utensils } from "lucide-react";

const navigationItems = [
  { href: "/admin", label: "Review queue", icon: ClipboardList },
  { href: "/", label: "Restaurant directory", icon: Utensils },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/10 bg-[#172B23] text-white md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0 md:border-b-0 md:border-r md:border-r-white/10">
      <div className="hidden border-b border-white/10 px-6 py-7 md:block">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
          <LayoutDashboard size={21} aria-hidden="true" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Workspace
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight">Operations</p>
      </div>

      <nav
        aria-label="Admin navigation"
        className="flex gap-2 overflow-x-auto p-3 md:flex-col md:gap-1 md:overflow-visible md:p-4"
      >
        <p className="hidden px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 md:block">
          Menu
        </p>
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname.startsWith("/admin")
              : pathname === "/" || pathname.startsWith("/restaurants");

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-[#D7F36B] shadow-inner shadow-white/5"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#D7F36B] md:block" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-5 mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:block">
        <div className="flex items-center gap-2 text-[#D7F36B]">
          <span className="h-2 w-2 rounded-full bg-[#D7F36B]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
            Staff workspace
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/55">
          Review student reports and keep every decision documented.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition-colors hover:text-[#D7F36B]"
        >
          Public directory <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
