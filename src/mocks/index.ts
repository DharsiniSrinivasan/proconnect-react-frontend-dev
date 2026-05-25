/**
 * Mock Data Index
 * Central export for all mock data used in the D2R application.
 */

// Dashboard Mocks
export {
  strategicDashboardMock,
  type StrategicDashboardData,
  type KPI,
  type Region,
  type Partner,
  type Facility,
  type Recommendation,
} from "./strategicDashboard.mock";

export {
  operationalDashboardMock,
  type OperationalDashboardMock,
  type OpsKpi,
  type SlaPatternData,
  type DailyVolPoint,
  type GeoTatCell,
  type PatternException,
  type PartnerTatRank,
  type CapacityAlert,
  type DocketEfficiency,
  type ModeGeoMix,
  type WeeklyTrend,
  type RouteOverload,
  type PartnerReliability,
  type OpsBottleneck,
} from "./operationalDashboard.mock";

export {
  financialDashboardMock,
  type FinancialDashboardMock,
  type FinKpi,
  type VarianceSegment,
} from "./financialDashboard.mock";

// Data Acquisition Mocks
export {
  datasetListMock,
  type Dataset,
  type DatasetSummary,
} from "./datasets.mock";

// Master Data Mocks
export {
  masterOverviewMock,
  customerMasterMock,
  partnerMasterMock,
  facilityMasterMock,
  rateCardsMock,
  type CustomerRow,
  type FacilityRow,
  type PartnerRow,
  type RateCardRow,
  type MasterStatus,
} from "./masterData.mock";

// Recommendations Mocks
export {
  recommendationsMock,
  type RecommendationDetail,
} from "./recommendations.mock";

// Forecast Mocks
export { forecastMock } from "./forecasts.mock";

// Admin Mocks
export {
  adminUsersMock,
  adminRolesMock,
  type UserRow,
  type RoleAccess,
} from "./admin.mock";
export { auditMock } from "./audit.mock";

// AI Assistant Mock
export { decisionAssistantMock } from "./decisionAssistant.mock";

// Convenience Aliases
export { strategicDashboardMock as strategicMock } from "./strategicDashboard.mock";
export { operationalDashboardMock as operationalMock } from "./operationalDashboard.mock";
export { financialDashboardMock as financialMock } from "./financialDashboard.mock";
