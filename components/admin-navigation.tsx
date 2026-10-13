"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const activeLinkClasses =
  "font-medium text-[#2F6F4E] hover:text-[#255a3f] transition-colors";
const inactiveLinkClasses =
  "text-[#1C2B24]/70 hover:text-[#1C2B24] transition-colors";

export function AdminNavigation() {
  const pathname = usePathname();
  const isQueueActive = pathname.startsWith("/admin");
  const isDirectoryActive =
    pathname === "/" || pathname.startsWith("/restaurants");

  return (
    <nav className="flex items-center gap-3 text-xs sm:gap-6 sm:text-sm">
      <Link
        href="/admin"
        aria-current={isQueueActive ? "page" : undefined}
        className={isQueueActive ? activeLinkClasses : inactiveLinkClasses}
      >
        <span className="sm:hidden">Queue</span>
        <span className="hidden sm:inline">Review queue</span>
      </Link>
      <Link
        href="/"
        aria-current={isDirectoryActive ? "page" : undefined}
        className={isDirectoryActive ? activeLinkClasses : inactiveLinkClasses}
      >
        <span className="sm:hidden">Directory</span>
        <span className="hidden sm:inline">Restaurant directory</span>
      </Link>
    </nav>
  );
}
