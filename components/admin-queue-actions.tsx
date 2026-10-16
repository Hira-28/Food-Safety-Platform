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

const quickButton =
  "inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DC] bg-white px-3 py-2.5 text-xs font-semibold text-[#415348] transition-colors hover:border-[#9DB6A1] hover:bg-[#F5F8F4] hover:text-[#2F6F4E] disabled:opacity-50";

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
    <div className="flex flex-col items-start gap-2 lg:items-end">
      <form
        action={formAction}
        className="flex flex-wrap gap-2 lg:justify-end"
      >
        <input type="hidden" name="reportId" value={reportId} />

        {status === "submitted" && (
          <button
            type="submit"
            name="status"
            value="under_review"
            disabled={pending}
            className={quickButton}
          >
            <Search size={14} aria-hidden="true" />
            Start review
          </button>
        )}

        {(status === "under_review" || status === "requires_info") && (
          <Link
            href={`/admin/reports/${reportId}?action=verified#status-update`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#CFE0CD] bg-[#F1F7EF] px-3 py-2.5 text-xs font-semibold text-[#2F6F4E] transition-colors hover:bg-[#E6F1E3]"
          >
            <Check size={14} aria-hidden="true" />
            Verify
          </Link>
        )}

          {(status === "under_review" ||
          status === "requires_info" ||
          status === "verified") && (
          <Link
            href={`/admin/reports/${reportId}?action=action_taken#status-update`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EBD2CA] bg-[#FFF7F4] px-3 py-2.5 text-xs font-semibold text-[#B54E3D] transition-colors hover:bg-[#FCECE6]"
          >
            <ArrowUpRight size={14} aria-hidden="true" />
            Action taken
          </Link>
        )}

        {(status === "verified" || status === "action_taken") && (
          <button
            type="submit"
            name="status"
            value="resolved"
            disabled={pending}
            className={quickButton}
          >
            <Check size={14} aria-hidden="true" />
            Mark resolved
          </button>
        )}

        <Link
          href={`/admin/reports/${reportId}`}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#718078] transition-colors hover:bg-[#F2F5F1] hover:text-[#263B30]"
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