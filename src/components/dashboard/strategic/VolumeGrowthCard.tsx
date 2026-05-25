/**
 * Volume Growth - Enhanced arrow trend with MoM % and regional breakdown
 */
import { formatNumber } from "@/lib/formatters";
import { Package, Globe } from "lucide-react";

interface VolumeGrowthCardProps {
  data: any;
}



// Color scale for regions based on volume share
const getBarColor = (sharePercent: number) => {
  if (sharePercent >= 40) return "bg-emerald-500";
  if (sharePercent >= 30) return "bg-blue-500";
  if (sharePercent >= 20) return "bg-yellow-500";
  if (sharePercent >= 10) return "bg-orange-500";
  return "bg-gray-400";
};

export const VolumeGrowthCard = ({ data }: VolumeGrowthCardProps) => {
  if (!data) {
    return (
      <div className="glass-card neon-border p-4 flex-1 min-w-[220px] text-xs text-muted-foreground text-center">
        Unit data unavailable
      </div>
    );
  }

  const currentVolume = Number(data.currentVolume ?? 0);
  const geoSplit = Array.isArray(data.geoSplit) ? data.geoSplit : [];
  const maxVolume = currentVolume;

  return (
    <div className="glass-card neon-border p-4 flex-1 min-w-[220px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-success/10">
            <Package className="w-3 h-3 text-success" />
          </div>
          <span className="text-sm font-semibold text-foreground  tracking-wider">
            Total Units
          </span>
        </div>
      </div>

      {/* Card description */}
      <p className="text-[10px] text-muted-foreground mb-2">
        Total units shipped for the period with regional share breakdown.
      </p>

      {/* Main volume */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
        <div className="flex-1">
          {/* Label above the KPI */}
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Units Shipped
          </span>
          <div className="text-2xl font-bold text-foreground neon-text">
            {formatNumber(currentVolume)}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Total units shipped
          </p>
        </div>
      </div>

      {/* Geo breakdown */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
          <Globe className="w-3 h-3" />
          <span>Regional Distribution</span>
          <span className="ml-auto text-[9px]">Share % | Unit</span>
        </div>

        {geoSplit.length === 0 ? (
          <div className="text-[10px] text-muted-foreground text-center py-4">
            No regional data available
          </div>
        ) : (
          geoSplit?.map((geo, i) => {
            const volume = Number(geo?.volume ?? 0);
            const sharePercent = Number(geo?.percent ?? 0);
            const widthPercent = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;

            return (
              <div key={geo?.region ?? i} className="group">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground w-12">
                      {geo?.region ?? "--"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({sharePercent}%)
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-foreground">
                      {formatNumber(volume)}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      units
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-primary`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30 text-[10px] text-muted-foreground">
        <span>{data?.shipmentYear ?? "--"}</span>
      </div>
    </div>
  );
};

export const VolumeGrowthCardSkeleton = () => (
  <div className="glass-card p-4 flex-1 min-w-[220px]">
    <div className="flex items-start justify-between mb-1">
      <div className="skeleton-glow h-3 w-24 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-48 rounded mb-2" />
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
      <div className="flex-1">
        <div className="skeleton-glow h-3 w-16 rounded mb-0.5" />
        <div className="skeleton-glow h-7 w-20 rounded" />
        <div className="skeleton-glow h-2 w-20 rounded mt-1" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between mb-1">
        <div className="skeleton-glow h-3 w-28 rounded" />
        <div className="skeleton-glow h-3 w-20 rounded" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="flex justify-between mb-0.5">
            <div className="skeleton-glow h-3 w-16 rounded" />
            <div className="skeleton-glow h-4 w-12 rounded" />
          </div>
          <div className="skeleton-glow h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
