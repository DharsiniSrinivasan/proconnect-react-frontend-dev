import { DatasetTableComboBox } from "@/components/dataset-table-combo/dataSet-combo-box";
import { useDecisionAssistant } from "@/components/layout/AppShell";
import { RecommendationsEmbed } from "@/components/recommendations/RecommendationsEmbed";
import SalesDashboard from "@/components/sales-recommendation/SalesDashboard";
import { Button } from "@/components/ui/button";
import { useDataSetStore } from "@/stores/dataSetStore";
import { getStorage } from "@/utils/storage";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface ComboBoxOption<T = any> {
  id: string | number;
  value: string; // id or uploadId
  label?: string; // dataset name (used for search)
  data?: T;
}

export interface DataSetItem {
  id: number | string;
  name: string;
  uploadId: string;
  uploadedAt: string;
  uploadedBy: string;
  totalRecords: number;
  dataQualityScore: number;
}


// Skeleton Loader Component
const DashboardSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-muted rounded-lg w-1/3"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-4 space-y-3">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-6 bg-muted-foreground/20 rounded"></div>
        </div>
      ))}
    </div>

    <div className="bg-muted rounded-lg p-6 space-y-4">
      <div className="h-6 bg-muted-foreground/20 rounded w-1/4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted-foreground/20 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);
export type SortOrder = "asc" | "desc" | null;

const RecommendationList = () => {
  let openDecisionAssistant: (() => void) | null = null;
  const { id } = useParams();
  const { pageSize, total, setPageSize, fetchDataSet, isLoading, data } =
    useDataSetStore();
  const getInitialState = () => {
    return null;
  };


  const initialState = getInitialState();
  const [sortBy, setSortBy] = useState<string | null>(
    initialState?.sortBy || null,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialState?.sortOrder || null,
  );
  const [filter_name, setFilter_name] = useState(
    initialState?.filter_name || "",
  );
  const filter_uploadId =
    initialState?.filter_uploadId || "";

  const filter_uploadAt =
    initialState?.filter_uploadAt || null
    ;
  const [filter_uploadBy, setUploadBy] = useState(
    initialState?.filter_uploadBy || "",
  );
  const [filter_customer, setFilter_customer] = useState(
    initialState?.filter_customer || "",
  );

 const storage = getStorage();
const navigate = useNavigate();
const [assetId, setAssetId] = useState(() => {
  const storedId = storage.getItem("datasetId");
  return storedId ? storedId : null;
});
  const [currentPage, setCurrentPage] = useState<number>(
    initialState?.page || 1,
  );
  const statusFilter = "Ready";
  const [filter_dqs, setDqs] = useState(initialState?.filter_dqs || "");
  const [batch_name, setBatch_name] = useState(initialState?.batch_name || "");
  try {
    const context = useDecisionAssistant();
    openDecisionAssistant = context.openDecisionAssistant;
  } catch (error) {
    console.error("DecisionAssistant context not available:", error);
  }
  useEffect(() => {
    if (initialState?.pageSize) {
      setPageSize(initialState.pageSize);
    }
  }, []);
  
  useEffect(() => {
    fetchDataSet(
      currentPage,
      pageSize,
      batch_name,
      filter_customer,
      filter_name,
      filter_uploadId,
      statusFilter,
      filter_uploadBy,
      filter_uploadAt,
      Number(filter_dqs),
      sortBy,
      sortOrder,
    );
  }, [
    pageSize,
    currentPage,
    filter_customer,
    batch_name,
    filter_name,
    filter_uploadAt,
    filter_uploadBy,
    filter_uploadId,
    filter_dqs,
    statusFilter,
    sortBy,
    sortOrder,
    fetchDataSet,
  ]);

const datasetType = useMemo(() => {
  if (!assetId || !data?.length) return null;

  return data.find(
    (item: any) => String(item.id) === String(assetId)
  )?.customer_type ?? null;
}, [data, assetId]);

useEffect(() => {
  if (!data?.length) return;

  const exists = data.some(
    (item: any) => String(item.id) === String(assetId)
  );

  if (!exists) {
    setAssetId(String(data[0].id)); // fallback
  }
}, [data, assetId]);
useEffect(() => {
  if (!assetId || !datasetType) return;

  navigate(`/list/recommendations/${assetId}/${datasetType}`, {
    state: { datasetType },
    replace: true,
  });
}, [assetId, datasetType]);

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Select Batch</h2>

        <div className="flex items-center gap-4">
          <DatasetTableComboBox
            batch_name={batch_name}
            setBatch_name={setBatch_name}
            filter_name={filter_name}
            setFilter_name={setFilter_name}
            filter_customer={filter_customer}
            setFilter_customer={setFilter_customer}
            filter_uploadBy={filter_uploadBy}
            setUploadBy={setUploadBy}
            filter_dqs={filter_dqs}
            setDqs={setDqs}
            value={assetId}
            onChange={(id) => {
              setAssetId(id);
              storage.setItem("datasetId", id);
            }} sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            data={data}
            isLoading={isLoading}
            total={total}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {
            assetId && (
              <Button
                variant="outline"
                onClick={openDecisionAssistant}
                className="ml-auto gap-2 border-primary/30 text-primary hover:bg-primary hover:border-primary/50"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Decision Assistant</span>
              </Button>
            )
          }

        </div>
      </div>

      {assetId ? (
        isLoading || !datasetType ? (
          <DashboardSkeleton />
        ) : datasetType === "External" ? (
          <SalesDashboard id={assetId} />
        ) : (
          <RecommendationsEmbed id={assetId} isDashboard={false} />
        )
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          No records found
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
