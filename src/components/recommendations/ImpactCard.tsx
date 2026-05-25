import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, Percent, Calendar } from "lucide-react";

interface ImpactCardProps {
  annualSavings: number;
  tatReduction: number;
  roiPct: number;
  paybackMonths: number;
  explanations: any;
}

export const ImpactCard = ({
  annualSavings,
  explanations,
  tatReduction,
  roiPct,
  paybackMonths,
}: ImpactCardProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString()}`;
  };

  const metrics = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Savings",
      value: formatCurrency(annualSavings),
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "TAT Reduction",
      value:
        tatReduction > 0
          ? `${tatReduction} days`
          : `+${Math.abs(tatReduction)} days`,
      color: tatReduction > 0 ? "text-blue-400" : "text-amber-400",
      bgColor: tatReduction > 0 ? "bg-blue-500/20" : "bg-amber-500/20",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "ROI",
      value: `${roiPct}%`,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Payback Period",
      value: `${paybackMonths} months`,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
  ];


  return (
    <NeonCard title="Impact Analysis" className="h-auto">
      <div className="text-sm text-muted-foreground leading-relaxed">
        {explanations?.impact}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics?.map((metric, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
          >
            <div
              className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center ${metric.color}`}
            >
              {metric.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className={`text-lg font-bold ${metric.color}`}>
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {(explanations?.Savings ||
        explanations?.tatReduction ||
        explanations?.tatReduction) && (
        <div className="space-y-4 mt-4">
          <div className="text-sm font-bold text-foreground mt-4">
            Explanations :
          </div>
          {/* Annual Savings */}
          {explanations?.Savings && (
            <div>
              <p className="text-sm font-semibold text-foreground">
                Savings
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {explanations?.Savings || "--"}
              </p>
            </div>
          )}
          {/* TAT Reduction */}
          {explanations?.tatReduction && (
            <div>
              <p className="text-sm font-semibold text-foreground">
                TAT Reduction
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {explanations?.tatReduction || "--"}
              </p>
            </div>
          )}
        </div>
      )}
    </NeonCard>
  );
};

export const ImpactCardSkeleton = () => (
  <NeonCard title="Impact Analysis">
    <div className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  </NeonCard>
);
