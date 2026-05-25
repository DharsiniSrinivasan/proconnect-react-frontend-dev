import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import LoginPage2 from "@/pages/auth/LoginPage2";
// ============= Auth Pages =============
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage"),
);

const ShipmentDashboard = lazy(
  () => import("@/pages/dashboard/CardPage"),
);

// ============= Dashboard Pages =============
const GenericDashboardPage = lazy(
  () => import("@/pages/dashboard/GenericDashboardPage"),
);
const GenericDashboardPage2 = lazy(
  () => import("@/pages/dashboard/Dashboard2"),
);
const DatasetDashboardsPage = lazy(
  () => import("@/pages/dashboard/DatasetDashboardsPage"),
);
const StrategicDashboard = lazy(() => import("@/pages/Index"));
const OperationalDashboard = lazy(() => import("@/pages/OperationalDashboard"));
const FinancialDashboard = lazy(() => import("@/pages/FinancialDashboard"));
const FacilityDashboard = lazy(() => import("@/pages/FacilityDashboard"));
const ForecastCentrePage = lazy(() => import("@/pages/ForecastCentrePage"));

// ============= Recommendation Pages =============
const RecommendationFeedPage = lazy(
  () => import("@/pages/recommendations/RecommendationFeedPage"),
);
const RecommendationDetailPage = lazy(
  () => import("@/pages/recommendations/RecommendationDetailPage"),
);

// ============= Data Acquisition Pages =============
const DatasetsPage = lazy(() => import("@/pages/data/DatasetsPage"));
const DatasetsPage2 = lazy(
  () => import("@/pages/data/DatasetsPage2"),
)
const NewUploadPage = lazy(() => import("@/pages/data/NewUploadPage"));
const UploadStatusPage = lazy(() => import("@/pages/data/UploadStatusPage"));
const BatchStatusPage = lazy(() => import("@/pages/data/BatchStatusPage"));
const ForeCastPage = lazy(() => import("@/pages/forecast-page/ForecastPage"));
const RecommendationPage = lazy(
  () => import("@/pages/recommandation-page/RecommendationPage"),
);
// ============= Data Exploration Pages =============
const ShipmentsExplorerPage = lazy(
  () => import("@/pages/data/ShipmentsExplorerPage"),
);

// ============= Master Data Pages =============
const MasterDataHomePage = lazy(
  () => import("@/pages/master-data/MasterDataHomePage"),
);

const MasterDataHomePage2 = lazy(
  () => import("@/pages/master-data/MasterDataHomePage2"),
);

const CustomerMasterPage = lazy(
  () => import("@/pages/master-data/CustomerMasterPage"),
);
const PartnerMasterPage = lazy(
  () => import("@/pages/master-data/PartnerMasterPage"),
);
const TransporterMainPage = lazy(
  () => import("@/pages/master-data/TransporterMainPage"),
);
const FacilityMainPage = lazy(
  () => import("@/pages/master-data/FacilityMainPage"),
);
const RateCardsPage = lazy(() => import("@/pages/master-data/RateCardsPage"));
const PartnersRatePage = lazy(
  () => import("@/pages/master-data/PartnersRateDetail"),
);
// ============= Admin Pages =============
const UsersRolesPage = lazy(() => import("@/pages/admin/UsersRolesPage"));
const AuditTrailPage = lazy(() => import("@/pages/admin/AuditTrailPage"));
const AppearanceSettingsPage = lazy(
  () => import("@/pages/admin/AppearanceSettingsPage"),
);
const ProfilePage = lazy(() => import("@/pages/admin/ProfilePage"));
const UnauthorizedPage = lazy(() => import("@/pages/Unauthorized"));

// ============= Error Pages =============
const NotFound = lazy(() => import("@/pages/NotFound"));

// Helper to wrap protected routes
const protectedRoute = (element: React.ReactNode, permission?: string) => {
  if (permission) {
    return (
      <AuthGuard>
        <PermissionGuard permission={permission}>
          {element as JSX.Element}
        </PermissionGuard>
      </AuthGuard>
    );
  }

  return <AuthGuard>{element}</AuthGuard>;
};

/**
 * Application route definitions
 */
