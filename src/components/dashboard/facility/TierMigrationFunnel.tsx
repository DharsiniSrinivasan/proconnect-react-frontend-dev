import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TierMigrationData } from "@/mocks/facilityDashboard.mock";

interface TierMigrationFunnelProps {
  data: TierMigrationData[];
}

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value}`;
};

const formatNumber = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value?.toString();
};

export const TierMigrationFunnel = ({ data }: TierMigrationFunnelProps) => {
  const total = data?.reduce((sum, d) => sum + d.shipments, 0);

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tier Migration Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data?.map((item, idx) => {
          const widthPercent = Math.max(
            20,
            (item.shipments / total) * 100 + 50,
          );
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {item.fromTier} → {item.toTier}
                </span>
                <span className="text-foreground font-medium">
                  {item.percentage}%
                </span>
              </div>
              <div
                className="h-8 bg-primary/30 rounded-lg flex items-center justify-between px-3 mx-auto transition-all"
                style={{ width: `${widthPercent}%` }}
              >
                <span className="text-xs font-medium text-foreground">
                  {formatNumber(item.shipments)}
                </span>
                <span className="text-xs text-amber-400">
                  {formatCurrency(item.costImpact)}
                </span>
              </div>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Total: {formatNumber(total)} shipments • Cost impact shown per
          migration
        </p>
      </CardContent>
    </Card>
  );
};

export const TierMigrationFunnelSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-36 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-10 bg-muted/20 rounded-lg animate-pulse"
          style={{ width: `${90 - i * 15}%`, margin: "0 auto" }}
        />
      ))}
    </CardContent>
  </Card>
);
