import Link from "next/link";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportEvents, reports, restaurants, users } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth-helpers";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
  const isStatusFilter = Object.prototype.hasOwnProperty.call(
    REPORT_STATUSES,
    filter
  );

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
    <main className="mx-auto w-full max-w-[1600px] space-y-7 px-4 py-6 sm:px-6 lg:space-y-9 lg:px-10 lg:py-9">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#52715F]">
            <span className="h-2 w-2 rounded-full bg-[#2F6F4E]" />
            Operations overview
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-[#172B23] sm:text-4xl">
            Student report desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#52635A]">
            Triage food-safety concerns, document decisions, and keep every case
            moving toward resolution.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#DDE5DD] bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4E9] text-[#2F6F4E]">
            <ClipboardCheck size={19} aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none tabular-nums text-[#172B23]">
              {totalReports}
            </p>
            <p className="mt-1 text-xs text-[#718078]">Reports on record</p>
          </div>
        </div>
      </header>

      <section
        aria-label="Report overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Open reports",
            value: openTotal,
            caption: "Need attention",
            icon: Clock3,
            tone: "bg-[#FFF1E8] text-[#C45D37]",
            accent: "border-t-[#DB774E]",
          },
          {
            label: "Priority cases",
            value: priorityTotal,
            caption: "Serious and open",
            icon: AlertTriangle,
            tone: "bg-[#FCECE9] text-[#B54E3D]",
            accent: "border-t-[#B54E3D]",
          },
          {
            label: "Under review",
            value: countFor("under_review"),
            caption: "Currently in progress",
            icon: Activity,
            tone: "bg-[#E9F2F7] text-[#4B83A3]",
            accent: "border-t-[#4B83A3]",
          },
          {
            label: "Actions taken",
            value: actionTakenResult?.total ?? 0,
            caption: "Decisions recorded",
            icon: ShieldCheck,
            tone: "bg-[#EAF3E9] text-[#2F6F4E]",
            accent: "border-t-[#2F6F4E]",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className={`rounded-2xl border border-[#E2E8E1] border-t-[3px] ${metric.accent} bg-white p-5 shadow-[0_4px_18px_rgba(23,43,35,0.035)] transition-shadow hover:shadow-[0_12px_28px_rgba(23,43,35,0.08)]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#68766D]">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-display text-4xl leading-none tabular-nums text-[#172B23]">
                    {metric.value}
                  </p>
                </div>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.tone}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-xs text-[#87928A]">{metric.caption}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.8fr)]">
        <div className="rounded-3xl border border-[#E2E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,43,35,0.035)] sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                At a glance
              </p>
              <h2 className="mt-1 font-display text-2xl text-[#172B23]">
                Report status
              </h2>
            </div>
            <span className="rounded-full bg-[#F2F5F1] px-3 py-1.5 text-xs font-medium text-[#718078]">
              {totalReports} total reports
            </span>
          </div>
          {totalReports === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#F6F8F5] px-5 py-8 text-center text-sm text-[#718078]">
              Status insights will appear when students submit reports.
            </div>
          ) : (
            <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {Object.entries(REPORT_STATUSES).map(([key, status]) => {
                const total = countFor(key as ReportStatus);
                const percent = Math.round((total / totalReports) * 100);
                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-[#425148]">
                        {status.label}
                      </span>
                      <span className="tabular-nums text-[#718078]">
                        {total} <span className="text-[#A1AAA3]">· {percent}%</span>
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${status.label} reports`}
                      aria-valuemin={0}
                      aria-valuemax={totalReports}
                      aria-valuenow={total}
                      className="h-2 overflow-hidden rounded-full bg-[#EEF1ED]"
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
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

        <aside className="relative overflow-hidden rounded-3xl bg-[#172B23] p-6 text-white shadow-[0_12px_32px_rgba(23,43,35,0.14)] sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[28px] border-white/[0.035]" />
          <div className="relative">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F36B] text-[#172B23]">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#D7F36B]">
              Field guide
            </p>
            <h2 className="mt-1 font-display text-2xl">A better way to triage</h2>
            <ol className="mt-5 space-y-4">
              {[
                "Prioritize contamination, insects, and spoiled food.",
                "Move reports into review and record each decision.",
                "Add a note when requesting information or recording action.",
              ].map((instruction, index) => (
                <li key={instruction} className="flex gap-3 text-sm leading-5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-[#D7F36B]">
                    {index + 1}
                  </span>
                  <span className="text-white/75">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#E2E8E1] bg-white shadow-[0_4px_18px_rgba(23,43,35,0.035)]">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
              Case management
            </p>
            <h2 className="mt-1 font-display text-2xl text-[#172B23]">
              Review queue
            </h2>
            <p className="mt-1 text-sm text-[#718078]">
              Serious open reports are surfaced first.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F2F5F1] px-3 py-1.5 text-xs font-medium text-[#52635A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F6F4E]" />
            {rows.length} {rows.length === 1 ? "case" : "cases"} shown
          </span>
        </div>

        <div className="border-y border-[#EDF0EC] bg-[#FAFBF9] px-5 sm:px-7">
          <nav
            aria-label="Filter reports by status"
            className="flex gap-1 overflow-x-auto py-3"
          >
            {tabs.map((tab) => {
              const isActive =
                filter === tab.key ||
                (!isStatusFilter && filter !== "all" && tab.key === "open");
              return (
                <Link
                  key={tab.key}
                  href={`/admin?status=${tab.key}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    isActive
                      ? "bg-[#172B23] text-white shadow-sm"
                      : "text-[#718078] hover:bg-[#EEF2EC] hover:text-[#263B30]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 p-4 sm:p-6">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DDE5DD] bg-[#FAFBF9] px-5 py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E9] text-[#2F6F4E]">
                <CheckCircle2 size={23} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl text-[#263B30]">
                You’re all caught up
              </h3>
              <p className="mt-1 text-sm text-[#718078]">
                There are no reports in this view right now.
              </p>
            </div>
          ) : (
            rows.map((report) => {
              const status = REPORT_STATUSES[report.status];
              const typeLabel =
                REPORT_TYPES.find((type) => type.value === report.type)?.label ??
                report.type;
              const isReportPriority = isPriority(report);

              return (
                <article
                  key={report.id}
                  className={`group relative grid gap-4 overflow-hidden rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(23,43,35,0.08)] sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center ${
                    isReportPriority
                      ? "border-[#F0D4CA] hover:border-[#DDA998]"
                      : "border-[#E8ECE7] hover:border-[#C9D8CA]"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 ${
                      isReportPriority ? "bg-[#C76348]" : "bg-[#D7E5D5]"
                    }`}
                  />
                  <div className="min-w-0 pl-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#20342A]">
                        {report.restaurantName}
                      </h3>
                      {isReportPriority && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0EA] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#B54E3D]">
                          <AlertTriangle size={11} aria-hidden="true" />
                          Priority
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE_CLASSES[status.tone]}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#718078]">
                      {typeLabel}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#52635A]">
                      {report.description}
                    </p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#89948C]">
                      <span>{report.reporterName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="break-all">{report.reporterEmail}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.createdAt.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="border-t border-[#EDF0EC] pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <AdminQueueActions
                      reportId={report.id}
                      status={report.status}
                    />
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#EDF0EC] px-5 py-4 text-xs text-[#87928A] sm:px-7">
          <span>Cases are prioritized by food-safety risk.</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-[#2F6F4E] hover:text-[#214F38]"
          >
            Restaurant directory <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}