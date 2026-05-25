import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TierCoverageData } from "@/mocks/facilityDashboard.mock";

interface TierCoverageCardProps {
  data: TierCoverageData[];
}

const formatNumber = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toString();
};

export const TierCoverageCard = ({ data }: TierCoverageCardProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tier Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.map((tier) => (
          <div key={tier.tier} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">
                {tier.tier}
              </span>
              <span className="text-sm text-primary font-medium">
                {tier.percentage.toFixed(2)}%
              </span>
            </div>
            <Progress value={tier.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {formatNumber(tier.pincodesCovered)} /{" "}
                {formatNumber(tier.totalPincodes)} pins
              </span>
              <span className="text-amber-400">
                Gap: {formatNumber(tier.expansionGap)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const TierCoverageCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-28 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted/30 rounded" />
          <div className="h-2 w-full bg-muted/30 rounded" />
          <div className="h-3 w-32 bg-muted/30 rounded" />
        </div>
      ))}
    </CardContent>
  </Card>
);
