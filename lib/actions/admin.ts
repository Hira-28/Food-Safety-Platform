"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  OPEN_STATUSES,
  REPORT_STATUSES,
  ALLOWED_TRANSITIONS,
  NOTE_REQUIRED_STATUSES,
  REOPEN_FROM,
  QUICK_STATUSES,
  type ReportStatus,
} from "@/lib/report-status";
import {
  reports,
  reportEvents,
  reportStatusEnum,
  restaurants,
} from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth-helpers";

export type AdminFormState = {
  error?: string;
  success?: string;
};

export async function updateReportStatus(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const officer = await requireOfficer();

  const reportId = formData.get("reportId") as string;
  const newStatus = formData.get("status") as ReportStatus;
  const note = ((formData.get("note") as string) ?? "").trim();

  if (!reportId || !reportStatusEnum.enumValues.includes(newStatus)) {
    return { error: "Choose a valid status." };
  }

  const [report] = await db
    .select({ status: reports.status, restaurantId: reports.restaurantId })
    .from(reports)
    .where(eq(reports.id, reportId));

  if (!report) {
    return { error: "Report not found." };
  }

  // Same status is allowed only as a note-only entry.
  if (report.status === newStatus) {
    if (!note) {
      return {
        error:
          "The report already has this status. Add a note or pick a different one.",
      };
    }
  } else if (!ALLOWED_TRANSITIONS[report.status].includes(newStatus)) {
    return {
      error: `A report that is "${REPORT_STATUSES[report.status].label}" can't be moved to "${REPORT_STATUSES[newStatus].label}". Refresh the page and check its current status.`,
    };
  }

  const needsNote =
    NOTE_REQUIRED_STATUSES.includes(newStatus) ||
    (newStatus === "under_review" && REOPEN_FROM.includes(report.status));

  if (needsNote && note.length < 5) {
    return {
      error: "Add a short note explaining this decision (at least 5 characters).",
    };
  }

  // Both writes succeed or neither does.
  await db.batch([
    db.insert(reportEvents).values({
      reportId,
      actorId: officer.id,
      fromStatus: report.status,
      toStatus: newStatus,
      note: note || null,
    }),
    db.update(reports).set({ status: newStatus }).where(eq(reports.id, reportId)),
  ]);

  // Keep the restaurant's "under review" flag accurate.
  const stillOpen = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.restaurantId, report.restaurantId),
        inArray(reports.status, OPEN_STATUSES)
      )
    )
    .limit(1);

  await db
    .update(restaurants)
    .set({ hasActiveComplaint: stillOpen.length > 0 })
    .where(eq(restaurants.id, report.restaurantId));

  revalidatePath("/admin");
  revalidatePath(`/admin/reports/${reportId}`);
  revalidatePath(`/restaurants/${report.restaurantId}`);
  revalidatePath("/reports/mine");
  revalidatePath("/");

  return { success: "Status updated." };
}

export async function quickUpdateReportStatus(
  previousState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const status = formData.get("status") as ReportStatus;
  if (!QUICK_STATUSES.includes(status)) {
    return { error: "Choose a valid quick action." };
  }

  return updateReportStatus(previousState, formData);
}