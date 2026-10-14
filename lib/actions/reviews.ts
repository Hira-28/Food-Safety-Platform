"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { restaurants, reviews } from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";

export type ReviewFormState = {
  error?: string;
  success?: string;
};

export async function createReview(
  _previousState: ReviewFormState | undefined,
  formData: FormData
): Promise<ReviewFormState> {
  const student = await requireStudent();
  const restaurantId = formData.get("restaurantId");
  const ratingValue = formData.get("rating");
  const bodyValue = formData.get("body");

  if (
    typeof restaurantId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      restaurantId
    )
  ) {
    return { error: "This restaurant could not be found." };
  }

  const rating = Number(ratingValue);
  if (
    typeof ratingValue !== "string" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return { error: "Choose a rating from 1 to 5 stars." };
  }

  if (typeof bodyValue !== "string") {
    return { error: "Write a review before submitting." };
  }

  const body = bodyValue.trim();
  if (body.length < 2 || body.length > 2000) {
    return { error: "Your review must be between 2 and 2,000 characters." };
  }

  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant) {
    return { error: "This restaurant could not be found." };
  }

  const [insertedReview] = await db
    .insert(reviews)
    .values({
      restaurantId,
      studentId: student.id,
      rating,
      body,
    })
    .onConflictDoNothing({
      target: [reviews.restaurantId, reviews.studentId],
    })
    .returning({ id: reviews.id });

  if (!insertedReview) {
    return { error: "You have already reviewed this restaurant." };
  }

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
  return { success: "Your review has been added. Thank you!" };
}
