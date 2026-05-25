import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatternDemandForecast } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { formatNumber } from "@/lib/formatters";

interface PatternDemandCardProps {
  data: PatternDemandForecast[];
}



export const PatternDemandCard = ({ data }: PatternDemandCardProps) => {
  return (
    <Card className="glass-card neon-border overflow-visible">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Pattern Demand Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 overflow-visible">
        <TooltipProvider delayDuration={100}>
          {data?.map((row) => {
            const TrendIcon =
              row.trend === "up"
                ? TrendingUp
                : row.trend === "down"
                  ? TrendingDown
                  : Minus;

            const unitEntries = Object.entries(row)
              .filter(
                ([key, val]) =>
                  key.startsWith("unit_") && typeof val === "number"
              )
              .sort((a, b) => {
                const getStart = (key: string) => {
                  const val = key.replace("unit_", "");

                  // ">10" always last
                  if (val.includes(">")) return Infinity;

                  return parseInt(val.split("-")[0], 10);
                };

                return getStart(a[0]) - getStart(b[0]);
              });

            return (
              <div className="p-3 rounded-lg  bg-muted/20 border border-border/50 hover:bg-muted/30 transition">
                <Tooltip key={row.geo}>
                  {/* IMPORTANT FIX */}
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer hover:bg-muted/30 transition">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {row.geo}
                          </span>

                          <TrendIcon
                            className={cn(
                              "w-4 h-4",
                              row.trend === "up" && "text-emerald-400",
                              row.trend === "down" && "text-red-400",
                              !row.trend && "text-muted-foreground",
                            )}
                          />
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {row.confidence}% conf
                        </Badge>
                      </div>

                      {/* Dynamic Units */}
                      <div className="flex gap-6 text-xs flex-wrap">
                        {unitEntries.map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">
                              {key}:{" "}
                            </span>
                            <span className="text-primary font-medium">
                              {formatNumber(value as number)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipTrigger>

                  {/* Tooltip Explanation */}
                  {row.patternDemand_explanation && (
                    <TooltipContent
                      side="top"
                      align="start"
                      sideOffset={8}
                      avoidCollisions={true}
                      collisionPadding={16}
                      className="max-w-xs text-xs"
                    >
                      {row.patternDemand_explanation}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            );
          })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export const PatternDemandCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-40 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </CardContent>
  </Card>
);
