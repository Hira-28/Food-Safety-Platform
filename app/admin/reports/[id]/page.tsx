import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
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
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/admin"
        className="text-sm text-[#1C2B24]/60 hover:text-[#1C2B24] transition-colors"
      >
        ← Back to queue
      </Link>

      <div className="mt-4 rounded-xl border border-[#1C2B24]/10 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/restaurants/${report.restaurantId}`}
              className="font-display text-2xl text-[#1C2B24] hover:text-[#2F6F4E] transition-colors"
            >
              {report.restaurantName}
            </Link>
            <p className="text-[#1C2B24]/60">{typeLabel}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_TONE_CLASSES[status.tone]}`}
          >
            {status.label}
          </span>
        </div>

        <p className="text-[#1C2B24]/80 mt-4 whitespace-pre-wrap">
          {report.description}
        </p>

        <div className="mt-5 pt-4 border-t border-[#1C2B24]/10 text-sm text-[#1C2B24]/60">
          <p>
            Submitted {report.createdAt.toLocaleString()} by{" "}
            <span className="text-[#1C2B24]">{report.studentName}</span> (
            {report.studentEmail})
          </p>
          <p className="text-xs text-[#1C2B24]/40 mt-1">
            Student details are visible to officers only and never shown
            publicly.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2
          id="status-update"
          className="font-display text-xl text-[#1C2B24] mb-4"
        >
          Update status
        </h2>
        <AdminStatusForm
          reportId={report.id}
          currentStatus={report.status}
          initialStatus={action === "action_taken" ? "action_taken" : report.status}
        />
      </div>

      <div className="mt-10 pt-8 border-t border-[#1C2B24]/10">
        <h2 className="font-display text-xl text-[#1C2B24] mb-4">History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-[#1C2B24]/50">
            No actions recorded yet.
          </p>
        ) : (
          <ol className="space-y-4">
            {history.map((e) => (
              <li key={e.id} className="text-sm">
                <p className="text-[#1C2B24]">
                  <span className="font-medium">{e.officerName}</span> changed
                  the status from{" "}
                  {e.fromStatus ? REPORT_STATUSES[e.fromStatus].label : "none"}{" "}
                  to {REPORT_STATUSES[e.toStatus].label}
                </p>
                {e.note && (
                  <p className="text-[#1C2B24]/70 mt-0.5">
                    &ldquo;{e.note}&rdquo;
                  </p>
                )}
                <p className="text-xs text-[#1C2B24]/40 mt-0.5">
                  {e.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}