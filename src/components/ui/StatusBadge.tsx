import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: "bg-badge-active/15 text-badge-active border-badge-active/30",
  inactive: "bg-badge-inactive/15 text-badge-inactive border-badge-inactive/30",
  pending: "bg-badge-pending/15 text-badge-pending border-badge-pending/30",
};

const statusLabels: Record<StatusType, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
