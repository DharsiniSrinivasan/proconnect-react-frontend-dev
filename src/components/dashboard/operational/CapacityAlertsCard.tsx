/**
 * Capacity Alerts Card
 * Gauge-style display of % utilization by geo/pattern
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Gauge, AlertTriangle } from "lucide-react";
import type { CapacityAlert } from "@/mocks/operationalDashboard.mock";

interface CapacityAlertsCardProps {
  data: CapacityAlert[];
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "CRITICAL":
      return {
        bg: "bg-destructive",
        text: "text-destructive",
        border: "border-destructive/30",
      };
    case "HIGH":
      return {
        bg: "bg-warning",
        text: "text-warning",
        border: "border-warning/30",
      };
    case "MEDIUM":
      return {
        bg: "bg-chart-4",
        text: "text-chart-4",
        border: "border-chart-4/30",
      };
    default:
      return {
        bg: "bg-chart-2",
        text: "text-chart-2",
        border: "border-chart-2/30",
      };
  }
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const GaugeBar = ({ value, status }: { value?: number; status?: string }) => {
  const colors = getStatusColor(status);
  const safeValue = clamp(value ?? 0);

  return (
    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
      <div
        className={`h-full ${colors.bg} transition-all duration-500`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export const CapacityAlertsCard = ({ data }: CapacityAlertsCardProps) => {
  const safeData = data ?? [];

  const criticalCount = safeData.filter((d) => d?.status === "CRITICAL").length;

  const sortedData = [...safeData].sort(
    (a, b) => (b?.utilPct ?? 0) - (a?.utilPct ?? 0),
  );

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
          <Gauge className="h-4 w-4 text-chart-1" />
          Capacity Alerts
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-[10px] ml-2">
              {criticalCount} Critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {sortedData?.map((alert, idx) => {
            const colors = getStatusColor(alert?.status);
            const utilPct = clamp(alert?.utilPct ?? 0);

            return (
              <div
                key={alert?.id ?? idx}
                className={`p-2.5 rounded-lg border ${colors.border} bg-background/30`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert?.status === "CRITICAL" && (
                      <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />
                    )}

                    <span className="text-sm font-medium text-foreground">
                      {alert?.region ?? "--"}
                    </span>

                    {alert?.pattern && (
                      <Badge variant="outline" className="text-[10px]">
                        {alert.pattern}
                      </Badge>
                    )}
                  </div>

                  <span className={`text-sm font-bold ${colors.text}`}>
                    {utilPct}%
                  </span>
                </div>

                <GaugeBar value={utilPct} status={alert?.status} />

                <div className="mt-1 text-[10px] text-muted-foreground">
                  {alert?.geoType ?? "Unknown"}
                  {alert?.status === "CRITICAL" && " • Overload risk"}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {sortedData.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-6">
              No capacity alerts available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const CapacityAlertsCardSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);
