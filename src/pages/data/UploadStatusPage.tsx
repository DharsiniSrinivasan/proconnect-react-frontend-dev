import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LineChart, List, Loader2, Upload, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  UploadStatsStrip,
  UploadStatsStripSkeleton,
} from "@/components/data-acquisition/UploadStatsStrip";
import { Skeleton } from "@/components/ui/skeleton";
import { useAirflowStore, useDetailStore } from "@/stores/dataSetStore";
import { UploadTimeline } from "@/components/data-acquisition/UploadTimeline";
import { getStorage } from "@/utils/storage";
import { toast } from "@/components/ui/sonner";
import { DownloadError, uploadFileData } from "@/services/dataSetServices";
import { DatasetStatusChip } from "@/components/data-acquisition/DatasetStatusChip";
import { websocketService } from "@/services/websocketService";
import { UploadZone } from "@/components/data-acquisition/UploadZone";
import { usePermission } from "@/utils/userPermission";
import { ErrorTypeSummary } from "@/components/data-acquisition/ErrorSummaryTable";
import { chatService } from "@/services/aiChatService";

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;


const TERMINAL_STATUSES = new Set([
  "READY",
  "FAILED",
  "DATA CATEGORIZATION",
  "Data Enrichment",
]);

const UploadStatusPage = () => {
  const storage = getStorage();
  const uploadId = storage.getItem("lastViewedDataset");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(uploadId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const rowNo= "";
  const errorType = "";
  const fieldName = "";
  const fieldValue = "";
  const fix = "";
  const severity = "";
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState("INITIATE");
  const [processing_status, setProcessing_status] = useState("");
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const navigate = useNavigate();
  const { triggerAirflow } = useAirflowStore();
  const {
    fetchDetail,
    retryDataset,
    detailData,
    total,
    pageSize,
    setPageSize,
    fetchErrorOptions,
    resetData,
  } = useDetailStore();

  const data: any = detailData;
  const isLoading = isInitialLoading || !data;

  const setupSocketSubscription = (datasetId: string | number,batchId:string | number) => {
    if (!websocketService.isConnected) {
      const token = storage.getItem("access_token") ?? "";
      websocketService.connect(token);
    }

    const sendSubscription = () => {
      websocketService.send({
        action: "subscribe",
        batch_id: String(batchId),
      });
    };

    const socket = websocketService.getSocket();
    if (socket?.readyState === WebSocket.OPEN) {
      sendSubscription();
    } else if (socket) {
      const prevOnOpen = socket.onopen;
      socket.onopen = (evt) => {
        if (prevOnOpen) (prevOnOpen as (evt: Event) => void)(evt);
        sendSubscription();
      };
    }

    websocketService.subscribe((message) => {
      if (!message) return;
      if (message.processing_status || message.status) {
        const incomingStatus: string = (message.status ?? "").toUpperCase();
        const incomingProcessing: string = (
          message.processing_status ?? ""
        ).toUpperCase();
        if (String(batchId) === String(message.batch_id)) {
          setStatus(message.status ?? "INITIATE");
          setProcessing_status(message.processing_status ?? "");
          if (
            TERMINAL_STATUSES.has(incomingStatus) ||
            TERMINAL_STATUSES.has(incomingProcessing)
          ) {
            fetchDetail(
              message.dataset_id ?? datasetId,
              currentPage,
              pageSize,
              errorType,
              severity,
              fieldName,
              fieldValue,
              Number(rowNo),
              fix,
              sortBy,
              sortOrder,
            );
          }
        
          if (message.processing_status ==="Data Enrichment") {
            let payload = {
              dataset_id: message.dataset_id ?? datasetId,
              customer_id: data?.detail?.customer_id,
              unit_rate: data?.detail?.budget_per_qty,
            };
            chatService.preCommute(payload);
          }
       }
      }
    });
  };

  const getInitialData = async () => {
    if (!selectedId) {
      setIsInitialLoading(false);
      return;
    }
    setIsInitialLoading(true);
    try {
      await fetchDetail(
        selectedId,
        currentPage,
        pageSize,
        errorType,
        severity,
        fieldName,
        fieldValue,
        Number(rowNo),
        fix,
        sortBy,
        sortOrder,
      );
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };
  useEffect(() => {
    resetData();
    getInitialData();
  }, [
    selectedId,
    currentPage,
    pageSize,
    errorType,
    severity,
    fieldName,
    fieldValue,
    rowNo,
    fix,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchErrorOptions();
  }, []);


  useEffect(() => {
    const id = data?.detail?.id;
    const batchId = data?.detail?.batch_id;
    const processingStatus: string = data?.detail?.processing_status ?? "";
    const uploadStatus: string = data?.detail?.status ?? "INITIATE";
    setStatus(uploadStatus);
    setProcessing_status(processingStatus);
    const shouldSubscribe = id && batchId && uploadStatus.toUpperCase() != "READY";
    if (shouldSubscribe) {
      setupSocketSubscription(id,batchId);
    } else {
      setStatus(uploadStatus);
      setProcessing_status(processingStatus);
    }
}, [detailData?.detail?.batch_id,selectedId,data?.detail?.id]);

  useEffect(() => {
    fetchErrorOptions();
  }, []);


  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await DownloadError.getDownload(true, data?.detail?.id);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleModalClose = () => {
    if (isUploading) return;
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file before submitting.");
      return;
    }
    const maxSizeInBytes = 300 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File size exceeds 300 MB. Please select a smaller file.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadFileData.uploadFile(
        selectedFile,
        data?.detail?.batch_id,
      );
      if (response.status === 200 || response.status === 201) {
        const id = response?.data?.data?.id ?? 0;
        const batch_id = response?.data?.data?.batch_id ?? 0;
        setIsInitialLoading(true);
        setSelectedId(String(id));
        storage.setItem("lastViewedDataset", id.toString());
        navigate(`/data/datasets/uploads/${id}?new=false`);
        triggerAirflow(id, data?.detail?.customer_id);
        setupSocketSubscription(id,batch_id);
        toast.success("File uploaded successfully");
        setIsImportModalOpen(false);
        setSelectedFile(null);
        setShowErrorDialog(false);
      } else {
        setErrorMessage(
          response?.error || "File upload failed. Please try again.",
        );
        setIsImportModalOpen(false);
        setSelectedFile(null);
        setShowErrorDialog(true);
      }
    } catch (err) {
      console.error(err);
      setIsImportModalOpen(false);
      setSelectedFile(null);
      setShowErrorDialog(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetryUpload = async () => {
    setIsRetry(true);
    try {
      const response = await retryDataset(
        data?.detail?.id,
        data?.detail?.customer_id,
      );
      if (response.status_code === 200 || response.status_code === 201) {
        await getInitialData();
        setupSocketSubscription(data?.detail?.id,data?.detail?.batch_id);
        if (data?.detail) {
          let payload = {
            dataset_id: data?.detail?.id,
            customer_id: data?.detail?.customer_id,
            unit_rate: data?.detail?.budget_per_qty,
          };
          chatService.preCommute(payload);
        }
      } else {
        toast.error("Failed to retry dataset");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to retry dataset");
    } finally {
      setIsRetry(false);
    }
  };

  const handleOpenDashboards = () => {
    storage.setItem("lastViewedDataset", selectedId);
    navigate(
      `/data/datasets/dashboard/${selectedId}/${data?.detail?.customer_type}`,
    );
    storage.setItem("datasetId", selectedId);
  };

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "--";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--";
    }
  };


  if (!selectedId) {
    return (
      <AppShell pageTitle="Upload Status" pageSubtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No upload ID provided</p>
          <Button
            className="hover:text-primary-foreground"
            onClick={() => navigate("/data/datasets")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Batches
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      pageTitle="Upload Status"
      pageSubtitle={!data ? "" : data?.name ?? ""}
    >
      {/* Toolbar */}
      <div className="flex flex-row justify-between mb-4 gap-2">
        {/* Back Button */}
        <Button
          className="hover:text-primary-foreground flex items-center"
          variant="ghost"
          onClick={() => navigate("/data/datasets")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span >Back to Batches</span>
        </Button>

        {/* Right Buttons */}
        <div className="flex gap-2 sm:gap-4">
          {hasPermission("manage-excel-templates") &&
            status?.toUpperCase() === "FAILED" && processing_status === "Data Quality Score Failed" && (
              <Button
                variant="default"
                onClick={() => setIsImportModalOpen(true)}
                className="hover:text-primary-foreground flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline ml-2">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Upload</span>
                  </>
                )}
              </Button>
            )}

          {data && (
            <Button
              variant="default"
              onClick={() =>
                navigate(`/data/datasets/batches/${data?.detail?.batch_id}`)
              }
              className="hover:text-primary-foreground flex items-center justify-center"
            >
              <List className="sm:hidden w-4 h-4" />
              <span className="hidden sm:inline ml-2">View History</span>
            </Button>
          )}

          {status?.toUpperCase() === "READY" && (
            <Button
              variant="default"
              onClick={handleOpenDashboards}
              className="hover:text-primary-foreground flex items-center justify-center"
            >
              <LineChart className="sm:hidden w-4 h-4" />
              <span className="hidden sm:inline ml-2">View Dashboard</span>
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full sm:w-96" />
          <Skeleton className="h-5 w-full sm:w-64" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              Batch Name :{" "}
              <span className="font-normal">{data?.detail?.batch_name ?? "--"}</span>
            </h1>
            <h1 className="text-lg font-bold">
              Budget/Qty :{" "}
              <span className="font-normal">₹ {data?.detail?.budget_per_qty ?? "--"}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 mb-2">
              <h1 className="text-lg font-bold">{data?.detail?.name ?? "--"}</h1>
              <DatasetStatusChip status={status !== "authenticated" ? status : "INITIATE"} />
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{data?.detail?.uploadId ?? selectedId}</span>
              <span>•</span>
              <span>Uploaded by {data?.detail?.uploadedBy ?? "Unknown"}</span>
              <span>•</span>
              <span>Customer: {data?.detail?.customer_name ?? "--"}</span>
              <span>•</span>
              <span>{formatDate(data?.detail?.uploadedAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl mb-4" />
      ) : (
        <UploadTimeline
          status={status?.toUpperCase() ?? "INITIATE"}
          progressStatus={processing_status ?? ""}
          onRetry={handleRetryUpload}
          isRetrying={isRetry}
        />
      )}

      {/* Stats */}
      {isLoading ? (
        <UploadStatsStripSkeleton />
      ) : (
        <UploadStatsStrip
          totalRecords={data?.detail?.totalRecords || 0}
          validRecords={data?.detail?.validRecords || 0}
          errorRecords={data?.detail?.errorRecords || 0}
          dataQualityScore={data?.detail?.dataQualityScore || 0}
          quarantineCount={data?.ERROR_COUNT || 0}
        />
      )}

      {/* Errors */}
      <ErrorTypeSummary
        isLoading={isLoading}
        errors={data?.valid_error_summary ?? []}
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={setCurrentPage}
        totalRecords={total ?? 0}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        handleDownload={handleDownload}
        isDownloading={isDownloading}
        searchValue={""}
        onSearch={() => { }}
      />

      {/* Upload Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            <UploadZone
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileRemove={() => setSelectedFile(null)}
            />
            <div className="flex flex-col sm:flex-row gap-3 p-6">
              <Button
                variant="outline"
                onClick={handleModalClose}
                disabled={isUploading}
                className="flex-1 hover:text-primary-foreground"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleStartUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Upload Failed</h3>
              <button
                onClick={() => setShowErrorDialog(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {errorMessage || "Something went wrong during upload. Please try again."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowErrorDialog(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setShowErrorDialog(false);
                  setIsImportModalOpen(true);
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Retry Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default UploadStatusPage;