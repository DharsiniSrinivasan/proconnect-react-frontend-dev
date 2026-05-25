/**
 * Strategic Dashboard Mock - Aligned with real CSV data
 * Data source: sample_dataset.csv (Oct 2024, ~22K shipments)
 * Rate source: rate_card_master.csv (~47K lane rates)
 */

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
  code: string;
  mode: "Road" | "Air" | "Rail" | "Multi-modal";
  costIndex: number;
  slaPercent: number;
  avgTat: number;
  odaCoveragePercent: number;
  overallScore: number;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  shipmentCount: number;
}

export interface Facility {
  id: string;
  name: string;
  plant: string;
  city: string;
  region: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  utilisationPercent: number;
  shipmentCount: number;
  onTimeRate: number;
  status: "Expand" | "Monitor" | "Optimise" | "Defer";
}

export interface Recommendation {
  id: string;
  title: string;
  category:
    | "Cost Optimisation"
    | "Network Expansion"
    | "Partner Strategy"
    | "Capacity Planning"
    | "Risk Mitigation"
    | "TAT Improvement";
  impact: "High" | "Medium" | "Low";
  confidencePercent: number;
  status: "New" | "In Review" | "Approved" | "Implemented";
  whyTriggered: string[];
}

export interface StrategicDashboardData {
  activeDataset: string;
  lastUpdated: string;
  kpis: KPI[];
  regions: Region[];
  partners: Partner[];
  facilities: Facility[];
  recommendations: Recommendation[];
}

