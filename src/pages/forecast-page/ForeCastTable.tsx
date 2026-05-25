import { useEffect, useState } from "react";
import { ForecastCentreEmbed } from "@/components/dashboard/forecast/ForecastCentreEmbed";
import { DatasetTableComboBox } from "@/components/dataset-table-combo/dataSet-combo-box";
import { useDecisionAssistant } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getStorage } from "@/utils/storage";
import { useNavigate, useParams } from "react-router-dom";
import { forecastStore } from "@/stores/foreCastStore";
import { useDataSetStore } from "@/stores/dataSetStore";

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

export type SortOrder = "asc" | "desc" | null;
const ForeCastList = () => {

  const storage = getStorage();
  const { openDecisionAssistant } = useDecisionAssistant();
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

  const { loading } = forecastStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [assetId, setAssetId] = useState<string | null>(() => {
    const initialId = id && id !== "null" ? id : storage.getItem("datasetId");
    return initialId && initialId !== "null" ? initialId : null;
  });
  const [currentPage, setCurrentPage] = useState<number>(
    initialState?.page || 1,
  );
  const statusFilter = "Ready";
  const [filter_dqs, setDqs] = useState(initialState?.filter_dqs || "");
  const [batch_name, setBatch_name] = useState(initialState?.batch_name || "");

  useEffect(() => {
    setAssetId(null);
  }, []);
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

  useEffect(() => {
    if (!assetId) return;
    storage.setItem("datasetId", assetId);
    if (assetId != null) {
      navigate(`/forecast/${assetId}`, { replace: true });
    }
  }, [assetId, id, navigate, storage]);


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
            }}
            sortBy={sortBy}
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
            assetId && !loading && (
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
        <ForecastCentreEmbed id={assetId} />
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          No records found
        </div>
      )}
    </div>
  );
};
export default ForeCastList;
