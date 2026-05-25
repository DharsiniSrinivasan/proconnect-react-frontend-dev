/**
 * Pattern Exceptions Card View
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Package,
  IndianRupee,
} from "lucide-react";
import type { PatternException } from "@/mocks/operationalDashboard.mock";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface PatternExceptionsTableProps {
  data: PatternException[];
}

/**  Badge */
const getSeverityBadge = (severity?: string) => {
  switch (severity) {
    case "CRITICAL":
      return <Badge className="bg-pink-600 text-white border-0">CRITICAL</Badge>;
    case "HIGH":
      return <Badge className="bg-orange-500 text-white border-0">HIGH</Badge>;
    case "MEDIUM":
      return <Badge className="bg-amber-500 text-white border-0">MEDIUM</Badge>;
    case "LOW":
      return <Badge className="bg-blue-500 text-white border-0">LOW</Badge>;
    default:
      return <Badge variant="outline">N/A</Badge>;
  }
};

/**  Indicator line color */
const getSeverityLineColor = (severity?: string) => {
  const map: Record<string, string> = {
    CRITICAL: "bg-pink-600",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-amber-500",
    LOW: "bg-blue-500",
  };
  return map[severity || ""] || "bg-gray-400";
};

/**  Deviation color */
const getDeviationColor = (deviation: number) => {
  if (deviation > 50) return "text-pink-500";
  if (deviation > 20) return "text-orange-500";
  if (deviation > 0) return "text-amber-500";
  if (deviation < 0) return "text-green-500";
  return "text-gray-400";
};

export const PatternExceptionsTable = ({
  data,
}: PatternExceptionsTableProps) => {
  const safeData = data ?? [];

  const sortedData = [...safeData].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (
      (severityOrder[a.severity as keyof typeof severityOrder] ?? 4) -
      (severityOrder[b.severity as keyof typeof severityOrder] ?? 4)
    );
  });

  return (
    <Card className="glass-card neon-border h-full flex flex-col">
      <CardHeader className="pb-3 flex justify-between border-b border-border/50">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-2 w-2/3">
            <div className="p-1.5 bg-destructive/10 rounded-md">
              <AlertOctagon className="h-4 w-4 text-destructive" />
            </div>
            <CardTitle className="text-base font-medium truncate">
              Pattern Exceptions
            </CardTitle>
          </div>
          <div className="w-1/2 flex justify-end">
            <Badge variant="outline" className="text-xs px-2 py-1 whitespace-nowrap">
              {safeData.length} alert{safeData.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertOctagon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">No pattern exceptions</p>
            <p className="text-xs text-muted-foreground">
              All patterns are within normal range
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
            {sortedData?.map((exc, idx) => {
              const deviation = exc?.deviation ?? 0;
              const freightPerQty = formatCurrency(exc?.freightPerQty) ?? 0;
              const avgFreightPerQty = formatCurrency(exc?.avgFreightPerQty) ?? 0;

              const deviationColor = getDeviationColor(deviation);
              const severityColor = getSeverityLineColor(exc?.severity);

              return (
                <div
                  key={exc?.id ?? idx}
                  className="group relative p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all hover:shadow-md"
                >
                  {/*  Clean indicator */}
                  <div
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${severityColor}`}
                  />

                  <div className="pl-3">
                    {/* Header */}
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {exc?.pattern ?? "--"}
                      </h3>
                      {getSeverityBadge(exc?.severity)}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Freight/Qty
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold">
                            {freightPerQty.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Avg Freight/Qty
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">
                            {avgFreightPerQty.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Deviation
                        </p>
                        <div className="flex items-center gap-1">
                          {deviation > 0 && (
                            <TrendingUp className={`h-3.5 ${deviationColor}`} />
                          )}
                          {deviation < 0 && (
                            <TrendingDown className={`h-3.5 ${deviationColor}`} />
                          )}
                          <span className={`text-sm ${deviationColor}`}>
                            {deviation > 0 ? "+" : ""}
                            {deviation}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Shipments
                        </p>
                        <div className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          <span className="text-sm">
                            {formatNumber(exc?.shipmentCount) ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

};

export const PatternExceptionsTableSkeleton = () => (
  <Card className="glass-card h-full flex flex-col">
    <CardHeader className="pb-3 border-b border-border/50 flex-none">
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent className="flex-1 p-0 overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-3 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-8 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);