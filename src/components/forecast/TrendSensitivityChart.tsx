import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TrendSensitivityPoint } from "@/mocks/forecasts.mock";
import { formatCurrency } from "@/lib/formatters";

interface TrendSensitivityChartProps {
  data: TrendSensitivityPoint[];
}



export const TrendSensitivityChart = ({ data }: TrendSensitivityChartProps) => {
  if (!data?.length) return null;

  // Get unique patterns
  const patterns = Array.from(new Set(data?.map((d) => d.pattern)));
  const mergedData = Array.from(
    new Map(
      data.map((item) => [item.volChange, item])
    ).keys()
  ).map((volChange) => {
    const obj: any = { volChange };

    patterns.forEach((pattern) => {
      const match = data.find(
        (d) => d.volChange === volChange && d.pattern === pattern
      );
      obj[pattern] = match?.freightImpact ?? null;
      obj[`${pattern}_explanation`] = match?.trendSensitivity_explanation;
    });

    return obj;
  });


  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Trend Sensitivity (Vol ±10% → Freight)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 10, right: 20, bottom: 5, left: 0 }} data={mergedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />

              <XAxis
                dataKey="volChange"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
              />

              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(val) => formatCurrency(val)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;


                  const explanations = payload
                    .map((entry: any) => ({
                      name: entry.name,
                      color: entry.color,
                      value: entry.payload?.[`${entry.dataKey}_explanation`],
                    }))
                    .filter((e: any) => e.value);
                  return (
                    <div
                      className="
          bg-card border border-border rounded-lg
          p-2 sm:p-3
          max-w-[220px] sm:max-w-xs
          text-xs sm:text-sm
          shadow-md break-words
        "
                    >
                      {/* Label */}
                      <div className="font-medium mb-1 truncate">
                        Vol Change: {label > 0 ? "+" : ""}
                        {label}%
                      </div>

                      {/* Freight Impact */}
                      {payload?.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between gap-2 sm:gap-4">
                          <span style={{ color: entry.color }} className="truncate">
                            {entry.name} {/* Use series name instead of hardcoded text */}
                          </span>
                          <span className="font-medium">{formatCurrency(entry.value)}</span>
                        </div>
                      ))}

                      {/* Explanation */}
                      {explanations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border text-muted-foreground text-[10px] sm:text-xs max-h-32 overflow-y-auto">
                          {explanations.map((exp: any, i: number) => (
                            <div key={i} className="mb-2">

                              {/* Pattern Name */}
                              <div
                                className="font-medium mb-0.5 flex items-center gap-1"
                                style={{ color: exp.color }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: exp.color }}
                                />
                                {exp.name}
                              </div>

                              {/* Explanation */}
                              <div>{exp.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
                wrapperStyle={{ pointerEvents: "auto" }}
              />

              <ReferenceLine
                y={0}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />

              {/* Render a line for each pattern dynamically */}
              {patterns?.map((pattern, idx) => (
                <Line
                  key={pattern}
                  type="monotone"
                  dataKey={pattern} //  dynamic key
                  stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={`${pattern} Pattern`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-4 mx-2">
          Shows how a ±10% change in volume impacts freight costs.
        </p>
      </CardContent>
    </Card>
  );
};

export const TrendSensitivityChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-52 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
