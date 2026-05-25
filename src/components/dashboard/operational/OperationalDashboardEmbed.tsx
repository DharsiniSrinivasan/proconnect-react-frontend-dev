import { useState, useEffect } from "react";
import { OpsKpiPillNew, OpsKpiPillNewSkeleton } from "./OpsKpiPillNew";
import { SlaPatternCard, SlaPatternCardSkeleton } from "./SlaPatternCard";
import { DailyVolChart, DailyVolChartSkeleton } from "./DailyVolChart";
import { GeoTatHeatmap, GeoTatHeatmapSkeleton } from "./GeoTatHeatmap";
import {
  PatternExceptionsTable,
  PatternExceptionsTableSkeleton,
} from "./PatternExceptionsTable";
import {
  PartnerTatLeaderboard,
  PartnerTatLeaderboardSkeleton,
} from "./PartnerTatLeaderboard";

import {
  PartnerReliabilityRadar,
  PartnerReliabilityRadarSkeleton,
} from "./PartnerReliabilityRadar";
import {
  OpsBottlenecksCard,
  OpsBottlenecksCardSkeleton,
} from "./OpsBottlenecksCard";
import { useOperationalStore } from "@/stores/operationalStore";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { operational } from "@/services/operationalService";

interface OperationalDashboardEmbedProps {
  id: string;
}

export const OperationalDashboardEmbed = ({
  id,
}: OperationalDashboardEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data, fetchOperational, resetData } = useOperationalStore();
 const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    fetchOperational(id).finally(() => setIsLoading(false));
    return () => {
      resetData();
    };
  }, [id, fetchOperational]);

  const handleExport = async () => {
    setIsExporting(true)
    if (!id) return;

    try {
      await operational.exportOperational(id);
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
    <section>
  {isLoading ? (
   
      <OpsKpiPillNewSkeleton/>
    
  ) : (
    <div className="w-full glass-card neon-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Operational Summary
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(data?.kpis ?? []).map((kpi, index) => (
          <OpsKpiPillNew
            key={kpi?.id ?? index}
            kpi={kpi}
            index={index}
          />
        ))}
      </div>
    </div>
  )}
</section>

      {/* SLA & Daily Volume */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <SlaPatternCardSkeleton />
        ) : (
          <SlaPatternCard data={data?.sla_by_pattern ?? []} />
        )}

        {isLoading ? (
          <DailyVolChartSkeleton />
        ) : (
          <DailyVolChart data={data?.daily_avg_volume ?? []} />
        )}
      </section>

      {/* TAT Heatmap & Pattern Exceptions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <GeoTatHeatmapSkeleton />
        ) : (
          <GeoTatHeatmap data={data?.geo_tat_proxy ?? []} />
        )}

        {isLoading ? (
          <PatternExceptionsTableSkeleton />
        ) : (
          <PatternExceptionsTable data={data?.pattern_exceptions ?? []} />
        )}
      </section>

      {/* Partner TAT & Capacity Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <PartnerTatLeaderboardSkeleton />
        ) : (
          <PartnerTatLeaderboard data={data?.partner_tat_rank ?? []} />
        )}

        {isLoading ? (
          <OpsBottlenecksCardSkeleton />
        ) : (
          <OpsBottlenecksCard
            data={data?.ops_bottlenecks?.data ?? []}
            summary={data?.ops_bottlenecks?.summary ?? ""}
          />
        )}
      </section>

      {/* Partner Reliability & Bottlenecks */}
      <section className="">
        {isLoading ? (
          <PartnerReliabilityRadarSkeleton />
        ) : (
          <PartnerReliabilityRadar data={data?.partner_reliability ?? []} />
        )}
      </section>
    </div>
  );
};
