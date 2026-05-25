/**
 * Weekly Trends Chart
 * Multi-line Freight/Qty rollups with forecast overlay
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { WeeklyTrend } from "@/mocks/operationalDashboard.mock";

interface WeeklyTrendsChartProps {
  data: WeeklyTrend[];
}

export const WeeklyTrendsChart = ({ data }: WeeklyTrendsChartProps) => {
  const safeData = data ?? [];

  // Split into actual and forecast
  const actualData = safeData.filter((d) => (d?.freightPerQty ?? 0) > 0);
  const lastActual = actualData[actualData.length - 1];

  const lastRow = safeData[safeData.length - 1];

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
            <TrendingUp className="h-4 w-4 text-chart-1" />
            Weekly Trends
          </CardTitle>

          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-chart-1 rounded" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-3 h-0.5 bg-chart-4 rounded"
                style={{ opacity: 0.6 }}
              />
              <span className="text-muted-foreground">Forecast</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={safeData}
              margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                width={45}
                domain={["auto", "auto"]}
              />

              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value?: number, name?: string) => [
                  `₹${(value ?? 0).toLocaleString()}`,
                  name === "freightPerQty" ? "Actual ₹/Qty" : "Forecast",
                ]}
              />

              <Line
                type="monotone"
                dataKey="freightPerQty"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "hsl(var(--chart-1, 221 83% 65%))",
                  stroke: "hsl(var(--chart-1, 221 83% 65%))",
                }}
                connectNulls={false}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{
                  r: 3,
                  fill: "hsl(var(--chart-1, 221 83% 65%))",
                  stroke: "hsl(var(--chart-1, 221 83% 65%))",
                  strokeDasharray: "0",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs p-2 bg-muted/20 rounded-lg border border-border/30">
          <div>
            <span className="text-muted-foreground">
              Latest Actual ({lastActual?.week ?? "--"}):
            </span>
            <span className="ml-2 font-semibold text-chart-1">
              ₹{(lastActual?.freightPerQty ?? 0).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground">Next Forecast:</span>
            <span className="ml-2 font-semibold text-chart-4">
              ₹{(lastRow?.forecast ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Empty state */}
        {safeData.length === 0 && (
          <div className="text-xs text-muted-foreground text-center mt-4">
            No weekly trend data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const WeeklyTrendsChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
