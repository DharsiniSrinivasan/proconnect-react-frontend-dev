import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GeoCapacityPredCell } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface GeoCapacityPredCardProps {
  data: GeoCapacityPredCell[];
}

export const GeoCapacityPredCard = ({ data }: GeoCapacityPredCardProps) => {
  const geos = [...new Set(data?.map((d) => d.geo))];
  const months = [...new Set(data?.map((d) => d.month))];

  const getCell = (geo: string, month: string) =>
    data.find((d) => d.geo === geo && d.month === month);
  const getGeoExplanation = (geo: string) =>
    data.find((d) => d.geo === geo)?.geoCapacityPred_explanation;
  const getGeoObject = (geo: string) => data.find((d) => d.geo === geo);
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Geo Capacity Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">
                    Geo / Tier
                  </th>
                  {months?.map((month) => (
                    <th
                      key={month}
                      className="text-center p-2 text-muted-foreground font-medium"
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {geos?.map((geo) => {
                  const geoExplanation = getGeoExplanation(geo);
                  const geoObject = getGeoObject(geo);

                  return (
                    <Tooltip key={geo}>
                      <TooltipTrigger asChild>
                        {/*Use div wrapper instead of tr directly */}
                        <tr className="border-t border-border/30 hover:bg-muted/10 cursor-pointer">
                          <td className="p-2">
                            <div className="text-foreground font-medium">
                              {geo}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {geoObject?.tier}
                            </div>
                          </td>

                          {months?.map((month) => {
                            const cell = getCell(geo, month);

                            if (!cell)
                              return (
                                <td key={month} className="p-2 text-center">
                                  -
                                </td>
                              );

                            return (
                              <td key={month} className="p-2">
                                <div
                                  className={cn(
                                    "text-center py-2 px-3 rounded-lg font-medium",
                                    cell.status === "hotspot" &&
                                      "bg-purple-500/20 text-purple-400",
                                    cell.status === "warning" &&
                                      "bg-amber-500/20 text-amber-400",
                                    cell.status === "normal" &&
                                      "bg-emerald-500/20 text-emerald-400",
                                  )}
                                >
                                  {cell.utilization}%
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      </TooltipTrigger>

                      <TooltipContent className="px-3 py-2 text-xs max-w-xs whitespace-normal">
                        {geoExplanation}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </tbody>
            </table>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Purple = Hotspot (&gt;90%) • Amber = Warning (85-90%)
        </p>
      </CardContent>
    </Card>
  );
};

export const GeoCapacityPredCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-40 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
