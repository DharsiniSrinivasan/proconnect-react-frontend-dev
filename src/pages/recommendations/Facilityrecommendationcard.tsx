import React from "react";
import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  MapPin,
  Info,
  IndianRupee,
} from "lucide-react";

interface LocationDetails {
  country: string;
  state: string;
  district: string;
  preferredLocality: string;
  tierClassification: string;
  industrialZone: boolean;
  roadAccessibility: string;
  nearestHighwayKm: number;
  floodRisk: string;
  drainageInfrastructure: boolean;
  powerSupplyAvailable: boolean;
}

interface FacilityData {
  facilityType: string;
  recommendedSizeSqFt: number;
  locationDetails: LocationDetails;
  tatReductionDays: number;
  tatReductionPct: number;
  slaImprovementPct: number;
  rentCostImpact: number;
  capexRequired: number;
  sizingFormula: string;
}

interface Props {
  facilityData: FacilityData;
  loading?: boolean;
  explanations: string;
}

const FacilityRecommendationCard: React.FC<Props> = ({
  facilityData,
  explanations,
  loading = false,
}) => {
  if (loading) {
    return <FacilityRecommendationSkeleton />;
  }

  const { locationDetails } = facilityData;

  const getRiskBadgeColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-emerald-500/20 text-emerald-400";
      case "medium":
        return "bg-amber-500/20 text-amber-400";
      case "high":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <NeonCard>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {facilityData.facilityType}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {locationDetails.preferredLocality}, {locationDetails.district},{" "}
              {locationDetails.state}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {facilityData.recommendedSizeSqFt.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Sq. Ft.</p>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 pb-6 border-b border-border/40">
                <MetricBox
                    label="TAT Reduction"
                    value={`${facilityData.tatReductionPct.toFixed(1)}%`}
                    subtext={`${facilityData.tatReductionDays.toFixed(2)} days`}
                />
                <MetricBox
                    label="CAPEX"
                    value={`₹${(facilityData.capexRequired / 100000).toFixed(1)}L`}
                    subtext={facilityData.capexRequired.toLocaleString()}
                />
                <MetricBox
                    label="SLA Impact"
                    value={`${facilityData.slaImprovementPct}%`}
                    subtext="Service Level"
                />
                <MetricBox
                    label="Tier"
                    value={locationDetails.tierClassification}
                    subtext="Classification"
                />
            </div> */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-green-400" />
          <h4 className="text-base font-semibold text-foreground">
            Explanation
          </h4>
        </div>
        <p className="text-sm text-muted-foreground ml-4 mb-4">
          {explanations}
        </p>
      </div>
      {/* Location & Infrastructure Section */}
      <div className="mb-6 pb-6 border-b border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-semibold text-foreground">
            Location & Infrastructure
          </h4>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">
                  Property
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Location
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {locationDetails.country} → {locationDetails.state} →{" "}
                  {locationDetails.district}
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Preferred Area
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {locationDetails.preferredLocality}
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Road Access
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {locationDetails.roadAccessibility}
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Highway Distance
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {locationDetails.nearestHighwayKm} km
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Industrial Zone
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${locationDetails.industrialZone ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
                  >
                    {locationDetails.industrialZone ? "Yes" : "No"}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Power Supply
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${locationDetails.powerSupplyAvailable ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {locationDetails.powerSupplyAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Drainage Infrastructure
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${locationDetails.drainageInfrastructure ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {locationDetails.drainageInfrastructure
                      ? "Present"
                      : "Absent"}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Flood Risk
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(locationDetails?.floodRisk)}`}
                  >
                    {locationDetails.floodRisk || "N/A"}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Capacity & Financial Impact Section */}
      <div className="mb-6 pb-6 border-b border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-semibold text-foreground">
            Capacity & Financial Impact
          </h4>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">
                  Metric
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Recommended Size
                </TableCell>
                <TableCell className="font-mono text-primary text-sm">
                  {facilityData.recommendedSizeSqFt.toLocaleString()} Sq. Ft.
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  CAPEX Required
                </TableCell>
                <TableCell className="font-mono text-primary text-sm">
                  ₹{facilityData.capexRequired.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  Annual Rent Impact
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {facilityData.rentCostImpact === 0
                    ? "No Impact"
                    : `₹${facilityData?.rentCostImpact?.toLocaleString()}`}
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  TAT Reduction
                </TableCell>
                <TableCell className="font-mono text-blue-400 text-sm">
                  {facilityData?.tatReductionPct?.toFixed(1)}% (
                  {facilityData?.tatReductionDays?.toFixed(2)}d)
                </TableCell>
              </TableRow>
              <TableRow className="border-border/30">
                <TableCell className="text-foreground text-sm">
                  SLA Improvement
                </TableCell>
                <TableCell className="font-mono text-emerald-400 text-sm">
                  {facilityData?.slaImprovementPct}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </NeonCard>
  );
};

const MetricBox: React.FC<{
  label: string;
  value: string;
  subtext: string;
}> = ({ label, value, subtext }) => (
  <div className="border border-border/40 rounded-lg p-3">
    <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
    <p className="text-base font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
  </div>
);

export const FacilityRecommendationSkeleton = () => (
  <NeonCard>
    <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/40">
      <div className="flex items-start gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-12 mt-1" />
      </div>
    </div>

    <div className="grid grid-cols-4 gap-3 mb-6 pb-6 border-b border-border/40">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>

    <div className="mb-6 pb-6 border-b border-border/40">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>

    <div className="mb-6 pb-6 border-b border-border/40">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>

    <div>
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-12 w-full" />
    </div>
  </NeonCard>
);

export default FacilityRecommendationCard;
