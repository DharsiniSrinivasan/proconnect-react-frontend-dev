/**
 * Operational Dashboard Mock - Restructured for Freight/Qty metrics
 * Data source: sample_dataset.csv (Oct 2024, ~22K shipments)
 */

// =============== TYPE DEFINITIONS ===============

export type GeoType = "Cross-Region" | "Within-State";
export type TransportMode = "ROAD" | "AIR";
export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PartnerType = "FFC" | "BDC";

export interface OpsKpi {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  prefix?: string | null;
  suffix?: string | null;
}

// 1. SLA % by Pattern
export interface SlaPatternData {
  pattern: string;
  qtyRange: string;
  onTimePct: number;
  totalShipments: number;
  isAlert: boolean;
}

// 2. Daily Avg Vol
export interface DailyVolPoint {
  date: string;
  billedQty: number;
  isPeak: boolean;
}

// 3. Geo TAT Proxy
export interface GeoTatCell {
  origin: string;
  destination: string;
  geoType: GeoType;
  freightPerQty: number;
  estimatedDays: number;
  docketCount: number;
}

// 4. Pattern Exceptions
export interface PatternException {
  id: string;
  pattern: string;
  freightPerQty: number;
  avgFreightPerQty: number;
  deviation: number;
  shipmentCount: number;
  severity: AlertSeverity;
}

// 5. Partner TAT Rank
export interface PartnerTatRank {
  id: string;
  partner: string;
  zone: string;
  avgTat: number;
  rank: number;
  mode: TransportMode;
  shipmentCount: number;
  invoiceCount: number;
}

// 6. Capacity Alerts
export interface CapacityAlert {
  id: string;
  region: string;
  pattern: string;
  geoType: GeoType;
  utilPct: number;
  status: AlertSeverity;
}

// 7. Docket Efficiency
export interface DocketEfficiency {
  id: string;
  stage: string;
  invoiceCount: number;
  volumeCount: number;
  ratio: number;
  isAnomaly: boolean;
}

// 8. Mode/Geo Mix
export interface ModeGeoMix {
  mode: TransportMode;
  geoType: GeoType;
  percentage: number;
  shipmentCount: number;
}

// 9. Weekly Trends
export interface WeeklyTrend {
  week: string;
  freightPerQty: number;
  forecast: number;
}

// 10. Route Overload
export interface RouteOverload {
  id: string;
  origin: string;
  destination: string;
  volume: number;
  frequency: number;
  consolidationRec: string;
}

// 11. Partner Reliability
export interface PartnerReliability {
  partner: string;
  type: PartnerType;
  onTimePct: number;
  volumePct: number;
  isLowPerformer: boolean;
}

// 12. Ops Bottlenecks
export interface OpsBottleneck {
  id: string;
  category: string;
  percentage: number;
  count: number;
  trend: "up" | "down" | "flat";
  actionItem: string;
}

export interface OperationalDashboardMock {
  activeDataset: string;
  lastUpdated: string;
  kpis: OpsKpi[];
  slaByPattern: SlaPatternData[];
  dailyVolume: DailyVolPoint[];
  geoTatProxy: GeoTatCell[];
  patternExceptions: PatternException[];
  partnerTatRank: PartnerTatRank[];
  capacityAlerts: CapacityAlert[];
  docketEfficiency: DocketEfficiency[];
  modeGeoMix: ModeGeoMix[];
  weeklyTrends: WeeklyTrend[];
  routeOverload: RouteOverload[];
  partnerReliability: PartnerReliability[];
  opsBottlenecks: OpsBottleneck[];
}

// =============== MOCK DATA ===============

