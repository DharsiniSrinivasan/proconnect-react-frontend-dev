import { cn } from "@/lib/utils";
import { RecoStatus, RecoPriority } from "@/mocks/recommendations.mock";

interface RecoStatusChipProps {
  type: "status" | "priority" | "category";
  value: RecoStatus | RecoPriority | RecoCategory | string;
  className?: string;
}
export type RecoCategory =
 | "COST_OPTIMIZATION"
  | "TAT_IMPROVEMENT"
  | "TRANSPORTER_SWITCH"
  | "CAPACITY_ADJUSTMENT"
  | "COMPLIANCE"
  | "PARTNER_SWITCH"
  | "COST_TAT_IMPROVEMENT"
  | "TAT_COST_OPTIMIZATION"
  | "FACILITY_SWITCH"
  | "FLOW_REALLOCATION"
  | "NEW_HUB"

const statusStyles: Record<RecoStatus, string> = {
  NEW: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
  UNDER_REVIEW: "bg-amber-500/20 text-amber-700 border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  REJECTED: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  IMPLEMENTED: "bg-violet-500/20 text-violet-700 border-violet-500/30",
};

const priorityStyles: Record<RecoPriority, string> = {
  CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LOW: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const categoryStyles: Record<RecoCategory, string> = {
  COST_OPTIMIZATION: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  TAT_IMPROVEMENT: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  TRANSPORTER_SWITCH: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  CAPACITY_ADJUSTMENT: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  COMPLIANCE: "bg-rose-500/20 text-rose-700 border-rose-500/30",
  PARTNER_SWITCH: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  NEW_HUB:"bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
  COST_TAT_IMPROVEMENT: "bg-teal-400/20 text-teal-700 border-teal-500/30",
  TAT_COST_OPTIMIZATION: "bg-sky-500/20 text-sky-700 border-sky-500/30",
  FACILITY_SWITCH: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  FLOW_REALLOCATION: "bg-pink-500/20 text-pink-700 border-pink-500/30",
};

export const categoryLabels: Record<RecoCategory, string> = {
  COST_OPTIMIZATION: "Cost Optimization",
  TAT_IMPROVEMENT: "TAT Improvement",
  TRANSPORTER_SWITCH: "Transporter Switch",
  CAPACITY_ADJUSTMENT: "Capacity Adjustment",
  COMPLIANCE: "Compliance",
  PARTNER_SWITCH: "Partner Switch",
  NEW_HUB:"New Hub",
  COST_TAT_IMPROVEMENT: "Cost TAT Improvement",
  TAT_COST_OPTIMIZATION: "TAT Cost Optimization",
  FACILITY_SWITCH: "Facility Switch",
  FLOW_REALLOCATION: "Flow Reallocation",
};
const statusLabels: Record<RecoStatus, string> = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  IMPLEMENTED: "Implemented",
};

export const RecoStatusChip = ({
  type,
  value,
  className,
}: RecoStatusChipProps) => {
  let styles = "";
  let label = "";

  if (type === "status") {
    styles = statusStyles[value as RecoStatus];
    label = statusLabels[value as RecoStatus];
  } else if (type === "priority") {
    styles = priorityStyles[value as RecoPriority];
    label = value as string;
  } else {
    styles = categoryStyles[value as RecoCategory];
    label = categoryLabels[value as RecoCategory];
  }

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
        styles,
        className,
      )}
    >
      {label}
    </span>
  );
};
