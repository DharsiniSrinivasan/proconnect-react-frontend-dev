/**
 * Business Case & Recommendations
 * Customer-facing page for sales: current performance, Proconnect improvement potential,
 * cost/TAT/SLA insights. Does NOT expose recommendation logic or internal optimization.
 */
import { useEffect, useMemo } from "react";
import {
  MetricCardSkeleton,
  MetricComparisonTile,
} from "@/components/business-dashboard/MetricComparisonTile";
import {
  USPComparisonCard,
  USPComparisonCardSkeleton,
} from "@/components/business-dashboard/USPComparisonCard";
import { StrategicSnapshotSection } from "@/components/business-dashboard/StrategicSnapshotSection";
import {
  OpportunityCard,
  OpportunityCardSkeleton,
} from "@/components/business-dashboard/OpportunityCard";
import { useStrategicStore } from "@/stores/strategicStore";
import { recommendationStore } from "@/stores/recommendationStore";

import {
  IndianRupee,
  Package,
  Clock,
  CheckCircle,
  Target,
  TrendingDown,
  Layers,
  MapPin,
} from "lucide-react";
import {
  LaneOpportunityRow,
  OpportunityImpactTable,
  OpportunityImpactTableSkeleton,
} from "../business-dashboard/OpportunityImpactTable";

