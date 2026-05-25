import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { BudgetTrackerData } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface BudgetTrackerCardProps {
  data: BudgetTrackerData[];
}


export const BudgetTrackerCard = ({ data }: BudgetTrackerCardProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            Budget Tracker
          </CardTitle>
          <p className="text-sm text-font-semibold">
            Overall Budget {formatCurrency(data?.[0]?.budget || 0)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground mb-2">
          Monthly spend vs rolling budget (flags overruns).
        </p>
        {data?.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.category}</span>
              <span className="text-foreground">
                {formatCurrency(item.spent)}
              </span>
            </div>
            <Progress
              value={item.percentage}
              className={cn(
                "h-2",
                item.percentage > 90
                  ? "[&>div]:bg-purple-400"
                  : item.percentage > 75
                    ? "[&>div]:bg-amber-400"
                    : "[&>div]:bg-emerald-400",
              )}
            />
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-xs font-medium",
                  item.percentage > 90
                    ? "text-purple-400"
                    : item.percentage > 75
                      ? "text-amber-400"
                      : "text-emerald-400",
                )}
              >
                {item?.percentage?.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const BudgetTrackerCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-28 bg-muted/50" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-full bg-muted/30" />
          <Skeleton className="h-2 w-full bg-muted/20" />
        </div>
      ))}
    </CardContent>
  </Card>
);
