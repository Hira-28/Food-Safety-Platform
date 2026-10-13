import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, restaurants } from "@/lib/db/schema";
import { REPORT_TYPES } from "@/lib/report-types";
import { REPORT_STATUSES, STATUS_TONE_CLASSES } from "@/lib/report-status";
import { requireStudent } from "@/lib/auth-helpers";
import { ArrowRight, ClipboardList, Clock3, Plus } from "lucide-react";

export default async function MyReportsPage() {
  const student = await requireStudent();

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
    .where(eq(reports.studentId, student.id))
    .orderBy(desc(reports.createdAt));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-7 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#172B23] p-6 text-white shadow-[0_18px_50px_rgba(23,43,35,0.16)] sm:p-9">
        <div className="absolute -right-8 -top-14 h-48 w-48 rounded-full border-[28px] border-white/[0.04]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
              <ClipboardList size={21} aria-hidden="true" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#D7F36B]">
              Your activity
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">
              My reports
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
              Follow the progress of your reports and see the latest status
              from the university review team.
            </p>
          </div>
          <Link
            href="/reports/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D7F36B] px-4 py-3 text-sm font-bold text-[#172B23] transition hover:-translate-y-0.5 hover:bg-[#E3FA8B]"
          >
            <Plus size={17} aria-hidden="true" />
            New report
          </Link>
        </div>
        <div className="relative mt-7 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/60">
          <Clock3 size={14} aria-hidden="true" />
          {myReports.length} {myReports.length === 1 ? "report" : "reports"}{" "}
          submitted
        </div>
      </header>

      {myReports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#DCE5DC] bg-white px-5 py-14 text-center shadow-[0_8px_30px_rgba(23,43,35,0.04)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E9] text-[#2F6F4E]">
            <ClipboardList size={24} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl text-[#20342A]">
            Nothing to track yet
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#718078]">
            When you send a food-safety report, you’ll be able to follow its
            progress here.
          </p>
          <Link
            href="/reports/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2F6F4E]"
          >
            Submit your first report <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {myReports.map((r) => {
            const status = REPORT_STATUSES[r.status];
            const typeLabel =
              REPORT_TYPES.find((t) => t.value === r.type)?.label ?? r.type;

            return (
              <article
                key={r.id}
                className="group rounded-3xl border border-[#E3EAE2] bg-white p-5 shadow-[0_6px_24px_rgba(23,43,35,0.045)] transition-all hover:-translate-y-0.5 hover:border-[#C9D8CA] hover:shadow-[0_14px_30px_rgba(23,43,35,0.08)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/restaurants/${r.restaurantId}`}
                      className="font-display text-xl text-[#20342A] transition-colors hover:text-[#2F6F4E]"
                    >
                      {r.restaurantName}
                    </Link>
                    <p className="mt-1 text-sm text-[#718078]">{typeLabel}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_TONE_CLASSES[status.tone]}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#52635A]">
                  {r.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0EC] pt-4">
                  <p className="max-w-xs text-xs leading-5 text-[#718078]">
                    {status.description}
                  </p>
                  <span className="shrink-0 text-xs text-[#98A29A]">
                    {r.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}