function formatCurrency(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(2)}K`;
  return `₹${value?.toFixed(2) ?? "0"}`;
}

const SalesDashboard = (id) => {
  //const { datasetId: paramId } = useParams();
  const paramId = id?.id;
  const {
    data: strategicData,
    fetchStrategic,
    isLoading: strategicLoading,
    resetData: resetStrategic,
  } = useStrategicStore();
  const {
    recommendationSalesDetails,
    getSalesRecommendation,
    loading: recoLoading,
  } = recommendationStore();

  useEffect(() => {
    fetchStrategic(paramId);
    getSalesRecommendation(paramId).catch(() => {});
  }, [paramId]);

  const isLoading = strategicLoading || recoLoading;

  // All values from Sales API — no frontend calculation
  const metrics = recommendationSalesDetails?.metrics ?? null;
  const feed = recommendationSalesDetails?.feed ?? [];
  const totalFreightSpend = Number(
    metrics?.totalFreightSpend ??
      strategicData?.total_freight_spend ??
      strategicData?.freight_spend_data?.totalSpend ??
      0,
  );
  const currentAvgCost =
    metrics?.currentAvgCost != null
      ? Number(metrics.currentAvgCost)
      : (strategicData?.avg_freight_per_qty ??
        strategicData?.avg_freight_data?.currentValue ??
        0);
  const optimizedSpend = Number(metrics?.optimizedSpend ?? 0);
  const optimizedAvgFreight = Number(metrics?.optimizedAvgCost ?? 0);
  const savingAmount = Number(
    metrics?.savingAmount ?? metrics?.estSavings ?? 0,
  );
  const estSavings = Number(metrics?.estSavings ?? 0);
  const savingPerUnit = Number(metrics?.savingPerUnit ?? 0);
  const currentAvgTat =
    metrics?.currentAvgTat != null ? Number(metrics.currentAvgTat) : null;
 
  const estTatImprovement = Number(metrics?.estTatImprovement ?? 0);
  const costOptLaneCount = Number(metrics?.costOptLaneCount ?? 0);
  const costOptExample = metrics?.costOptExample ?? null;
  const hasCostOpportunity = metrics?.hasCostOpportunity ?? false;
  const hasSlaOpportunity = metrics?.hasSlaOpportunity ?? false;
  const hasTatOpportunity = metrics?.hasTatOpportunity ?? false;
  const highPriorityCount = Number(metrics?.highPriority ?? 0);
  const totalRecos = Number(metrics?.total ?? 0);
  const implementationRate = Number(metrics?.implementationRate ?? 0);
  const quickWinsCount = Number(metrics?.quickWinsCount ?? 0);

  const laneRows: LaneOpportunityRow[] = useMemo(() => {
    return feed?.map(
      (item: {
        id?: string;
        scope?: string;
        category?: string;
        impact?: string;
        currentPerformance?: string;
        optimizedPerformance?: string;
        priority?: string;
        confidencePct?: number;
      }) => ({
        id: item.id,
        scope: item.scope ?? "—",
        category: item.category ?? "—",
        currentPerformance: item.currentPerformance ?? "—",
        optimizedPerformance: item.optimizedPerformance ?? "—",
        potentialImpact: item.impact ?? "—",
        priority: item.priority ?? "—",
        confidencePct: item.confidencePct,
      }),
    );
  }, [feed]);
  
  // Strategic API only (for cards that need it)
  const freightSpendData = strategicData?.freight_spend_data ?? {};
  const annualTarget = Number(freightSpendData?.annualTarget ?? 0);
  const vsTargetPercent = Number(freightSpendData?.vsTargetPercent ?? 0);
  const spendAfterSavings = Number(metrics?.optimizedSpend ?? 0);
  const avgFreightData = strategicData?.avg_freight_data ?? {};
  const avgCostCurrentStrategic = Number(avgFreightData?.currentValue ?? 0);
  const avgCostTarget = Number(avgFreightData?.targetValue ?? 0);
  const avgCostOverTargetPct =
    avgCostTarget > 0 && avgCostCurrentStrategic > 0
      ? Math.round(
          ((avgCostCurrentStrategic - avgCostTarget) / avgCostTarget) * 100,
        )
      : null;
  const stateHeatmap = strategicData?.regional_heatmap?.stateHeatmap ?? [];
  const highCriticalStateCount = stateHeatmap.filter(
    (s: { intensity?: string }) =>
      s?.intensity === "high" || s?.intensity === "critical",
  ).length;
  const volumeGrowthPct =
    strategicData?.volume_growth_percent ??
    strategicData?.volume_growth_data?.growthPercent ??
    null;
  const currentVol = Number(
    strategicData?.volume_growth_data?.currentVolume ??
      metrics?.totalQuantity ??
      0,
  );

  return (
    <>
      {/* Section 1 — Metric Comparison Tiles */}

      {/* Section 2 — Customer Strategic Snapshot */}
      <StrategicSnapshotSection
        data={strategicData}
        isLoading={strategicLoading}
      />

      <section className="pl-3 pr-3 pt-3">
        <div>
          {" "}
          <h2 className="text-lg font-semibold mb-4 relative">
            Customer vs Proconnect Improvement
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, idx) => (
              <MetricCardSkeleton key={idx} />
            ))
          ) : (
            <>
              <MetricComparisonTile
                title="Total Freight Spend"
                icon={<IndianRupee className="w-4 h-4" />}
                customerValue={
                  totalFreightSpend > 0
                    ? formatCurrency(totalFreightSpend)
                    : "—"
                }
                optimizedValue={
                  optimizedSpend > 0 ? formatCurrency(optimizedSpend) : "—"
                }
                savingLabel="Potential saving"
                savingValue={
                  savingAmount > 0 ? formatCurrency(savingAmount) : undefined
                }
              />
              <MetricComparisonTile
                title="Avg Freight Cost / Qty"
                icon={<Package className="w-4 h-4" />}
                customerValue={
                  currentAvgCost > 0 ? `₹${currentAvgCost.toFixed(2)}` : "—"
                }
                optimizedValue={
                  optimizedAvgFreight > 0
                    ? `₹${optimizedAvgFreight.toFixed(2)}`
                    : "—"
                }
                savingLabel="Saving per shipment"
                savingValue={
                  savingPerUnit > 0 ? `₹${savingPerUnit.toFixed(2)}` : undefined
                }
              />
              <MetricComparisonTile
                title="Average TAT"
                icon={<Clock className="w-4 h-4" />}
                customerValue={
                  currentAvgTat != null
                    ? `${currentAvgTat} days avg`
                    : "Current baseline"
                }
                optimizedValue={
                  metrics?.optimizedTatDays != null
                    ? `${metrics.optimizedTatDays} days achievable`
                    : estTatImprovement > 0
                      ? `Up to ${estTatImprovement} day(s) improvement`
                      : "—"
                }
                savingLabel="TAT improvement potential"
                savingValue={
                  estTatImprovement > 0
                    ? `${estTatImprovement} days`
                    : undefined
                }
              />
              {/* <MetricComparisonTile
            title="OTIF / SLA Improvement"
            icon={<CheckCircle className="w-4 h-4" />}
            customerValue={
              currentOtifPct != null
                ? `${currentOtifPct}% OTIF`
                : "Current performance"
            }
            optimizedValue={
              optimizedOtifPct != null
                ? `${optimizedOtifPct}% OTIF`
                : hasSlaOpportunity
                  ? "100% OTIF achievable"
                  : "—"
            }
            savingLabel="SLA improvement"
            savingValue={
              otifImprovementPts != null
                ? `+${otifImprovementPts} pts`
                : hasSlaOpportunity
                  ? "Improvement potential detected"
                  : undefined
            }
          /> */}
            </>
          )}
        </div>

        {/* USP row — Why Proconnect (unique value) */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 relative">
            Why Proconnect — Unique value
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, idx) => (
                <USPComparisonCardSkeleton key={idx} />
              ))
            ) : (
              <>
                <USPComparisonCard
                  title="Budget vs target"
                  icon={<Target className="w-4 h-4" />}
                  customerLabel="Current"
                  customerValue={
                    annualTarget > 0 && totalFreightSpend > 0
                      ? `${((totalFreightSpend / annualTarget) * 100).toFixed(1)}% of target`
                      : annualTarget > 0
                        ? `${vsTargetPercent.toFixed(1)}% of target`
                        : totalFreightSpend > 0
                          ? formatCurrency(totalFreightSpend)
                          : "—"
                  }
                  proconnectLabel="With Proconnect"
                  proconnectValue={
                    annualTarget > 0 && spendAfterSavings > 0
                      ? `${((spendAfterSavings / annualTarget) * 100).toFixed(1)}% of target`
                      : "—"
                  }
                  highlight={
                    annualTarget > 0 && savingAmount > 0
                      ? `Spend ${formatCurrency(totalFreightSpend)} → ${formatCurrency(spendAfterSavings)} vs target ${formatCurrency(annualTarget)}`
                      : undefined
                  }
                />
                <USPComparisonCard
                  title="Ratebook / cost efficiency"
                  icon={<TrendingDown className="w-4 h-4" />}
                  customerLabel="Current"
                  customerValue={
                    savingAmount > 0
                      ? `${formatCurrency(savingAmount)} overspend`
                      : "—"
                  }
                  proconnectLabel="Proconnect insight"
                  proconnectValue={
                    savingAmount > 0
                      ? `${formatCurrency(savingAmount)} improvement potential`
                      : strategicData?.savings_opportunities?.avgVariance !=
                          null
                        ? "Lane-level opportunities"
                        : "—"
                  }
                  highlight={
                    savingAmount > 0 ||
                    strategicData?.savings_opportunities?.totalSavings != null
                      ? "Data-driven cost opportunities identified"
                      : undefined
                  }
                />
                {/* <USPComparisonCard
              title="OTIF improvement lanes"
              icon={<CheckCircle className="w-4 h-4" />}
              customerLabel="Lanes below par"
              customerValue={
                otifLaneCount > 0 ? `${otifLaneCount} lane(s) below target` : "—"
              }
              proconnectLabel="Proconnect target"
              proconnectValue={
                otifLaneCount > 0
                  ? `${otifLaneCount} lane(s) targeted for 100% OTIF`
                  : "—"
              }
              highlight={
                otifLaneCount > 0
                  ? "Delivery performance uplift opportunity"
                  : undefined
              }
            /> */}
                <USPComparisonCard
                  title="Cost optimization lanes"
                  icon={<Layers className="w-4 h-4" />}
                  customerLabel="Opportunities"
                  customerValue={
                    costOptLaneCount > 0
                      ? `${costOptLaneCount} lane(s) with cost gap`
                      : "—"
                  }
                  proconnectLabel="With Proconnect"
                  proconnectValue={
                    costOptLaneCount > 0
                      ? `${costOptLaneCount} lane(s) with optimization ready`
                      : "—"
                  }
                  highlight={
                    costOptExample
                      ? `Example impact: ${costOptExample}`
                      : undefined
                  }
                />
                {/* 1. Avg cost/unit vs target */}
                <USPComparisonCard
                  title="Avg freight cost/unit vs target"
                  icon={<Target className="w-4 h-4" />}
                  customerLabel="Current"
                  customerValue={
                    avgCostCurrentStrategic > 0 && avgCostTarget > 0
                      ? `₹${avgCostCurrentStrategic.toFixed(2)}/unit (${avgCostOverTargetPct != null ? avgCostOverTargetPct + "% over target" : "—"})`
                      : avgCostCurrentStrategic > 0
                        ? `₹${avgCostCurrentStrategic.toFixed(2)}/unit`
                        : currentAvgCost > 0
                          ? `₹${currentAvgCost.toFixed(2)}/unit`
                          : "—"
                  }
                  proconnectLabel="Proconnect"
                  proconnectValue={
                    optimizedAvgFreight > 0
                      ? `₹${optimizedAvgFreight.toFixed(2)}/unit achievable`
                      : "—"
                  }
                  highlight={
                    savingPerUnit > 0
                      ? `Gap closure: -₹${savingPerUnit.toFixed(2)}/unit`
                      : undefined
                  }
                />
                {/* 2. High-priority action count */}
                <USPComparisonCard
                  title="High-priority action count"
                  icon={<Package className="w-4 h-4" />}
                  customerLabel="Needs attention"
                  customerValue={
                    totalRecos > 0
                      ? `${highPriorityCount} critical/high of ${totalRecos}`
                      : "—"
                  }
                  proconnectLabel="Proconnect"
                  proconnectValue={
                    totalRecos > 0
                      ? `${totalRecos} actions prioritized (${highPriorityCount} critical/high)`
                      : "—"
                  }
                  highlight={
                    highPriorityCount > 0
                      ? "We've prioritized what to fix first"
                      : undefined
                  }
                />
                {/* 3. Implementation readiness */}
                <USPComparisonCard
                  title="Implementation readiness"
                  icon={<CheckCircle className="w-4 h-4" />}
                  customerLabel="Current"
                  customerValue={
                    totalRecos > 0 ? `${implementationRate}% implemented` : "—"
                  }
                  proconnectLabel="Proconnect"
                  proconnectValue={
                    quickWinsCount > 0
                      ? `${quickWinsCount} quick wins ready`
                      : totalRecos > 0
                        ? "Prioritized action list ready"
                        : "—"
                  }
                  highlight={
                    quickWinsCount > 0
                      ? "Fast time-to-value on remaining items"
                      : undefined
                  }
                />
                {/* 4. Regional focus */}
                <USPComparisonCard
                  title="Regional focus"
                  icon={<MapPin className="w-4 h-4" />}
                  customerLabel="High/critical cost"
                  customerValue={
                    stateHeatmap.length > 0
                      ? `${highCriticalStateCount} state(s) with high/critical cost`
                      : "—"
                  }
                  proconnectLabel="Proconnect"
                  proconnectValue={
                    highCriticalStateCount > 0
                      ? `${highCriticalStateCount} state(s) with targeted plan`
                      : "—"
                  }
                  highlight={
                    highCriticalStateCount > 0
                      ? "We pinpoint which regions drive cost"
                      : undefined
                  }
                />
                {/* 5. Volume trend + cost */}
                <USPComparisonCard
                  title="Unit trend + freight cost"
                  icon={<Layers className="w-4 h-4" />}
                  customerLabel="Current"
                  customerValue={
                    currentVol > 0 && volumeGrowthPct != null
                      ? `${currentVol} shipments (${volumeGrowthPct > 0 ? "+" : ""}${volumeGrowthPct}% trend)`
                      : currentVol > 0
                        ? `${currentVol} shipments`
                        : "—"
                  }
                  proconnectLabel="Proconnect"
                  proconnectValue={
                    currentAvgCost > 0 && optimizedAvgFreight > 0
                      ? `₹${currentAvgCost.toFixed(2)} → ₹${optimizedAvgFreight.toFixed(2)}/unit`
                      : "—"
                  }
                  highlight={
                    currentVol > 0 && totalRecos > 0
                      ? "Efficiency gains even at current volume"
                      : undefined
                  }
                />
              </>
            )}
          </div>
        </div>
      </section>
      {/* Section 3 — Optimization Opportunity Summary */}
   {
   metrics &&
  (hasCostOpportunity || hasSlaOpportunity || hasTatOpportunity) &&
  feed.length > 0  &&(
         <section className="px-3 py-3 space-y-4">
        <div className="relative transform-gpu">
          <h2 className="text-lg font-semibold">
            Optimization Opportunity Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[160px]">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <OpportunityCardSkeleton key={idx} className="h-[140px]" />
            ))
          ) : (
            <>
              {hasCostOpportunity && (
                <OpportunityCard
                  className="h-[140px]"
                  type="cost"
                  title="Cost Optimization"
                  summary="Cost optimization opportunities detected across multiple lanes."
                  impactHighlight={
                    estSavings > 0
                      ? `Potential rate reduction: ${formatCurrency(estSavings)}`
                      : undefined
                  }
                />
              )}

              {hasSlaOpportunity && (
                <OpportunityCard
                  className="h-[140px]"
                  type="sla"
                  title="SLA Improvement"
                  summary="On-time-in-full and SLA improvement potential identified."
                  impactHighlight="OTIF improvement potential detected in selected lanes."
                />
              )}

              {hasTatOpportunity && (
                <OpportunityCard
                  className="h-[140px]"
                  type="tat"
                  title="TAT Improvement"
                  summary="Transit time and breach rate improvement potential."
                  impactHighlight={
                    estTatImprovement > 0
                      ? `Reduce breach rate; TAT improvement up to ${estTatImprovement} days`
                      : "Reduce breach rate by 10–15%."
                  }
                />
              )}

              {!hasCostOpportunity &&
                !hasSlaOpportunity &&
                !hasTatOpportunity &&
                feed.length > 0 && (
                  <OpportunityCard
                    className="h-[140px]"
                    type="general"
                    title="Improvement Opportunities"
                    summary="High-level improvement opportunities detected."
                  />
                )}
            </>
          )}
        </div>
      </section>
    )
   }

      {/* Section 4 — Lane Level Opportunity Table */}
      {isLoading ? (
        <OpportunityImpactTableSkeleton className="mt-4" />
      ) : (
        <OpportunityImpactTable
          rows={laneRows}
          details={recommendationSalesDetails?.details}
          className="mt-4"
        />
      )}

      {/* Section 5 — Loss Exposure Summary */}
    </>
  );
};

export default SalesDashboard;
