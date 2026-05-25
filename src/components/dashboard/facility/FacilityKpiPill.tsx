import type { FacilityKpi } from "@/mocks/facilityDashboard.mock";

interface FacilityKpiPillProps {
  kpi: FacilityKpi;
}

export const FacilityKpiPill = ({ kpi }: FacilityKpiPillProps) => {
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
    <div className="bg-gradient-to-br from-muted/30 border border-border/50 to-transparent rounded-xl p-4 min-w-[160px] flex-1 hover:scale-[1.02] transition-transform">
      <p className="text-xs text-muted-foreground tracking-wide mb-1">
        {kpi.label}
      </p>
      <p className="text-2xl font-bold text-foreground mb-1">
        {formattedValue}
      </p>
      {kpi.subtext && (
        <span className="text-xs text-muted-foreground">{kpi.subtext}</span>
      )}
    </div>
  );
};

export const FacilityKpiPillSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="skeleton-glow w-4 h-4 rounded" />
        <div className="skeleton-glow h-4 w-32 rounded" />
      </div>
      <div className="skeleton-glow h-7 w-24 rounded" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-glow h-24 rounded-xl" />
      ))}
    </div>
  </div>
);
