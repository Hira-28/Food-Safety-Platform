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
        <label
          htmlFor="report-restaurant"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          Restaurant <span className="text-[#B54E3D]">*</span>
        </label>
        <select
          id="report-restaurant"
          name="restaurantId"
          defaultValue={preselected}
          required
          className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
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
        <label
          htmlFor="report-type"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          Issue type <span className="text-[#B54E3D]">*</span>
        </label>
        <select
          id="report-type"
          name="type"
          required
          defaultValue=""
          className="w-full rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm text-[#263B30] outline-none transition focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
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
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="report-description"
            className="block text-sm font-semibold text-[#263B30]"
          >
            What happened? <span className="text-[#B54E3D]">*</span>
          </label>
          <span className="text-xs text-[#98A29A]">10–5,000 characters</span>
        </div>
        <textarea
          id="report-description"
          name="description"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Describe what happened, when you noticed it, and anything the review team should know."
          className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-[#FAFBF9] px-4 py-3 text-sm leading-6 text-[#263B30] outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl border border-[#F0D4CA] bg-[#FFF4EF] px-4 py-3 text-sm text-[#A34530]"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0EC] pt-5">
        <p className="max-w-xs text-xs leading-5 text-[#87928A]">
          Reports are shared with the university proctorial team for review.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2F6F4E] hover:shadow-md disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Submitting report..." : "Submit report"}
        </button>
      </div>
    </form>
  );
}