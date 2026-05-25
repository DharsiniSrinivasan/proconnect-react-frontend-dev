import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyFreightData } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface MonthlyFreightChartProps {
  data: MonthlyFreightData[];
}



export const MonthlyFreightChart = ({ data }: MonthlyFreightChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Monthly Freight Spend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Monthly freight spend with shipment count (trend view).
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
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
              tickFormatter={(val)=>formatCurrency(val)}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                  fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))",  fontSize: "12px", }}
              formatter={(value: number, name: string) => [
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
            <Bar
              dataKey="freight"
              name="Freight (Includes ODA)"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="odaCharge"
              name="ODA Charge"
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const MonthlyFreightChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[220px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
