"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { OPEN_STATUSES } from "@/lib/report-status";
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

type StatusValue = (typeof reportStatusEnum.enumValues)[number];

const NOTE_REQUIRED: StatusValue[] = [
  "requires_info",
  "unverified",
  "action_taken",
];

export async function updateReportStatus(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const officer = await requireOfficer();

  const reportId = formData.get("reportId") as string;
  const newStatus = formData.get("status") as StatusValue;
  const note = ((formData.get("note") as string) ?? "").trim();

  if (!reportId || !reportStatusEnum.enumValues.includes(newStatus)) {
    return { error: "Choose a valid status." };
  }

  if (NOTE_REQUIRED.includes(newStatus) && note.length < 5) {
    return {
      error: "Add a short note explaining this decision (at least 5 characters).",
    };
  }

  const [report] = await db
    .select({ status: reports.status, restaurantId: reports.restaurantId })
    .from(reports)
    .where(eq(reports.id, reportId));

  if (!report) {
    return { error: "Report not found." };
  }

  if (report.status === newStatus && !note) {
    return { error: "The report already has this status. Add a note or pick a different one." };
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
  const status = formData.get("status");
  if (status !== "under_review" && status !== "verified" && status !== "resolved") {
    return { error: "Choose a valid quick action." };
  }

  return updateReportStatus(previousState, formData);
}