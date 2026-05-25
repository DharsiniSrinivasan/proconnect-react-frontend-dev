/**
 * StrategicSnapshotSection - Customer current state summary
 * Uses strategic dashboard API: freight trend, volume by region, partner share, pattern breakdown, regional heatmap.
 */
import { NeonCard } from "@/components/ui/neon-card";
import { FreightSpendCard } from "@/components/dashboard/strategic/FreightSpendCard";
import { AvgFreightGaugeCard } from "@/components/dashboard/strategic/AvgFreightGaugeCard";
import { VolumeGrowthCard } from "@/components/dashboard/strategic/VolumeGrowthCard";
import { TopPatternsCard } from "@/components/dashboard/strategic/TopPatternsCard";
import { RegionalHeatmapCard } from "@/components/dashboard/strategic/RegionalHeatmapCard";

export interface StrategicSnapshotSectionProps {
  /** Strategic dashboard API payload (data from useStrategicStore) */
  data: {
    freight_spend_data?: {
      totalSpend?: number;
      monthlyTrend?: { month: string; value: number }[];
      shipmentYear?: string;
    };
    avg_freight_data?: {
      currentValue?: number;
      targetValue?: number;
      trend?: unknown[];
    };
    volume_growth_data?: {
      currentVolume?: number;
      geoSplit?: { region: string; volume: number }[];
    };
    partner_share?: {
      code: string;
      name: string;
      freightShare: number;
      volumeShare: number;
    }[];
    pattern_breakdown?: {
      topPatterns?: {
        pattern: string;
        label: string;
        freightPercent: number;
        freightValue: number;
        ratebookVariance: number;
      }[];
    };
    regional_heatmap?: {
      stateHeatmap?: {
        state: string;
        freightPerQty: number;
        volume: number;
        intensity?: string;
      }[];
    };
  } | null;
  isLoading?: boolean;
}

export function StrategicSnapshotSection({
  data,
  isLoading,
}: StrategicSnapshotSectionProps) {
  if (isLoading) {
    return (
      <NeonCard title="Customer Strategic Snapshot">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="skeleton-glow h-48 rounded-xl" />
          <div className="skeleton-glow h-48 rounded-xl" />
          <div className="skeleton-glow h-48 rounded-xl" />
        </div>
      </NeonCard>
    );
  }

  if (!data) {
    return (
      <NeonCard title="Customer Strategic Snapshot">
        <p className="text-sm text-muted-foreground">
          Select a dataset to view strategic snapshot.
        </p>
      </NeonCard>
    );
  }

  return (
    <div className="space-y-6">
      <NeonCard title="Customer Strategic Snapshot" className="w-full">
        <p className="text-xs text-muted-foreground mb-4">
          Current state view: freight trends, volume by region, partner share,
          pattern breakdown, and regional performance.
        </p>
        {/* KPI row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <FreightSpendCard data={data.freight_spend_data ?? {}} />
          <AvgFreightGaugeCard data={data.avg_freight_data ?? {}} />
          <VolumeGrowthCard data={data.volume_growth_data ?? {}} />
        </section>
        {/* Pattern & Partner */}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {data.pattern_breakdown?.topPatterns?.length ? (
            <TopPatternsCard data={data.pattern_breakdown.topPatterns} />
          ) : null}
        </section>
        {/* Regional heatmap */}
        {data.regional_heatmap?.stateHeatmap?.length ? (
          <section className="mt-6">
            <RegionalHeatmapCard data={data.regional_heatmap.stateHeatmap} />
          </section>
        ) : null}
      </NeonCard>
    </div>
  );
}
