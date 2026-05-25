import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FreightQtyPredPoint } from "@/mocks/forecasts.mock";

interface FreightQtyPredChartProps {
  data: FreightQtyPredPoint[];
}

export const FreightQtyPredChart = ({ data }: FreightQtyPredChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Freight/Qty Prediction (Cross-Reg Focus)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                domain={[20, 80]}
                tickFormatter={(v) => `₹${v}`}
              />
            <Tooltip
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const explanation = payload[0]?.payload?.freightQtyPred_explanation;

    return (
      <div
        className="
          bg-card border border-border rounded-lg p-2 sm:p-3
          max-w-[220px] sm:max-w-xs
          text-xs sm:text-sm
          shadow-md break-words
        "
      >
        {/* Month / Label */}
        <div className="text-foreground font-medium mb-1 truncate">
          {label}
        </div>

        {/* Values */}
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex justify-between gap-2 sm:gap-4"
          >
            <span style={{ color: entry.color }} className="truncate">
              {entry.name}
            </span>
            <span className="font-medium">
              ₹
              {Number(entry.value).toLocaleString("en-IN", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
          </div>
        ))}

        {/* Explanation */}
        {explanation && (
          <div
            className="
              mt-2 pt-2 border-t border-border
              text-muted-foreground
              text-[10px] sm:text-xs
              max-h-24 overflow-y-auto
            "
          >
            {explanation}
          </div>
        )}
      </div>
    );
  }}
/>

              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                name="Actual"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
                name="Predicted"
              />
              <Line
                type="monotone"
                dataKey="ratebook"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="3 3"
                name="Ratebook"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-primary" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-0.5 bg-accent"
              style={{ borderStyle: "dashed" }}
            />{" "}
            Predicted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-muted-foreground" /> Ratebook
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-4 mx-2 mb-2">
          Monthly actual vs forecast freight with benchmark comparison.
        </p>
      </CardContent>
    </Card>
  );
};

export const FreightQtyPredChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-52 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
