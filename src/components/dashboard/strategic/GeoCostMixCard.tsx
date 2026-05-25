/**
 * Geo Cost Mix - Stacked bar chart
 */
import { MapPin } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface GeoCostMix {
  month: string;
  crossRegion: number;
  withinRegion: number;
  withinState: number;
  withinCity: number;
}

interface GeoCostMixCardProps {
  data: GeoCostMix[];
  shipmentYear: string;
}

const GEO_SEGMENTS = [
  {
    key: "crossRegion",
    label: "Cross-Region",
    color: "#6366F1",
    description:
      "Shipments across different regions — highest freight cost tier",
  },
  {
    key: "withinRegion",
    label: "Within-Region",
    color: "#0EA5E9",
    description: "Shipments within the same region",
  },
  {
    key: "withinState",
    label: "Within-State",
    color: "#f97316",
    description: "Shipments within the same state",
  },
  {
    key: "withinCity",
    label: "Within-City",
    color: "#22C55E",
    description: "Local city-level shipments — lowest freight cost tier",
  },
] as const;

export const GeoCostMixCard = ({ data, shipmentYear }: GeoCostMixCardProps) => {
  const safeData: GeoCostMix[] = Array.isArray(data) ? data : [];
  const hasData = safeData.length > 0;

  return (
    <div className="glass-card neon-border p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Geo Freight Cost Mix
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {shipmentYear || ""}
        </span>
      </div>

      {/* Card description */}
      <p className="text-xs text-muted-foreground mb-4">
        Monthly breakdown of freight cost share by shipment distance tier.
        Higher local delivery mix indicates lower avg. freight cost.
      </p>

      {/* Chart */}
      <div className="h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeData} barSize={32}>
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: "% of Freight Cost",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: {
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 10,
                  },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
                formatter={(value?: number, name?: string) => [
                  `${value ?? 0}%`,
                  name,
                ]}
              />

              <Bar
                dataKey={(d) => d?.crossRegion ?? 0}
                name="Cross-Region"
                stackId="a"
                fill="#6366F1"
              />
              <Bar
                dataKey={(d) => d?.withinRegion ?? 0}
                name="Within-Region"
                stackId="a"
                fill="#0EA5E9"
              />
              <Bar
                dataKey={(d) => d?.withinState ?? 0}
                name="Within-State"
                stackId="a"
                fill="#f97316"
              />
              <Bar
                dataKey={(d) => d?.withinCity ?? 0}
                name="Within-City"
                stackId="a"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No geo freight cost data available
          </div>
        )}
      </div>
      {/* Segment legend with descriptions */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2  mt-4">
        {GEO_SEGMENTS.map((seg) => (
          <div key={seg.key} className="flex items-start gap-1.5">
            <span
              className="mt-0.5 inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div>
              <p className="text-[11px] font-medium text-foreground leading-none mb-0.5">
                {seg.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {seg.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Footer stats with labels */}
      {/* <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">
            Cross-Region Avg
          </p>
          <p className="text-sm font-mono font-semibold text-destructive">
            {hasData ? `${crossRegionAvg}%` : "--"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Higher = costlier freight mix
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">
            Within-City Avg
          </p>
          <p className="text-sm font-mono font-semibold text-success flex items-center gap-1">
            {hasData ? (
              <>
                <TrendingDown className="w-3 h-3" />
                {withinCityAvg}%
              </>
            ) : (
              "--"
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Higher = more freight cost savings
          </p>
        </div>
      </div> */}
    </div>
  );
};

export const GeoCostMixCardSkeleton = () => (
  <div className="glass-card p-5 h-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-24 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-3/4 rounded mb-4" />
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="skeleton-glow w-2.5 h-2.5 rounded-sm mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="skeleton-glow h-3 w-16 rounded" />
            <div className="skeleton-glow h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
    <div className="skeleton-glow h-[200px] w-full rounded" />
    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/50">
      <div className="space-y-1">
        <div className="skeleton-glow h-3 w-20 rounded" />
        <div className="skeleton-glow h-5 w-12 rounded" />
        <div className="skeleton-glow h-3 w-24 rounded" />
      </div>
      <div className="space-y-1">
        <div className="skeleton-glow h-3 w-20 rounded" />
        <div className="skeleton-glow h-5 w-12 rounded" />
        <div className="skeleton-glow h-3 w-24 rounded" />
      </div>
    </div>
  </div>
);