export const routes: RouteObject[] = [
  // Auth Routes (public)
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/login", element: <LoginPage2 /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },

  // Dashboard Routes (protected)
   {
    path: "/newcard",
  element: protectedRoute(
    <ShipmentDashboard />,
    "view-dashboards"
  ),
  },
  {
    path: "/",
    element: protectedRoute(<GenericDashboardPage />, "view-dashboards"),
  },
  {
    path: "/dashboard",
    element: protectedRoute(<GenericDashboardPage />, "view-dashboards"),
  },
  {
    path: "/dashboard2",
    element: protectedRoute(<GenericDashboardPage2 />, "view-dashboards"),
  },
  {
    path: "/data/datasets/dashboard/:datasetId/:tab?/:customerType",
    element: protectedRoute(<DatasetDashboardsPage />),
  },
  {
    path: "/dashboard/strategic",
    element: protectedRoute(
      <StrategicDashboard />,
      "access-strategic-dashboard",
    ),
  },
  {
    path: "/dashboard/operational",
    element: protectedRoute(
      <OperationalDashboard />,
      "access-operational-dashboard",
    ),
  },
  {
    path: "/dashboard/financial",
    element: protectedRoute(
      <FinancialDashboard />,
      "access-financial-dashboard",
    ),
  },
  {
    path: "/dashboard/facility-analytics",
    element: protectedRoute(
      <FacilityDashboard />,
      "access-facility-analytics-dashboard",
    ),
  },

  // Forecast Centre (protected)
  { path: "/forecasts", element: protectedRoute(<ForecastCentrePage />) },
  { path: "/forecast", element: protectedRoute(<ForeCastPage />) },
    { path: "/forecast/:id", element: protectedRoute(<ForeCastPage />) },
  {
    path: "/list/recommendations",
    element: protectedRoute(<RecommendationPage />),
  },
  {
    path: "/list/recommendations/:id/:datasetType?",
    element: protectedRoute(<RecommendationPage />),
  },

  // Recommendations (protected)
  {
    path: "/recommendations/feed",
    element: protectedRoute(<RecommendationFeedPage />),
  },
  {
    path: "/recommendations/:id",
    element: protectedRoute(<RecommendationDetailPage />),
  },

  // Data Acquisition (protected)
  {
    path: "/data/datasets",
    element: protectedRoute(<DatasetsPage />, "access-data-set-list"),
  },
  {
  path: "/data2/datasets",
  element: protectedRoute(
    <DatasetsPage2 />,
    "access-data-set-list",
  ),
},
  {
    path: "/data2/datasets",
    element: protectedRoute(<DatasetsPage />, "access-data-set-list"),
  },
  {
    path: "/data/new-upload",
    element: protectedRoute(<NewUploadPage />, "manage-excel-templates"),
  },
  {
    path: "/data/datasets/uploads/:uploadId",
    element: protectedRoute(<UploadStatusPage />),
  },
  {
    path: "/data/datasets/batches/:batchId",
    element: protectedRoute(<BatchStatusPage />),
  },
  {
    path: "/forecast-view/:uploadId",
    element: protectedRoute(<UploadStatusPage />),
  },
  // Data Exploration (protected)
  {
    path: "/data/shipments",
    element: protectedRoute(<ShipmentsExplorerPage />),
  },

  // Master Data (protected)
  {
    path: "/master-data",
    element: protectedRoute(<MasterDataHomePage />, "manage-master-data"),
  },
  {
    path: "/master-data/customers",
    element: protectedRoute(<CustomerMasterPage />, "access-customer"),
  },
  {
    path: "/master-data/customers/:buttontype",
    element: protectedRoute(<CustomerMasterPage />, "access-customer"),
  },
  // { path: "/master-data/transporters", element: protectedRoute(<PartnerMasterPage />,"access-partner") },
  {
    path: "/master-data/tab",
    element: protectedRoute(<FacilityMainPage />, "access-facilities"),
  },
  {
    path: "/master-data/tab/:tab",
    element: protectedRoute(<FacilityMainPage />, "access-facilities"),
  },
  {
    path: "/master-data/tab/:tab/:buttontype",
    element: protectedRoute(<FacilityMainPage />, "access-facilities"),
  },
  {
    path: "/master-data/page",
    element: protectedRoute(<TransporterMainPage />, "access-ratecard"),
  },
  {
    path: "/master-data/page/:tab",
    element: protectedRoute(<TransporterMainPage />, "access-ratecard"),
  },
  {
    path: "/master-data/page/:tab/:buttontype",
    element: protectedRoute(<TransporterMainPage />, "access-ratecard"),
  },

  {
  path: "/master-data2",
  element: protectedRoute(<MasterDataHomePage2 />, "manage-master-data"),
},

  {
    path: "/master-data/page/transporters/details/:id/:name",
    element: protectedRoute(<PartnersRatePage />, "access-transporter"),
  },

  // Admin (protected)
  {
    path: "/admin/users",
    element: protectedRoute(<UsersRolesPage />, "manage-users"),
  },
  {
    path: "/admin/audit",
    element: protectedRoute(<AuditTrailPage />, "monitor-real-time-audit"),
  },
  {
    path: "/admin/appearance",
    element: protectedRoute(<AppearanceSettingsPage />),
  },
  { path: "/admin/profile", element: protectedRoute(<ProfilePage />) },

  // Catch-all 404
  { path: "*", element: <NotFound /> },
];

/**
 * Route metadata for sidebar navigation and breadcrumbs
 */
export const routeMeta = {
  auth: {
    login: { path: "/login", label: "Login" },
    forgotPassword: { path: "/forgot-password", label: "Forgot Password" },
  },
  dashboards: {
    insights: { path: "/dashboard", label: "Insights Dashboard" },
    strategic: { path: "/dashboard/strategic", label: "Strategic Dashboard" },
    operational: {
      path: "/dashboard/operational",
      label: "Operational Dashboard",
    },
    financial: { path: "/dashboard/financial", label: "Financial Dashboard" },
    facility: {
      path: "/dashboard/facility-analytics",
      label: "Facility Analytics",
    },
    forecast: { path: "/forecasts", label: "Forecast Centre" },
    recommendations: {
      path: "/recommendations/feed",
      label: "Recommendations",
    },
  },
  dataAcquisition: {
    datasets: { path: "/data/datasets", label: "Datasets" },
    newUpload: { path: "/data/new-upload", label: "New Upload" },
  },
  dataExploration: {
    shipments: { path: "/data/shipments", label: "Shipments Explorer" },
  },
  masterData: {
    overview: { path: "/master-data", label: "Master Data Overview" },
    customers: { path: "/master-data/customers", label: "Customer Master" },
    partners: { path: "/master-data/partners", label: "Transporters" },
    facilities: { path: "/master-data/facilities", label: "Facility Master" },
    rateCards: { path: "/master-data/rate-cards", label: "Rate Cards" },
  },
  admin: {
    users: { path: "/admin/users", label: "Users & Roles" },
    audit: { path: "/admin/audit", label: "Audit Trail" },
    appearance: {
      path: "/admin/appearance",
      label: "Appearance & Preferences",
    },
  },
} as const;
