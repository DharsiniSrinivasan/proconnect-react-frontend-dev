/**
 * Top Patterns - Horizontal bar % Freight by Units
 */
import { Package, IndianRupee } from "lucide-react";
import type { PatternBreakdown } from "@/mocks/strategicDashboardV2.mock";
import { formatCurrency } from "@/lib/formatters";

interface TopPatternsCardProps {
  data: PatternBreakdown[];
}



export const TopPatternsCard = ({ data }: TopPatternsCardProps) => {
  //const maxPercent = Math.max(...data.map((d) => d.freightPercent));
  const maxPercent =100;

  return (
    <div className="glass-card neon-border p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Package className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Top Patterns</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Shipping route patterns ranked by freight share. Variance shows how
        actual freight compares to the ratebook benchmark.
      </p>

      <div className="space-y-5">
        {data?.map((pattern) => {
          const isSaving = pattern.ratebookVariance <= 0;

          return (
            <div key={pattern.pattern} className="space-y-1.5">
              {/* Pattern name */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {pattern.label}
                </span>
                <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  Budget {formatCurrency(pattern.budget)}
                </span>
              </div>

              {/* Value row with labels */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Freight Share */}
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none mb-0.5">
                    Freight Share
                  </span>
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {pattern.freightPercent}%
                  </span>
                </div>

                <div className="w-px h-6 bg-border/60" />

                {/* Freight Value */}
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none mb-0.5">
                    Freight Value
                  </span>
                  <span className="text-sm font-mono font-semibold text-foreground flex items-center gap-0.5">
                    <IndianRupee className="w-3 h-3" />
                    {formatCurrency(pattern.freightValue).replace("₹", "")}
                  </span>
                </div>

                <div className="w-px h-6 bg-border/60" />

                {/* Ratebook Variance */}
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none mb-0.5">
                    vs Ratebook
                  </span>
                  <span
                    className={`text-sm font-mono font-semibold flex items-center gap-0.5 ${pattern.ratebookVariance !== 0
                        ? isSaving
                          ? "text-success"
                          : "text-destructive"
                        : "text-foreground"
                      }`}
                  >
                    {/* {pattern.ratebookVariance !== 0 &&
                      (isSaving ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      ))} */}
                    {/* {pattern.ratebookVariance > 0 ? "+" : ""} */}
                    {Math.abs(pattern.ratebookVariance)}%
                  </span>
                </div>

                {/* Savings / Overspend badge */}
                {pattern.ratebookVariance !== 0 && (
                  <span
                    className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${isSaving
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                      }`}
                  >
                    {isSaving ? "Saving" : "Overspend"}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div
                className="h-2 bg-muted/30 rounded-full overflow-hidden"
                title={`${pattern.freightPercent}% of total freight volume`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(pattern.freightPercent / maxPercent) * 100}%`,
                    background:
                      pattern.ratebookVariance > 0
                        ? "linear-gradient(90deg, hsl(var(--warning)), hsl(var(--destructive)))"
                        : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--success)))",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {/* <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-success/70" />
          <span className="text-[10px] text-muted-foreground">
            Negative variance = freight cost savings vs ratebook
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-destructive/70" />
          <span className="text-[10px] text-muted-foreground">
            Positive variance = freight overspend
          </span>
        </div>
      </div> */}
    </div>
  );
};

export const TopPatternsCardSkeleton = () => (
  <div className="glass-card p-5 h-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-24 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-3/4 rounded mb-4" />
    <div className="space-y-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="skeleton-glow h-4 w-28 rounded" />
          <div className="flex gap-4">
            <div className="skeleton-glow h-8 w-16 rounded" />
            <div className="skeleton-glow h-8 w-16 rounded" />
            <div className="skeleton-glow h-8 w-16 rounded" />
          </div>
          <div className="skeleton-glow h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
