/**
 * Dashboard-related TypeScript types
 * Used across Strategic, Operational, Financial, and Facility dashboards
 */

// ============= Common Types =============

export type TrendDirection = "up" | "down" | "flat" | "neutral";
export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT"
  | "Low"
  | "Medium"
  | "High";
export type TatBand = "GREEN" | "AMBER" | "RED";
export type SlaRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// ============= Strategic Dashboard =============

export interface KPI {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  isPositive: boolean;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  volumeBoxes: number;
  costPerKg: number;
  slaPercent: number;
  avgTatDays: number;
  utilisationPercent: number;
  priority: "High" | "Medium" | "Low";
  coordinates: { x: number; y: number };
}

export interface Partner {
  id: string;
  name: string;
  mode: "Air" | "Road" | "Rail" | "Sea" | "Multi-modal";
  costIndex: number;
  slaPercent: number;
  avgTat: number;
  odaCoveragePercent: number;
  overallScore: number;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
}

export interface Facility {
  id: string;
  name: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  utilisationPercent: number;
  roiPercent: number;
  paybackMonths: number;
  status: "Expand" | "Monitor" | "Optimise" | "Defer";
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  category:
    | "Cost Optimisation"
    | "Network Expansion"
    | "Partner Strategy"
    | "Capacity Planning"
    | "Risk Mitigation";
  impact: "High" | "Medium" | "Low";
  confidencePercent: number;
  status: "New" | "In Review" | "Approved" | "Implemented";
}

export interface StrategicDashboardData {
  activeDataset: string;
  lastUpdated: string;
  kpis: KPI[];
  regions: Region[];
  partners: Partner[];
  facilities: Facility[];
  recommendations: StrategicRecommendation[];
}

// ============= Operational Dashboard =============

export interface OpsKpi {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
  trendDirection: TrendDirection;
}

export interface SlaPoint {
  date: string;
  slaPct: number;
}

export interface BreachCause {
  cause: string;
  count: number;
  pct: number;
  topRegion: string;
}

export interface LanePerformanceRow {
  id: string;
  origin: string;
  destination: string;
  mode: string;
  partner: string;
  shipments: number;
  breachPct: number;
  avgTat: number;
  p75Tat: number;
  tatBand: TatBand;
  slaRiskLevel: SlaRiskLevel;
}

export interface FacilityUtilRow {
  id: string;
  name: string;
  utilisation: number;
  capacity: number;
  throughput: number;
}

export interface OpsQueueItem {
  id: string;
  item: string;
  count: number;
  oldestAgeHours: number;
  priority: Priority;
}

export interface OperationalDashboardData {
  activeDataset: string;
  lastUpdated: string;
  kpis: OpsKpi[];
  slaTrend: SlaPoint[];
  breachCauses: BreachCause[];
  lanes: LanePerformanceRow[];
  facilities: FacilityUtilRow[];
  opsQueue: OpsQueueItem[];
}

// ============= Financial Dashboard =============

export interface FinKpi {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
  isPositive: boolean;
}

export interface CostTrendPoint {
  month: string;
  actual: number;
  budget: number;
  forecast: number;
}

export interface CostBreakdownItem {
  category: string;
  amount: number;
  pct: number;
  variance: number;
}

export interface PartnerRateRow {
  id: string;
  partner: string;
  mode: string;
  baseRate: number;
  negotiatedRate: number;
  effectiveRate: number;
  volume: number;
  spend: number;
}

export interface FinancialDashboardData {
  activeDataset: string;
  lastUpdated: string;
  kpis: FinKpi[];
  costTrend: CostTrendPoint[];
  costBreakdown: CostBreakdownItem[];
  partnerRates: PartnerRateRow[];
}

// ============= Facility Dashboard =============

export interface FacilityKpi {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
  trendDirection: TrendDirection;
}

export interface FacilityDetailRow {
  id: string;
  name: string;
  tier: string;
  region: string;
  capacity: number;
  utilPct: number;
  throughput: number;
  costPerUnit: number;
  status: string;
}

export interface UtilTrendPoint {
  week: string;
  utilPct: number;
  capacity: number;
}

export interface CapacityQuadrantItem {
  id: string;
  name: string;
  utilisation: number;
  roi: number;
  size: number;
}

export interface ExpansionItem {
  id: string;
  facility: string;
  type: string;
  investment: number;
  expectedRoi: number;
  timeline: string;
  priority: Priority;
}

export interface FacilityDashboardData {
  activeDataset: string;
  lastUpdated: string;
  kpis: FacilityKpi[];
  facilities: FacilityDetailRow[];
  utilTrend: UtilTrendPoint[];
  quadrant: CapacityQuadrantItem[];
  expansions: ExpansionItem[];
}
