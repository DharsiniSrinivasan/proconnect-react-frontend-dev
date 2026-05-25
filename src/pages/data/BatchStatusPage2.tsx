import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/data-acquisition/StatusChip";
import { NeonCard } from "@/components/ui/neon-card";
import {
  UploadStatsStrip,
  UploadStatsStripSkeleton,
} from "@/components/data-acquisition/UploadStatsStrip";
import { Skeleton } from "@/components/ui/skeleton";
import { useBatchStore, useDetailStore } from "@/stores/dataSetStore";
import { DownloadError, DownloadUpload } from "@/services/dataSetServices";
import { ErrorTypeSummary, ErrorTypeSummarySkeleton } from "@/components/data-acquisition/ErrorSummaryTable";

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface DatasetItem {
  id: number;
  name: string;
  uploadId: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  dataQualityScore: number;
}

// Per-row independent filter + pagination state
interface RowFilterState {
  currentPage: number;
  rowNo: string;
  errorType: string;
  fieldName: string;
  fieldValue: string;
  fix: string;
  severity: string;
  sortBy: string | null;
  sortOrder: SortOrder;
}

const defaultRowFilter = (): RowFilterState => ({
  currentPage: 1,
  rowNo: "",
  errorType: "",
  fieldName: "",
  fieldValue: "",
  fix: "",
  severity: "",
  sortBy: null,
  sortOrder: null,
});

