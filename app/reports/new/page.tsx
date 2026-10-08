import { Suspense } from "react";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { ReportForm } from "@/components/report-form";
import { requireStudent } from "@/lib/auth-helpers";

export default async function NewReportPage() {
  await requireStudent();

  const allRestaurants = await db
    .select({ id: restaurants.id, name: restaurants.name })
    .from(restaurants);

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-[#1C2B24] mb-2">
        Report an Issue
      </h1>
      <p className="text-[#1C2B24]/60 mb-8">
        Your report goes to the university proctorial team for review. Be as
        specific as you can.
      </p>

      <Suspense fallback={null}>
        <ReportForm restaurants={allRestaurants} />
      </Suspense>
    </main>
  );
}