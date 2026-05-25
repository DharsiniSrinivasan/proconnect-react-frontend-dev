import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GeoCapacityCell } from "@/mocks/facilityDashboard.mock";

interface GeoCapacityHeatmapProps {
  data: GeoCapacityCell[];
}

export const GeoCapacityHeatmap = ({ data }: GeoCapacityHeatmapProps) => {
  const geos = [...new Set(data?.map((d) => d.geo))];
  const patterns = [...new Set(data?.map((d) => d.pattern))];

  const getCell = (geo: string, pattern: string) =>
    data?.find((d) => d.geo === geo && d.pattern === pattern);
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Geo Capacity Gaps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Full geo × band matrix with %
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground font-medium">
                  Geo / Pattern
                </th>
                {patterns?.map((pattern) => {
                  // find the first matching object in the data
                  const patternObj = data.find((d) => d.pattern === pattern);
                  const description = patternObj?.label?.description || pattern;

                  return (
                    <th
                      key={pattern}
                      className="text-center p-2 text-muted-foreground font-medium"
                    >
                      {description}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {geos?.map((geo) => (
                <tr key={geo} className="border-t border-border/30">
                  <td className="p-2 text-foreground font-medium">{geo}</td>
                  {patterns?.map((pattern) => {
                    const cell = getCell(geo, pattern);
                    if (!cell)
                      return (
                        <td key={pattern} className="p-2 text-center">
                          -
                        </td>
                      );
                    return (
                      <td key={pattern} className="p-2">
                        <div
                          className={cn(
                            "text-center py-2 px-3 rounded-lg font-medium bg-emerald-500/20 text-emerald-400",
                            // cell.status === "overload" &&
                            //   "bg-red-500/20 text-red-400",
                            // cell.status === "warning" &&
                            //   "bg-amber-500/20 text-amber-400",
                            // cell.status === "normal" &&
                            //   "bg-emerald-500/20 text-emerald-400",
                          )}
                        >
                          {cell.distributionPercent}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <p className="text-xs text-muted-foreground mt-3">
          Threshold: 85% • Red = Overload • Amber = Warning
        </p> */}
      </CardContent>
    </Card>
  );
};

export const GeoCapacityHeatmapSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-36 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-40 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
