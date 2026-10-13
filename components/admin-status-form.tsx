"use client";

import { useActionState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { updateReportStatus, type AdminFormState } from "@/lib/actions/admin";
import { REPORT_STATUSES, type ReportStatus } from "@/lib/report-status";

const initialState: AdminFormState = {};

export function AdminStatusForm({
  reportId,
  currentStatus,
  initialStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
  initialStatus?: ReportStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateReportStatus,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="reportId" value={reportId} />

      <div>
        <label
          htmlFor="report-status"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          Status
        </label>
        <select
          id="report-status"
          name="status"
          defaultValue={initialStatus ?? currentStatus}
          className="w-full rounded-xl border border-[#DCE5DC] bg-white px-4 py-3 text-sm text-[#263B30] shadow-sm outline-none transition focus:border-[#2F6F4E] focus:ring-4 focus:ring-[#2F6F4E]/10"
        >
          {Object.entries(REPORT_STATUSES).map(([value, s]) => (
            <option key={value} value={value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="report-note"
          className="mb-2 block text-sm font-semibold text-[#263B30]"
        >
          Note
        </label>
        <textarea
          id="report-note"
          name="note"
          rows={3}
          placeholder="Explain this decision. Required for 'More information needed', 'Could not be verified' and 'Action taken'."
          className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-white px-4 py-3 text-sm leading-6 text-[#263B30] shadow-sm outline-none transition placeholder:text-[#9AA59D] focus:border-[#2F6F4E] focus:ring-4 focus:ring-[#2F6F4E]/10"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-[#F0D4CA] bg-[#FFF4EF] px-4 py-3 text-sm text-[#A34530]"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-xl border border-[#CFE0CD] bg-[#F1F7EF] px-4 py-3 text-sm text-[#2F6F4E]"
        >
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203B2E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F6F4E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6F4E] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            Saving update...
          </>
        ) : (
          <>
            <Check size={16} aria-hidden="true" />
            Save decision
          </>
        )}
      </button>
    </form>
  );
}