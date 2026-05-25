import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { CostAllocationNode } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface CostAllocationTreemapProps {
  data: CostAllocationNode[];
}


const COLORS = [
  "hsl(var(--orange))",
  "hsl(var(--accent))",
  "hsl(142 76% 36%)",
  "hsl(25 85% 45%)",
];

export const CostAllocationTreemap = ({ data }: CostAllocationTreemapProps) => {
  // Transform data for stacked bar
  const stackedData = data?.reduce((acc, parent) => {
    parent.children?.forEach((child) => {
      const existing = acc.find((item) => item.name === child.name);
      if (existing) {
        existing[parent.name] = child.value;
        existing.total += child.value;
      } else {
        acc.push({
          name: child.name,
          [parent.name]: child.value,
          total: child.value,
        });
      }
    });
    return acc;
  }, [] as any[]);

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Freight Cost Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Landed cost split into base freight, ODA, tax (% share).
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={stackedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              fontSize={11}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
             tickFormatter={(val)=>formatCurrency(val)}
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
                fontSize: "12px", // smaller text for mobile
                padding: "6px 8px",
              }}
              wrapperStyle={{
                maxWidth: "80vw",   // prevent overflow
                wordBreak: "break-word",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
            />
            {data?.map((parent, idx) => (
              <Bar
                key={parent.name}
                dataKey={parent.name}
                stackId="a"
                fill={COLORS[idx % COLORS.length]}
                maxBarSize={50}
                radius={idx === data.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const CostAllocationTreemapSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-28 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[240px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
