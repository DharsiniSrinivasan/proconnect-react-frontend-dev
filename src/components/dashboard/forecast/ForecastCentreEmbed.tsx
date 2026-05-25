/**
 * Forecast Centre Embed - Restructured with 11 exact forecast cards
 * NO historical comparisons - projection focused
 */

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ForecastTab } from "@/mocks/forecasts.mock";
import {
  ForecastKpiStrip,
  ForecastKpiStripSkeleton,
} from "@/components/forecast/ForecastKpiStrip";
import {
  VolForecastChart,
  VolForecastChartSkeleton,
} from "@/components/forecast/VolForecastChart";
import {
  FreightForecastChart,
  FreightForecastChartSkeleton,
} from "@/components/forecast/FreightForecastChart";
import {
  FreightQtyPredChart,
  FreightQtyPredChartSkeleton,
} from "@/components/forecast/FreightQtyPredChart";
import {
  PatternDemandCard,
  PatternDemandCardSkeleton,
} from "@/components/forecast/PatternDemandCard";
import {
  CostScenariosChart,
  CostScenariosChartSkeleton,
} from "@/components/forecast/CostScenariosChart";
import {
  GeoCapacityPredCard,
  GeoCapacityPredCardSkeleton,
} from "@/components/forecast/GeoCapacityPredCard";
import {
  TrendSensitivityChart,
  TrendSensitivityChartSkeleton,
} from "@/components/forecast/TrendSensitivityChart";
import {
  SlaProbForecastTable,
  SlaProbForecastTableSkeleton,
} from "@/components/forecast/SlaProbForecastTable";
import {
  GrowthAlertsCard,
  GrowthAlertsCardSkeleton,
} from "@/components/forecast/GrowthAlertsCard";
import {
  MultiMetricCITable,
  MultiMetricCITableSkeleton,
} from "@/components/forecast/MultiMetricCITable";
import { forecastStore } from "@/stores/foreCastStore";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { forecast } from "@/services/forecastService";

export const ForecastCentreEmbed = (id: any) => {
  const [activeTab, setActiveTab] = useState<ForecastTab>("demand");
  const { getForecast, forecastDetails, loading } = forecastStore();
   const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    if (id?.id) {
      getForecast(id?.id);
    }
  }, [id?.id, getForecast]);
  const currentKpis = forecastDetails?.kpis[activeTab];
  const handleExport = async () => {
     setIsExporting(true);
    if (!id?.id) return;

    try {
      await forecast.exportForecast(id?.id);
    } catch (err: any) {
      console.error(err);
    }
    finally {
      setIsExporting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ForecastKpiStripSkeleton />;
    }
    if (forecastDetails) {
      return (
        <>
           <div className="glass-card neon-border p-5">
      <div className="flex items-center justify-between mb-4">
       <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
           Forecast Summary
          </h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="text-xs font-medium  gap-1.5 hover:text-primary-foreground"
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
          <ForecastKpiStrip kpis={currentKpis ?? []} />
</div>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ForecastTab)}
          >
            <TabsList className="bg-card/50 border border-border/50 p-1">
              <TabsTrigger
                value="demand"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Demand
              </TabsTrigger>
              <TabsTrigger
                value="cost"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Freight Cost
              </TabsTrigger>
              <TabsTrigger
                value="tat"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                TAT
              </TabsTrigger>
              {/* <TabsTrigger value="capacity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            CAPACITY
          </TabsTrigger> */}
            </TabsList>

            {/* Demand Tab */}
            <TabsContent value="demand" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                  <VolForecastChartSkeleton />
                ) : (
                  <VolForecastChart data={forecastDetails?.volForecast ?? []} />
                )}
                {loading ? (
                  <PatternDemandCardSkeleton />
                ) : (
                  <PatternDemandCard
                    data={forecastDetails?.patternDemand ?? []}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                  <GrowthAlertsCardSkeleton />
                ) : (
                  <GrowthAlertsCard
                    data={forecastDetails?.growthAlerts ?? []}
                  />
                )}
                {loading ? (
                  <MultiMetricCITableSkeleton />
                ) : (
                  <MultiMetricCITable
                    data={forecastDetails?.multiMetricCI ?? []}
                  />
                )}
              </div>
            </TabsContent>

            {/* Cost Tab */}
            <TabsContent value="cost" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                  <FreightForecastChartSkeleton />
                ) : (
                  <FreightForecastChart
                    data={forecastDetails?.freightForecast ?? []}
                  />
                )}
                {loading ? (
                  <FreightQtyPredChartSkeleton />
                ) : (
                  <FreightQtyPredChart data={forecastDetails?.freightQtyPred} />
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                  <CostScenariosChartSkeleton />
                ) : (
                  <CostScenariosChart
                    data={forecastDetails?.costScenarios ?? []}
                  />
                )}
                {loading ? (
                  <TrendSensitivityChartSkeleton />
                ) : (
                  <TrendSensitivityChart
                    data={forecastDetails?.trendSensitivity ?? []}
                  />
                )}
              </div>
              {/* <div>
            {loading ? <WhatIfExternalCardSkeleton /> : <WhatIfExternalCard data={forecastDetails?.whatIfExternal ?? []} />}
          </div> */}
            </TabsContent>

            {/* TAT Tab */}
            <TabsContent value="tat" className="mt-6 space-y-6">
              <div>
                {loading ? (
                  <SlaProbForecastTableSkeleton />
                ) : (
                  <SlaProbForecastTable
                    data={forecastDetails?.slaProbForecast ?? []}
                  />
                )}
              </div>
            </TabsContent>

            {/* Capacity Tab */}
            <TabsContent value="capacity" className="mt-6 space-y-6">
              <div>
                {loading ? (
                  <GeoCapacityPredCardSkeleton />
                ) : (
                  <GeoCapacityPredCard
                    data={forecastDetails?.geoCapacityPred ?? []}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      );
    }
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground">
        No records found
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderContent()}
    </div>
  );
};