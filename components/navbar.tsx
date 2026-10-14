import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { signOut } from "@/auth";
import { AppNavigation } from "@/components/app-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { currentUserRole } from "@/lib/auth-helpers";

export async function Navbar() {
  const role = await currentUserRole();
  const isOfficer = role === "officer" || role === "super_admin";

  return (
    <header className="sticky top-0 z-50 border-b border-[#1C2B24]/10 bg-white/90 backdrop-blur-sm">
      <div
        className={`mx-auto w-full px-4 sm:px-6 ${
          isOfficer ? "max-w-none md:px-8" : "max-w-7xl"
        }`}
      >
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href={isOfficer ? "/admin" : "/"}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#172B23] text-[#D7F36B] shadow-sm">
              <UtensilsCrossed size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-lg leading-5 text-[#1C2B24]">
                Campus Eats
              </span>
              <span className="hidden text-[10px] font-medium tracking-wide text-[#859188] sm:block">
                EAT WELL. FEEL SAFE.
              </span>
            </span>
          </Link>

          {!isOfficer && (
            <AppNavigation
              isSignedIn={Boolean(role)}
              className="hidden sm:flex"
            />
          )}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isOfficer && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#203B2E] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2F6F4E] sm:px-4 sm:text-sm"
              >
                <span>Review queue</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            )}
            {role ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-xl px-3 py-2.5 text-xs font-semibold text-[#66736A] transition hover:bg-[#F0F4EE] hover:text-[#1C2B24] sm:px-4 sm:text-sm"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-xl bg-[#203B2E] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2F6F4E] sm:px-5 sm:text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
          {!isOfficer && (
            <div className="-mx-4 min-w-0 border-t border-[#E8ECE7] px-2 sm:hidden">
              <AppNavigation isSignedIn={Boolean(role)} className="flex" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}