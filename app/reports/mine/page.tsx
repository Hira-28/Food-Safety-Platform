import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { reports, restaurants } from "@/lib/db/schema";
import { REPORT_TYPES } from "@/lib/report-types";
import { REPORT_STATUSES, STATUS_TONE_CLASSES } from "@/lib/report-status";

export default async function MyReportsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const myReports = await db
    .select({
      id: reports.id,
      type: reports.type,
      description: reports.description,
      status: reports.status,
      createdAt: reports.createdAt,
      restaurantId: restaurants.id,
      restaurantName: restaurants.name,
    })
    .from(reports)
    .innerJoin(restaurants, eq(reports.restaurantId, restaurants.id))
    .where(eq(reports.studentId, session.user.id))
    .orderBy(desc(reports.createdAt));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-[#1C2B24] mb-2">My Reports</h1>
      <p className="text-[#1C2B24]/60 mb-8">
        Track the reports you&apos;ve submitted and see how each one is
        progressing.
      </p>

      {myReports.length === 0 ? (
        <div className="rounded-xl border border-[#1C2B24]/10 px-6 py-10 text-center">
          <p className="text-[#1C2B24]/60 mb-4">
            You haven&apos;t submitted any reports yet.
          </p>
          <Link
            href="/reports/new"
            className="inline-block rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#255a3f] transition-colors"
          >
            Report an issue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myReports.map((r) => {
            const status = REPORT_STATUSES[r.status];
            const typeLabel =
              REPORT_TYPES.find((t) => t.value === r.type)?.label ?? r.type;

            return (
              <div
                key={r.id}
                className="rounded-xl border border-[#1C2B24]/10 px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/restaurants/${r.restaurantId}`}
                      className="font-display text-lg text-[#1C2B24] hover:text-[#2F6F4E] transition-colors"
                    >
                      {r.restaurantName}
                    </Link>
                    <p className="text-sm text-[#1C2B24]/60">{typeLabel}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_TONE_CLASSES[status.tone]}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="text-sm text-[#1C2B24]/70 mt-3">
                  {r.description}
                </p>

                <div className="flex items-center justify-between mt-3 text-xs text-[#1C2B24]/40">
                  <span>{status.description}</span>
                  <span>{r.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}