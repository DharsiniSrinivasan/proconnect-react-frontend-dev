import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import type { VolForecastPoint } from "@/mocks/forecasts.mock";
import { formatNumber } from "@/lib/formatters";

interface VolForecastChartProps {
  data: VolForecastPoint[];
}



const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;

  return (
    <div
      className="
        bg-popover text-popover-foreground border rounded-lg shadow-md
        p-2 sm:p-3
        max-w-[220px] sm:max-w-xs
        text-xs sm:text-sm
        break-words
      "
    >
      {/* Label */}
      <p className="font-semibold mb-1 truncate">{label}</p>

      {/* Values */}
      <div className="space-y-0.5">
        {payload?.map((entry: any, i: number) => (
          <p
            key={i}
            style={{ color: entry?.color }}
            className="leading-tight"
          >
            <span className="font-medium">{entry?.name}:</span>{" "}
            {entry?.value?.toLocaleString?.()}
          </p>
        ))}
      </div>

      {/* Explanation */}
      {data?.volForecast_explanation && (
        <p
          className="
            mt-2 pt-2 border-t
            text-[10px] sm:text-xs
            text-muted-foreground
            leading-snug
            max-h-24 overflow-y-auto
          "
        >
          {data?.volForecast_explanation}
        </p>
      )}
    </div>
  );
};
export const VolForecastChart = ({ data }: VolForecastChartProps) => {
  /**
   * Detect dynamic unit keys
   * Example: "1-2 units", "3-5 units", ">10 units"
   */
  const unitKeys = useMemo(() => {
  if (!data?.length) return [];

  const ignoreKeys = [
    "month",
    "p50",
    "p75",
    "p90",
    "volForecast_explanation",
  ];

  return Object.keys(data[0])
    .filter(
      (key) =>
        !ignoreKeys.includes(key) &&
        typeof data[0][key as keyof (typeof data)[0]] === "number"
    )
    .sort((a, b) => {
      const getStart = (key: string) => {
        const val = key.replace("unit_", "");

        // keep ">10" always last
        if (val.includes(">")) return Infinity;

        // extract start number from "1-2", "3-5", etc.
        return parseInt(val.split("-")[0], 10);
      };

      return getStart(a) - getStart(b);
    });
}, [data]);

  if (!data?.length) return null;

  return (
    <Card className="glass-card neon-border overflow-visible">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Unit Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />

              <YAxis
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
                tickFormatter={(val)=>formatNumber(val)}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Confidence Bands */}
              <Area
                type="monotone"
                dataKey="p90"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                name="P90"
              />

              <Area
                type="monotone"
                dataKey="p75"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                name="P75"
              />

              <Line
                type="monotone"
                dataKey="p50"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                name="P50"
              />

              {/* Dynamic Unit Lines */}
              {unitKeys?.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                  name={key}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Shaded: P50-P90 confidence interval • Dashed: unit distribution
        </p>
      </CardContent>
    </Card>
  );
};

export const VolForecastChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-40 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