export const operationalDashboardMock: OperationalDashboardMock = {
  activeDataset: "Android Oct 2024 Dataset",
  lastUpdated: "2024-10-31T23:59:00Z",

  kpis: [
    {
      id: "kpi-1",
      label: "Total Shipments",
      value: "22,176",
      subtitle: "Oct 2024",
    },
    {
      id: "kpi-2",
      label: "Avg Freight/Qty",
      value: "₹847",
      subtitle: "Per unit",
    },
    {
      id: "kpi-3",
      label: "Cross-Region %",
      value: "34.2%",
      subtitle: "7,584 shipments",
    },
    {
      id: "kpi-4",
      label: "On-Time SLA",
      value: "88.2%",
      subtitle: "19,564 delivered",
    },
    {
      id: "kpi-5",
      label: "Peak Daily Vol",
      value: "1,248",
      subtitle: "Oct 15",
    },
    {
      id: "kpi-6",
      label: "Exception Rate",
      value: "4.8%",
      subtitle: "1,064 alerts",
    },
  ],

  // 1. SLA % by Pattern
  slaByPattern: [
    {
      pattern: "1-2u",
      qtyRange: "1-2 units",
      onTimePct: 72.4,
      totalShipments: 8420,
      isAlert: true,
    },
    {
      pattern: "3-5u",
      qtyRange: "3-5 units",
      onTimePct: 86.8,
      totalShipments: 6280,
      isAlert: false,
    },
    {
      pattern: "6-10u",
      qtyRange: "6-10 units",
      onTimePct: 91.2,
      totalShipments: 4120,
      isAlert: false,
    },
    {
      pattern: ">10u",
      qtyRange: ">10 units",
      onTimePct: 95.6,
      totalShipments: 3356,
      isAlert: false,
    },
  ],

  // 2. Daily Avg Vol (Oct-Jan extrapolation)
  dailyVolume: [
    { date: "2024-10-01", billedQty: 680, isPeak: false },
    { date: "2024-10-08", billedQty: 720, isPeak: false },
    { date: "2024-10-15", billedQty: 1248, isPeak: true },
    { date: "2024-10-22", billedQty: 890, isPeak: false },
    { date: "2024-10-29", billedQty: 760, isPeak: false },
    { date: "2024-11-05", billedQty: 820, isPeak: false },
    { date: "2024-11-12", billedQty: 1180, isPeak: true },
    { date: "2024-11-19", billedQty: 950, isPeak: false },
    { date: "2024-11-26", billedQty: 1320, isPeak: true },
    { date: "2024-12-03", billedQty: 1050, isPeak: false },
    { date: "2024-12-10", billedQty: 1150, isPeak: true },
    { date: "2024-12-17", billedQty: 980, isPeak: false },
    { date: "2024-12-24", billedQty: 1420, isPeak: true },
    { date: "2024-12-31", billedQty: 1380, isPeak: true },
    { date: "2025-01-07", billedQty: 920, isPeak: false },
  ],

  // 3. Geo TAT Proxy
  geoTatProxy: [
    {
      origin: "DEL",
      destination: "MUM",
      geoType: "Cross-Region",
      freightPerQty: 1245,
      estimatedDays: 4.2,
      docketCount: 1820,
    },
    {
      origin: "BLR",
      destination: "CHE",
      geoType: "Within-State",
      freightPerQty: 420,
      estimatedDays: 1.5,
      docketCount: 2340,
    },
    {
      origin: "KOL",
      destination: "BHU",
      geoType: "Cross-Region",
      freightPerQty: 980,
      estimatedDays: 3.8,
      docketCount: 1450,
    },
    {
      origin: "MUM",
      destination: "PUN",
      geoType: "Within-State",
      freightPerQty: 380,
      estimatedDays: 1.2,
      docketCount: 2890,
    },
    {
      origin: "DEL",
      destination: "LKO",
      geoType: "Within-State",
      freightPerQty: 520,
      estimatedDays: 1.8,
      docketCount: 1680,
    },
    {
      origin: "CHE",
      destination: "HYD",
      geoType: "Cross-Region",
      freightPerQty: 1120,
      estimatedDays: 3.5,
      docketCount: 1240,
    },
    {
      origin: "BLR",
      destination: "MUM",
      geoType: "Cross-Region",
      freightPerQty: 1380,
      estimatedDays: 4.8,
      docketCount: 980,
    },
    {
      origin: "AMD",
      destination: "SUR",
      geoType: "Within-State",
      freightPerQty: 340,
      estimatedDays: 1.0,
      docketCount: 1560,
    },
  ],

  // 4. Pattern Exceptions
  patternExceptions: [
    {
      id: "exc-1",
      pattern: "1u Cross-Region AIR",
      freightPerQty: 2450,
      avgFreightPerQty: 847,
      deviation: 189,
      shipmentCount: 124,
      severity: "CRITICAL",
    },
    {
      id: "exc-2",
      pattern: "2u Within-State ROAD",
      freightPerQty: 1280,
      avgFreightPerQty: 847,
      deviation: 51,
      shipmentCount: 342,
      severity: "HIGH",
    },
    {
      id: "exc-3",
      pattern: "1u Cross-Region ROAD",
      freightPerQty: 1150,
      avgFreightPerQty: 847,
      deviation: 36,
      shipmentCount: 567,
      severity: "MEDIUM",
    },
    {
      id: "exc-4",
      pattern: "3u Cross-Region AIR",
      freightPerQty: 1080,
      avgFreightPerQty: 847,
      deviation: 28,
      shipmentCount: 189,
      severity: "MEDIUM",
    },
    {
      id: "exc-5",
      pattern: "5u Within-State AIR",
      freightPerQty: 1020,
      avgFreightPerQty: 847,
      deviation: 20,
      shipmentCount: 98,
      severity: "LOW",
    },
  ],

  // 5. Partner TAT Rank
  partnerTatRank: [
    {
      id: "ptr-1",
      partner: "BLUEDART",
      zone: "Metro",
      avgTat: 1.2,
      rank: 1,
      mode: "AIR",
      shipmentCount: 4520,
      invoiceCount: 0,
    },
    {
      id: "ptr-2",
      partner: "FFC Express",
      zone: "Metro",
      avgTat: 1.4,
      rank: 2,
      mode: "ROAD",
      shipmentCount: 3840,
      invoiceCount: 0,
    },
    {
      id: "ptr-3",
      partner: "DELHIVERY",
      zone: "Tier-1",
      avgTat: 1.8,
      rank: 3,
      mode: "ROAD",
      shipmentCount: 2980,
      invoiceCount: 0,
    },
    {
      id: "ptr-4",
      partner: "DTDC",
      zone: "Tier-2",
      avgTat: 2.2,
      rank: 4,
      mode: "ROAD",
      shipmentCount: 2450,
      invoiceCount: 0,
    },
    {
      id: "ptr-5",
      partner: "GMS",
      zone: "Rural",
      avgTat: 2.8,
      rank: 5,
      mode: "ROAD",
      shipmentCount: 1820,
      invoiceCount: 0,
    },
    {
      id: "ptr-6",
      partner: "XPRESSBEES",
      zone: "Tier-1",
      avgTat: 1.6,
      rank: 6,
      mode: "AIR",
      shipmentCount: 2120,
      invoiceCount: 0,
    },
    {
      id: "ptr-7",
      partner: "ECOM",
      zone: "Tier-2",
      avgTat: 2.5,
      rank: 7,
      mode: "ROAD",
      shipmentCount: 1680,
      invoiceCount: 0,
    },
    {
      id: "ptr-8",
      partner: "SHADOWFAX",
      zone: "Metro",
      avgTat: 1.5,
      rank: 8,
      mode: "ROAD",
      shipmentCount: 1420,
      invoiceCount: 0,
    },
  ],

  // 6. Capacity Alerts
  capacityAlerts: [
    {
      id: "cap-1",
      region: "North",
      pattern: "1-2u",
      geoType: "Within-State",
      utilPct: 94,
      status: "CRITICAL",
    },
    {
      id: "cap-2",
      region: "West",
      pattern: "3-5u",
      geoType: "Cross-Region",
      utilPct: 88,
      status: "HIGH",
    },
    {
      id: "cap-3",
      region: "South",
      pattern: ">10u",
      geoType: "Within-State",
      utilPct: 82,
      status: "MEDIUM",
    },
    {
      id: "cap-4",
      region: "East",
      pattern: "6-10u",
      geoType: "Cross-Region",
      utilPct: 76,
      status: "LOW",
    },
    {
      id: "cap-5",
      region: "Central",
      pattern: "1-2u",
      geoType: "Cross-Region",
      utilPct: 91,
      status: "CRITICAL",
    },
    {
      id: "cap-6",
      region: "North",
      pattern: ">10u",
      geoType: "Cross-Region",
      utilPct: 72,
      status: "LOW",
    },
  ],

  // 7. Docket Efficiency
  docketEfficiency: [
    {
      id: "dkt-1",
      stage: "Invoices Created",
      invoiceCount: 24500,
      volumeCount: 22176,
      ratio: 1.1,
      isAnomaly: false,
    },
    {
      id: "dkt-2",
      stage: "Dockets Generated",
      invoiceCount: 22800,
      volumeCount: 22176,
      ratio: 1.03,
      isAnomaly: false,
    },
    {
      id: "dkt-3",
      stage: "Dispatched",
      invoiceCount: 22400,
      volumeCount: 22176,
      ratio: 1.01,
      isAnomaly: false,
    },
    {
      id: "dkt-4",
      stage: "In Transit",
      invoiceCount: 21800,
      volumeCount: 19564,
      ratio: 1.11,
      isAnomaly: true,
    },
    {
      id: "dkt-5",
      stage: "Delivered",
      invoiceCount: 19564,
      volumeCount: 19564,
      ratio: 1.0,
      isAnomaly: false,
    },
  ],

  // 8. Mode/Geo Mix
  modeGeoMix: [
    {
      mode: "ROAD",
      geoType: "Within-State",
      percentage: 48.2,
      shipmentCount: 10689,
    },
    {
      mode: "ROAD",
      geoType: "Cross-Region",
      percentage: 28.4,
      shipmentCount: 6298,
    },
    {
      mode: "AIR",
      geoType: "Cross-Region",
      percentage: 15.8,
      shipmentCount: 3504,
    },
    {
      mode: "AIR",
      geoType: "Within-State",
      percentage: 7.6,
      shipmentCount: 1685,
    },
  ],

  // 9. Weekly Trends
  weeklyTrends: [
    { week: "W40", freightPerQty: 820, forecast: 830 },
    { week: "W41", freightPerQty: 845, forecast: 840 },
    { week: "W42", freightPerQty: 892, forecast: 860 },
    { week: "W43", freightPerQty: 847, forecast: 870 },
    { week: "W44", freightPerQty: 865, forecast: 880 },
    { week: "W45", freightPerQty: 890, forecast: 885 },
    { week: "W46", freightPerQty: 912, forecast: 895 },
    { week: "W47", freightPerQty: 0, forecast: 905 },
  ],

  // 10. Route Overload
  routeOverload: [
    {
      id: "ro-1",
      origin: "DEL",
      destination: "MUM",
      volume: 4250,
      frequency: 145,
      consolidationRec: "Combine 1-2u shipments daily",
    },
    {
      id: "ro-2",
      origin: "BLR",
      destination: "CHE",
      volume: 3820,
      frequency: 128,
      consolidationRec: "Weekly bulk consolidation",
    },
    {
      id: "ro-3",
      origin: "MUM",
      destination: "PUN",
      volume: 3450,
      frequency: 112,
      consolidationRec: "Same-day batch dispatch",
    },
    {
      id: "ro-4",
      origin: "KOL",
      destination: "BHU",
      volume: 2980,
      frequency: 98,
      consolidationRec: "Partner hub routing",
    },
    {
      id: "ro-5",
      origin: "DEL",
      destination: "LKO",
      volume: 2650,
      frequency: 86,
      consolidationRec: "Direct line haul",
    },
    {
      id: "ro-6",
      origin: "CHE",
      destination: "HYD",
      volume: 2420,
      frequency: 78,
      consolidationRec: "Air-road mix optimize",
    },
  ],

  // 11. Partner Reliability
  partnerReliability: [
    {
      partner: "BLUEDART",
      type: "FFC",
      onTimePct: 94.2,
      volumePct: 22.4,
      isLowPerformer: false,
    },
    {
      partner: "FFC Express",
      type: "FFC",
      onTimePct: 91.8,
      volumePct: 18.6,
      isLowPerformer: false,
    },
    {
      partner: "DELHIVERY",
      type: "BDC",
      onTimePct: 88.5,
      volumePct: 15.2,
      isLowPerformer: false,
    },
    {
      partner: "DTDC",
      type: "BDC",
      onTimePct: 82.4,
      volumePct: 12.8,
      isLowPerformer: true,
    },
    {
      partner: "GMS",
      type: "BDC",
      onTimePct: 78.6,
      volumePct: 9.4,
      isLowPerformer: true,
    },
    {
      partner: "XPRESSBEES",
      type: "FFC",
      onTimePct: 89.2,
      volumePct: 11.2,
      isLowPerformer: false,
    },
  ],

  // 12. Ops Bottlenecks
  opsBottlenecks: [
    {
      id: "bot-1",
      category: "Cross-Region Delay",
      percentage: 34.2,
      count: 364,
      trend: "up",
      actionItem: "Increase hub capacity",
    },
    {
      id: "bot-2",
      category: "1-2u Pattern Breach",
      percentage: 28.6,
      count: 304,
      trend: "flat",
      actionItem: "Consolidate small shipments",
    },
    {
      id: "bot-3",
      category: "Partner SLA Miss",
      percentage: 18.4,
      count: 196,
      trend: "down",
      actionItem: "Review BDC contracts",
    },
    {
      id: "bot-4",
      category: "Capacity Overload",
      percentage: 12.2,
      count: 130,
      trend: "up",
      actionItem: "Add West region capacity",
    },
    {
      id: "bot-5",
      category: "Mode Mismatch",
      percentage: 6.6,
      count: 70,
      trend: "flat",
      actionItem: "Optimize AIR allocation",
    },
  ],
};
