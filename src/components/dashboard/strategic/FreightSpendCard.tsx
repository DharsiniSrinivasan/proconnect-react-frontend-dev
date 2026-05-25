/**
 * Total Freight Spend - KPI + Sparkline + Monthly breakdown
 */
import { formatCurrency } from "@/lib/formatters";
import { IndianRupee, Calendar } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface FreightSpendCardProps {
  data: any;
}



export const FreightSpendCard = ({ data }: FreightSpendCardProps) => {
  if (!data) {
    return (
      <div className="glass-card neon-border p-4 flex-1 min-w-[220px] text-xs text-muted-foreground text-center">
        Freight spent data unavailable
      </div>
    );
  }

  const totalSpend = Number(data.totalSpend ?? 0);
  const annualTarget = Number(data.annualTarget ?? 0);
  const isExceeded = totalSpend > annualTarget;
  const progressPercent =
    annualTarget > 0 ? Math.min((totalSpend / annualTarget) * 100, 100) : 0;

  const monthlyTrend = Array.isArray(data.monthlyTrend)
    ? data.monthlyTrend
    : [];
  const exceededAmount =
    totalSpend > annualTarget ? totalSpend - annualTarget : 0;
  return (
    <div className="glass-card neon-border p-4 flex-1 min-w-[220px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <IndianRupee className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-wider">
            Total Freight Spent
          </span>
        </div>
      </div>

      {/* Card description */}
      <p className="text-[10px] text-muted-foreground mb-2">
        Cumulative freight cost for the financial year vs. annual budget target.
      </p>

      {/* Main KPI */}
      <div className="flex items-end justify-between mb-2">
        <div>
          {/* Total spent with label */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Total Spent
            </span>
            <span className="text-2xl font-bold text-foreground neon-text">
              {formatCurrency(totalSpend)}
            </span>
          </div>

          {/* Budget with label */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Budget:
            </span>
            <span className="text-xs text-muted-foreground">
              {formatCurrency(annualTarget)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all bg-primary ${isExceeded ? "bg-red-500" : "bg-success"}`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        <div
          className={`flex justify-between mt-1 text-[10px]  ${isExceeded ? "text-red-500" : "text-success"}`}
        >
          <span>{progressPercent.toFixed(0)}% of target used</span>

          {isExceeded && (
            <span
              className={` ${isExceeded ? "text-red-500" : "text-success"}`}
            >
              Exceeded by {formatCurrency(exceededAmount)}
            </span>
          )}
        </div>
      </div>

      {/* Sparkline */}
      <div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          Monthly Spent Trend
        </span>
      </div>
      <div className="h-48 -mx-1">
        {monthlyTrend.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground">
            No trend data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient
                  id="freightGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                interval={0}
                angle={-30}
                height={40}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                padding={{ left: 20, right: 20 }}
                tickFormatter={(value, index) => {
                  const item = monthlyTrend[index];
                  return `${value} ${item?.year||""}`;
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [
                  formatCurrency(value ?? 0),
                  "Monthly Spend",
                ]}
                labelFormatter={(label) => `${label ?? ""}`}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#freightGradient)"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

                  {/* Monthly values */}
    <div >
  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
    Monthly Spent
  </span>

  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
    {monthlyTrend?.map((item) => (
      <div
        key={item.month}
        className="rounded-lg border border-border/40 bg-muted/20 px-2 py-2 text-center"
      >
        <p className="text-[10px] text-muted-foreground">
          {item.month.split(" ")[0]}
        </p>
        <p className="text-xs font-medium text-foreground">
          {formatCurrency(item.value)}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export const FreightSpendCardSkeleton = () => (
  <div className="glass-card p-4 flex-1 min-w-[220px]">
    <div className="flex items-start justify-between mb-1">
      <div className="skeleton-glow h-3 w-28 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-48 rounded mb-2" />
    <div className="skeleton-glow h-3 w-16 rounded mb-0.5" />
    <div className="skeleton-glow h-8 w-24 rounded mb-1" />
    <div className="skeleton-glow h-3 w-32 rounded mb-2" />
    <div className="skeleton-glow h-1.5 w-full rounded-full mb-3" />
    <div className="skeleton-glow h-3 w-28 rounded mb-1" />
    <div className="skeleton-glow h-16 w-full rounded" />
  </div>
);
