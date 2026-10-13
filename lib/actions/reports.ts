"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reports, reportTypeEnum, restaurants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireStudent } from "@/lib/auth-helpers";

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
    !reportTypeEnum.enumValues.some((validType) => validType === type)
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

  await db.batch([
    db.insert(reports).values({
      restaurantId,
      studentId: student.id,
      type: type as (typeof reportTypeEnum.enumValues)[number],
      description: trimmedDescription,
    }),
    db
      .update(restaurants)
      .set({ hasActiveComplaint: true })
      .where(eq(restaurants.id, restaurantId)),
  ]);

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
  revalidatePath("/reports/mine");
  redirect(`/restaurants/${restaurantId}?reported=true`);
}