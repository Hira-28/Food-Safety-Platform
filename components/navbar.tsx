import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#1C2B24]/10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-[#1C2B24]">
          Campus Eats
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-[#1C2B24]/70">
          <Link href="/" className="hover:text-[#1C2B24] transition-colors">
            Restaurants
          </Link>
          <Link
            href="/reports/new"
            className="hover:text-[#1C2B24] transition-colors"
          >
            Report an Issue
          </Link>
          <Link
            href="/reports/mine"
            className="hover:text-[#1C2B24] transition-colors"
          >
            My Reports
          </Link>
        </nav>

        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-[#1C2B24]/70 hover:text-[#1C2B24] transition-colors"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/auth/signin"
            className="rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-4 py-2 hover:bg-[#255a3f] transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}