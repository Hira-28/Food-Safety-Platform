"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reports, reportTypeEnum, restaurants } from "@/lib/db/schema";
import { and, count, eq, gte, inArray } from "drizzle-orm";
import { requireStudent } from "@/lib/auth-helpers";
import { REPORT_TYPES } from "@/lib/report-types";
import { OPEN_STATUSES } from "@/lib/report-status";

const MAX_REPORTS_PER_DAY = 5;

export async function createReport(
  _previousState: { error: string } | undefined,
  formData: FormData
) {
  const student = await requireStudent();

  const restaurantId = formData.get("restaurantId");
  const type = formData.get("type");
  const description = formData.get("description");

  if (
    typeof restaurantId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      restaurantId
    )
  ) {
    return { error: "Select a valid restaurant." };
  }

  if (
    typeof type !== "string" ||
    !REPORT_TYPES.some((reportType) => reportType.value === type)
  ) {
    return { error: "Select a valid report type." };
  }

  if (typeof description !== "string") {
    return { error: "Describe what happened in at least 10 characters." };
  }

  const trimmedDescription = description.trim();
  if (trimmedDescription.length < 10 || trimmedDescription.length > 5000) {
    return {
      error: "Your description must be between 10 and 5,000 characters.",
    };
  }

  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant) {
    return { error: "That restaurant could not be found. Please select another." };
  }

  // One open report per student per restaurant.
  const [alreadyOpen] = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.studentId, student.id),
        eq(reports.restaurantId, restaurantId),
        inArray(reports.status, OPEN_STATUSES)
      )
    )
    .limit(1);

  if (alreadyOpen) {
    return {
      error:
        "You already have an open report for this restaurant. You can submit another once it has been reviewed.",
    };
  }

  // Daily limit across all restaurants.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [{ total }] = await db
    .select({ total: count() })
    .from(reports)
    .where(and(eq(reports.studentId, student.id), gte(reports.createdAt, since)));

  if (total >= MAX_REPORTS_PER_DAY) {
    return {
      error: `You have reached the limit of ${MAX_REPORTS_PER_DAY} reports in 24 hours. Please try again later.`,
    };
  }

  await db.insert(reports).values({
    restaurantId,
    studentId: student.id,
    type: type as (typeof reportTypeEnum.enumValues)[number],
    description: trimmedDescription,
  });

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
  revalidatePath("/reports/mine");
  redirect(`/restaurants/${restaurantId}?reported=true`);
}