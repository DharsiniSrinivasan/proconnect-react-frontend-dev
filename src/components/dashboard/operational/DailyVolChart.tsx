/**
 * Daily Avg Unit Card
 * Line chart showing extrapolated daily Billed Qty with peak day markers
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
  ReferenceDot,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { DailyVolPoint } from "@/mocks/operationalDashboard.mock";
import { formatNumber } from "@/lib/formatters";

interface DailyVolChartProps {
  data: DailyVolPoint[];
}

export const DailyVolChart = ({ data }: DailyVolChartProps) => {
  const safeData = data ?? [];

  const formatDate = (date?: string) => {
    if (!date) return "--";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "--"
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const peakDays = safeData.filter((d) => d?.isPeak);

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
            <TrendingUp className="h-4 w-4 text-chart-1" />
            Daily Avg Units
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Daily billed quantity over date with peak day markers. Helps identify
          unit spikes and dispatch patterns across the period.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={safeData}
              margin={{ left: 0, right: 10, top: 10, bottom: 10 }}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatDate}
                interval="preserveStartEnd"
                type="category"
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
                height={40}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                width={55}
                domain={[0, "auto"]}
                label={{
                  value: "Billed Qty",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={formatDate}
                formatter={(value?: number) => [
                  (formatNumber(value) ?? 0),
                  "Billed Qty",
                ]}
              />

              <Line
                type="monotone"
                dataKey="billedQty"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                connectNulls={false}
              />

              {peakDays?.map((peak, i) => (
                <ReferenceDot
                  key={peak?.date ?? i}
                  x={peak?.date}
                  y={peak?.billedQty ?? 0}
                  r={6}
                  fill="hsl(var(--warning))"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          {/* <span className="text-muted-foreground">
            Avg Daily:{" "}
            <span className="text-foreground font-medium">
              {avgVol.toLocaleString()}
            </span>
          </span> */}

          <span className="text-warning">
            {peakDays.length} peak days identified
          </span>
        </div>

        {/* Optional empty state */}
        {safeData.length === 0 && (
          <div className="text-xs text-muted-foreground text-center mt-4">
            No daily unit data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DailyVolChartSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);
