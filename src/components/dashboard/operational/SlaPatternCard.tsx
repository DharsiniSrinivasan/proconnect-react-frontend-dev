/**
 * SLA % by Pattern Card
 * Bar chart showing on-time % by quantity pattern with threshold alerts
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { SlaPatternData } from "@/mocks/operationalDashboard.mock";

// CustomTooltip.tsx
import type { TooltipProps } from "recharts";
import { formatNumber } from "@/lib/formatters";

interface CustomTooltipProps extends TooltipProps<number, string> {}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        padding: 8,
        color: "hsl(var(--foreground))",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: 4 }}>
        Pattern: {label ?? "--"}
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>On-Time: </span>
        {`${(data.onTimePct ?? 0).toFixed(2)}%`}
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>Total Shipment: </span>
        {formatNumber(data?.totalShipments) ?? 0}
      </div>
      {data.isAlert && (
        <div
          style={{
            marginTop: 6,
            color: "hsl(var(--warning))",
            fontWeight: 500,
          }}
        >
          ⚠️ Below threshold
        </div>
      )}
    </div>
  );
};

interface SlaPatternCardProps {
  data: SlaPatternData[];
}

const THRESHOLD = 85;
const ALERTS_PER_PAGE = 1;

export const SlaPatternCard = ({ data }: SlaPatternCardProps) => {
  const [alertPage, setAlertPage] = useState(1);

  const safeData = data ?? [];
  const alertPatterns = safeData.filter((d) => d?.isAlert);

  // ── Alert pagination ──────────────────────────────────────────────────────
  const totalAlertPages = Math.ceil(alertPatterns.length / ALERTS_PER_PAGE);
  const alertStart = (alertPage - 1) * ALERTS_PER_PAGE;
  const paginatedAlerts = alertPatterns.slice(
    alertStart,
    alertStart + ALERTS_PER_PAGE,
  );
  const hasAlertPagination = alertPatterns.length > ALERTS_PER_PAGE;

  const getBarColor = (isAlert?: boolean) => {
    if (isAlert) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  const hasAlert = safeData.some((d) => d?.isAlert);

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
          SLA % by Pattern
          {hasAlert && (
            <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={safeData}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}%`}
              />

              <YAxis
                type="category"
                dataKey="pattern"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={50}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="onTimePct" radius={[0, 4, 4, 0]}>
                {safeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry?.isAlert)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="bg-muted/40 rounded-lg p-2 border border-border/50">
          {/* Legend items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success" />
              <span className="text-xs text-muted-foreground">
                <strong>Green</strong> — On-time performance at or above{" "}
                {THRESHOLD}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-warning" />
              <span className="text-xs text-muted-foreground">
                <strong>Yellow</strong> — On-time performance below {THRESHOLD}%
              </span>
            </div>
          </div>
        </div>

        {/* Alert indicators with pagination */}
        {alertPatterns.length > 0 && (
          <div className="space-y-2">
            {/* Alert header with pagination controls */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-warning flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Patterns Requiring Attention
              </div>

              {hasAlertPagination && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAlertPage((p) => Math.max(p - 1, 1))}
                    disabled={alertPage === 1}
                    className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Previous patterns"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-warning" />
                  </button>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {alertPage} / {totalAlertPages}
                  </span>
                  <button
                    onClick={() =>
                      setAlertPage((p) => Math.min(p + 1, totalAlertPages))
                    }
                    disabled={alertPage === totalAlertPages}
                    className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Next patterns"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-warning" />
                  </button>
                </div>
              )}
            </div>

            {/* Alert rows */}
            <div className="space-y-1.5">
              {paginatedAlerts.map((d) => (
                <div
                  key={d?.pattern ?? Math.random()}
                  className="flex items-start gap-2 text-xs text-warning bg-warning/10 px-2.5 py-1.5 rounded border border-warning/20"
                >
                  <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong>{d?.qtyRange ?? "N/A"}</strong>: Low
                    freight/quantity causing delays
                    <div className="text-warning/70 mt-0.5">
                      Current: {(d?.onTimePct ?? 0).toFixed(1)}% | Target:{" "}
                      {THRESHOLD}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional empty state */}
        {safeData.length === 0 && (
          <div className="text-xs text-muted-foreground text-center mt-4">
            No SLA pattern data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SlaPatternCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32 bg-muted/50" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-16 w-full bg-muted/30 rounded-lg" />
      <Skeleton className="h-[200px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);