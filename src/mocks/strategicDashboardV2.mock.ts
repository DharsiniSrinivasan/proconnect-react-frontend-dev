/**
 * Strategic Dashboard V2 Mock - Restructured with exact metrics
 * Based on Oct 2024 - Jan 2025 data patterns
 */

// ============= Types =============
export interface FreightSpendKpi {
  totalSpend: number;
  annualTarget: number;
  sparklineData: { month: string; value: number }[];
  vsTargetPercent: number;
}

export interface AvgFreightQtyGauge {
  currentValue: number;
  targetValue: number;
  trendData: { month: string; value: number }[];
  status: "good" | "warning" | "critical";
}

export interface VolumeGrowth {
  currentVolume: number;
  previousVolume: number;
  growthPercent: number;
  geoBreakdown: { region: string; volume: number; growth: number }[];
}

export interface PatternBreakdown {
  pattern: string;
  label: string;
  budget?: number;
  freightPercent: number;
  freightValue: number;
  ratebookVariance: number;
}

export interface GeoCostMix {
  month: string;
  crossRegion: number;
  withinRegion: number;
  withinCity: number;
}

export interface PartnerShare {
  code: string;
  name: string;
  freightShare: number;
  volumeShare: number;
  switchOppValue: number;
}

export interface SavingsOpportunity {
  totalSavings: number;
  topLanes: { lane: string; savings: number; pattern: string }[];
}

export interface StateHeatmap {
  state: string;
  freightPerQty: number;
  volume: number;
  intensity: "low" | "medium" | "high" | "critical";
}

export interface FacilityROI {
  facility: string;
  plant: string;
  volumeGap: number;
  paybackMonths: number;
  roi: number;
  rank: number;
}

export interface CrossRegionEscalation {
  month: string;
  units1to2: number;
  units3to5: number;
  unitsGt10: number;
}

export interface WhatIfScenario {
  consolidationPercent: number;
  savingsAmount: number;
  volumeImpacted: number;
}

export interface ExecutiveSummaryKpi {
  id: string;
  label: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  isPositive: boolean;
  icon: "volume" | "cost" | "tat" | "coverage";
  value: number | string;
  prefix?: string; // optional (₹)
  suffix?: string; // optional (%, d)
}

export interface StrategicDashboardV2Data {
  lastUpdated: string;
  dataRange: string;
  freightSpend: FreightSpendKpi;
  avgFreightQty: AvgFreightQtyGauge;
  volumeGrowth: VolumeGrowth;
  topPatterns: PatternBreakdown[];
  geoCostMix: GeoCostMix[];
  partnerShares: PartnerShare[];
  savingsOpportunity: SavingsOpportunity;
  stateHeatmap: StateHeatmap[];
  facilityROI: FacilityROI[];
  crossRegionEscalation: CrossRegionEscalation[];
  whatIfScenario: WhatIfScenario;
  executiveSummary: ExecutiveSummaryKpi[];
}

