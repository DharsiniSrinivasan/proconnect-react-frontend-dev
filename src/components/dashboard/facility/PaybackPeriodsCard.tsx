import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PaybackPeriodData } from "@/mocks/facilityDashboard.mock";

interface PaybackPeriodsCardProps {
  data: PaybackPeriodData[];
}

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value}`;
};

export const PaybackPeriodsCard = ({ data }: PaybackPeriodsCardProps) => {
  const maxMonths = Math.max(
    ...(data?.map((d) => d.startMonth + d.paybackMonths) ?? []),
  );

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Payback Periods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.map((item) => (
            <div key={item.facility} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {item.facility}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {item.tier}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.paybackMonths}mo
                </span>
              </div>
              <div className="relative h-6 bg-muted/20 rounded overflow-hidden">
                <div
                  className="absolute h-full bg-primary/60 rounded"
                  style={{
                    left: `${(item.startMonth / maxMonths) * 100}%`,
                    width: `${(item.paybackMonths / maxMonths) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Savings: {formatCurrency(item.freightSavings)}/mo</span>
                <span>Opex: {formatCurrency(item.opex)}/mo</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-4 pt-2 border-t border-border/30">
          <span>Month 1</span>
          <span>Month {maxMonths}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaybackPeriodsCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-32 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-4 w-40 bg-muted/30 rounded" />
          <div className="h-6 w-full bg-muted/20 rounded" />
        </div>
      ))}
    </CardContent>
  </Card>
);
