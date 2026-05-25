import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SlaProbForecastCell } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SlaProbForecastTableProps {
  data: SlaProbForecastCell[];
}

export const SlaProbForecastTable = ({ data }: SlaProbForecastTableProps) => {
  return (
    <Card className="glass-card neon-border overflow-visible">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          SLA Probability Forecast Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground font-medium">
                  Lane
                </th>
                <th className="text-left p-2 text-muted-foreground font-medium">
                  Pattern
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P50
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P75
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  P90
                </th>
                <th className="text-center p-2 text-muted-foreground font-medium">
                  Baseline
                </th>
              </tr>
            </thead>
            <TooltipProvider>
              <tbody>
                {data?.map((row, idx) => (
                  <Tooltip key={row.lane}>
                    <TooltipTrigger asChild>
                      <tr
                        key={idx}
                        className="border-t border-border/30 hover:bg-muted/10 cursor-pointer"
                      >
                        <td className="p-2 text-foreground font-medium">
                          {row.lane}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {row.pattern}
                        </td>
                        <td
                          className={cn(
                            "p-2 text-center font-medium",
                            row.p50 >= row.baseline
                              ? "text-emerald-400"
                              : "text-purple-400",
                          )}
                        >
                          {row.p50}%
                        </td>
                        <td
                          className={cn(
                            "p-2 text-center font-medium",
                            row.p75 >= row.baseline
                              ? "text-emerald-400"
                              : "text-amber-400",
                          )}
                        >
                          {row.p75}%
                        </td>
                        <td
                          className={cn(
                            "p-2 text-center font-medium",
                            row.p90 >= row.baseline
                              ? "text-emerald-400"
                              : "text-purple-400",
                          )}
                        >
                          {row.p90}%
                        </td>
                        <td className="p-2 text-center text-muted-foreground">
                          {row.baseline}%
                        </td>
                      </tr>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      avoidCollisions={true}
                      collisionPadding={16}
                      className="max-w-xs text-xs"
                    >
                      {row.slaProbForecast_explanation}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </tbody>
            </TooltipProvider>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Green = above baseline • Purple/Amber = below baseline
        </p>
      </CardContent>
    </Card>
  );
};

export const SlaProbForecastTableSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-48 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
