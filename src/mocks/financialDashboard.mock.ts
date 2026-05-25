/**
 * Financial Dashboard Mock Data
 * NO historical comparisons - current period data only
 */

export interface FinKpi {
  id: string;
  label: string;
  value: number | string;
  subtext?: string;
  prefix?: string;
}

export interface MonthlyFreightData {
  month: string;
  freight: number;
  odaCharge: number;
}

export interface FreightQtyTrendPoint {
  month: string;
  freightPerQty: number;
  ratebookSlab: number;
}

export interface PatternCostData {
  pattern: string;
  cost: number;
  percentage: number;
}

export interface GeoCostLeader {
  geo: string;
  pattern: string;
  cost: number;
  budget_gap: number;
  budget: number;
}

export interface VarianceSegment {
  id: string;
  label: string;
  value: number;
  type: "start" | "add" | "subtract" | "end";
}

export interface BudgetTrackerData {
  category: string;
  spent: number;
  budget: number;
  percentage: number;
}

export interface PatternMarginRow {
  pattern: string;
  totalInvoice: number;
  freight: number;
  margin: number;
  marginPercent: number;
  status: "healthy" | "warning" | "critical";
  budget: number;
}

export interface PartnerCostCompare {
  partner: string;
  avgPerQty: number;
  ratebook: number;
  gap: number;
}

export interface CostAllocationNode {
  name: string;
  value: number;
  children?: CostAllocationNode[];
}

export interface FinancialDashboardMock {
  kpis: FinKpi[];
  monthlyFreight: MonthlyFreightData[];
  freightQtyTrend: FreightQtyTrendPoint[];
  patternCosts: PatternCostData[];
  geoCostLeaders: GeoCostLeader[];
  varianceWaterfall: VarianceSegment[];
  budgetTracker: BudgetTrackerData[];
  patternMargins: PatternMarginRow[];
  partnerCostCompare: PartnerCostCompare[];
  costAllocation: CostAllocationNode[];
}
