import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { VarianceSegment } from "@/mocks/financialDashboard.mock";

interface VarianceWaterfallProps {
  data: VarianceSegment[];
}



export const VarianceWaterfall = ({ data }: VarianceWaterfallProps) => {
  const maxValue = Math.max(...(data?.map((d) => Math.abs(d.value)) ?? []));

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Variance vs Optimal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">
          Actual freight cost vs base freight gap (overpayment indicator).
        </p>
        {data?.map((segment) => {
          const isAdd = segment.type === "add";
          const isSubtract = segment.type === "subtract";
          const barWidth = (Math.abs(segment.value) / maxValue) * 100;

          return (
            <div key={segment.id} className="flex items-center gap-3">
              <div className="w-28 text-xs text-muted-foreground text-right shrink-0">
                {segment.label}
              </div>
              <div className="flex-1 h-10 relative">
                <div className="flex items-center h-full">
                  <div
                    className={cn(
                      "h-full rounded transition-all duration-300",
                      isAdd && "bg-purple-400/70",
                      isSubtract && "bg-emerald-500/70",
                      !isAdd && !isSubtract && "bg-primary/60",
                      segment.type === "end" && "bg-primary",
                    )}
                    style={{ width: `${Math.max(barWidth, 8)}%` }}
                  />
                  <span
                    className={cn(
                      "ml-2 text-xs font-medium",
                      isAdd && "text-purple-400",
                      isSubtract && "text-emerald-400",
                      !isAdd && !isSubtract && "text-foreground",
                    )}
                  >
                    {isAdd ? "+" : isSubtract ? "-" : ""}
                    {formatCurrency(segment.value)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const VarianceWaterfallSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36 bg-muted/50" />
    </CardHeader>
    <CardContent className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-28 h-4 bg-muted/30" />
          <Skeleton className="flex-1 h-5 bg-muted/20" />
        </div>
      ))}
    </CardContent>
  </Card>
);
