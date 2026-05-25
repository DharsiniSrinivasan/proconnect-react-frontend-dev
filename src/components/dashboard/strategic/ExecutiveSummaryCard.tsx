/**
 * Executive Summary - 4 KPI tiles grid with PDF export
 * No historical comparisons - current snapshot only
 */
import {
  FileText,
  Download,
  Package,
  IndianRupee,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExecutiveSummaryKpi } from "@/mocks/strategicDashboardV2.mock";
import { strategic } from "@/services/strategicService";

interface ExecutiveSummaryCardProps {
  data: ExecutiveSummaryKpi[];
  id: any;
}

const getIcon = (icon: ExecutiveSummaryKpi["icon"]) => {
  switch (icon) {
    case "volume":
      return Package;
    case "cost":
      return IndianRupee;
    case "tat":
      return Clock;
    case "coverage":
      return Globe;
  }
};

export const ExecutiveSummaryCard = ({
  data,
  id,
}: ExecutiveSummaryCardProps) => {
  const handleExport = async () => {
    if (!id) return;

    try {
      await strategic.exportStrategic(id?.id);
    } catch (err: any) {
      console.error(err);
    }
  };
  const formatKpiValue = (kpi: ExecutiveSummaryKpi) => {
    const numericValue =
      typeof kpi.value === "number" ? kpi.value : Number(kpi.value);

    if (isNaN(numericValue)) {
      return `${kpi.prefix ?? ""}${kpi.value ?? "--"}${kpi.suffix ?? ""}`;
    }

    let formatted = "";

    if (Math.abs(numericValue) >= 10000000) {
      // Crore
      formatted = `${(numericValue / 10000000).toFixed(2)} Cr`;
    } else if (Math.abs(numericValue) >= 100000) {
      // Lakh
      formatted = `${(numericValue / 100000).toFixed(2)} L`;
    } else {
      // Normal format
      formatted = String(numericValue);
    }
    return `${kpi.prefix ?? ""}${formatted}${kpi.suffix ?? ""}`;
  };
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="glass-card neon-border p-5 text-sm text-muted-foreground text-center">
        No executive summary data available
      </div>
    );
  }

  return (
    <div className="glass-card neon-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Executive Summary
          </h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="text-xs font-medium  gap-1.5 hover:text-primary-foreground"
        >
          <Download className="w-3 h-3" />
          Export Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.map((kpi, index) => {
          if (!kpi) return null;

          const Icon = getIcon(kpi.icon) ?? FileText;

          return (
            <div
              key={kpi.id ?? index}
              className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>

                <span className="text-xs font-medium text-muted-foreground tracking-wider">
                  {kpi.label ?? "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {formatKpiValue(kpi)}
                </span>
              </div>
              {kpi.trendValue && (
                <span
                  className={`text-xs font-medium text-muted-foreground
                    }`}
                >
                  {kpi.trendValue}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="flex items-center justify-end text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
        <span>Current batch snapshot</span>
      </div> */}
    </div>
  );
};

export const ExecutiveSummaryCardSkeleton = () => (
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
