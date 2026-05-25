import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import {
  RecoHeader,
  RecoHeaderSkeleton,
} from "@/components/recommendations/RecoHeader";
import {
  WhyTriggeredCard,
  WhyTriggeredCardSkeleton,
} from "@/components/recommendations/WhyTriggeredCard";
import {
  ProposedActionCard,
  ProposedActionCardSkeleton,
} from "@/components/recommendations/ProposedActionCard";
import {
  ImpactCard,
  ImpactCardSkeleton,
} from "@/components/recommendations/ImpactCard";
import { ActivityTimelineSkeleton } from "@/components/recommendations/ActivityTimeline";
import { getStorage } from "@/utils/storage";
import { recommendationStore } from "@/stores/recommendationStore";
import FacilityRecommendationCard from "./Facilityrecommendationcard";
import {
  ConflictsCard,
  ConflictsCardSkeleton,
} from "@/components/recommendations/ConflictsCard";
import TransporterComparison from "@/components/recommendations/TransporterComparison";
import { WorstPerformance, WorstPerformanceSkeleton } from "@/components/recommendations/worstPerformance";

const RecommendationDetailPage = () => {
  const { recommendationDetails, getRecommendation } = recommendationStore();
  const { id } = useParams<{ id: string }>();
  const storage = getStorage();
  const dataSetId = storage.getItem("datasetId");


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataSetId) {
      getRecommendation(dataSetId);
    }
  }, [dataSetId, getRecommendation]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const recommendation = id ? recommendationDetails?.details[id] : null;

  // Check if warehouse recommendation data exists
  const hasWarehouseRecommendation =
    recommendation?.warehouserecommendation &&
    Object.keys(recommendation.warehouserecommendation).length > 0;


  const formatMode = (mode: string) => {
    const map: Record<string, string> = {
      AIR: "Air",
      ROAD: "Road",
      RAIL: "Rail",
      SEA: "Sea",
      INLAND: "Inland",
    };
    return map[mode] || mode;
  };

  const mapToLaneDetails = (data: any) => ({
    lane: data?.lane,
    plant: data?.plant,
    tierType: data?.tierType,

    current: {
      name: data?.currentTransporterName,
      code: data?.currentTransporterCode,
      mode: formatMode(data?.currentTransportMode),
      metrics: data?.currentMetrics, //
    },

    proposed: {
      name: data?.proposedTransporterName,
      code: data?.proposedTransporterCode,
      mode: formatMode(data?.proposedTransportMode),
      metrics: data?.proposedMetrics, // 
    },
  });
  const laneDetails = mapToLaneDetails(recommendation!?.laneDetails)
 
  return (
    <AppShell
      pageTitle="Recommendation Detail"
      lastUpdated={recommendation?.createdAt}
    >
      {loading ? (
        <RecoHeaderSkeleton />
      ) : (
        <RecoHeader recommendation={recommendation!} />
      )}
      {loading ? (
        <WorstPerformanceSkeleton />
      ) : recommendation?.worst_performance?.length ? (
        <WorstPerformance worstDetails={recommendation?.worst_performance} />
      ) : null}




      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Column */}
        <div className="space-y-6">
          {loading ? (
            <>
              <ProposedActionCardSkeleton />
            </>
          ) : (
            <>
              <ProposedActionCard
                proposedAction={recommendation?.proposedAction || 'N/A'}
                comparison={recommendation?.currentVsProposed || []}
                explanations={recommendation?.explanations || {}}
              />
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {loading ? (
            <>
              <ImpactCardSkeleton />
              <WhyTriggeredCardSkeleton />
              <ConflictsCardSkeleton />
              <ActivityTimelineSkeleton />
            </>
          ) : (
            <>
              <ImpactCard
                annualSavings={recommendation!?.Savings || '0'}
                tatReduction={recommendation!?.tatReduction || '0'}
                roiPct={recommendation!?.roiPct || '0'}
                paybackMonths={recommendation!?.paybackMonths || '0'}
                explanations={recommendation!?.explanations || '0'}
              />
              <WhyTriggeredCard
                explanations={recommendation?.explanations ?? {}}
                triggers={recommendation?.whyTriggered ?? []}
              />
              {recommendation!?.conflicts?.length > 0 && (
                <ConflictsCard conflicts={recommendation!?.conflicts} />
              )}
              {/* <ActivityTimeline activity={recommendation!.activity} /> */}
            </>
          )}
        </div>
      </div>

      {hasWarehouseRecommendation && (
        <div>
          <FacilityRecommendationCard
            facilityData={recommendation!.warehouserecommendation}
            explanations={recommendation!.warehouserecommendation_explanations}
            loading={loading}
          />
        </div>
      )}
      {recommendation!?.category == "TRANSPORTER_SWITCH" && (
        <TransporterComparison laneDetails={laneDetails} />
      )}


    </AppShell>
  );
};

export default RecommendationDetailPage;