const BatchStatusPage2 = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data, fetchBatch, isLoading, pageSize, total, setPageSize } =
    useBatchStore();

  const {
    fetchDetail,
    detailData,
    pageSize: detailPageSize,
    isLoading: errorLoading,
    fetchErrorOptions,
  } = useDetailStore();
  const { batchId } = useParams<{ batchId: string }>();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeDetailId, setActiveDetailId] = useState<number | null>(null);
  const [rowFilters, setRowFilters] = useState<Record<number, RowFilterState>>(
    {},
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [pageInput, setPageInput] = useState<number | "">(1);

  const getFilter = (id: number): RowFilterState =>
    rowFilters[id] ?? defaultRowFilter();

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setPageInput("");
      return;
    }

    const num = Number(value);

    // Check for NaN or invalid number
    if (isNaN(num)) {
      setPageInput(currentPage + 1);
      return;
    }

    // Clamp the value between 1 and totalPages
    if (num < 1) {
      setPageInput(1);
    } else if (num > totalPages) {
      setPageInput(totalPages);
    } else {
      setPageInput(num);
    }
  };

  const handlePageInputBlur = () => {
    // If user leaves input empty or invalid, reset to current page + 1
    if (pageInput === "" || isNaN(pageInput as number)) {
      setPageInput(currentPage + 1);
    }
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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await DownloadError.getDownload(true, detailData?.detail?.id);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadDownload = async (id: string | number) => {
    const numId = typeof id === "string" ? parseInt(id) : id;
    setDownloadingIds((prev) => new Set(prev).add(numId));
    try {
      await DownloadUpload.getDownload(true, String(id));
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(numId);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchErrorOptions();
  }, []);

  useEffect(() => {
    fetchBatch(batchId, currentPage, pageSize);
  }, [pageSize, currentPage]);

  const loadErrors = (id: number, overrides?: Partial<RowFilterState>) => {
    const f = { ...getFilter(id), ...overrides };
    fetchDetail(
      String(id),
      f.currentPage,
      detailPageSize,
      f.errorType,
      f.severity,
      f.fieldName,
      f.fieldValue,
      Number(f.rowNo),
      f.fix,
      f.sortBy,
      f.sortOrder,
    );
    setActiveDetailId(id);
  };

  useEffect(() => {
    if (activeDetailId !== null) {
      loadErrors(activeDetailId);
    }
  }, [rowFilters, detailPageSize]);

  const toggleRow = (dataset: DatasetItem) => {
    const { id } = dataset;
    const hasErrors = (dataset.errorRecords ?? 0) > 0;

    setExpandedId((prev) => {
      if (prev === id) {
        // close if already open
        if (activeDetailId === id) setActiveDetailId(null);
        return null;
      } else {
        // open this and close others
        if (hasErrors) loadErrors(id);
        return id;
      }
    });
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  const isItemDownloading = (id: number) => downloadingIds.has(id);

  return (
    <AppShell pageTitle="Batches" pageSubtitle="All uploaded batches">
      <div className="hidden md:block">
        {/* Back */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            className="hover:text-primary-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-5 w-64" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-1xl font-bold">
                  Batch Name :{" "}
                  <span className="font-normal">
                    {detailData?.detail?.batch_name ?? "--"}
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-1xl font-bold">
                  Budget/Qty :{" "}
                  <span className="font-normal">
                    ₹ {detailData?.detail?.budget_per_qty ?? "--"}
                  </span>
                </h1>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="font-mono">
                  Batch ID: {detailData?.detail?.batch_id ?? "--"}
                </span>
                <span>•</span>
                <span>
                  {total} file{total !== 1 ? "s" : ""}
                </span>
                <span>•</span>
                <span>
                  Created by {detailData?.detail?.uploadedBy ?? "Unknown"}
                </span>
                <span>•</span>
                <span>Customer: {detailData?.detail?.customer_name || "--"}</span>
                <span>•</span>
                <span>{formatDate(detailData?.detail?.uploadedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <NeonCard title={`Batches (${total ?? total})`}>
            <div className="space-y-2">
              {total === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No batches found.
                </p>
              )}

              {data?.map((dataset) => {
                const hasErrors = (dataset.errorRecords ?? 0) > 0;
                const isExpanded = expandedId === dataset.id && hasErrors;
                const isDownload= isItemDownloading(dataset.id);

                return (
                  <div
                    key={dataset.id}
                    className="border border-border/30 rounded-lg overflow-hidden"
                  >
                    {/* ── Row header ── */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleRow(dataset)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRow(dataset);
                        }
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-primary/5 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {/* Chevron — visible only when row has errors */}
                      {hasErrors ? (
                        <ChevronRight
                          className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-5 h-5 shrink-0" />
                      )}

                      {/* Name + meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-foreground truncate">
                            {dataset.name}
                          </h3>
                          <StatusChip status={dataset.status} />
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">{dataset.uploadId}</span>
                          <span>•</span>
                          <span>{dataset.uploadedBy}</span>
                          <span>•</span>
                          <span>{formatDate(dataset.uploadedAt)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      {!isExpanded && (
                        <div className="flex items-center gap-6 text-sm shrink-0">
                          <div className="text-center">
                            <div className="text-muted-foreground text-xs mb-1">
                              Total
                            </div>
                            <div className="font-semibold">
                              {(dataset.totalRecords ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground text-xs mb-1">
                              Valid
                            </div>
                            <div className="font-semibold text-green-600">
                              {(dataset.validRecords ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground text-xs mb-1">
                              Errors
                            </div>
                            <div className="font-semibold text-destructive">
                              {(dataset.errorRecords ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground text-xs mb-1">
                              DQS
                            </div>
                            <div className="font-semibold">
                              {(dataset.dataQualityScore ?? 0).toFixed(2)}%
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadDownload(dataset.id);
                            }}
                            disabled={isDownload}
                            className="flex items-center gap-1.5 text-xs h-8 hover:text-primary-foreground"
                          >
                            {isDownload ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    {isExpanded && hasErrors && (
                      <div className="border-t border-border/30 bg-muted/20 p-6">
                        <div className="space-y-4">
                          {/* Download Buttons */}
                          <div className="flex gap-3 justify-end">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadDownload(dataset.id);
                              }}
                              disabled={isDownload}
                              className="gap-2 hover:text-primary-foreground"
                            >
                              {isDownload ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  Download Uploaded File
                                </>
                              )}
                            </Button>
                          </div>
                          {/* Summary Stats */}
                          {errorLoading ? (
                            <UploadStatsStripSkeleton />
                          ) : (
                            <UploadStatsStrip
                              totalRecords={detailData?.detail?.totalRecords || 0}
                              validRecords={detailData?.detail?.validRecords || 0}
                              errorRecords={detailData?.detail?.errorRecords || 0}
                              dataQualityScore={
                                detailData?.detail?.dataQualityScore || 0
                              }
                              quarantineCount={
                                detailData?.ERROR_COUNT ||
                                0
                              }
                            />
                          )}
                          {
                            errorLoading ?
                              <ErrorTypeSummarySkeleton />
                              :
                              <ErrorTypeSummary
                                isLoading={isLoading}
                                errors={detailData?.valid_error_summary ?? []}
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
                          }

                        </div>
                      </div>
                    )}

                    {/* ── Expanded: no errors ── */}
                    {isExpanded && !hasErrors && (
                      <div className="border-t border-border/30 bg-muted/20 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          ✓ No validation errors found in this file
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {total > 10 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border/30 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Rows per page:
                  </span>
                  <select
                    className="border rounded px-2 py-1 text-xs bg-background"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                  </select>
                </div>
                <p className="text-sm text-muted-foreground">
                  {start}–{end} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </NeonCard>
        )}
      </div>

      <div className="md:hidden">

        <div className="flex items-center justify-between mb-4 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-1 h-auto w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold flex-1 truncate">Batches</h1>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 h-auto w-auto"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <p className="pl-2 pr-2">View details</p>
            )}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-muted/40 rounded-lg p-3 mb-4 space-y-3 border border-border/30 animate-in slide-in-from-top-2">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Batch Name
                  </p>
                  <p className="text-sm font-medium truncate">
                    {detailData?.detail?.batch_name ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Budget/Qty
                  </p>
                  <p className="text-sm font-medium">
                    ₹ {detailData?.detail?.budget_per_qty ?? "--"}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/30 space-y-2 text-xs">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">ID:</span>{" "}
                    {detailData?.detail?.batch_id ?? "--"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Files:</span> {total}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Created by:</span>{" "}
                    {detailData?.detail?.uploadedBy ?? "Unknown"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Customer:</span>{" "}
                    {detailData?.detail?.customer_name || "--"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(detailData?.detail?.uploadedAt)}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {total === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No batches found.
              </p>
            )}

            {data?.map((dataset) => {
              const hasErrors = (dataset.errorRecords ?? 0) > 0;
              const isExpanded = expandedId === dataset.id && hasErrors;
              const isDownload = isItemDownloading(dataset.id);

              return (
                <div
                  key={dataset.id}
                  className="border border-border/30 rounded-lg overflow-hidden bg-card"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleRow(dataset)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRow(dataset);
                      }
                    }}
                    className="p-3 space-y-2 active:bg-primary/10 transition-colors"
                  >
                    {/* Header with chevron and name */}
                    <div className="flex items-start gap-2">
                      {hasErrors ? (
                        <ChevronRight
                          className={`w-5 h-5 mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-5 h-5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold truncate">
                            {dataset.name}
                          </h3>
                          <StatusChip status={dataset.status} />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {dataset.uploadId}
                        </p>
                      </div>
                    </div>

                    {/* Metadata row */}
                    <div className="text-xs text-muted-foreground space-y-0.5 ml-7">
                      <p>{dataset.uploadedBy}</p>
                      <p>{formatDate(dataset.uploadedAt)}</p>
                    </div>

                    {/* Stats Grid (2 columns) */}
                    {!isExpanded && (
                      <div className="grid grid-cols-2 gap-2 ml-7 pt-2">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Total
                          </p>
                          <p className="text-sm font-semibold">
                            {(dataset.totalRecords ?? 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Valid
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            {(dataset.validRecords ?? 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Errors
                          </p>
                          <p className="text-sm font-semibold text-destructive">
                            {(dataset.errorRecords ?? 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            DQS
                          </p>
                          <p className="text-sm font-semibold">
                            {(dataset.dataQualityScore ?? 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Download Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadDownload(dataset.id);
                      }}
                      disabled={isDownload}
                      className="w-full gap-2 mt-2"
                    >
                      {isDownload ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>


                  {isExpanded && hasErrors && (
                    <div className="border-t border-border/30 bg-muted/20 p-3 space-y-3 animate-in slide-in-from-top-2">
                      {/* Summary Stats */}
                      {errorLoading ? (
                        <UploadStatsStripSkeleton />
                      ) : (
                        <UploadStatsStrip
                          totalRecords={detailData?.detail?.totalRecords || 0}
                          validRecords={detailData?.detail?.validRecords || 0}
                          errorRecords={detailData?.detail?.errorRecords || 0}
                          dataQualityScore={
                            detailData?.detail?.dataQualityScore || 0
                          }
                          quarantineCount={
                            detailData?.validationErrors?.pagination?.total || 0
                          }
                        />
                      )}

                      {
                        errorLoading ?
                          <ErrorTypeSummarySkeleton />
                          :
                          <div className="overflow-x-auto -mx-3 -mb-3">
                            <ErrorTypeSummary
                              isLoading={isLoading}
                              errors={detailData?.valid_error_summary ?? []}
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
                          </div>
                      }

                    </div>
                  )}


                  {isExpanded && !hasErrors && (
                    <div className="border-t border-border/30 bg-muted/20 p-3 text-center animate-in slide-in-from-top-2">
                      <p className="text-sm text-muted-foreground">
                        ✓ No validation errors
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {total > 10 && (
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-border/30">
                {/* Rows per page */}
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-xs text-muted-foreground">
                    Rows per page:
                  </span>
                  <select
                    className="border rounded px-2 py-1 text-xs bg-background"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                  </select>
                </div>

                {/* Page info */}
                <p className="text-xs text-muted-foreground text-center">
                  {start}–{end} of {total}
                </p>

                {/* Navigation buttons */}
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Page input */}
                  <div className="flex items-center gap-1">
                    
                    <span className="text-xs px-1 text-muted-foreground">
                     {currentPage} / {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </AppShell>
  );
};

export default BatchStatusPage2;