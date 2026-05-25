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
import type { VolForecastGapPoint } from "@/mocks/facilityDashboard.mock";

interface VolForecastGapsChartProps {
  data: VolForecastGapPoint[];
}

const formatNumber = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

export const VolForecastGapsChart = ({ data }: VolForecastGapsChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Unit Forecast vs Capacity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
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
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [formatNumber(value), ""]}
              />
              <Area
                type="monotone"
                dataKey="upperBand"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lowerBand"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                name="Volume"
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Capacity"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Shaded area = forecast confidence band
        </p>
      </CardContent>
    </Card>
  );
};

export const VolForecastGapsChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
