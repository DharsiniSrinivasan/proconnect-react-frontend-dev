/**
 * Facility Dashboard Embed - Capacity & expansion planning focused
 * Unique focus: Tier utilization, pincode density, payback periods, expansion priority
 */

import { useEffect, useState } from "react";
import {
  FacilityKpiPill,
  FacilityKpiPillSkeleton,
} from "@/components/dashboard/facility/FacilityKpiPill";
import {
  TierUtilizationChart,
  TierUtilizationChartSkeleton,
} from "@/components/dashboard/facility/TierUtilizationChart";
import {
  PatternDemandCard,
  PatternDemandCardSkeleton,
} from "@/components/dashboard/facility/PatternDemandCard";
import {
  GeoCapacityHeatmap,
  GeoCapacityHeatmapSkeleton,
} from "@/components/dashboard/facility/GeoCapacityHeatmap";
import {
  HighDensityPinsCard,
  HighDensityPinsCardSkeleton,
} from "@/components/dashboard/facility/HighDensityPinsCard";
import {
  DemandClustersCard,
  DemandClustersCardSkeleton,
} from "@/components/dashboard/facility/DemandClustersCard";
import { useFacilityDashboardStore } from "@/stores/facilityDashboardStore";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { facilityDashboardService } from "@/services/facilityDashboardService";

export const FacilityDashboardEmbed = (id: any) => {
  const { facilityDetail, isLoading, getDetailFacility } =
    useFacilityDashboardStore();
     const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    if (id?.id) {
      getDetailFacility(id?.id);
    }
  }, [id?.id, getDetailFacility]);

  const handleExport = async () => {
     setIsExporting(true);
    if (!id?.id) return;

    try {
      await facilityDashboardService.exportFacility(id?.id);
    } catch (err: any) {
      console.error(err);
    }
    finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="space-y-6">
    
      {/* KPI Strip */}
   <div >
  {isLoading ? (
    
      <FacilityKpiPillSkeleton />
    
  ) : (
    <div className="w-full glass-card neon-border p-5">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Facility Summary
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

      {/* KPI Pills */}
      <div className="flex flex-wrap gap-4">
        {facilityDetail?.kpis
          ?.filter((kpi) => kpi.id !== "expansion-ready")
          .map((kpi) => (
            <FacilityKpiPill key={kpi.id} kpi={kpi} />
          ))}
      </div>
    </div>
  )}
</div>

      {/* Tier Utilization & Capacity Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <TierUtilizationChartSkeleton />
        ) : (
          <TierUtilizationChart data={facilityDetail?.tier_utilization || []} />
        )}
        {isLoading ? (
          <GeoCapacityHeatmapSkeleton />
        ) : (
          <GeoCapacityHeatmap data={facilityDetail?.geo_capacity_gaps || []} />
        )}
      </div>

      {/* Pattern Demand & Tier Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {isLoading ? (
          <PatternDemandCardSkeleton />
        ) : (
          <PatternDemandCard data={facilityDetail?.pattern_demand || []} />
        )}
      </div>

      {/* High Density Pins & Demand Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <HighDensityPinsCardSkeleton />
        ) : (
          <HighDensityPinsCard data={facilityDetail?.high_density_pins || []} />
        )}
        {isLoading ? (
          <DemandClustersCardSkeleton />
        ) : (
          <DemandClustersCard data={facilityDetail?.demand_clusters || []} />
        )}
      </div>
    </div>
  );
};
