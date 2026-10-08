import { reportTypeEnum } from "@/lib/db/schema";

export const REPORT_TYPES = [
  { value: "contamination", label: "Food contamination / foreign object" },
  { value: "insects", label: "Insects in food" },
  { value: "spoiled_food", label: "Spoiled or stale food" },
  { value: "bad_smell_taste", label: "Bad smell or taste" },
  { value: "hygiene", label: "Hygiene problem" },
  { value: "cleanliness", label: "Cleanliness problem" },
  { value: "poor_quality", label: "Poor food quality" },
  { value: "service", label: "Staff / service issue" },
  { value: "pricing", label: "Pricing issue" },
  { value: "positive", label: "Positive experience" },
  { value: "other", label: "Other" },
] as const;
export const SERIOUS_REPORT_TYPES: (typeof reportTypeEnum.enumValues)[number][] = [
  "contamination",
  "insects",
  "spoiled_food",
];