// KPIs derived from sample_dataset.csv actual metrics
// export const strategicDashboardMock: StrategicDashboardData = {
//   activeDataset: "Android Oct 2024 – Shipment Data",
//   lastUpdated: "2024-10-31T23:59:00Z",
//   kpis: [
//     {
//       id: "kpi-1",
//       label: "Total Shipments",
//       value: "22,176",
//       subtitle: "Oct 2024",
//       trend: "up",
//       trendValue: "+8.5%",
//       isPositive: true,
//     },
//     {
//       id: "kpi-2",
//       label: "Total Value",
//       value: "₹529.6 Cr",
//       subtitle: "Invoice Value",
//       trend: "up",
//       trendValue: "+12.3%",
//       isPositive: true,
//     },
//     {
//       id: "kpi-3",
//       label: "On-Time Delivery",
//       value: "88.2%",
//       subtitle: "SLA Compliance",
//       trend: "up",
//       trendValue: "+2.3%",
//       isPositive: true,
//     },
//     {
//       id: "kpi-4",
//       label: "Avg TAT",
//       value: "1.75d",
//       subtitle: "vs 2.1d Benchmark",
//       trend: "down",
//       trendValue: "-0.35d",
//       isPositive: true,
//     },
//     {
//       id: "kpi-5",
//       label: "ODA Shipments",
//       value: "4,125",
//       subtitle: "18.6% of total",
//       trend: "up",
//       trendValue: "+340",
//       isPositive: false,
//     },
//     {
//       id: "kpi-6",
//       label: "Active Partners",
//       value: "24",
//       subtitle: "Courier Partners",
//       trend: "neutral",
//       trendValue: "0",
//       isPositive: true,
//     },
//   ],
//   // Regions from actual sample_dataset.csv (North, South, East, West)
//   regions: [
//     {
//       id: "reg-1",
//       name: "North",
//       code: "N",
//       volumeBoxes: 7520,
//       costPerKg: 66.40,
//       slaPercent: 87.5,
//       avgTatDays: 1.8,
//       utilisationPercent: 82,
//       priority: "High",
//       coordinates: { x: 45, y: 25 },
//     },
//     {
//       id: "reg-2",
//       name: "South",
//       code: "S",
//       volumeBoxes: 5890,
//       costPerKg: 65.60,
//       slaPercent: 91.2,
//       avgTatDays: 1.5,
//       utilisationPercent: 85,
//       priority: "High",
//       coordinates: { x: 50, y: 70 },
//     },
//     {
//       id: "reg-3",
//       name: "West",
//       code: "W",
//       volumeBoxes: 4616,
//       costPerKg: 60.15,
//       slaPercent: 89.8,
//       avgTatDays: 1.6,
//       utilisationPercent: 79,
//       priority: "Medium",
//       coordinates: { x: 25, y: 50 },
//     },
//     {
//       id: "reg-4",
//       name: "East",
//       code: "E",
//       volumeBoxes: 4150,
//       costPerKg: 57.78,
//       slaPercent: 84.3,
//       avgTatDays: 2.4,
//       utilisationPercent: 68,
//       priority: "High",
//       coordinates: { x: 75, y: 45 },
//     },
//   ],
//   // Partners from actual sample_dataset.csv courier names
//   partners: [
//     {
//       id: "ptr-1",
//       name: "BLUE DART EXPRESS",
//       code: "BLUEDART",
//       mode: "Multi-modal",
//       costIndex: 1.15,
//       slaPercent: 86.5,
//       avgTat: 2.4,
//       odaCoveragePercent: 20,
//       overallScore: 82,
//       tier: "Platinum",
//       shipmentCount: 5850,
//     },
//     {
//       id: "ptr-2",
//       name: "Trustus Logistics",
//       code: "Trustus",
//       mode: "Road",
//       costIndex: 0.92,
//       slaPercent: 92.3,
//       avgTat: 1.4,
//       odaCoveragePercent: 12,
//       overallScore: 91,
//       tier: "Platinum",
//       shipmentCount: 3290,
//     },
//     {
//       id: "ptr-3",
//       name: "NEW INDIA CARGO",
//       code: "NEW INDIA",
//       mode: "Road",
//       costIndex: 0.85,
//       slaPercent: 88.7,
//       avgTat: 1.8,
//       odaCoveragePercent: 35,
//       overallScore: 85,
//       tier: "Gold",
//       shipmentCount: 2850,
//     },
//     {
//       id: "ptr-4",
//       name: "SME CARGO SERVICES",
//       code: "SME CARGO",
//       mode: "Road",
//       costIndex: 0.88,
//       slaPercent: 91.5,
//       avgTat: 1.9,
//       odaCoveragePercent: 18,
//       overallScore: 88,
//       tier: "Gold",
//       shipmentCount: 1920,
//     },
//     {
//       id: "ptr-5",
//       name: "WORLDFIRST LOGISTICS",
//       code: "WORLDFIRST",
//       mode: "Road",
//       costIndex: 0.95,
//       slaPercent: 89.2,
//       avgTat: 1.7,
//       odaCoveragePercent: 25,
//       overallScore: 84,
//       tier: "Gold",
//       shipmentCount: 1750,
//     },
//     {
//       id: "ptr-6",
//       name: "SAKHI RAIL CARGO",
//       code: "SAKHI RAIL",
//       mode: "Rail",
//       costIndex: 0.72,
//       slaPercent: 93.1,
//       avgTat: 1.3,
//       odaCoveragePercent: 22,
//       overallScore: 89,
//       tier: "Gold",
//       shipmentCount: 1180,
//     },
//     {
//       id: "ptr-7",
//       name: "AFEX EXPRESS",
//       code: "AFEXEXP",
//       mode: "Road",
//       costIndex: 0.82,
//       slaPercent: 90.8,
//       avgTat: 1.6,
//       odaCoveragePercent: 10,
//       overallScore: 86,
//       tier: "Silver",
//       shipmentCount: 1520,
//     },
//     {
//       id: "ptr-8",
//       name: "GMS LOGISTICS",
//       code: "GMS",
//       mode: "Road",
//       costIndex: 0.89,
//       slaPercent: 87.9,
//       avgTat: 2.0,
//       odaCoveragePercent: 8,
//       overallScore: 78,
//       tier: "Silver",
//       shipmentCount: 990,
//     },
//   ],
//   // Facilities from actual sample_dataset.csv plant codes
//   facilities: [
//     {
//       id: "fac-1",
//       name: "Delhi Hub",
//       plant: "DEO1",
//       city: "NEW DELHI",
//       region: "North",
//       tier: "Tier 1",
//       utilisationPercent: 92,
//       shipmentCount: 3850,
//       onTimeRate: 88.2,
//       status: "Expand",
//     },
//     {
//       id: "fac-2",
//       name: "Bengaluru Hub",
//       plant: "BEN2",
//       city: "BENGALURU",
//       region: "South",
//       tier: "Tier 1",
//       utilisationPercent: 88,
//       shipmentCount: 2920,
//       onTimeRate: 91.5,
//       status: "Monitor",
//     },
//     {
//       id: "fac-3",
//       name: "Thane Hub",
//       plant: "MUB2",
//       city: "THANE",
//       region: "West",
//       tier: "Tier 1",
//       utilisationPercent: 85,
//       shipmentCount: 2680,
//       onTimeRate: 89.8,
//       status: "Monitor",
//     },
//     {
//       id: "fac-4",
//       name: "Chennai Hub",
//       plant: "CHE1",
//       city: "CHENNAI",
//       region: "South",
//       tier: "Tier 1",
//       utilisationPercent: 82,
//       shipmentCount: 2450,
//       onTimeRate: 92.3,
//       status: "Optimise",
//     },
//     {
//       id: "fac-5",
//       name: "Kolkata Hub",
//       plant: "KOL2",
//       city: "KOLKATA",
//       region: "East",
//       tier: "Tier 1",
//       utilisationPercent: 78,
//       shipmentCount: 2280,
//       onTimeRate: 84.1,
//       status: "Optimise",
//     },
//     {
//       id: "fac-6",
//       name: "Ahmedabad DC",
//       plant: "AHM1",
//       city: "AHMEDABAD",
//       region: "West",
//       tier: "Tier 2",
//       utilisationPercent: 72,
//       shipmentCount: 1620,
//       onTimeRate: 90.5,
//       status: "Optimise",
//     },
//     {
//       id: "fac-7",
//       name: "Secunderabad DC",
//       plant: "SEC2",
//       city: "SECUNDERABAD",
//       region: "South",
//       tier: "Tier 2",
//       utilisationPercent: 68,
//       shipmentCount: 1450,
//       onTimeRate: 89.2,
//       status: "Monitor",
//     },
//     {
//       id: "fac-8",
//       name: "Jaipur WH",
//       plant: "JAI1",
//       city: "JAIPUR",
//       region: "North",
//       tier: "Tier 2",
//       utilisationPercent: 65,
//       shipmentCount: 1180,
//       onTimeRate: 87.8,
//       status: "Defer",
//     },
//   ],
//   // Recommendations based on real data patterns
//   // recommendations: [
//   //   {
//   //     id: "REC-001",
//   //     title: "Switch partner for Kolkata-Bardhaman ODA lane (18.5% breach rate)",
//   //     category: "Partner Strategy",
//   //     impact: "High",
//   //     confidencePercent: 94,
//   //     status: "New",
//   //   },
//   //   {
//   //     id: "REC-002",
//   //     title: "Expand Delhi Hub capacity – 92% utilization with rising volume",
//   //     category: "Capacity Planning",
//   //     impact: "High",
//   //     confidencePercent: 91,
//   //     status: "In Review",
//   //   },
//   //   {
//   //     id: "REC-003",
//   //     title: "Increase Trustus allocation for North region (92.3% SLA)",
//   //     category: "Partner Strategy",
//   //     impact: "Medium",
//   //     confidencePercent: 87,
//   //     status: "Approved",
//   //   },
//   //   {
//   //     id: "REC-004",
//   //     title: "Address East region TAT (2.4d avg vs 1.75d network)",
//   //     category: "TAT Improvement",
//   //     impact: "High",
//   //     confidencePercent: 85,
//   //     status: "In Review",
//   //   },
//   //   {
//   //     id: "REC-005",
//   //     title: "Consolidate low-volume lanes to reduce ODA costs",
//   //     category: "Cost Optimisation",
//   //     impact: "Medium",
//   //     confidencePercent: 82,
//   //     status: "New",
//   //   },
//   // ],
// };
