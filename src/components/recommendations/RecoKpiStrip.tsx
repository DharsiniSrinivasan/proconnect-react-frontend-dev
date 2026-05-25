import { RecoMetrics } from "@/mocks/recommendations.mock";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Timer,
  CheckCircle,
} from "lucide-react";

interface RecoKpiStripProps {
  metrics: RecoMetrics;
}

interface KpiPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  className?: string;
}

const KpiPill = ({ icon, label, value, subtitle,className }: KpiPillProps) => (
  <div  className={`bg-gradient-to-br from-muted/30 border border-border/50 to-transparent rounded-xl p-4 flex items-center gap-3  ${className ?? ""}`}>
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value || 0}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

export const RecoKpiStrip = ({ metrics }: RecoKpiStripProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString()||"0"}`;
  };

  return (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
  <KpiPill
    icon={<Lightbulb className="w-5 h-5" />}
    label={metrics?.total > 1 ? "Total Recommendations" : "Total Recommendation"}
    value={metrics?.total?.toString() ||"-"}
    subtitle=""
     
  />
  {/* <KpiPill
    icon={<Clock className="w-5 h-5" />}
    label="New (24h)"
    value={metrics?.new24h?.toString()||"-"}
    subtitle="Pending review"
     
  /> */}
  <KpiPill
    icon={<AlertTriangle className="w-5 h-5" />}
    label="High Priority"
    value={metrics?.highPriority?.toString()||"-"}
    subtitle="Needs attention"
     
  />
  <KpiPill
    icon={<TrendingUp className="w-5 h-5" />}
    label="Est. Savings"
    value={formatCurrency(metrics?.estSavings)}
    subtitle="If all implemented"
     
  />
  <KpiPill
    icon={<Timer className="w-5 h-5" />}
    label="TAT Improvement"
    value={`${metrics?.estTatImprovement||"0"} days`}
    subtitle="Potential gain"
    
  />
  {/* <KpiPill
    icon={<CheckCircle className="w-5 h-5" />}
    label="Implementation Rate"
    value={`${metrics?.implementationRate||"0"}%`}
    subtitle="Last 90 days"
    
  /> */}
</div>
  );
};

export const RecoKpiStripSkeleton = () => (
  <div >
     <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="skeleton-glow w-4 h-4 rounded" />
        <div className="skeleton-glow h-4 w-32 rounded" />
      </div>
      
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-glow h-24 rounded-xl" />
      ))}
    </div>
  </div>
  </div>
);
