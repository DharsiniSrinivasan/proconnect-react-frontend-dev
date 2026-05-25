/**
 * Geo TAT Proxy Heatmap
 * Shows estimated days based on Freight/Qty and distance
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Package,
  IndianRupee,
  Receipt,
} from "lucide-react";
import { formatNumber } from "@/lib/formatters";

interface GeoTatHeatmapProps {
  data: any[];
}

const getTatColor = (days: number) => {
  if (days <= 1.5)
    return "from-success/5 to-success/10 border-success/20 hover:border-success/40";
  if (days <= 3)
    return "from-warning/5 to-warning/10 border-warning/20 hover:border-warning/40";
  return "from-orange-500/5 to-orange-500/10 border-orange-500/20 hover:border-orange-500/40";
};

const getTatBadgeColor = (days: number) => {
  if (days <= 1.5) return "bg-success/20 text-success border-success/30";
  if (days <= 3) return "bg-warning/20 text-warning border-warning/30";
  return "bg-orange-500/20 text-orange-500 border-orange-500/30";
};

const getGeoTypeColor = (geoType: string) => {
  if (geoType === "Cross Region") {
    return "bg-warning/10 text-warning border border-warning/20";
  }
  if (geoType === "With-in City") {
    return "bg-success/10 text-success border border-success/20";
  }
  return "bg-primary/10 text-primary border border-primary/20";
};

export const GeoTatHeatmap = ({ data }: GeoTatHeatmapProps) => {
  const safeData = data ?? [];

  const sortedData = [...safeData].sort(
    (a, b) => (b?.estimatedDays ?? 0) - (a?.estimatedDays ?? 0),
  );

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/50 flex-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-destructive/10 rounded-md">
            <MapPin className="h-4 w-4 text-chart-4" />
          </div>
          <div>
            <CardTitle className="text-base font-medium text-foreground">
              Geo TAT Proxy
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Shipping route patterns ranked by estimated transit days.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs px-2 py-1">
          {safeData.length} total{safeData.length !== 1 ? "s" : ""}
        </Badge>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
          {sortedData.map((cell, idx) => {
            const estDays = Number(formatNumber(cell?.estimatedDays)) ?? 0;
            const freight = `₹${(formatNumber(cell?.freightPerQty) ?? 0)}`;
            const totalQty = (formatNumber(cell?.totalQty) ?? 0);
            const finalCost = `₹${(formatNumber(cell?.final_cost) ?? 0)}`;

            return (
              <div
                key={`${cell?.origin ?? "o"}-${cell?.destination ?? "d"}-${idx}`}
                className={`bg-gradient-to-br ${getTatColor(estDays)} p-3 rounded-lg border transition-all duration-200 hover:shadow-md group`}
              >
                {/* Header with Origin and Destination */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground leading-snug flex flex-wrap gap-1">
                      <span className="text-primary">
                        {cell?.origin ?? "--"}
                      </span>
                      <span className="text-muted-foreground shrink-0">→</span>
                      <span className="text-primary">
                        {cell?.destination ?? "--"}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Origin: {cell?.origin ?? "--"} • Dest:{" "}
                      {cell?.destination ?? "--"}
                    </p>
                  </div>

                  {/* Geo Type Badge */}
                  {cell?.geoType && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium flex-shrink-0 ${getGeoTypeColor(cell.geoType)}`}
                    >
                      {cell.geoType}
                    </Badge>
                  )}
                </div>

                {/* Metrics Grid - 3 columns */}
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  {/* Total Quantity */}
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">Qty</p>
                      <p className="text-xs font-semibold text-foreground truncate">
                        {totalQty}
                      </p>
                    </div>
                  </div>

                  {/* Final Cost */}
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">
                        Freight Cost
                      </p>
                      <p className="text-xs font-semibold text-foreground truncate">
                        {finalCost}
                      </p>
                    </div>
                  </div>

                  {/* Combined Docket/Invoice Count */}
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">
                        Invoice
                      </p>
                      <p className="text-xs font-semibold text-foreground truncate">
                        {formatNumber(cell?.invoiceCount) ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  {/* Freight per Quantity */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      Freight/Qty:
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {freight}
                    </span>
                  </div>

                  {/* Estimated Days with Badge */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      Est. Transit:
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold ${getTatBadgeColor(estDays)}`}
                    >
                      {estDays.toFixed(2)} days
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {safeData.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-8">
              No geo TAT data available
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border/30 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <span className="text-xs font-medium text-foreground">Speed:</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" /> ≤1.5 days
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" /> 1.5–3 days
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> &gt;3 days
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="w-2 h-2 rounded-full bg-success/50" /> Within City
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning/50" /> Cross Region
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const GeoTatHeatmapSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-3 border-b border-border/50">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-full mt-2" />
      <Skeleton className="h-3 w-3/4 mt-1" />
    </CardHeader>
    <CardContent className="pt-3">
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="space-y-2 p-2 border border-border/20 rounded-lg"
          >
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
