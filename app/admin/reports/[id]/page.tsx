import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft, CalendarDays, Clock3, FileText, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { reports, reportEvents, restaurants, users } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth-helpers";
import { REPORT_TYPES } from "@/lib/report-types";
import { REPORT_STATUSES, STATUS_TONE_CLASSES } from "@/lib/report-status";
import { AdminStatusForm } from "@/components/admin-status-form";

export default async function AdminReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ action?: string }>;
}) {
  await requireOfficer();
  const { id } = await params;
  const { action } = await searchParams;

  const [report] = await db
    .select({
      id: reports.id,
      type: reports.type,
      description: reports.description,
      status: reports.status,
      createdAt: reports.createdAt,
      restaurantId: restaurants.id,
      restaurantName: restaurants.name,
      studentName: users.name,
      studentEmail: users.email,
    })
    .from(reports)
    .innerJoin(restaurants, eq(reports.restaurantId, restaurants.id))
    .innerJoin(users, eq(reports.studentId, users.id))
    .where(eq(reports.id, id));

  if (!report) {
    notFound();
  }

  const history = await db
    .select({
      id: reportEvents.id,
      fromStatus: reportEvents.fromStatus,
      toStatus: reportEvents.toStatus,
      note: reportEvents.note,
      createdAt: reportEvents.createdAt,
      officerName: users.name,
    })
    .from(reportEvents)
    .innerJoin(users, eq(reportEvents.actorId, users.id))
    .where(eq(reportEvents.reportId, id))
    .orderBy(asc(reportEvents.createdAt));

  const status = REPORT_STATUSES[report.status];
  const typeLabel =
    REPORT_TYPES.find((t) => t.value === report.type)?.label ?? report.type;

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#68766D] transition-colors hover:text-[#2F6F4E]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to review queue
        </Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
              Case details
            </p>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-[#172B23] sm:text-4xl">
              {report.restaurantName}
            </h1>
            <p className="mt-1 text-sm text-[#68766D]">
              {typeLabel} <span className="mx-1 text-[#B6C0B8]">·</span>
              Submitted {report.createdAt.toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${STATUS_TONE_CLASSES[status.tone]}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(21rem,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-[#E2E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,43,35,0.035)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4E9] text-[#2F6F4E]">
                <FileText size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-[#263B30]">Report summary</h2>
                <p className="text-xs text-[#87928A]">
                  Student-submitted concern
                </p>
              </div>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#52635A]">
              {report.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#EDF0EC] pt-4 text-xs text-[#718078]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden="true" />
                {report.createdAt.toLocaleString()}
              </span>
              <Link
                href={`/restaurants/${report.restaurantId}`}
                className="font-semibold text-[#2F6F4E] hover:text-[#214F38]"
              >
                View restaurant
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-[#E2E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,43,35,0.035)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F3F0] text-[#52635A]">
                <Clock3 size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-[#263B30]">Decision history</h2>
                <p className="text-xs text-[#87928A]">
                  {history.length} {history.length === 1 ? "update" : "updates"}{" "}
                  recorded
                </p>
              </div>
            </div>
            {history.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-[#F7F9F6] px-4 py-6 text-sm text-[#718078]">
                No actions have been recorded for this report yet.
              </div>
            ) : (
              <ol className="mt-6">
                {history.map((event, index) => (
                  <li
                    key={event.id}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {index < history.length - 1 && (
                      <span className="absolute bottom-0 left-[15px] top-8 w-px bg-[#E5EBE4]" />
                    )}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF4E9] text-[#2F6F4E] ring-4 ring-white">
                      <ShieldCheck size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm leading-6 text-[#425148]">
                        <span className="font-semibold text-[#263B30]">
                          {event.officerName}
                        </span>{" "}
                        changed the status from{" "}
                        {event.fromStatus
                          ? REPORT_STATUSES[event.fromStatus].label
                          : "none"}{" "}
                        to{" "}
                        <span className="font-semibold text-[#263B30]">
                          {REPORT_STATUSES[event.toStatus].label}
                        </span>
                      </p>
                      {event.note && (
                        <p className="mt-2 rounded-xl bg-[#F7F9F6] px-4 py-3 text-sm leading-6 text-[#68766D]">
                          “{event.note}”
                        </p>
                      )}
                      <p className="mt-2 text-xs text-[#98A29A]">
                        {event.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside
          id="status-update"
          className="space-y-5 xl:sticky xl:top-24"
        >
          <section className="rounded-3xl border border-[#DDE6DC] bg-white p-5 shadow-[0_8px_24px_rgba(23,43,35,0.06)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
              Officer action
            </p>
            <h2 className="mt-1 font-display text-2xl text-[#172B23]">
              Update this case
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#718078]">
              Choose the current outcome and record context for the next
              officer.
            </p>
            <div className="mt-5">
              <AdminStatusForm
                reportId={report.id}
                currentStatus={report.status}
                initialStatus={
                  action === "action_taken" ? "action_taken" : report.status
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-[#E2E8E1] bg-white p-5 shadow-[0_4px_18px_rgba(23,43,35,0.035)] sm:p-6">
            <h2 className="text-sm font-semibold text-[#263B30]">
              Submitted by
            </h2>
            <p className="mt-3 font-medium text-[#263B30]">
              {report.studentName}
            </p>
            <p className="mt-0.5 break-all text-sm text-[#718078]">
              {report.studentEmail}
            </p>
            <p className="mt-4 border-t border-[#EDF0EC] pt-3 text-xs leading-5 text-[#87928A]">
              Reporter details are visible to officers only and are never shown
              publicly.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}