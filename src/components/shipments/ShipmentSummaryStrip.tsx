import { Skeleton } from "@/components/ui/skeleton";
import type { ShipmentFiltersSummary } from "@/mocks/shipments.mock";

interface ShipmentSummaryStripProps {
  summary: ShipmentFiltersSummary;
}

export const ShipmentSummaryStrip = ({
  summary,
}: ShipmentSummaryStripProps) => {
  const items = [
    {
      label: "Filtered Records",
      value: summary.filteredRecords.toLocaleString(),
      color: "text-foreground",
    },
    {
      label: "Avg Cost/Kg",
      value: `₹${summary.avgCostPerKg}`,
      color: "text-foreground",
    },
    {
      label: "Avg TAT",
      value: `${summary.avgTat} days`,
      color: "text-foreground",
    },
    {
      label: "SLA %",
      value: `${summary.slaPct}%`,
      color:
        summary.slaPct >= 95
          ? "text-emerald-400"
          : summary.slaPct >= 90
            ? "text-amber-400"
            : "text-rose-400",
    },
    {
      label: "High Risk %",
      value: `${summary.highRiskPct}%`,
      color:
        summary.highRiskPct <= 5
          ? "text-emerald-400"
          : summary.highRiskPct <= 10
            ? "text-amber-400"
            : "text-rose-400",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-card rounded-xl px-4 py-3 min-w-[140px] flex-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            {item.label}
          </p>
          <span className={`text-xl font-bold ${item.color}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ShipmentSummaryStripSkeleton = () => (
  <div className="flex flex-wrap gap-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="glass-card rounded-xl px-4 py-3 min-w-[140px] flex-1"
      >
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
);
