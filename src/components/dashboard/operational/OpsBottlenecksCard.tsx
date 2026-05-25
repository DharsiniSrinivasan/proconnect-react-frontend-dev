/**
 * Ops Bottlenecks Card
 * Pie chart + trend showing Cross-Reg % of total exceptions with action items
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
} from "lucide-react";
import type { OpsBottleneck } from "@/mocks/operationalDashboard.mock";
import { formatNumber } from "@/lib/formatters";
// Custom Tooltip for Pie Chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { name, value, payload: original } = payload[0];
    return (
      <div
        className="p-2 rounded border"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))",
        }}
      >
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs">Percentage: {(value ?? 0).toFixed(2)}%</div>
        <div className="text-xs">Shipments: {formatNumber(original?.count)?? 0}</div>
      </div>
    );
  }
  return null;
};
interface OpsBottlenecksCardProps {
  data: OpsBottleneck[];
  summary: string;
}

const COLORS = [
  "hsl(var(--pink))",
  "hsl(var(--warning))",
  "hsl(var(--chart-2))",
  "hsl(var(--primary))",
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-pink" />;
  if (trend === "down")
    return <TrendingDown className="h-3 w-3 text-chart-2" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

export const OpsBottlenecksCard = ({
  data,
  summary,
}: OpsBottlenecksCardProps) => {
  const safeData = data ?? [];

  const chartData = safeData.map((d, idx) => ({
    name: d?.category ?? `Category ${idx + 1}`,
    value: d?.percentage ?? 0,
    count: d?.count ?? 0,
  }));

  const totalExceptions = safeData.reduce((sum, d) => sum + (d?.count ?? 0), 0);

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Ops Bottlenecks
          <Badge variant="outline" className="text-[10px] ml-2">
            {formatNumber(totalExceptions)} delayed shipment{totalExceptions>1?'s':''}
          </Badge>
        </CardTitle>

        <p className="text-xs text-muted-foreground">{summary}</p>
      </CardHeader>
      <CardContent>
        {safeData.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-8">
            No operational bottleneck data available
          </div>
        ) : (
          <>
            <div className="flex gap-4 items-center">
              {/* Pie Chart */}
              <div className="h-[200px] w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData?.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with trends */}
              <div className="flex flex-col justify-center space-y-2 w-1/2 py-2">
                {safeData.slice(0, 4).map((item, idx) => (
                  <div
                    key={item?.id ?? idx}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="truncate flex-1 text-muted-foreground">
                      {item?.category ?? "Unknown"}
                    </span>
                    <TrendIcon trend={item?.trend ?? "FLAT"} />
                    <span className="font-medium text-foreground">
                      {item?.percentage ?? 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action items */}
            <div className="mt-2 flex flex-wrap gap-2">
              {safeData.map((item, idx) => (
                <div
                  key={item?.id ?? `action-${idx}`}
                  className="flex items-center gap-1 text-xs bg-muted/20 px-2 py-1 rounded border border-border/20 max-w-[220px]"
                >
                  <CheckCircle className="h-3 w-3 text-chart-2 shrink-0" />

                  <span className="text-muted-foreground truncate">
                    {item?.category ?? "Item"}:
                  </span>

                  <span className="font-medium text-foreground truncate">
                    {item?.actionItem ?? "No action"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const OpsBottlenecksCardSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[160px] w-full" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
