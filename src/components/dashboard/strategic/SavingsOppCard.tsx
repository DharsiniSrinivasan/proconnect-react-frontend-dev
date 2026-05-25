/**
 * Network Savings Opportunity - Enhanced KPI with detailed lane analysis
 */
import {
  PiggyBank,
  ArrowRight,
  TrendingUp,
  Target,
  MapPin,
  Package,
  Calculator,
} from "lucide-react";

interface LabelConfig {
  key: string;
  label: string;
  min: number;
  max: number | null;
  description: string;
}
interface SavingsOppCardProps {
  data: any;
  labelConfig?: LabelConfig[];
}

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
    // Standard Indian format with commas
    return `₹${value.toLocaleString("en-IN")}`;
  }
};

export const SavingsOppCard = ({
  data,
  labelConfig = [],
}: SavingsOppCardProps) => {
  const maxSavings = Math.max(...(data.topLanes?.map((l) => l.savings) || [0]));
  const crossRegionLanes =
    data.topLanes?.filter((l) => l.category === "Cross Region").length || 0;
  const getDescriptionByKey = (key: string) => {
    const item = labelConfig.find((config) => config.key === key);
    return item ? item.description : key;
  };
  return (
    <div className="glass-card neon-border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-success/10 border border-success/20">
            <PiggyBank className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Network Savings Opportunity
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Actual vs Ratebook variance analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <span className="text-2xl font-bold text-success neon-text">
              {formatCurrency(data.totalSavings || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-border/50">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
          <div className="p-2 rounded-md bg-primary/10">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">
              {data.topLanes?.length || 0}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase">
              Top Lanes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
          <div className="p-2 rounded-md bg-warning/10">
            <Target className="w-4 h-4 text-warning" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">
              {crossRegionLanes}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase">
              Cross Region
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
          <div className="p-2 rounded-md bg-chart-2/10">
            <Package className="w-4 h-4 text-chart-2" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">
              {getDescriptionByKey(data.topLanes?.[0]?.pattern) || "-"}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase">
              Top Pattern
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
          <div className="p-2 rounded-md bg-success/10">
            <Calculator className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">
              {data?.avgVariance || 0}%
            </span>
            <p className="text-[10px] text-muted-foreground uppercase">
              Avg Variance
            </p>
          </div>
        </div>
      </div>

      {/* Top Lanes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            Top Savings Lanes
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.topLanes?.map((lane, index) => {
            const barWidth =
              lane?.savings && maxSavings
                ? (lane.savings / maxSavings) * 100
                : 0;

            return (
              <div
                key={lane?.lane || index}
                className="group relative p-4 rounded-xl bg-muted/20 hover:bg-muted/30 border border-transparent hover:border-primary/20 transition-all"
              >
                {/* Rank badge */}
                <div className="absolute -left-1 top-4 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="ml-4">
                  {/* Lane header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-semibold text-foreground">
                        {lane?.lane || "-"}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          lane?.category === "Cross Region"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {lane?.category || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Pattern tag */}
                  <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 inline-block mb-2">
                    {getDescriptionByKey(lane?.pattern) || "-"}
                  </span>

                  {/* Details row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                    {lane?.volume && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {lane.volume}
                      </span>
                    )}
                  </div>

                  {/* Rate comparison */}
                  {lane?.currentRate && lane?.ratebookRate && (
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="text-orange-500">
                        {lane.currentRate}
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-success">{lane.ratebookRate}</span>
                    </div>
                  )}

                  {/* Savings */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Savings potential
                    </span>
                    <span className="text-lg font-bold text-success">
                      {formatCurrency(lane?.savings || 0)}
                    </span>
                  </div>

                  {/* Savings bar */}
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success to-success/60 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground">
          Analysis based on {data?.shipmentYear || ""} shipment data vs
          contracted rate cards
        </div>
      </div>
    </div>
  );
};

export const SavingsOppCardSkeleton = () => (
  <div className="glass-card p-6">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="skeleton-glow w-10 h-10 rounded-xl" />
        <div>
          <div className="skeleton-glow h-5 w-48 rounded" />
          <div className="skeleton-glow h-3 w-32 rounded mt-1" />
        </div>
      </div>
      <div className="skeleton-glow h-10 w-24 rounded-lg" />
    </div>
    <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-border/50">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-glow h-16 rounded-lg" />
      ))}
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-glow h-32 rounded-xl" />
      ))}
    </div>
  </div>
);
