"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { createReport } from "@/lib/actions/reports";
import { REPORT_TYPES } from "@/lib/report-types";

type RestaurantOption = { id: string; name: string };

export function ReportForm({
  restaurants,
}: {
  restaurants: RestaurantOption[];
}) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("restaurant") ?? "";
  const [state, formAction, pending] = useActionState(createReport, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
          Restaurant
        </label>
        <select
          name="restaurantId"
          defaultValue={preselected}
          required
          className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
        >
          <option value="" disabled>
            Select a restaurant
          </option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
          What happened?
        </label>
        <select
          name="type"
          required
          defaultValue=""
          className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
        >
          <option value="" disabled>
            Select an issue type
          </option>
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
          Details
        </label>
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Describe what happened, when, and anything the proctorial team should know."
          className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] placeholder:text-[#1C2B24]/40 focus:outline-none focus:border-[#2F6F4E] resize-none"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-6 py-3 hover:bg-[#255a3f] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}