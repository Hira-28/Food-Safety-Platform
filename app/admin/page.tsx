import Link from "next/link";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportEvents, reports, restaurants, users } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth-helpers";
import { REPORT_TYPES, SERIOUS_REPORT_TYPES } from "@/lib/report-types";
import {
  REPORT_STATUSES,
  STATUS_TONE_CLASSES,
  OPEN_STATUSES,
  type ReportStatus,
} from "@/lib/report-status";
import { AdminQueueActions } from "@/components/admin-queue-actions";

const STATUS_BAR_COLORS = {
  neutral: "#53635B",
  info: "#4B83A3",
  warning: "#E8A33D",
  alert: "#B54E3D",
  success: "#2F6F4E",
} as const;

export default async function AdminQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireOfficer();
  const { status: statusParam } = await searchParams;

  const filter = statusParam ?? "open";
  const isStatusFilter = filter in REPORT_STATUSES;

  const base = db
    .select({
      id: reports.id,
      type: reports.type,
      description: reports.description,
      status: reports.status,
      createdAt: reports.createdAt,
      restaurantName: restaurants.name,
      reporterName: users.name,
      reporterEmail: users.email,
    })
    .from(reports)
    .innerJoin(restaurants, eq(reports.restaurantId, restaurants.id))
    .innerJoin(users, eq(reports.studentId, users.id));

  const rows =
    filter === "all"
      ? await base.orderBy(desc(reports.createdAt))
      : isStatusFilter
        ? await base
            .where(eq(reports.status, filter as ReportStatus))
            .orderBy(desc(reports.createdAt))
        : await base
            .where(inArray(reports.status, OPEN_STATUSES))
            .orderBy(desc(reports.createdAt));

  const counts = await db
    .select({ status: reports.status, total: count() })
    .from(reports)
    .groupBy(reports.status);

  const countFor = (s: ReportStatus) =>
    counts.find((c) => c.status === s)?.total ?? 0;
  const openTotal = OPEN_STATUSES.reduce((sum, s) => sum + countFor(s), 0);
  const totalReports = counts.reduce((sum, row) => sum + row.total, 0);
  const [actionTakenResult] = await db
    .select({ total: count() })
    .from(reportEvents)
    .where(eq(reportEvents.toStatus, "action_taken"));
  const [priorityResult] = await db
    .select({ total: count() })
    .from(reports)
    .where(
      and(
        inArray(reports.status, OPEN_STATUSES),
        inArray(reports.type, SERIOUS_REPORT_TYPES)
      )
    );
  const priorityTotal = priorityResult?.total ?? 0;

  // Serious open reports first, then newest.
  const isPriority = (r: (typeof rows)[number]) =>
    SERIOUS_REPORT_TYPES.includes(r.type) &&
    OPEN_STATUSES.includes(r.status);
  rows.sort(
    (a, b) =>
      Number(isPriority(b)) - Number(isPriority(a)) ||
      b.createdAt.getTime() - a.createdAt.getTime()
  );

  const tabs: { key: string; label: string }[] = [
    { key: "open", label: `Open (${openTotal})` },
    { key: "all", label: "All" },
    ...Object.entries(REPORT_STATUSES).map(([key, s]) => ({
      key,
      label: `${s.label} (${countFor(key as ReportStatus)})`,
    })),
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <header className="border-b-2 border-[#2F6F4E] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F6F4E]">
          Campus Eats / Operations
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-[#1C2B24]">
              Student report desk
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#1C2B24]/60">
              Triage food safety concerns, document decisions, and follow each
              case through resolution.
            </p>
          </div>
          <p className="text-sm text-[#1C2B24]/50">
            {totalReports} reports on record
          </p>
        </div>
      </header>

      <section
        aria-label="Report overview"
        className="grid grid-cols-2 border-b border-[#1C2B24]/10 sm:grid-cols-4"
      >
        {[
          { label: "Open", value: openTotal, color: "text-[#B54E3D]" },
          { label: "Priority", value: priorityTotal, color: "text-[#B54E3D]" },
          {
            label: "Under review",
            value: countFor("under_review"),
            color: "text-[#4B83A3]",
          },
          {
            label: "Actions taken",
            value: actionTakenResult?.total ?? 0,
            color: "text-[#2F6F4E]",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="border-b border-r border-[#1C2B24]/10 px-4 py-5 last:border-r-0 sm:border-b-0"
          >
            <p className="text-sm text-[#1C2B24]/60">{metric.label}</p>
            <p className={`mt-1 font-display text-3xl ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-10 border-b border-[#1C2B24]/10 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl text-[#1C2B24]">
              Status distribution
            </h2>
            <span className="text-xs text-[#1C2B24]/45">
              All reports on record
            </span>
          </div>
          {totalReports === 0 ? (
            <p className="mt-5 text-sm text-[#1C2B24]/50">
              Status data will appear when students submit reports.
            </p>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(REPORT_STATUSES).map(([key, status]) => {
                const total = countFor(key as ReportStatus);
                const percent = Math.round((total / totalReports) * 100);
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#1C2B24]/70">{status.label}</span>
                      <span className="tabular-nums text-[#1C2B24]/50">
                        {total} · {percent}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${status.label} reports`}
                      aria-valuemin={0}
                      aria-valuemax={totalReports}
                      aria-valuenow={total}
                      className="h-2 overflow-hidden bg-[#1C2B24]/10"
                    >
                      <div
                        className="h-full transition-[width] duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: STATUS_BAR_COLORS[status.tone],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-t border-[#1C2B24]/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="font-display text-xl text-[#1C2B24]">Triage guide</h2>
          <ol className="mt-4 space-y-3 text-sm text-[#1C2B24]/65">
            <li className="flex gap-3">
              <span className="font-semibold text-[#B54E3D]">01</span>
              <span>Prioritize contamination, insects, and spoiled food.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[#4B83A3]">02</span>
              <span>Move reports into review and record each decision.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[#2F6F4E]">03</span>
              <span>Use Action taken when follow-up work is complete.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="pt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[#1C2B24]">Review queue</h2>
            <p className="mt-1 text-sm text-[#1C2B24]/55">
              Serious open reports are prioritized first.
            </p>
          </div>
          <span className="text-sm tabular-nums text-[#1C2B24]/50">
            {rows.length} shown
          </span>
        </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 border-b border-[#1C2B24]/10 pb-3">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin?status=${t.key}`}
            className={`text-sm pb-1 border-b-2 transition-colors ${
              filter === t.key || (!isStatusFilter && filter !== "all" && t.key === "open")
                ? "border-[#2F6F4E] text-[#1C2B24]"
                : "border-transparent text-[#1C2B24]/50 hover:text-[#1C2B24]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-[#1C2B24]/50 text-sm">No reports in this view.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const status = REPORT_STATUSES[r.status];
            const typeLabel =
              REPORT_TYPES.find((t) => t.value === r.type)?.label ?? r.type;
            return (
              <article
                key={r.id}
                className={`grid gap-4 border border-[#1C2B24]/10 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] ${
                  isPriority(r) ? "border-l-4 border-l-[#B54E3D]" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-[#1C2B24]">
                      {r.restaurantName}
                    </h3>
                    {isPriority(r) && (
                      <span className="border border-[#B54E3D]/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#B54E3D]">
                        Priority
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium ${STATUS_TONE_CLASSES[status.tone]}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#1C2B24]/60">{typeLabel}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#1C2B24]/75">
                    {r.description}
                  </p>
                  <p className="mt-3 text-xs text-[#1C2B24]/45">
                    {r.reporterName} · {r.reporterEmail} · {r.createdAt.toLocaleString()}
                  </p>
                </div>
                <AdminQueueActions reportId={r.id} status={r.status} />
              </article>
            );
          })}
        </div>
      )}
      </section>
    </main>
  );
}