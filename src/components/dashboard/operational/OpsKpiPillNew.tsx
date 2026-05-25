/**
 * Ops KPI Pill - Simplified without trend comparisons
 */
import type { OpsKpi } from "@/mocks/operationalDashboard.mock";

interface OpsKpiPillProps {
  kpi: OpsKpi;
  index: number;
}

const getKpiAccent = (index?: number) => {
  const accents = [
    "border-l-chart-1",
    "border-l-chart-2",
    "border-l-chart-4",
    "border-l-chart-3",
    "border-l-warning",
    "border-l-primary",
  ];

  // default to first accent if index is null/undefined
  return accents[(index ?? 0) % accents.length];
};

export const OpsKpiPillNew = ({ kpi, index }: OpsKpiPillProps) => {
  // If KPI itself is null, don’t render anything (or return a skeleton)
  if (!kpi) return null;

  const formatIndianCompact = (value: number, prefix = "", suffix = "") => {
    if (value === null || value === undefined) return "0";

    const absValue = Math.abs(value);
    let formatted = "";

    if (absValue >= 10000000) {
      // Crore
      formatted = (value / 10000000).toFixed(2) + " Cr";
    } else if (absValue >= 100000) {
      // Lakh
      formatted = (value / 100000).toFixed(2) + " L";
    } else if (absValue >= 1000) {
      // Thousand
      formatted = (value / 1000).toFixed(2) + " K";
    } else {
      // Normal number
      formatted = value.toLocaleString("en-IN");
    }

    return `${prefix}${formatted}${suffix}`;
  };
  const formattedValue =
    kpi.value !== undefined && kpi.value !== null
      ? formatIndianCompact(
          Number(kpi.value),
          kpi.prefix ?? "",
          kpi.suffix ?? "",
        )
      : "0";
  return (
    <div
className="bg-gradient-to-br from-muted/30 border border-border/50 to-transparent rounded-xl p-4 hover:scale-[1.02] transition-transform"    >
      <div className="text-xs text-muted-foreground mb-1">
        {kpi.label ?? "--"}
      </div>

      <div className="text-xl font-bold text-foreground">{formattedValue}</div>

      {kpi.subtitle && (
        <div className="text-[10px] text-muted-foreground mt-1">
          {kpi.subtitle}
        </div>
      )}
    </div>
  );
};

export const OpsKpiPillNewSkeleton = () => (
   <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="skeleton-glow w-4 h-4 rounded" />
        <div className="skeleton-glow h-4 w-32 rounded" />
      </div>
      <div className="skeleton-glow h-7 w-24 rounded" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-glow h-24 rounded-xl" />
      ))}
    </div>
  </div>
);
