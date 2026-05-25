import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { Facility } from "@/mocks/strategicDashboard.mock";

interface FacilityUtilisationChartProps {
  facilities: Facility[];
}

export const FacilityUtilisationChart = ({
  facilities,
}: FacilityUtilisationChartProps) => {
  const chartData = facilities?.map((f) => ({
    name: f.name
      .replace(" Hub", "")
      .replace(" Central", "")
      .replace(" Tech Park", "")
      .replace(" Port Hub", "")
      .replace(" East", "")
      .replace(" Gateway", "")
      .replace(" Logistics Park", "")
      .replace(" Distribution", ""),
    utilisation: f.utilisationPercent,
    isOverCapacity: f.utilisationPercent > 85,
  }));

  return (
    <div className="glass-card neon-border h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">
            Facility Utilisation
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-destructive/80" />
          <span>&gt;85% Critical</span>
        </div>
      </div>
      <div className="flex-1 p-4 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222 30% 18%)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
              tickLine={{ stroke: "hsl(222 30% 18%)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
              tickLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 9%)",
                border: "1px solid hsl(185 100% 50% / 0.3)",
                borderRadius: "8px",
                boxShadow: "0 0 20px hsl(185 100% 50% / 0.2)",
              }}
              labelStyle={{ color: "hsl(210 40% 96%)", fontWeight: 600 }}
              itemStyle={{ color: "hsl(185 100% 50%)" }}
              formatter={(value: number) => [`${value}%`, "Utilisation"]}
            />
            <ReferenceLine
              x={85}
              stroke="hsl(0 85% 55%)"
              strokeDasharray="5 5"
              strokeOpacity={0.7}
            />
            <Bar dataKey="utilisation" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isOverCapacity
                      ? "hsl(0 85% 55%)"
                      : "hsl(185 100% 50%)"
                  }
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const FacilityUtilisationChartSkeleton = () => (
  <div className="glass-card h-full flex flex-col">
    <div className="p-4 border-b border-border/50">
      <div className="skeleton-glow h-5 w-40 rounded" />
    </div>
    <div className="flex-1 p-4">
      <div className="skeleton-glow h-full w-full rounded" />
    </div>
  </div>
);
