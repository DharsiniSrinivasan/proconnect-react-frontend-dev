/**
 * Regional Heatmap - Choropleth by state
 */ 
import { Map, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { StateHeatmap } from "@/mocks/strategicDashboardV2.mock";
import { formatNumber } from "@/lib/formatters";

interface RegionalHeatmapCardProps {
  data: StateHeatmap[];
}

const getIntensityColor = (intensity?: string) => {
  switch (intensity) {
    case "low":
      return "bg-orange-500/60 border-orange-500";
    case "medium":
      return "bg-warning/60 border-warning";
    case "high":
      return "bg-success/70 border-success";
    case "critical":
      return "bg-blue-500/70 border-blue";
    default:
      return "bg-muted/40 border-border";
  }
};

const getIntensityLabel = (intensity?: string, count?: string) => {
  const labelMap: Record<string, string> = {
    low: "Low Unit",
    medium: "Medium Unit",
    high: "High Unit",
    critical: "Very High Unit",
  };

  const label = labelMap[intensity ?? ""] || "Unknown";

  return count !== undefined ? `${label} (${count})` : label;
};


const formatCurrency = (value: number, compact = true) => {
  if (compact) {
    if (value >= 1_00_00_000)
      return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.00$/, "")}Cr`;
    if (value >= 1_00_000)
      return `₹${(value / 1_00_000).toFixed(2).replace(/\.00$/, "")}L`;
    if (value >= 1_000)
      return `₹${(value / 1_000).toFixed(2).replace(/\.00$/, "")}K`;
    return `₹${value}`;
  } else {
    return `₹${value.toLocaleString("en-IN")}`;
  }
};

export const RegionalHeatmapCard = ({ data }: RegionalHeatmapCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safeData = Array.isArray(data) ? data : [];

  const hasData = safeData.length > 0;

  const itemsPerRow = 6;
  const rowsToShow = 2;
  const initialItemCount = itemsPerRow * rowsToShow;

  const displayedData = isExpanded
    ? safeData
    : safeData.slice(0, initialItemCount);
  const hasMore = safeData.length > initialItemCount;
  const summary = safeData.reduce(
    (acc, item) => {
      const level = item?.intensity?.toLowerCase();
      const volume = item?.volume ?? 0;

      if (level === "low") {
        acc.low.count += 1;
        acc.low.volume = Number((acc.low.volume + volume).toFixed(2));
      } else if (level === "medium") {
        acc.medium.count += 1;
        acc.medium.volume = Number((acc.medium.volume + volume).toFixed(2));
      } else if (level === "high") {
        acc.high.count += 1;
        acc.high.volume = Number((acc.high.volume + volume).toFixed(2));
      }

      return acc;
    },
    {
      low: { count: 0, freight: 0, volume: 0 },
      medium: { count: 0, freight: 0, volume: 0 },
      high: { count: 0, freight: 0, volume: 0 },
    },
  );
  return (
    <div className="glass-card neon-border p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Map className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          State wise Qty Heatmap
        </h3>

        <div className="ml-auto flex items-center gap-3 text-xs">
          {[
            ["Low", "bg-orange-500/60"],
            ["Med", "bg-warning/60"],
            ["High", "bg-success/70"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${color}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card description */}
      <p className="text-xs text-muted-foreground mb-4">
        Freight cost per unit quantity by state, sorted lowest to highest
      </p>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg border border-orange-500/40 bg-orange-500/10">
          <div className="text-xs text-muted-foreground">Low Unit</div>
          <div className="text-sm font-semibold text-orange-500">
            {summary.low.count} States
          </div>
          <div className="text-xs text-foreground/80">
            Total Unit : {formatNumber(summary?.low?.volume)}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-warning/40 bg-warning/10">
          <div className="text-xs text-muted-foreground">Medium Unit</div>
          <div className="text-sm font-semibold text-warning">
            {summary.medium.count} States
          </div>
          <div className="text-xs text-foreground/80">
            Total Unit : {formatNumber(summary?.medium?.volume)}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-success/40 bg-success/10">
          <div className="text-xs text-muted-foreground">High Unit</div>
          <div className="text-sm font-semibold text-success">
            {summary.high.count} States
          </div>
          <div className="text-xs text-foreground/80">
            Total Unit : {formatNumber(summary?.high?.volume)}
          </div>
        </div>
      </div>
      {/* Grid */}
      {hasData ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayedData?.map((state, i) => (
              <div
                key={state?.state ?? i}
                title={getIntensityLabel(
                  state?.intensity?.toLowerCase(),
                  formatNumber(state?.volume),
                )}
                className={`p-3 rounded-lg border transition-all hover:scale-105
                  ${getIntensityColor(state?.intensity?.toLowerCase())}`}
              >
                <div className="text-xs font-medium text-foreground truncate mb-1">
                  {state?.state ?? "Unknown"}
                </div>

                {/* Freight per Qty value with label */}
                <div className="text-lg font-bold text-foreground leading-tight">
                  {formatCurrency(state?.freightPerQty) ?? 0}
                </div>
                <div className="text-[9px] text-foreground/70 mb-1">
                  per unit
                </div>

                {/* Volume with label */}
                <div className="text-xs text-foreground font-mono">
                  {formatNumber(state?.volume)}
                </div>
                <div className="text-[9px] text-foreground/70">units</div>
              </div>
            ))}
          </div>

          {/* View More/Less Button */}
          {hasMore && (
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? (
                  <>
                    View less
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    View more
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[120px] text-xs text-muted-foreground">
          No state freight data available
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
        <span>
          Freight cost per Qty (₹) by state • Higher = needs optimization
        </span>
        <span>{hasData ? "Current period data" : "--"}</span>
      </div>
    </div>
  );
};

export const RegionalHeatmapCardSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-1">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-48 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-3/4 rounded mb-4" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="skeleton-glow h-20 rounded-lg" />
      ))}
    </div>
  </div>
);
