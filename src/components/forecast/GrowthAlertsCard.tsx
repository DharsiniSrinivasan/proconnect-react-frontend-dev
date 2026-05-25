import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GrowthAlertRow } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface GrowthAlertsCardProps {
  data: GrowthAlertRow[];
}

export const GrowthAlertsCard = ({ data }: GrowthAlertsCardProps) => {
  return (
    <Card className="glass-card neon-border overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <CardTitle className="text-sm font-medium text-foreground">
            Growth Alerts (&gt;20% MoM Projected)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <TooltipProvider delayDuration={100}>
          {data?.map((alert) => (
            <div
              className={cn(
                "p-3 rounded-lg border cursor-pointer",
                alert.severity === "high" &&
                  "border-purple-500/30 bg-purple-500/10",
                alert.severity === "medium" &&
                  "border-amber-500/30 bg-amber-500/10",
                alert.severity === "low" && "border-muted bg-muted/10",
              )}
            >
              <Tooltip key={alert.id}>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer hover:bg-muted/30 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.type}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {alert.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          +{alert.projectedGrowth}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.mitigation}
                    </p>
                  </div>
                </TooltipTrigger>
              

                
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={6}
                          avoidCollisions
                          collisionPadding={16}
                          className="max-w-sm text-xs space-y-2"
                        >
                          {/* Explanation */}
                          <div className="text-muted-foreground">
                             <div className="font-medium text-foreground">Explanation</div>
                            {alert?.growthAlerts_explanation}
                          </div>

                          {/* Formula */}
                          <div>
                            <div className="font-medium text-foreground">Formula</div>
                            <div className="text-muted-foreground">
                              {alert.calculation?.formula}
                            </div>
                          </div>

                          {/* Evaluated */}
                          <div>
                            <div className="font-medium text-foreground">Calculation</div>
                            <div className="text-muted-foreground">
                              {alert.calculation?.evaluated}
                            </div>
                          </div>
                        </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export const GrowthAlertsCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-48 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </CardContent>
  </Card>
);
