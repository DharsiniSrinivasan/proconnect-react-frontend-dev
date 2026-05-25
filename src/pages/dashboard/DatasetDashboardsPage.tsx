/**
 * Dataset Dashboards Page
 *
 * Multi-dashboard tabbed view for a specific dataset.
 * Shows Strategic, Operational, Financial, Facility, Forecast, and Recommendations
 * tabs for the selected dataset.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell, useDecisionAssistant } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { Package, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import embed components
import { StrategicDashboardEmbed } from "@/components/dashboard/strategic/StrategicDashboardEmbed";
import { OperationalDashboardEmbed } from "@/components/dashboard/operational/OperationalDashboardEmbed";
import { FinancialDashboardEmbed } from "@/components/dashboard/financial/FinancialDashboardEmbed";
import { FacilityDashboardEmbed } from "@/components/dashboard/facility/FacilityDashboardEmbed";
import { ForecastCentreEmbed } from "@/components/dashboard/forecast/ForecastCentreEmbed";
import { RecommendationsEmbed } from "@/components/recommendations/RecommendationsEmbed";
import { useDetailStore } from "@/stores/dataSetStore";
import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";
import SalesDashboard from "@/components/sales-recommendation/SalesDashboard";

type DashboardTab =
  | "strategic"
  | "operational"
  | "financial"
  | "facility"
  | "forecast"
  | "recommendations";

interface TabConfig {
  id: DashboardTab;
  label: string;
}

const tabs: TabConfig[] = [
  { id: "strategic", label: "Strategic" },
  { id: "operational", label: "Operational" },
  { id: "financial", label: "Financial" },
  { id: "facility", label: "Facility Analytics" },
  { id: "forecast", label: "Forecast Centre" },
  { id: "recommendations", label: "Recommendations" },
];

// Inner content component that can use the Decision Assistant hook
const DatasetDashboardContent = ({
  activeDataset,
  activeTab,
  setActiveTab,
  datasetId,
  isLoading,
  error,
  detailData,
}: {
  activeDataset: {
    id: string;
    name: string;
    uploadedAt: string;
    totalRecords: number;
    batch_name: string;
    budget_per_qty: string;
  } | null;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  datasetId: string | undefined;
  isLoading: boolean;
  error: string | null;
  detailData: any;
}) => {
  const { customerType } = useParams();
  const navigate = useNavigate();
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const tabPermissions: Record<DashboardTab, string> = {
    strategic: "access-strategic-dashboard",
    operational: "access-operational-dashboard",
    financial: "access-financial-dashboard",
    facility: "access-facility-analytics-dashboard",
    forecast: "access-forecast-dashboard",
    recommendations: "access-recommendations-dashboard",
  };

  const allowedTabs = tabs.filter(
    (tab) =>
      hasPermission(tabPermissions[tab.id]) ||
      (tab.id === "recommendations" &&
        hasPermission("access-sales-reco-dashboard")),
  );
  const isSalesRole = customerType;
  let openDecisionAssistant: (() => void) | null = null;
  
  try {
    const context = useDecisionAssistant();
    openDecisionAssistant = context.openDecisionAssistant;
  } catch (error) {
    console.error("DecisionAssistant context not available:", error);
  }
  const renderTabContent = () => {
    if (!datasetId) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No data provided</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "strategic":
        return <StrategicDashboardEmbed id={datasetId} />;
      case "operational":
        return <OperationalDashboardEmbed id={datasetId} />;
      case "financial":
        return <FinancialDashboardEmbed id={datasetId} />;
      case "facility":
        return <FacilityDashboardEmbed id={datasetId} />;
      case "forecast":
        return <ForecastCentreEmbed id={datasetId} />;
      case "recommendations":
        return <RecommendationsEmbed id={datasetId} isDashboard={true}/>;
      //  case "recommendations":
      // return isSalesRole
      //   ? <SalesPage />
      //   : <RecommendationsEmbed id={datasetId} />;

      default:
        return <StrategicDashboardEmbed id={datasetId} />;
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg font-medium text-foreground mb-2">
            Error Loading..
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dataset...</p>
        </div>
      </div>
    );
  }
  const total = activeDataset?.totalRecords ?? 0;
  const recordLabel = total === 1 ? "record" : "records";
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <Button
          variant="ghost"
          className="hover:text-primary-foreground"
          onClick={() => navigate("/data/datasets")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Batches
        </Button>

        <Button
          variant="default"
          onClick={() => {
            navigate(`/data/datasets/batches/${detailData?.detail?.batch_id}`);
          }}
          className="gap-2 hover:text-primary-foreground"
        >
          View History
        </Button>
      </div>
      {}
      <div className="flex items-center justify-between gap-4">
        {activeDataset ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 flex-1">
            <Package className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Batch- {activeDataset.batch_name||"--"}
              </p>
              <p className="text-sm font-medium text-foreground">
                {" "}
                Budget/Qty - ₹{" "}
                {activeDataset.budget_per_qty
                  ? activeDataset.budget_per_qty
                  : "--"}
              </p>
              <p className="text-sm font-medium text-foreground">
                {activeDataset.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {total.toLocaleString()} {recordLabel} • Uploaded{" "}
                {activeDataset.uploadedAt
                  ? new Date(activeDataset.uploadedAt).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "--"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border flex-1">
            <Package className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                No dataset loaded
              </p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={openDecisionAssistant}
          className="gap-2 border-primary/30 text-primary hover:bg-primary hover:border-primary/50 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Decision Assistant</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      {isSalesRole == "Internal" && (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm overflow-x-auto">
          {allowedTabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="animate-fade-in" key={activeTab}>
        {isSalesRole === "External" ? (
          <SalesDashboard id={datasetId} />
        ) : (
          renderTabContent()
        )}
      </div>
    </>
  );
};

const DatasetDashboardsPage = () => {
  const { datasetId, tab } = useParams<{
    datasetId: string;
    tab?: DashboardTab;
  }>();
  const navigate = useNavigate();
  const { customerType } = useParams();
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    tab && tabs.some((t) => t.id === tab) ? tab : "strategic",
  );

  const { fetchDetail, detailData, isLoading, error } = useDetailStore();

  useEffect(() => {
    if (!datasetId) {
      console.warn("No dataset ID provided in URL");
      return;
    }
    fetchDetail(datasetId);
  }, [datasetId, fetchDetail]);
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);
  const handleTabChange = (tab: DashboardTab) => {
    navigate(`/data/datasets/dashboard/${datasetId}/${tab}/${customerType}`);
  };

  return (
    <AppShell
      pageTitle={`Batch ${ !isLoading ? detailData?.detail?.batch_name||"--":""}`}
      pageSubtitle={!isLoading?detailData?.detail?.name || "Loading...":""}
      lastUpdated={
        detailData?.detail?.uploadedAt
          ? new Date(detailData?.detail?.uploadedAt).toLocaleDateString(
              "en-IN",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            )
          : "--"
      }
    >
      <DatasetDashboardContent
        activeDataset={detailData?.detail ?? null}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        datasetId={datasetId}
        isLoading={isLoading ?? false}
        error={error ?? null}
        detailData={detailData}
      />
    </AppShell>
  );
};

export default DatasetDashboardsPage;
