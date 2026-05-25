import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FreightForecastPoint } from "@/mocks/forecasts.mock";
import { formatCurrency } from "@/lib/formatters";

interface FreightForecastChartProps {
  data: FreightForecastPoint[];
}


const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const explanation = payload[0]?.payload?.freightForecast_explanation;

  return (
    <div
      className="
        rounded-lg border bg-card p-2 sm:p-3 shadow-md
        max-w-[220px] sm:max-w-xs
        text-xs sm:text-sm
        space-y-1
        break-words
      "
    >
      {/* Label */}
      <div className="font-medium text-foreground truncate">{label}</div>

      {/* Payload Values */}
      {payload?.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex justify-between gap-2 sm:gap-4"
        >
          <span style={{ color: entry.color }} className="truncate">{entry.name}</span>
          <span className="font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}

      {/* Explanation */}
      {explanation && (
        <div
          className="
            pt-2 mt-2 border-t text-muted-foreground
            text-[10px] sm:text-xs
            max-h-24 overflow-y-auto
          "
        >
          {explanation}
        </div>
      )}
    </div>
  );
};
export const FreightForecastChart = ({ data }: FreightForecastChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Freight Forecast by Scenario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                tickFormatter={(val)=>formatCurrency(val)}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="pessimistic"
                stroke="hsl(var(--orange))"
                fill="hsl(var(--orange))"
                fillOpacity={0.2}
                name="Pessimistic (+20% Vol)"
              />
              <Area
                type="monotone"
                dataKey="base"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
                name="Base"
              />
              <Area
                type="monotone"
                dataKey="oda_total"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.3}
                name="ODA"
              />
              <Area
                type="monotone"
                dataKey="local"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.15}
                name="Local"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Stacked: Base + ODA split • Orange: Pessimistic scenario
        </p>
      </CardContent>
    </Card>
  );
};

export const FreightForecastChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-44 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
