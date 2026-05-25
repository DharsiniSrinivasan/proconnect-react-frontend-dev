/**
 * MetricComparisonTile - Customer vs Proconnect optimized metric comparison
 * Used on Business Case & Recommendations page. Does not expose internal logic.
 */
import { cn } from "@/lib/utils";
import { RecoStatusChip } from "../recommendations/RecoStatusChip";

type MetricComparisonTileProps = {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly customerValue: string;
  readonly optimizedValue: string;
  readonly savingLabel?: string;
  readonly savingValue?: string;
  readonly className?: string;
  readonly currentLabel?: string;
  readonly optimizedLabel?: string;
  readonly onClick?: () => void;
  readonly category?: string; 
  readonly savingPctLabel?: string;
  readonly savingPctValue?: string;
};

const formatCompact = (s: string) => {
  if (!s || s === "—" || s === "–") return s;
  return s;
};

export function MetricComparisonTile({
  title,
  icon,
  customerValue,
  optimizedValue,
  savingLabel,
  savingValue,
  className,
  currentLabel = "Customer",
  optimizedLabel = "Proconnect model",
  category,
  onClick,
  savingPctLabel,
  savingPctValue,
}: MetricComparisonTileProps) {
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
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-muted-foreground">{currentLabel}</span>
          <span className="font-medium text-foreground">
            {formatCompact(customerValue)}
          </span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-muted-foreground">{optimizedLabel}</span>
          <span className="font-semibold text-primary">
            {formatCompact(optimizedValue)}
          </span>
        </div>
        {savingLabel != null && savingValue != null && (
          <div className="pt-2 mt-2 border-t border-border/30 flex justify-between items-baseline">
            <span className="text-muted-foreground text-xs">{savingLabel}</span>
            <span className="font-medium text-success">{savingValue}</span>
          </div>
          
        )}
        {savingPctLabel != null && savingPctValue != null && (
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-muted-foreground text-xs">{savingPctLabel}</span>
            <span className="font-medium text-success">{savingPctValue}</span>
          </div>
        )}
        
       
      </div>
    </div>
  );
}

export const MetricCardSkeleton = ({ className }: { className?: string }) => (
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

