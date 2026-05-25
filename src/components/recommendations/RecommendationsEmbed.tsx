/**
 * Recommendations Embed
 *
 * Embeddable version of the Recommendations Feed content (without AppShell).
 * Used in the tabbed DatasetDashboardsPage.
 */

import { useState, useEffect } from "react";
import { NeonCard } from "@/components/ui/neon-card";
import {
  RecoKpiStrip,
  RecoKpiStripSkeleton,
} from "@/components/recommendations/RecoKpiStrip";
import {
  RecoFeedTable,
  RecoFeedTableSkeleton,
} from "@/components/recommendations/RecoFeedTable";
import { RecoTopBarControls } from "@/components/recommendations/RecoTopBarControls";
import { RecoCategory, RecoPriority } from "@/mocks/recommendations.mock";
import { recommendationStore } from "@/stores/recommendationStore";
import { Clock, FileText, IndianRupee, Layers, MapPin, Package, Target } from "lucide-react";
import { MetricCardSkeleton, MetricComparisonTile } from "../business-dashboard/MetricComparisonTile";
import { USPComparisonCard, USPComparisonCardSkeleton } from "../business-dashboard/USPComparisonCard";
import { OpportunityCard, OpportunityCardSkeleton } from "../business-dashboard/OpportunityCard";
import { useStrategicStore } from "@/stores/strategicStore";
import { formatCurrency } from "@/lib/formatters";

