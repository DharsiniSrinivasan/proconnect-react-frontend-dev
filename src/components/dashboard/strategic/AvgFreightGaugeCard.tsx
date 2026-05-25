/**
 * Avg Freight/Qty - Enhanced Gauge with trend and breakdown
 */
import { formatCurrency } from "@/lib/formatters";
import { Target, Zap } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  ReferenceLine,
} from "recharts";

interface AvgFreightGaugeCardProps {
  data: any;
}



export const AvgFreightGaugeCard = ({ data }: AvgFreightGaugeCardProps) => {
  if (!data) {
    return (
      <div className="glass-card neon-border p-4 flex-1 min-w-[220px] text-xs text-muted-foreground text-center">
        Avg freight data unavailable
      </div>
    );
  }

  const currentValue = Number(data.currentValue ?? 0);
  const targetValue = Number(data.targetValue ?? 0);

  const percentage =
    targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  const isGood = data.status?.toLowerCase() === "good";

  const trendData = Array.isArray(data.trend) ? data.trend : [];

  return (
    <div className="glass-card neon-border p-2 flex-1 min-w-[220px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-success/10">
            <Zap className="w-3 h-3 text-success" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-wider">
            Avg Freight Cost / Qty
          </span>
        </div>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            isGood ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          }`}
        >
          {isGood ? "On Track" : "Review"}
        </span>
      </div>

      {/* Card description */}
      <p className="text-[10px] text-muted-foreground mb-2">
        Average freight cost per unit shipped. Lower is better — gauge fills as
        spend approaches the target ceiling.
      </p>

      {/* Gauge + KPI */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Current Rate
          </span>
          {/* Gauge */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={isGood ? "hsl(var(--success))" : "hsl(var(--warning))"}
                strokeWidth="3"
                strokeDasharray={`${percentage * 0.88} 88`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm font-bold text-foreground neon-text">
                {formatCurrency(currentValue)}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase">
                per unit
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          {/* Target with label */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-1">
              <Target className="w-3 h-3" /> Target Value
            </span>
            <span className="text-xs font-mono font-medium text-foreground">
              {targetValue > 0 ? formatCurrency(targetValue) : "--"}
            </span>
          </div>

          {/* Usage label */}
          <div className="text-[10px] text-muted-foreground">
            {percentage.toFixed(0)}% of target used
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          Monthly Avg Trend
        </span>
      </div>
      <div className="h-48 -mx-1 mb-2">
        {trendData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground">
            No trend data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis
                dataKey="month"
                interval={0}
                 angle={-30}
                 height={40}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                padding={{ left: 20, right: 20 }}
              />

              {targetValue > 0 && (
                <ReferenceLine
                  y={targetValue}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "6px 10px",
                }}
                formatter={(value: number) => [
                  `${formatCurrency(value) ?? 0}`,
                  "Avg Freight Cost / Unit",
                ]}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly values */}
    <div className="mt-4">
  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
    Monthly Breakdown
  </span>

  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
    {trendData?.map((item) => (
      <div
        key={item.month}
        className="rounded-lg border border-border/40 bg-muted/20 px-2 py-2 text-center"
      >
        <p className="text-[10px] text-muted-foreground">
          {item.month.split(" ")[0]}
        </p>
        <p className="text-xs font-medium text-foreground">
          ₹{item.value?.toFixed(2)}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export const AvgFreightGaugeCardSkeleton = () => (
  <div className="glass-card p-4 flex-1 min-w-[220px]">
    <div className="flex items-start justify-between mb-1">
      <div className="skeleton-glow h-3 w-24 rounded" />
      <div className="skeleton-glow h-5 w-12 rounded-full" />
    </div>
    <div className="skeleton-glow h-3 w-48 rounded mb-2" />
    <div className="flex items-center gap-4 mb-3">
      <div className="skeleton-glow w-20 h-20 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-glow h-3 w-16 rounded" />
        <div className="skeleton-glow h-4 w-full rounded" />
        <div className="skeleton-glow h-3 w-16 rounded" />
        <div className="skeleton-glow h-4 w-3/4 rounded" />
        <div className="skeleton-glow h-3 w-1/2 rounded" />
      </div>
    </div>
    <div className="skeleton-glow h-3 w-28 rounded mb-1" />
    <div className="skeleton-glow h-14 w-full rounded mb-2" />
    <div className="skeleton-glow h-3 w-28 rounded mb-1" />
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-glow h-6 flex-1 rounded" />
      ))}
    </div>
  </div>
);
