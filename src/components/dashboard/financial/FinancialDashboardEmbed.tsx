/**
 * Financial Dashboard Embed
 *
 * Restructured with exact cards for financial metrics.
 * NO historical comparisons - current period data only.
 */

import { useEffect, useState } from "react";
import {
  FinKpiPill,
  FinKpiPillSkeleton,
} from "@/components/dashboard/financial/FinKpiPill";
import {
  MonthlyFreightChart,
  MonthlyFreightChartSkeleton,
} from "@/components/dashboard/financial/MonthlyFreightChart";
import {
  FreightQtyTrendChart,
  FreightQtyTrendChartSkeleton,
} from "@/components/dashboard/financial/FreightQtyTrendChart";
import {
  PatternCostChart,
  PatternCostChartSkeleton,
} from "@/components/dashboard/financial/PatternCostChart";
import {
  GeoCostLeadersChart,
  GeoCostLeadersChartSkeleton,
} from "@/components/dashboard/financial/GeoCostLeadersChart";
import {
  VarianceWaterfall,
  VarianceWaterfallSkeleton,
} from "@/components/dashboard/financial/VarianceWaterfall";
import {
  BudgetTrackerCard,
  BudgetTrackerCardSkeleton,
} from "@/components/dashboard/financial/BudgetTrackerCard";
import {
  PatternMarginTable,
  PatternMarginTableSkeleton,
} from "@/components/dashboard/financial/PatternMarginTable";
import {
  PartnerCostCompareChart,
  PartnerCostCompareChartSkeleton,
} from "@/components/dashboard/financial/PartnerCostCompareChart";
import {
  CostAllocationTreemap,
  CostAllocationTreemapSkeleton,
} from "@/components/dashboard/financial/CostAllocationTreemap";
import { useFinancialStore } from "@/stores/financialStore";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { financial } from "@/services/financialService";

export const FinancialDashboardEmbed = (id: any) => {
  const { getDetailFinancial, financialDetail, isLoading } =
    useFinancialStore();
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    if (id?.id) {
      getDetailFinancial(id?.id);
    }
  }, [id?.id, getDetailFinancial]);

  const handleExport = async () => {
    setIsExporting(true);
    if (!id?.id) return;

    try {
      await financial.exportFinancial(id?.id);
    } catch (err: any) {
      console.error(err);
    }
    finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {isLoading ? (
          <FinKpiPillSkeleton />
        ) : (
          <div className="w-full glass-card neon-border p-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Financial Summary
                </h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="text-xs font-medium gap-1.5 hover:text-primary-foreground"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export Excel</span>
                  </>
                )}
              </Button>
            </div>

            {/* KPI List */}
            <div className="flex flex-wrap gap-4">
              {financialDetail?.kpis?.map((kpi) => (
                <FinKpiPill key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cost Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <MonthlyFreightChartSkeleton />
        ) : (
          <MonthlyFreightChart data={financialDetail?.monthly_freight || []} />
        )}
        {isLoading ? (
          <FreightQtyTrendChartSkeleton />
        ) : (
          <FreightQtyTrendChart
            data={financialDetail?.freight_qty_trend || []}
          />
        )}
      </div>

      {/* Pattern/Geo 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <PatternCostChartSkeleton />
        ) : (
          <PatternCostChart data={financialDetail?.cost_by_pattern || []} />
        )}
        {isLoading ? (
          <GeoCostLeadersChartSkeleton />
        ) : (
          <GeoCostLeadersChart data={financialDetail?.geo_cost_leaders || []} />
        )}
        {isLoading ? (
          <PatternMarginTableSkeleton />
        ) : (
          <PatternMarginTable
            data={financialDetail?.per_pattern_margin || []}
          />
        )}
        {isLoading ? (
          <PartnerCostCompareChartSkeleton />
        ) : (
          <PartnerCostCompareChart
            data={financialDetail?.partner_cost_compare || []}
          />
        )}
      </div>

      {/* Waterfall + Budget Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <VarianceWaterfallSkeleton />
        ) : (
          <VarianceWaterfall
            data={financialDetail?.variance_vs_optimal || []}
          />
        )}
        {isLoading ? (
          <BudgetTrackerCardSkeleton />
        ) : (
          <BudgetTrackerCard data={financialDetail?.budget_tracker || []} />
        )}
      </div>

      {/* Cost Allocation */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <CostAllocationTreemapSkeleton />
        ) : (
          <CostAllocationTreemap data={financialDetail?.cost_allocation} />
        )}
      </div>
    </div>
  );
};
