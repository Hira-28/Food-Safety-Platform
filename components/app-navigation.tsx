"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Compass, Plus } from "lucide-react";

const links = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/reports/new", label: "Report an issue", icon: Plus },
  { href: "/reports/mine", label: "My reports", icon: ClipboardList },
];

export function AppNavigation({
  isSignedIn,
  className = "",
}: {
  isSignedIn: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className={`flex w-full min-w-0 items-center justify-around gap-1 overflow-x-auto py-2 ${className}`}
    >
      {links.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/restaurants")
            : pathname === href || pathname.startsWith(`${href}/`);
        const isDisabled =
          (href === "/reports/new" || href === "/reports/mine") && !isSignedIn;

        return (
          <Link
            key={href}
            href={isDisabled ? "/auth/signin" : href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-colors sm:min-w-0 sm:flex-initial sm:flex-row sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
              isActive
                ? "text-[#2F6F4E]"
                : "text-[#738078] hover:bg-[#F1F5EF] hover:text-[#263B30]"
            }`}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
