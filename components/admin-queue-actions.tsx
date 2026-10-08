"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowUpRight, Check, Search } from "lucide-react";
import {
  quickUpdateReportStatus,
  type AdminFormState,
} from "@/lib/actions/admin";
import type { ReportStatus } from "@/lib/report-status";

const initialState: AdminFormState = {};

export function AdminQueueActions({
  reportId,
  status,
}: {
  reportId: string;
  status: ReportStatus;
}) {
  const [state, formAction, pending] = useActionState(
    quickUpdateReportStatus,
    initialState
  );

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <form action={formAction} className="flex flex-wrap gap-2 sm:justify-end">
        <input type="hidden" name="reportId" value={reportId} />
        {status === "submitted" && (
          <button
            type="submit"
            name="status"
            value="under_review"
            disabled={pending}
            className="inline-flex items-center gap-1.5 border border-[#1C2B24]/15 px-3 py-2 text-xs font-medium text-[#1C2B24] hover:border-[#2F6F4E] hover:text-[#2F6F4E] disabled:opacity-50"
          >
            <Search size={14} aria-hidden="true" />
            Start review
          </button>
        )}
        {(status === "submitted" ||
          status === "under_review" ||
          status === "requires_info") && (
          <>
            <button
              type="submit"
              name="status"
              value="verified"
              disabled={pending}
              className="inline-flex items-center gap-1.5 border border-[#2F6F4E]/30 bg-[#2F6F4E]/5 px-3 py-2 text-xs font-medium text-[#2F6F4E] hover:bg-[#2F6F4E]/10 disabled:opacity-50"
            >
              <Check size={14} aria-hidden="true" />
              Verify
            </button>
            <Link
              href={`/admin/reports/${reportId}?action=action_taken#status-update`}
              className="inline-flex items-center gap-1.5 border border-[#B54E3D]/25 px-3 py-2 text-xs font-medium text-[#B54E3D] hover:bg-[#B54E3D]/5"
            >
              <ArrowUpRight size={14} aria-hidden="true" />
              Action taken
            </Link>
          </>
        )}
        <Link
          href={`/admin/reports/${reportId}`}
          className="px-3 py-2 text-xs font-medium text-[#1C2B24]/60 hover:text-[#1C2B24]"
        >
          Details
        </Link>
      </form>
      {state.error && (
        <p role="alert" className="text-xs text-[#B54E3D]">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-xs text-[#2F6F4E]">
          {state.success}
        </p>
      )}
    </div>
  );
}