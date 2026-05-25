import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPI } from "@/mocks/strategicDashboard.mock";

interface KpiPillProps {
  kpi: KPI;
  index: number;
}

export const KpiPill = ({ kpi, index }: KpiPillProps) => {
  let TrendIcon:any;

  if (kpi.trend === "up") {
    TrendIcon = TrendingUp;
  } else if (kpi.trend === "down") {
    TrendIcon = TrendingDown;
  } else {
    TrendIcon = Minus;
  }

  const trendColor = kpi.isPositive ? "text-success" : "text-destructive";

  return (
    <div
      className="glass-card neon-border p-4 flex-1 min-w-[180px] transition-all duration-300 hover:scale-[1.02] group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {kpi.label}
        </span>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-xs font-mono font-medium">
            {kpi.trendValue}
          </span>
        </div>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold text-foreground neon-text group-hover:text-primary transition-colors">
          {kpi.value}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
    </div>
  );
};

export const KpiPillSkeleton = () => (
  <div className="glass-card p-4 flex-1 min-w-[180px]">
    <div className="flex items-start justify-between mb-2">
      <div className="skeleton-glow h-3 w-24 rounded" />
      <div className="skeleton-glow h-3 w-12 rounded" />
    </div>
    <div className="skeleton-glow h-8 w-20 rounded mb-1" />
    <div className="skeleton-glow h-3 w-28 rounded" />
  </div>
);
