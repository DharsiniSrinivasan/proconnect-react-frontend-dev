/**
 * Facility Dashboard Mock - Restructured for exact facility metrics
 * NO historical comparisons - current period data only
 */

export type FacilityTier = "Mother Hub" | "Satellite Hub" | "Satellite WH";

export interface FacilityKpi {
  id: string;
  label: string;
  value: string | number;
  prefix?: string | null;
  suffix?: string | null;
  subtext?: string;
}

export interface TierUtilizationData {
  geo: string;
  motherHub: number;
  satelliteHub: number;
  satelliteWH: number;
}

export interface PatternDemandPoint {
  pincode: string;
  geo: string;
  qty12u: number;
  qty10plus: number;
  total: number;
  tierRec: FacilityTier;
}
export interface PatternDemandApiPoint {
  pincode: string;
  geo: string;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  Q5: number;
  facilityName: string;
  facilityCode: string;
  total: number;
  tierRec?: any;
  labelConfigArray: {
    key: string;
    min: number;
    max: number | null;
    description: string;
  }[];
}

export interface GeoCapacityCell {
  geo: string;
  pattern: string;
  utilization: number;
  threshold: number;
  status: "normal" | "warning" | "overload";
  label: {
    description: string;
  };
  distributionPercent: number;
}

export interface TierCoverageData {
  tier: FacilityTier;
  pincodesCovered: number;
  totalPincodes: number;
  percentage: number;
  expansionGap: number;
}

export interface PaybackPeriodData {
  facility: string;
  tier: FacilityTier;
  startMonth: number;
  paybackMonths: number;
  freightSavings: number;
  opex: number;
}

export interface VolForecastGapPoint {
  month: string;
  volume: number;
  capacity: number;
  lowerBand: number;
  upperBand: number;
}

export interface HighDensityPin {
  rank: number;
  pincode: string;
  region: string;
  billedQty: number;
  crossRegPercent: number;
  tierRec: FacilityTier;
}

export interface EconomicsMatrixRow {
  tier: FacilityTier;
  geo: string;
  rentCost: number;
  freightPerQty: number;
  totalCost: number;
  roi: number;
}

export interface DemandClusterPoint {
  clusterId: string;
  region: string;
  pincodes: number;
  totalVol: number;
  density: "Low" | "Medium" | "High";
  assignedFacility: string | null;
}

export interface ExpansionPriorityRow {
  rank: number;
  pincode: string;
  region: string;
  volGrowth: number;
  capacityGap: number;
  paybackMonths: number;
  score: number;
  whatIfVol20: number;
}

export interface TierMigrationData {
  fromTier: string;
  toTier: string;
  shipments: number;
  percentage: number;
  costImpact: number;
}

export interface UtilizationTrendCell {
  month: string;
  pattern: string;
  utilization: number;
  alert: "low" | "normal" | "high" | null;
}

export interface FacilityDashboardMock {
  kpis: FacilityKpi[];
  tierUtilization: TierUtilizationData[];
  patternDemand: PatternDemandPoint[];
  geoCapacityGaps: GeoCapacityCell[];
  tierCoverage: TierCoverageData[];
  paybackPeriods: PaybackPeriodData[];
  volForecastGaps: VolForecastGapPoint[];
  highDensityPins: HighDensityPin[];
  economicsMatrix: EconomicsMatrixRow[];
  demandClusters: DemandClusterPoint[];
  expansionPriority: ExpansionPriorityRow[];
  tierMigration: TierMigrationData[];
  utilizationTrends: UtilizationTrendCell[];
}
