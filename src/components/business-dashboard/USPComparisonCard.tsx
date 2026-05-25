/**
 * USPComparisonCard - Unique selling point card: problem → Proconnect solution
 * Used for Budget vs target, Ratebook variance, OTIF lanes, Cost optimization lanes.
 */
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RecoStatusChip } from "../recommendations/RecoStatusChip";

export interface USPComparisonCardProps {
  readonly title: string;
  readonly icon?: ReactNode;
  readonly customerLabel?: string;
  readonly customerValue?: string;
  readonly proconnectLabel?: string;
  readonly proconnectValue?: string;
  readonly highlight?: string;
  readonly className?: string;
  readonly onClick?: () => void;
  readonly category?: string;
}
export function USPComparisonCard({
  title,
  icon,
  customerLabel,
  customerValue,
  proconnectLabel,
  proconnectValue,
  highlight,
  className,
  category,
  onClick,
}: USPComparisonCardProps) {
  return (
    <div
    onClick={onClick}
      className={cn(
        "glass-card neon-border p-4 flex-1 min-w-[200px] flex flex-col",
        className,
      )}
    >
     <div className="flex items-start justify-between mb-3">
  <div className="flex items-center gap-2">
    {icon && (
      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
    )}
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {title}
    </span>
  </div>

  {category?.trim() && (
    <RecoStatusChip type="category" value={category} />
  )}
</div>
     <div className="space-y-2 text-sm">
  {/* Customer */}
  {(customerLabel || customerValue) && (
    <div
      className={cn(
        "flex gap-2",
        customerLabel
          ? "justify-between items-baseline"
          : "justify-center text-center"
      )}
    >
      {customerLabel && (
        <span className="text-muted-foreground">
          {customerLabel}
        </span>
      )}
      {customerValue && (
        <span
          className={cn(
            "font-medium text-foreground",
            !customerLabel && "text-center"
          )}
        >
          {customerValue}
        </span>
      )}
    </div>
  )}

  {/* Proconnect */}
  {(proconnectLabel || proconnectValue) && (
    <div
      className={cn(
        "flex gap-2",
        proconnectLabel
          ? "justify-between items-baseline"
          : "justify-center text-center"
      )}
    >
      {proconnectLabel && (
        <span className="text-muted-foreground">
          {proconnectLabel}
        </span>
      )}
      {proconnectValue && (
        <span
          className={cn(
            "font-semibold text-primary",
            !proconnectLabel && "text-base text-center"
          )}
        >
          {proconnectValue}
        </span>
      )}
    </div>
  )}

  {/* Highlight */}
  {highlight && (
    <div className="pt-2 mt-2 border-t border-border/30 text-center">
      <span className="text-xs text-success font-medium">
        {highlight}
      </span>
    </div>
  )}
</div>
    </div>
  );
}

export const USPComparisonCardSkeleton = ({
  className,
}: {
  className?: string;
}) => (
  <div
    className={cn(
      "glass-card neon-border p-4 flex-1 min-w-[200px] flex flex-col animate-pulse",
      className,
    )}
  >
    {/* Icon + title */}
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-md bg-primary/10 w-6 h-6" />
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>

    {/* Customer & Proconnect rows */}
    <div className="space-y-2 text-sm flex-1">
      <div className="flex justify-between items-baseline gap-2">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between items-baseline gap-2">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Highlight row */}
      <div className="pt-2 mt-2 border-t border-border/30">
        <div className="h-3 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);
