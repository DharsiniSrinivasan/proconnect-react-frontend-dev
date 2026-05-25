import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CostScenarioData } from "@/mocks/forecasts.mock";
import { formatCurrency } from "@/lib/formatters";

interface CostScenariosChartProps {
  data: CostScenarioData[];
}


const COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 76%, 36%)",
  "hsl(280, 70%, 65%)",
];

export const CostScenariosChart = ({ data }: CostScenariosChartProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Cost Scenarios (Base/Opt/Pess)
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
               tickFormatter={(val)=>formatCurrency(val)}
              />
              <YAxis
                type="category"
                dataKey="scenario"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={120}
              />
           <Tooltip
            wrapperStyle={{ pointerEvents: "auto" }}
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const explanation = payload[0]?.payload?.costScenarios_explanation;

    return (
      <div
        className="
          bg-card border border-border rounded-lg
          p-2 sm:p-3
          max-w-[170px] sm:max-w-xs
          text-xs sm:text-sm
          shadow-md break-words
        "
      >
        {/* Scenario Label */}
        <div className="text-foreground font-medium mb-1 truncate">
          {label}
        </div>

        {/* Values */}
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-2 sm:gap-4">
            <span style={{ color: entry.color }} className="truncate">
              {entry.name}
            </span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
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

              <Bar dataKey="freight" name="Freight" radius={[0, 4, 4, 0]}>
                {data?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          {data?.map((row, idx) => (
            <div key={row.scenario} className="text-center">
              <p className="text-muted-foreground">{row.scenario}</p>
              <p
                className={cn(
                  "font-medium",
                  row.savings > 0 && "text-emerald-400",
                  row.savings < 0 && "text-purple-400",
                  row.savings === 0 && "text-foreground",
                )}
              >
                {row.savings > 0
                  ? `+${formatCurrency(row.savings)}`
                  : row.savings < 0
                    ? formatCurrency(row.savings)
                    : "-"}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 mx-2 mb-2">
          Compares base, optimistic, and pessimistic freight cost projections.
        </p>
      </CardContent>
    </Card>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const CostScenariosChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
