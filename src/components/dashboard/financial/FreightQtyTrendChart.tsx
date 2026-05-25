import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { FreightQtyTrendPoint } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface FreightQtyTrendChartProps {
  data: FreightQtyTrendPoint[];
}

export const FreightQtyTrendChart = ({ data }: FreightQtyTrendChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Freight Cost / Qty Trend vs Actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Monthly spend vs quantity to spot efficiency shifts.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={50}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontSize: "12px", }}
              formatter={(value: number, name: string): [string, string] => [
                formatCurrency(value),
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="freightPerQty"
              name="Budget ₹/Qty"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="ratebookSlab"
              name="Actual"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--muted-foreground))", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const FreightQtyTrendChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-44 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[220px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
