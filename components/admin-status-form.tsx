"use client";

import { useActionState } from "react";
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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="reportId" value={reportId} />

      <div>
        <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
          Status
        </label>
        <select
          name="status"
          defaultValue={initialStatus ?? currentStatus}
          className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] focus:outline-none focus:border-[#2F6F4E]"
        >
          {Object.entries(REPORT_STATUSES).map(([value, s]) => (
            <option key={value} value={value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1C2B24] mb-1.5">
          Note
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="Explain this decision. Required for 'More information needed', 'Could not be verified' and 'Action taken'."
          className="w-full rounded-lg border border-[#1C2B24]/15 bg-white px-4 py-2.5 text-[#1C2B24] placeholder:text-[#1C2B24]/40 focus:outline-none focus:border-[#2F6F4E] resize-none"
        />
      </div>

      {state.error && <p className="text-sm text-[#B54E3D]">{state.error}</p>}
      {state.success && <p className="text-sm text-[#2F6F4E]">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2F6F4E] text-white text-sm font-medium px-6 py-2.5 hover:bg-[#255a3f] transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Update status"}
      </button>
    </form>
  );
}