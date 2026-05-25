import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PatternCostData } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface PatternCostChartProps {
  data: PatternCostData[];
}


const COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(142 76% 36%)",
  "hsl(38 92% 50%)",
];

export const PatternCostChart = ({ data }: PatternCostChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Freight cost by Pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Spend split by quantity band.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis
              type="number"
             tickFormatter={(val)=>formatCurrency(val)}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              type="category"
              dataKey="pattern"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              width={60}
            />

            <Tooltip
              wrapperStyle={{
                maxWidth: "90vw", // prevent overflow on mobile
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                padding: "8px 10px",
             
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
              itemStyle={{
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${formatCurrency(value)} (${props.payload?.percentage ?? 0}%)`,
                "Freight Cost",
              ]}
            />

            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const PatternCostChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
