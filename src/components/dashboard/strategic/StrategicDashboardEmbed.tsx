/**
 * Strategic Dashboard Embed - Executive overview focused
 * Unique focus: High-level KPIs, savings opportunities, what-if scenarios
 */
import { useState, useEffect } from "react";
import {
  FreightSpendCard,
  FreightSpendCardSkeleton,
} from "@/components/dashboard/strategic/FreightSpendCard";
import {
  AvgFreightGaugeCard,
  AvgFreightGaugeCardSkeleton,
} from "@/components/dashboard/strategic/AvgFreightGaugeCard";
import {
  VolumeGrowthCard,
  VolumeGrowthCardSkeleton,
} from "@/components/dashboard/strategic/VolumeGrowthCard";
import {
  TopPatternsCard,
  TopPatternsCardSkeleton,
} from "@/components/dashboard/strategic/TopPatternsCard";
import {
  GeoCostMixCard,
  GeoCostMixCardSkeleton,
} from "@/components/dashboard/strategic/GeoCostMixCard";
import {
  PartnerShareCard,
  PartnerShareCardSkeleton,
} from "@/components/dashboard/strategic/PartnerShareCard";
import {
  SavingsOppCard,
  SavingsOppCardSkeleton,
} from "@/components/dashboard/strategic/SavingsOppCard";
import {
  RegionalHeatmapCard,
  RegionalHeatmapCardSkeleton,
} from "@/components/dashboard/strategic/RegionalHeatmapCard";
import {
  CrossRegionAlertCard,
  CrossRegionAlertCardSkeleton,
} from "@/components/dashboard/strategic/CrossRegionAlertCard";
import {
  ExecutiveSummaryCard,
  ExecutiveSummaryCardSkeleton,
} from "@/components/dashboard/strategic/ExecutiveSummaryCard";
import { useStrategicStore } from "@/stores/strategicStore";
import { QuantityWiseBreakdown } from "./quantitywiseBreakdown";
import FreighCostMode from "./frieghtCostMode";
import { NeonCard } from "@/components/ui/neon-card";
import GoogleMapComponent from "@/components/dashboard/map/InteractiveMap";
import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";
import { BillingWisePattern } from "./billingWiseComponent";

export const StrategicDashboardEmbed = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchStrategic, data, resetData } = useStrategicStore();
  const [isDark, setIsDark] = useState(false);
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));

  useEffect(() => {
    const savedTheme = storage.getItem("themeMode");

    const darkMode = savedTheme === "DARK";

    setIsDark(darkMode);

    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (hasPermission("access-strategic-dashboard")) {
      fetchStrategic(id.id).finally(() => setIsLoading(false));
      return () => {
        resetData();
      };
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <section>
        {isLoading ? (
          <ExecutiveSummaryCardSkeleton />
        ) : (
          <ExecutiveSummaryCard
            data={data?.executive_summary?.executiveSummary ?? []}
            id={id}
          />
        )}
      </section>

      {/* KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <FreightSpendCardSkeleton />
            <AvgFreightGaugeCardSkeleton />
            {/* <VolumeGrowthCardSkeleton /> */}
          </>
        ) : (
          <>
            <FreightSpendCard data={data?.freight_spend_data ?? {}} />
            <AvgFreightGaugeCard data={data?.avg_freight_data ?? {}} />
            {/* <VolumeGrowthCard data={data?.volume_growth_data ?? {}} /> */}
          </>
        )}
      </section>

      {/* Network Savings Opportunity - Full Width */}
      <section>
        {isLoading ? (
          <SavingsOppCardSkeleton />
        ) : (
          data?.savings_opportunities?.avgVariance > 0 && (
            <SavingsOppCard
              data={data?.savings_opportunities ?? []}
              labelConfig={
                data?.cross_region_escalation?.labelConfigArray ?? []
              }
            />
          )
        )}
      </section>

      {/* Pattern & Geo Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <TopPatternsCardSkeleton />
        ) : (
          <TopPatternsCard data={data?.pattern_breakdown?.topPatterns ?? []} />
        )}

        {isLoading ? (
          <GeoCostMixCardSkeleton />
        ) : (
          <GeoCostMixCard
            data={data?.geo_cost_mix ?? {}}
            shipmentYear={data?.shipmentYear ?? ""}
          />
        )}
      </section>

      {/* Full-width Heatmap */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {isLoading ? (
        <>
          <PartnerShareCardSkeleton />
           <VolumeGrowthCardSkeleton />
          </>
        ) : (
        <>
          <PartnerShareCard data={data?.partner_share ?? []} />
          <VolumeGrowthCard data={data?.volume_growth_data ?? {}} />
          </>
        )}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {isLoading ? (
          <RegionalHeatmapCardSkeleton />
        ) : (
          <RegionalHeatmapCard
            data={data?.regional_heatmap?.stateHeatmap ?? []}
          />
        )}
      </section>

      {/* Partner Share & Strategic Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px] lg:h-[500px]">
        <div className="h-[300px] lg:h-full w-full min-h-0">
          <GoogleMapComponent
            markers={data?.regional_heatmap?.mapDetails}
            isDark={isDark}
          />
        </div>

        <div className="h-[300px] lg:h-full w-full min-h-0 overflow-y-auto">
          {isLoading ? (
            <CrossRegionAlertCardSkeleton />
          ) : (
            <CrossRegionAlertCard
              data={data?.cross_region_escalation?.cross_region_escalation ?? []}
              mitigation={data?.cross_region_escalation?.mitigation ?? ""}
              labelConfig={data?.cross_region_escalation?.labelConfigArray ?? []}
            />
          )}
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <QuantityWiseBreakdown data={data?.qty_wise_break_up} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <BillingWisePattern
          data={data?.freight_against_billing_pattern ?? []}
        />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <NeonCard title="Freight Cost Mode & Region Wise" className="w-full">
          {data?.freight_cost_mode_region_wise?.map((month) => (
            <FreighCostMode key={month.month} monthData={month} />
          ))}
        </NeonCard>
      </section>
    </div>
  );
};
