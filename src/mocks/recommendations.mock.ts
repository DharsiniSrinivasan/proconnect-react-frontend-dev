/**
 * Recommendations Mock - Aligned with real CSV data
 * Based on actual lanes, partners, and performance issues from sample_dataset.csv
 */

export type RecoCategory =
  | "COST_OPTIMIZATION"
  | "TAT_IMPROVEMENT"
  | "TRANSPORTER_SWITCH"
  | "CAPACITY_ADJUSTMENT"
  | "COMPLIANCE"
  | "PARTNER_SWITCH"
  | "COST_TAT_IMPROVEMENT"
  | "TAT_COST_OPTIMIZATION"
  | "FACILITY_SWITCH"
  | "FLOW_REALLOCATION"
  
export type RecoStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IMPLEMENTED";
export type RecoPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface RecommendationSummary {
  id: string;
  title: string;
  category: RecoCategory;
  scope: string;
  impact: string;
  confidencePct: number;
  priority: RecoPriority;
  status: RecoStatus;
  owner: string | null;
  createdAt: string;
}

export interface ActivityItem {
  action: string;
  by: string;
  at: string;
}

export interface ConflictItem {
  conflictingId: string;
  type: string;
  resolution: string;
}

export interface CurrentVsProposed {
  metric: string;
  current: string;
  proposed: string;
  change: string;
}

export interface RecommendationDetail extends RecommendationSummary {
  whyTriggered: string[];
  proposedAction: string;
  currentVsProposed: CurrentVsProposed[];
  annualSavings: number;
  tatReduction: number;
  roiPct: number;
  paybackMonths: number;
  conflicts: ConflictItem[];
  activity: ActivityItem[];
}

export interface RecoMetrics {
  total: number;
  new24h: number;
  highPriority: number;
  estSavings: number;
  estTatImprovement: number;
  implementationRate: number;
}

export interface RecommendationsMock {
  metrics: RecoMetrics;
  feed: RecommendationSummary[];
  details: Record<string, RecommendationDetail>;
}

export const recommendationsMock: RecommendationsMock = {
  metrics: {
    total: 24,
    new24h: 5,
    highPriority: 8,
    estSavings: 1850000,
    estTatImprovement: 15,
    implementationRate: 72,
  },
  feed: [
    {
      id: "REC-001",
      title: "Switch Partner for Kolkata-Bardhaman ODA Lane",
      category: "PARTNER_SWITCH",
      scope: "KOL2 → Bardhaman (ODA)",
      impact: "18.5% breach rate → 8%",
      confidencePct: 94,
      priority: "CRITICAL",
      status: "NEW",
      owner: null,
      createdAt: "2024-10-31T08:30:00Z",
    },
    {
      id: "REC-002",
      title: "Expand Delhi Hub Capacity (DEO1)",
      category: "CAPACITY_ADJUSTMENT",
      scope: "DEO1 - NEW DELHI",
      impact: "Handle 25% more volume",
      confidencePct: 91,
      priority: "CRITICAL",
      status: "UNDER_REVIEW",
      owner: "Ops Lead",
      createdAt: "2024-10-30T14:20:00Z",
    },
    {
      id: "REC-003",
      title: "Increase Trustus Allocation for North Region",
      category: "PARTNER_SWITCH",
      scope: "North Region Routes",
      impact: "92.3% SLA vs 88.2% avg",
      confidencePct: 87,
      priority: "HIGH",
      status: "APPROVED",
      owner: "Partner Mgr",
      createdAt: "2024-10-29T09:15:00Z",
    },
    {
      id: "REC-004",
      title: "Address East Region TAT Performance",
      category: "TAT_IMPROVEMENT",
      scope: "East Region (KOL2, BHU1)",
      impact: "2.4d → 1.8d avg TAT",
      confidencePct: 85,
      priority: "HIGH",
      status: "UNDER_REVIEW",
      owner: "Regional Mgr",
      createdAt: "2024-10-28T16:45:00Z",
    },
    {
      id: "REC-005",
      title: "Reduce ODA Surcharges via Lane Consolidation",
      category: "COST_OPTIMIZATION",
      scope: "All ODA lanes (18.6%)",
      impact: "₹4.2Cr annual savings",
      confidencePct: 82,
      priority: "MEDIUM",
      status: "NEW",
      owner: null,
      createdAt: "2024-10-27T11:00:00Z",
    },
    {
      id: "REC-006",
      title: "Switch to SAKHI RAIL for Long-Haul Routes",
      category: "COST_OPTIMIZATION",
      scope: "Cross-region bulk",
      impact: "25.9% below benchmark cost",
      confidencePct: 78,
      priority: "MEDIUM",
      status: "NEW",
      owner: null,
      createdAt: "2024-10-26T10:30:00Z",
    },
    {
      id: "REC-007",
      title: "Address Kolkata-Purulia Lane Performance",
      category: "TAT_IMPROVEMENT",
      scope: "KOL2 → Purulia (ODA)",
      impact: "22.4% breach → 10%",
      confidencePct: 88,
      priority: "HIGH",
      status: "NEW",
      owner: null,
      createdAt: "2024-10-25T13:20:00Z",
    },
    {
      id: "REC-008",
      title: "Optimize SME CARGO Allocation",
      category: "COST_OPTIMIZATION",
      scope: "West Region",
      impact: "13.6% below benchmark",
      confidencePct: 76,
      priority: "LOW",
      status: "IMPLEMENTED",
      owner: "Finance",
      createdAt: "2024-10-24T08:00:00Z",
    },
  ],
  details: {
    "REC-001": {
      id: "REC-001",
      title: "Switch Partner for Kolkata-Bardhaman ODA Lane",
      category: "PARTNER_SWITCH",
      scope: "KOL2 → Bardhaman (ODA)",
      impact: "18.5% breach rate → 8%",
      confidencePct: 94,
      priority: "CRITICAL",
      status: "NEW",
      owner: null,
      createdAt: "2024-10-31T08:30:00Z",
      whyTriggered: [
        "BLUEDART breach rate on this lane: 18.5% (420 shipments)",
        "Average TAT: 3.2 days vs agreed 2 days",
        "NEW INDIA shows 8.4% breach on similar ODA lanes",
        "Cost impact: Higher breach = higher redelivery costs",
      ],
      proposedAction:
        "Switch 70% of Kolkata-Bardhaman ODA volume to NEW INDIA. Retain 30% with BLUEDART for coverage redundancy. Monitor for 4 weeks.",
      currentVsProposed: [
        {
          metric: "Breach Rate",
          current: "18.5%",
          proposed: "8.0%",
          change: "-57%",
        },
        {
          metric: "Avg TAT",
          current: "3.2 days",
          proposed: "2.4 days",
          change: "-25%",
        },
        {
          metric: "SLA Compliance",
          current: "81.5%",
          proposed: "92.0%",
          change: "+13%",
        },
        {
          metric: "Monthly Volume",
          current: "420",
          proposed: "420",
          change: "0%",
        },
      ],
      annualSavings: 320000,
      tatReduction: 0.8,
      roiPct: 280,
      paybackMonths: 0.5,
      conflicts: [],
      activity: [
        {
          action: "Recommendation generated",
          by: "D2R Engine",
          at: "2024-10-31T08:30:00Z",
        },
        {
          action: "Flagged as critical",
          by: "System",
          at: "2024-10-31T08:31:00Z",
        },
      ],
    },
  },
};
