/**
 * What-if: Consolidate - Slider with savings KPI
 */
import { useState } from "react";
import { Shuffle, Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { WhatIfScenario } from "@/mocks/strategicDashboardV2.mock";

interface WhatIfCardProps {
  data: WhatIfScenario;
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const formatVolume = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toString();
};

export const WhatIfCard = ({ data }: WhatIfCardProps) => {
  const [consolidationPercent, setConsolidationPercent] = useState(
    data.consolidationPercent,
  );

  // Calculate savings based on slider (linear scaling for demo)
  const baseRate = data.savingsAmount / data.consolidationPercent;
  const calculatedSavings = baseRate * consolidationPercent;
  const volumeImpacted =
    (data.volumeImpacted / data.consolidationPercent) * consolidationPercent;

  return (
    <div className="glass-card neon-border p-5 h-full bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Shuffle className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          What-if: Consolidation
        </h3>
        <Calculator className="w-3 h-3 text-muted-foreground ml-auto" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Cross-Region → Within-Region shift
          </span>
          <span className="text-sm font-bold text-primary">
            {consolidationPercent}%
          </span>
        </div>
        <Slider
          value={[consolidationPercent]}
          onValueChange={(v) => setConsolidationPercent(v[0])}
          min={5}
          max={50}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>5%</span>
          <span>50%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
          <span className="text-xs text-muted-foreground block mb-1">
            Est. Savings
          </span>
          <span className="text-xl font-bold text-success">
            {formatCurrency(calculatedSavings)}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <span className="text-xs text-muted-foreground block mb-1">
            Unit Impacted
          </span>
          <span className="text-xl font-bold text-foreground">
            {formatVolume(volumeImpacted)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
        Shift cross-region 1-2u shipments to regional consolidation hubs
      </p>
    </div>
  );
};

export const WhatIfCardSkeleton = () => (
  <div className="glass-card p-5 h-full">
    <div className="flex items-center gap-2 mb-4">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-32 rounded" />
    </div>
    <div className="skeleton-glow h-8 w-full rounded mb-4" />
    <div className="grid grid-cols-2 gap-3">
      <div className="skeleton-glow h-20 rounded" />
      <div className="skeleton-glow h-20 rounded" />
    </div>
  </div>
);
