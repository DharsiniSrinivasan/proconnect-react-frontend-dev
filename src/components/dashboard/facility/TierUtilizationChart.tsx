import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TierUtilizationChartProps {
  data: [];
}

export const TierUtilizationChart = ({ data }: TierUtilizationChartProps) => {

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tier Utilization by Geo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Units shipped per geo per tier
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                type="category"
                dataKey="geo"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                   fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontSize: "12px", }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number | string, name: string) => {
                  return [formatNumber(Number(value) || 0), name];
                }}
              />

              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))" }}>
                    {value}
                  </span>
                )}
              />

              <Bar
                dataKey="motherHub"
                name="Mother Hub"
                fill="hsl(var(--primary))"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="satelliteHub"
                name="Satellite Hub"
                fill="hsl(var(--accent))"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="satelliteWH"
                name="Satellite WH"
                fill="hsl(var(--muted))"
                stackId="a"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const TierUtilizationChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-40 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
