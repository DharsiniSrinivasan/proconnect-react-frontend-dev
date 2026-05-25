/**
 * Cross-Region Escalation - Alert trend line
 */
import { formatNumber } from "@/lib/formatters";
import { AlertTriangle } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface LabelConfig {
  key: string;
  label: string;
  min: number;
  max: number | null;
  description: string;
}

interface CrossRegionAlertCardProps {
  data: any;
  mitigation: string;
  labelConfig?: LabelConfig[];
}

export const CrossRegionAlertCard = ({
  data,
  mitigation,
  labelConfig = [],
}: CrossRegionAlertCardProps) => {
  const safeData = Array.isArray(data) ? data : [];
  const hasData = safeData.length > 0;
  // Color mapping for each Q
  const colorMap: Record<string, string> = {
    Q1: "hsl(200, 85%, 55%)", // blue
    Q2: "hsl(35, 90%, 55%)", // orange
    Q3: "hsl(330, 80%, 65%)", // pink
    Q4: "hsl(135, 70%, 45%)", // green
    Q5: "hsl(275, 75%, 60%)", // purple
  };

  return (
    <div className="glass-card neon-border p-5 h-full border-primary/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Cross-Region Distribution
        </h3>
      </div>

      {/* Card description */}
      <p className="text-xs text-muted-foreground mb-3">
        Monthly trend of shipment volumes across freight distance bands. Rising
        cross-region lines indicate increasing long-haul costs that may need
        route optimisation.
      </p>

      {/* Chart */}
      <div className="h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeData}>
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{
                  value: "Shipment Unit",
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
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
                formatter={(value: any, name: string) => {
                  const config = labelConfig.find((c) => c.key === name);
                  const label = config?.description || name;
                  return [`${formatNumber(value)}`, label];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "10px" }}
                formatter={(value) => {
                  const config = labelConfig.find((c) => c.key === value);
                  const displayText = config?.description || value;
                  return (
                    <span className="text-muted-foreground">{displayText}</span>
                  );
                }}
              />

              {labelConfig.length > 0 ? (
                labelConfig?.map((config) => (
                  <Line
                    key={config.key}
                    type="monotone"
                    dataKey={(d) => d?.[config.key] ?? 0}
                    name={config.key}
                    stroke={colorMap[config.key] || "hsl(var(--primary))"}
                    strokeWidth={2}
                    dot={{
                      fill: colorMap[config.key] || "hsl(var(--primary))",
                      strokeWidth: 0,
                    }}
                  />
                ))
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey={(d) => d?.Q1 ?? 0}
                    name="Q1"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--secondary))", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={(d) => d?.Q2 ?? 0}
                    name="Q2"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--warning))", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={(d) => d?.Q3 ?? 0}
                    name="Q3"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={(d) => d?.Q4 ?? 0}
                    name="Q4"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={(d) => d?.Q5 ?? 0}
                    name="Q5"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 0 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No cross-region trend data available
          </div>
        )}
      </div>

      {/* Mitigation */}
      {mitigation != "" && (
        <div className="mt-3 p-2 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-xs text-secondary">
            <strong>Mitigation:</strong> {mitigation || ""}
          </p>
        </div>
      )}
    </div>
  );
};

export const CrossRegionAlertCardSkeleton = () => (
  <div className="glass-card p-5 h-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-36 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-3/4 rounded mb-3" />
    <div className="flex gap-2 mb-3">
      <div className="skeleton-glow h-12 w-28 rounded-lg" />
      <div className="flex gap-2 flex-wrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-glow h-7 w-24 rounded-md" />
        ))}
      </div>
    </div>
    <div className="skeleton-glow h-[300px] w-full rounded" />
  </div>
);