export const RecommendationsEmbed = ({ id, isDashboard }) => {
  const {
    loading,
    recommendationDetails,
    getRecommendation,
    getCategory,
    getPriority,
    categoryData,
    priorityData,
  } = recommendationStore();
  const {
    data: strategicData,
    fetchStrategic,
    isLoading: strategicLoading,

  } = useStrategicStore();
  const metrics = recommendationDetails?.metrics ?? null;
  const totalFreightSpend = Number(
    metrics?.totalFreightSpend ??
    strategicData?.total_freight_spend ??
    strategicData?.freight_spend_data?.totalSpend ??
    0,
  );
  const feed = recommendationDetails?.feed ?? [];
  const currentAvgCost =
    metrics?.currentAvgCost != null
      ? Number(metrics.currentAvgCost)
      : (strategicData?.avg_freight_per_qty ??
        strategicData?.avg_freight_data?.currentValue ??
        0);
  const optimizedSpend = Number(metrics?.optimizedSpend ?? 0);
  const optimizedSpendPct = Number(metrics?.optimizedSpendPct ?? 0);
  const optimizedAvgFreight = Number(metrics?.optimizedAvgCost ?? 0);
  const optimizedAvgCostPct = Number(metrics?.optimizedAvgCostPct ?? 0);
  const optimizedTatDaysPct = Number(metrics?.optimizedTatDaysPct ?? 0);
  const savingAmount = Number(
    metrics?.savingAmount ?? metrics?.estSavings ?? 0,
  );
  const estSavings = Number(metrics?.estSavings ?? 0);
  const savingPerUnit = Number(metrics?.savingPerUnit ?? 0);
  const currentAvgTat =
    metrics?.currentAvgTat != null ? Number(metrics.currentAvgTat) : null;

  const estTatImprovement = Number(metrics?.estTatImprovement ?? 0);
  const costOptLaneCount = Number(metrics?.costOptLaneCount ?? 0);
  const hasCostOpportunity = metrics?.hasCostOpportunity ?? false;
  const hasSlaOpportunity = metrics?.hasSlaOpportunity ?? false;
  const hasTatOpportunity = metrics?.hasTatOpportunity ?? false;
  const freightSpendData = strategicData?.freight_spend_data ?? {};
  const annualTarget = Number(freightSpendData?.annualTarget ?? 0);
  const vsTargetPercent = Number(freightSpendData?.vsTargetPercent ?? 0);
  const spendAfterSavings = Number(metrics?.optimizedSpend ?? 0);


  const [categoryFilter, setCategoryFilter] = useState<RecoCategory | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<RecoPriority | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"impact" | "confidence" | "created" | null>(null);
  const [activeDataset, setActiveDataset] = useState("DS-2025-Q4-001");

  useEffect(() => {
    if (id) {
      fetchStrategic(id);
      getRecommendation(id);
    }
  }, [id, getRecommendation]);

  useEffect(() => {
    getCategory();
    getPriority();
  }, [getCategory, getPriority]);


  return (
    <div className="space-y-6 transform-gpu relative">

      <section className="pl-3 pr-3 pt-3 ">
        <div>
          {" "}
          <h2 className="text-lg font-semibold mb-4 ">
            Actual vs Optimized Decision Logic
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategicLoading ? (
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
                  savingAmount > 0 ? formatCurrency(savingAmount) : null
                }
                currentLabel="Actual"
                optimizedLabel="Recommended"
                savingPctLabel="Saving %"
                savingPctValue={
                  savingAmount > 0 ? `${optimizedSpendPct.toFixed(1)}%` : null
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
                 savingPctLabel="Saving %"
                savingPctValue={
                  savingPerUnit > 0 ? `${optimizedAvgCostPct.toFixed(1)}%` : null
                }
                currentLabel="Actual"
                optimizedLabel="Recommended"
              />
              <MetricComparisonTile
                title="Average TAT"
                icon={<Clock className="w-4 h-4" />}
                customerValue={
                  currentAvgTat != null
                    ? `${currentAvgTat} days avg`
                    : "Actual"
                }
                currentLabel="Actual"
                optimizedLabel="Recommended"
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
                 savingPctLabel="Efficiency Gain (%)"
                savingPctValue={
                  estTatImprovement > 0 ? `${optimizedTatDaysPct.toFixed(1)}%` : null
                }
                
              />

            </>
          )}
        </div>

        {/* USP row — Why Proconnect (unique value) */}
        <div className="mt-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {strategicLoading ? (
              Array.from({ length: 9 }).map((_, idx) => (
                <USPComparisonCardSkeleton key={idx} />
              ))
            ) : (
              <>
                <USPComparisonCard
                  title={`Budget vs target (${strategicData?.avg_freight_data?.targetValue})`}
                  icon={<Target className="w-4 h-4" />}
                  customerLabel="Actual"
                  customerValue={
                    annualTarget > 0 && totalFreightSpend > 0
                      ? `${((totalFreightSpend / annualTarget) * 100).toFixed(1)}% of target`
                      : annualTarget > 0
                        ? `${vsTargetPercent.toFixed(1)}% of target`
                        : totalFreightSpend > 0
                          ? formatCurrency(totalFreightSpend)
                          : "—"
                  }
                  proconnectLabel="Recommended"
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
                  title="Cost optimization lanes"
                  icon={<Layers className="w-4 h-4" />}
                  proconnectValue={
                    costOptLaneCount > 0
                      ? `${costOptLaneCount} lane(s) with optimization ready`
                      : "—"
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
        feed.length > 0 && (
          <section className="px-3 py-3 space-y-4">
            <div className="relative transform-gpu">
              <h2 className="text-lg font-semibold">
                Optimization Opportunity Summary
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[160px]">
              {strategicLoading ? (
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
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row  lg:items-center lg:justify-between gap-4 ">
        <p className="text-muted-foreground text-sm">

        </p>

        <RecoTopBarControls
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
          categoryData={categoryData}
          priorityData={priorityData}
        />
      </div>


      {/* KPI Strip */}
      {loading ? (
        <RecoKpiStripSkeleton />
      ) : (
        <div className="glass-card neon-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Recommendations Summary
              </h3>
            </div>
          </div>
          <RecoKpiStrip metrics={recommendationDetails?.metrics} />

        </div>
      )}

      {/* Feed Table */}
      <NeonCard title="Recommendations">
        {loading ? (
          <RecoFeedTableSkeleton />
        ) : (
          <RecoFeedTable
            categoryFilter={categoryFilter}
            priorityFilter={priorityFilter}
            feed={recommendationDetails?.feed}
            sortBy={sortBy}
            isDashboard={isDashboard}
            categoryData={categoryData}
            priorityData={priorityData}
          />
        )}
      </NeonCard>

    </div>
  );
};
