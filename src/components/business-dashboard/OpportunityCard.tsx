/**
 * OpportunityCard - High-level optimization opportunity summary
 * Shows impact summary only. Does NOT expose transporter names, routing, or internal logic.
 */
import { cn } from "@/lib/utils";

export interface OpportunityCardProps {
  readonly title: string;
  readonly type: "cost" | "sla" | "tat" | "general";
  readonly summary: string;
  readonly impactHighlight?: string;
  readonly className?: string;
}

const typeConfig: Record<
  OpportunityCardProps["type"],
  { icon: string; bg: string; border: string }
> = {
  cost: { icon: "₹", bg: "bg-primary/10", border: "border-primary/30" },
  sla: { icon: "✓", bg: "bg-success/10", border: "border-success/30" },
  tat: { icon: "⏱", bg: "bg-chart-3/10", border: "border-chart-3/30" },
  general: { icon: "◆", bg: "bg-muted/30", border: "border-border" },
};

export function OpportunityCard({
  title,
  type,
  summary,
  impactHighlight,
  className,
}: OpportunityCardProps) {
  const config = typeConfig[type];
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-4 border",
        config.bg,
        config.border,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold",
            config.bg,
            type === "cost" && "text-primary",
            type === "sla" && "text-success",
            type === "tat" && "text-chart-3",
            type === "general" && "text-muted-foreground",
          )}
        >
          {typeConfig[type].icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground">{summary}</p>
          {impactHighlight && (
            <p className="text-sm font-medium text-foreground mt-2">
              {impactHighlight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const OpportunityCardSkeleton = ({
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
