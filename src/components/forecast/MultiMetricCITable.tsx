import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MultiMetricCIRow } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { formatCurrency } from "@/lib/formatters";

interface MultiMetricCITableProps {
  data: MultiMetricCIRow[];
}

const formatValue = (value: number, unit: string) => {
  const u = (unit || "").toLowerCase().trim();
  const formatCompact = (val: number) => {
    const format = (n: number) =>
      parseFloat(n.toFixed(2)).toString();

    if (val >= 10000000) return format(val / 10000000) + "Cr";
    if (val >= 100000) return format(val / 100000) + "L";
    if (val >= 1000) return format(val / 1000) + "K";
    return val.toString();
  };

  //  Currency handling (covers all cases)
  if (u === "₹" || u === "currency" || u === "inr" || u === "rs") {
    return formatCurrency(value);
  }

  if (u === "units" || u === "tons" ) { return formatCompact(value) };

  if (u === "days") {
    return `${parseFloat(value.toFixed(2))}d`;
  }

  if (u === "%") {
    return `${parseFloat(value.toFixed(2))}%`;
  }

  return value.toString();
};
export const MultiMetricCITable = ({ data }: MultiMetricCITableProps) => {
  return (
    <Card className="glass-card neon-border overflow-visible">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Multi-Metric Confidence Intervals
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground font-medium">
                  Metric
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P50
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P75
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P90
                </th>
              </tr>
            </thead>
            <TooltipProvider>
              <tbody>
                {data?.map((row) => (
                  <tr key={row.metric} className="border-t border-border/30">
                    <td colSpan={4} className="p-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="grid grid-cols-4 items-center p-2 hover:bg-muted/10 cursor-pointer">
                            <div className="text-foreground font-medium">
                              {row.metric}
                            </div>

                            <div className="text-center text-emerald-400 font-medium">
                              {formatValue(row.p50, row.unit)}
                            </div>

                            <div className="text-center text-amber-400 font-medium">
                              {formatValue(row.p75, row.unit)}
                            </div>

                            <div className="text-center text-purple-400 font-medium">
                              {formatValue(row.p90, row.unit)}
                            </div>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={6}
                          avoidCollisions
                          collisionPadding={16}
                          className="max-w-sm text-xs space-y-2"
                        >
                          {/* Explanation */}
                          <div className="text-muted-foreground">
                             <div className="font-medium text-foreground">Explanation</div>
                            {row.multiMetricCI_explanation}
                          </div>

                          {/* Formula */}
                          <div>
                            <div className="font-medium text-foreground">Formula</div>
                            <div className="text-muted-foreground">
                              {row.calculation?.formula}
                            </div>
                          </div>

                          {/* Evaluated */}
                          <div>
                            <div className="font-medium text-foreground">Calculation</div>
                            <div className="text-muted-foreground">
                              {row.calculation?.evaluated}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TooltipProvider>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          P50 = median • P75/P90 = upper confidence bounds
        </p>
      </CardContent>
    </Card>
  );
};

export const MultiMetricCITableSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-32 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
