/**
 * Docket Efficiency Funnel
 * Shows Invoice/Volume ratio anomalies through fulfillment stages
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle } from "lucide-react";
import type { DocketEfficiency } from "@/mocks/operationalDashboard.mock";

interface DocketEfficiencyFunnelProps {
  data: DocketEfficiency[];
}

export const DocketEfficiencyFunnel = ({
  data,
}: DocketEfficiencyFunnelProps) => {
  const safeData = data ?? [];

  const maxInvoices =
    safeData.length > 0
      ? Math.max(...safeData.map((d) => d?.invoiceCount ?? 0))
      : 0;

  const anomalyCount = safeData.filter((d) => d?.isAnomaly).length;

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
          <FileText className="h-4 w-4 text-chart-3" />
          Docket Efficiency
          {anomalyCount > 0 && (
            <Badge
              variant="outline"
              className="text-warning border-warning/30 text-[10px] ml-2"
            >
              {anomalyCount} anomaly
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {safeData.map((stage, idx) => {
            const invoiceCount = stage?.invoiceCount ?? 0;
            const widthPct =
              maxInvoices > 0 ? (invoiceCount / maxInvoices) * 100 : 0;

            return (
              <div key={stage?.id ?? idx} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium flex items-center gap-1 text-foreground">
                    {stage?.isAnomaly && (
                      <AlertCircle className="h-3 w-3 text-warning" />
                    )}
                    {stage?.stage ?? "--"}
                  </span>

                  <span
                    className={`text-xs ${
                      stage?.isAnomaly
                        ? "text-warning font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    Ratio: {(stage?.ratio ?? 0).toFixed(2)}
                  </span>
                </div>

                <div className="h-8 bg-muted/30 rounded-md overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stage?.isAnomaly
                        ? "bg-gradient-to-r from-warning/60 to-warning/40"
                        : "bg-gradient-to-r from-chart-3/60 to-chart-3/40"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    <span className="bg-background/70 px-2 py-0.5 rounded text-foreground">
                      {invoiceCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {idx < safeData.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {safeData.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-6">
              No docket efficiency data available
            </div>
          )}
        </div>

        {/* Insight box */}
        {anomalyCount > 0 && (
          <div className="mt-4 p-2 bg-muted/20 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Anomaly detected:
              </span>{" "}
              One or more stages show abnormal invoice ratios
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DocketEfficiencyFunnelSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);
