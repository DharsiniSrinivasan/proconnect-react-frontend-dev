import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WhatIfExternalScenario } from "@/mocks/forecasts.mock";

interface WhatIfExternalCardProps {
  data: WhatIfExternalScenario[];
}

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 100000)
    return `${value < 0 ? "-" : "+"}₹${(absValue / 100000).toFixed(2)}L`;
  if (absValue >= 1000)
    return `${value < 0 ? "-" : "+"}₹${(absValue / 1000).toFixed(2)}K`;
  return `${value < 0 ? "-" : "+"}₹${absValue}`;
};

export const WhatIfExternalCard = ({ data }: WhatIfExternalCardProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium text-foreground">
            What-If External Factors
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data?.map((scenario, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-muted/20 border border-border/50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {scenario.lever}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  scenario.impact < 0 ? "text-emerald-400" : "text-red-400",
                )}
              >
                {formatCurrency(scenario.impact)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    scenario.impact < 0 ? "bg-emerald-500" : "bg-red-500",
                  )}
                  style={{
                    width: `${Math.min(100, Math.abs(scenario.adjustedValue - scenario.currentValue) * 5 + 20)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {scenario.currentValue}
                {scenario.unit} → {scenario.adjustedValue}
                {scenario.unit}
              </span>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Adjust levers to see projected freight impact
        </p>
      </CardContent>
    </Card>
  );
};

export const WhatIfExternalCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-40 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </CardContent>
  </Card>
);
