/**
 * Recommendations types
 */

export type RecoCategory =
  | "COST_OPTIMIZATION"
  | "TAT_IMPROVEMENT"
  | "PARTNER_SWITCH"
  | "CAPACITY_ADJUSTMENT"
  | "COMPLIANCE";
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

export interface RecommendationsData {
  metrics: RecoMetrics;
  feed: RecommendationSummary[];
  details: Record<string, RecommendationDetail>;
}