// ============= Mock Data =============
export const strategicDashboardV2Mock: StrategicDashboardV2Data = {
  lastUpdated: "2025-01-07T10:30:00Z",
  dataRange: "Oct 2024 - Jan 2025",

  // 1. Total Freight Spend
  freightSpend: {
    totalSpend: 27200000, // ₹2.72 Cr
    annualTarget: 30000000, // ₹3 Cr
    sparklineData: [
      { month: "Oct", value: 5800000 },
      { month: "Nov", value: 6200000 },
      { month: "Dec", value: 7100000 },
      { month: "Jan", value: 8100000 },
    ],
    vsTargetPercent: -9.3,
  },

  // 2. Avg Freight/Qty Gauge
  avgFreightQty: {
    currentValue: 31.7,
    targetValue: 50,
    trendData: [
      { month: "Oct", value: 71.9 },
      { month: "Nov", value: 58.2 },
      { month: "Dec", value: 42.5 },
      { month: "Jan", value: 31.7 },
    ],
    status: "good",
  },

  // 3. Volume Growth
  volumeGrowth: {
    currentVolume: 1500000,
    previousVolume: 221000,
    growthPercent: 578.7,
    geoBreakdown: [
      { region: "North", volume: 520000, growth: 612 },
      { region: "South", volume: 410000, growth: 545 },
      { region: "West", volume: 340000, growth: 598 },
      { region: "East", volume: 230000, growth: 489 },
    ],
  },

  // 4. Top Patterns
  topPatterns: [
    {
      pattern: "1-2u",
      label: "1-2 Units",
      freightPercent: 42.5,
      freightValue: 11560000,
      ratebookVariance: 12.3,
    },
    {
      pattern: "3-5u",
      label: "3-5 Units",
      freightPercent: 28.2,
      freightValue: 7670000,
      ratebookVariance: 8.1,
    },
    {
      pattern: "6-10u",
      label: "6-10 Units",
      freightPercent: 18.4,
      freightValue: 5005000,
      ratebookVariance: 5.2,
    },
    {
      pattern: ">10u",
      label: ">10 Units",
      freightPercent: 10.9,
      freightValue: 2965000,
      ratebookVariance: -2.4,
    },
  ],

  // 5. Geo Cost Mix
  geoCostMix: [
    { month: "Oct", crossRegion: 38, withinRegion: 42, withinCity: 20 },
    { month: "Nov", crossRegion: 40, withinRegion: 40, withinCity: 20 },
    { month: "Dec", crossRegion: 42, withinRegion: 38, withinCity: 20 },
    { month: "Jan", crossRegion: 40, withinRegion: 39, withinCity: 21 },
  ],

  // 6. Partner Market Share
  partnerShares: [
    {
      code: "FFC",
      name: "First Flight Couriers",
      freightShare: 34.2,
      volumeShare: 38.5,
      switchOppValue: 2400000,
    },
    {
      code: "BDC",
      name: "Blue Dart Express",
      freightShare: 28.5,
      volumeShare: 24.8,
      switchOppValue: 1800000,
    },
    {
      code: "SFC",
      name: "Safexpress",
      freightShare: 22.1,
      volumeShare: 21.2,
      switchOppValue: 950000,
    },
    {
      code: "Others",
      name: "Other Partners",
      freightShare: 15.2,
      volumeShare: 15.5,
      switchOppValue: 450000,
    },
  ],

  // 7. Network Savings Opportunity
  savingsOpportunity: {
    totalSavings: 4850000, // ₹48.5L
    topLanes: [
      { lane: "DEL → MUM", savings: 1200000, pattern: "1-2u" },
      { lane: "BLR → CHE", savings: 890000, pattern: "3-5u" },
      { lane: "MUM → PUN", savings: 720000, pattern: "1-2u" },
      { lane: "DEL → JAI", savings: 580000, pattern: "6-10u" },
      { lane: "KOL → GUW", savings: 460000, pattern: "1-2u" },
    ],
  },

  // 8. Regional Heatmap
  stateHeatmap: [
    {
      state: "Maharashtra",
      freightPerQty: 42.5,
      volume: 280000,
      intensity: "medium",
    },
    {
      state: "Karnataka",
      freightPerQty: 38.2,
      volume: 245000,
      intensity: "low",
    },
    {
      state: "Tamil Nadu",
      freightPerQty: 35.8,
      volume: 198000,
      intensity: "low",
    },
    {
      state: "Delhi NCR",
      freightPerQty: 68.4,
      volume: 320000,
      intensity: "high",
    },
    {
      state: "Gujarat",
      freightPerQty: 45.2,
      volume: 165000,
      intensity: "medium",
    },
    {
      state: "West Bengal",
      freightPerQty: 72.8,
      volume: 142000,
      intensity: "critical",
    },
    {
      state: "Rajasthan",
      freightPerQty: 58.6,
      volume: 98000,
      intensity: "high",
    },
    {
      state: "Uttar Pradesh",
      freightPerQty: 64.2,
      volume: 185000,
      intensity: "high",
    },
    {
      state: "Telangana",
      freightPerQty: 41.5,
      volume: 125000,
      intensity: "medium",
    },
    {
      state: "Kerala",
      freightPerQty: 52.3,
      volume: 78000,
      intensity: "medium",
    },
    { state: "Punjab", freightPerQty: 55.8, volume: 68000, intensity: "high" },
    {
      state: "Madhya Pradesh",
      freightPerQty: 48.9,
      volume: 56000,
      intensity: "medium",
    },
  ],

  // 9. Facility ROI Scorecard
  facilityROI: [
    {
      facility: "Delhi Hub",
      plant: "DEO1",
      volumeGap: 180000,
      paybackMonths: 8,
      roi: 142,
      rank: 1,
    },
    {
      facility: "Bengaluru DC",
      plant: "BEN2",
      volumeGap: 145000,
      paybackMonths: 10,
      roi: 128,
      rank: 2,
    },
    {
      facility: "Mumbai Hub",
      plant: "MUB2",
      volumeGap: 120000,
      paybackMonths: 12,
      roi: 115,
      rank: 3,
    },
    {
      facility: "Chennai DC",
      plant: "CHE1",
      volumeGap: 95000,
      paybackMonths: 14,
      roi: 98,
      rank: 4,
    },
    {
      facility: "Kolkata Hub",
      plant: "KOL2",
      volumeGap: 78000,
      paybackMonths: 18,
      roi: 72,
      rank: 5,
    },
  ],

  // 10. Cross-Region Escalation
  crossRegionEscalation: [
    { month: "Oct", units1to2: 106, units3to5: 45, unitsGt10: 12 },
    { month: "Nov", units1to2: 185, units3to5: 62, unitsGt10: 18 },
    { month: "Dec", units1to2: 278, units3to5: 85, unitsGt10: 24 },
    { month: "Jan", units1to2: 364, units3to5: 112, unitsGt10: 32 },
  ],

  // 11. What-If Scenario
  whatIfScenario: {
    consolidationPercent: 20,
    savingsAmount: 3200000,
    volumeImpacted: 85000,
  },

  // 12. Executive Summary
  executiveSummary: [
    {
      id: "vol",
      label: "Volume",
      value: "1.5M",
      trend: "up",
      trendValue: "+595%",
      isPositive: true,
      icon: "volume",
    },
    {
      id: "cost",
      label: "Cost/Qty",
      value: "₹31.7",
      trend: "down",
      trendValue: "-56%",
      isPositive: true,
      icon: "cost",
    },
    {
      id: "tat",
      label: "Avg TAT",
      value: "1.8d",
      trend: "up",
      trendValue: "+0.2d",
      isPositive: false,
      icon: "tat",
    },
    {
      id: "coverage",
      label: "Coverage",
      value: "94.2%",
      trend: "up",
      trendValue: "+3.8%",
      isPositive: true,
      icon: "coverage",
    },
  ],
};
