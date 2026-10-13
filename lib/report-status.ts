export const REPORT_STATUSES = {
  submitted: {
    label: "Submitted",
    description: "Your report was received and is waiting for review.",
    tone: "neutral",
  },
  under_review: {
    label: "Under review",
    description: "The proctorial team is looking into this.",
    tone: "info",
  },
  requires_info: {
    label: "More information needed",
    description: "The team needs more details from you to continue.",
    tone: "warning",
  },
  verified: {
    label: "Verified",
    description: "The team confirmed this issue.",
    tone: "alert",
  },
  unverified: {
    label: "Could not be verified",
    description: "The team could not confirm this issue.",
    tone: "neutral",
  },
  resolved: {
    label: "Resolved",
    description: "The issue has been addressed.",
    tone: "success",
  },
  action_taken: {
    label: "Action taken",
    description: "The university took action on this report.",
    tone: "success",
  },
  closed: {
    label: "Closed",
    description: "This report is closed.",
    tone: "neutral",
  },
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

export const STATUS_TONE_CLASSES = {
  neutral: "bg-[#1C2B24]/5 text-[#1C2B24]/70",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-[#E8A33D]/15 text-[#9a6a14]",
  alert: "bg-[#B54E3D]/10 text-[#B54E3D]",
  success: "bg-[#2F6F4E]/10 text-[#2F6F4E]",
} as const;
export const OPEN_STATUSES: ReportStatus[] = [
  "submitted",
  "under_review",
  "requires_info",
];

export const PUBLIC_STATUSES: ReportStatus[] = [
  ...OPEN_STATUSES,
  "verified",
  "resolved",
  "action_taken",
];