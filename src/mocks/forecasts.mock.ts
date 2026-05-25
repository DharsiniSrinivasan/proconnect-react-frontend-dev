/**
 * Forecast Mock - Restructured with 11 exact forecast metrics
 * NO historical comparisons - projection focused
 */

export type ForecastTab = "demand" | "cost" | "tat" | "capacity";

export interface ForecastKpi {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  explanation?: string;
  calculation?: {
    formula: string;
    evaluated: string;
  } | null;
}

export interface VolForecastPoint {
  month: string;
  pattern12u: number;
  pattern10plus: number;
  p50: number;
  p75: number;
  p90: number;
  volForecast_explanation: string;
}

export interface FreightForecastPoint {
  month: string;
  base: number;
  pessimistic: number;
  igst: number;
  local: number;
}

export interface FreightQtyPredPoint {
  month: string;
  actual: number;
  predicted: number;
  ratebook: number;
}

export interface PatternDemandForecast {
  geo: string;
  pattern12u: number;
  pattern10plus: number;
  confidence: number;
  trend: "stable" | "up" | "down";
  patternDemand_explanation: string;
}

export interface CostScenarioData {
  scenario: string;
  freight: number;
  igst: number;
  total: number;
  savings: number;
}

export interface GeoCapacityPredCell {
  geo: string;
  month: string;
  utilization: number;
  tier: string;
  status: "normal" | "warning" | "hotspot";
  geoCapacityPred_explanation: any;
}

export interface TrendSensitivityPoint {
  volChange: number;
  freightImpact: number;
  pattern: string;
  geo: string;
  trendSensitivity_explanation?: string;
}

export interface SlaProbForecastCell {
  lane: string;
  pattern: string;
  p50: number;
  p75: number;
  p90: number;
  baseline: number;
  slaProbForecast_explanation: string;
}

export interface GrowthAlertRow {
  id: string;
  type: "pattern" | "geo";
  name: string;
  projectedGrowth: number;
  mitigation: string;
  severity: "low" | "medium" | "high";
  growthAlerts_explanation: string;
   calculation?: {
    formula: string;
    evaluated: string;
  };
}

export interface MultiMetricCIRow {
  metric: string;
  p50: number;
  p75: number;
  p90: number;
  unit: string;
  multiMetricCI_explanation: string;
  calculation?: {
    formula: string;
    evaluated: string;
  };
}

export interface WhatIfExternalScenario {
  lever: string;
  currentValue: number;
  adjustedValue: number;
  impact: number;
  unit: string;
}

export interface ForecastMock {
  kpis: Record<ForecastTab, ForecastKpi[]>;
  volForecast: VolForecastPoint[];
  freightForecast: FreightForecastPoint[];
  freightQtyPred: FreightQtyPredPoint[];
  patternDemand: PatternDemandForecast[];
  costScenarios: CostScenarioData[];
  geoCapacityPred: GeoCapacityPredCell[];
  trendSensitivity: TrendSensitivityPoint[];
  slaProbForecast: SlaProbForecastCell[];
  growthAlerts: GrowthAlertRow[];
  multiMetricCI: MultiMetricCIRow[];
  whatIfExternal: WhatIfExternalScenario[];
}
