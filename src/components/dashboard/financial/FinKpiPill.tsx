import { cn } from "@/lib/utils";
import type { FinKpi } from "@/mocks/financialDashboard.mock";

interface FinKpiPillProps {
  kpi: FinKpi;
}

export const FinKpiPill = ({ kpi }: FinKpiPillProps) => {
  const formatIndianCurrency = (value: number, prefix = "") => {
    if (value >= 10000000) {
      // Crore
      return `${prefix}${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      // Lakh
      return `${prefix}${(value / 100000).toFixed(2)} L`;
    } else {
      // Normal formatting
      return `${prefix}${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const formattedValue =
    typeof kpi.value === "number"
      ? formatIndianCurrency(kpi.value, kpi.prefix ?? "")
      : kpi.value;

  return (
    <div className="bg-gradient-to-br from-muted/30 border border-border/50 to-transparent rounded-xl p-4 min-w-[180px] flex-1 hover:scale-[1.02] transition-transform">
      <p className="text-xs text-muted-foreground tracking-wide mb-1">
        {kpi.label}
      </p>

      <p
        className={cn(
          "text-2xl font-bold mb-1 text-foreground",
          kpi.id === "budget" &&
            kpi.subtext === "Out of Track" &&
            "text-destructive",
        )}
      >
        {formattedValue}
      </p>

      {kpi.subtext && (
        <span
          className={cn(
            "text-xs text-muted-foreground",
            kpi.id === "budget" &&
              kpi.subtext === "Out of Track" &&
              "text-destructive",
          )}
        >
          {kpi.subtext}
        </span>
      )}
    </div>
    // <div className="glass-card rounded-xl p-4 min-w-[180px] flex-1 hover:scale-[1.02] transition-transform">
    //   <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
    //     {kpi.label}
    //   </p>
    //   <p className="text-2xl font-bold text-foreground mb-1">{kpi.value}</p>
    //   {kpi.subtext && (
    //     <span className="text-xs text-muted-foreground">{kpi.subtext}</span>
    //   )}
    // </div>
  );
};

export const FinKpiPillSkeleton = () => (
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
