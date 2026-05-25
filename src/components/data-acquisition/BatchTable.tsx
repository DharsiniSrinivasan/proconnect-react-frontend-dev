import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { StatusChip } from "./StatusChip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataSetItem } from "@/types";
import { SortableTableHead } from "../sortable-table-head";
import { getStorage } from "@/utils/storage";
import { useEffect, useRef, useState } from "react";

interface BatchTableProps {
  batches: DataSetItem[];
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  // Filter props
  filter_batchName: string;
  setFilter_batchName: (value: string) => void;
  filter_batchId: string;
  setBatchId: (value: string) => void;
  filter_createdAt: Date | null;
  setCreatedAt: (value: Date | null) => void;
  filter_createdBy: string;
  setCreatedBy: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
}

const isDashboardReady = (status: string): boolean => {
  return status === "READY";
};

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

// Group datasets by batch
interface BatchGroup {
  batchId: string;
  batchName: string;
  datasets: DataSetItem[];
  totalFiles: number;
  totalRecords: number;
  errorRecords: number;
  createdAt: string;
  createdBy: string;
  status: string; // Overall batch status
}

export const BatchTable = ({
  batches,
  totalRecords,
  pageSize,
  onPageSizeChange,
  page,
  onPageChange,
  filter_batchName,
  setFilter_batchName,
  filter_batchId,
  setBatchId,
  filter_createdAt,
  setCreatedAt,
  filter_createdBy,
  setCreatedBy,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  sortOrder,
  onSort,
}: BatchTableProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pageInput, setPageInput] = useState<number | "">(1);
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(
    new Set(),
  );
  const storage = getStorage();
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);
  const highlightedId = searchParams.get("highlight");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const status = [
    "Ready",
    "Failed",
    "Analysing",
    "Initiate",
    "Queue",
    "Processing",
  ];

  // Group datasets by batchId with dummy data
  const groupedBatches: BatchGroup[] = Object.values(
    batches.reduce(
      (acc, dataset: any, index) => {
        // Generate dummy batch data if not present
        const batchKey =
          dataset.batchId || `batch-${Math.floor(index / 2) + 1}`;
        const batchId =
          dataset.batchId ||
          `BATCH${String(Math.floor(index / 2) + 1).padStart(4, "0")}`;
        const batchName =
          dataset.batchName ||
          `Q${Math.ceil((new Date(dataset.uploadedAt).getMonth() + 1) / 3)} ${new Date(dataset.uploadedAt).getFullYear()} Import Batch`;

        if (!acc[batchKey]) {
          acc[batchKey] = {
            batchId: batchId,
            batchName: batchName,
            datasets: [],
            totalFiles: 0,
            totalRecords: 0,
            errorRecords: 0,
            createdAt: dataset.uploadedAt,
            createdBy: dataset.uploadedBy,
            status: dataset.status,
          };
        }

        acc[batchKey].datasets.push(dataset);
        acc[batchKey].totalFiles += 1;
        acc[batchKey].totalRecords += dataset.totalRecords;
        acc[batchKey].errorRecords += dataset.errorRecords;

        // Update created date to earliest
        if (new Date(dataset.uploadedAt) < new Date(acc[batchKey].createdAt)) {
          acc[batchKey].createdAt = dataset.uploadedAt;
        }

        // Update status to show worst case (Failed > Processing > Ready)
        const statusPriority = {
          FAILED: 3,
          PROCESSING: 2,
          ANALYSING: 2,
          QUEUE: 2,
          READY: 1,
          INITIATE: 1,
        };
        const currentPriority = statusPriority[acc[batchKey].status] || 0;
        const newPriority = statusPriority[dataset.status] || 0;
        if (newPriority > currentPriority) {
          acc[batchKey].status = dataset.status;
        }

        return acc;
      },
      {} as Record<string, BatchGroup>,
    ),
  );

  useEffect(() => {
    if (highlightedId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedId, batches]);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" &&
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== page
      ) {
        onPageChange(pageInput);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput, page, onPageChange]);

  const toggleBatchExpansion = (batchId: string) => {
    setExpandedBatches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(batchId)) {
        newSet.delete(batchId);
      } else {
        newSet.add(batchId);
      }
      return newSet;
    });
  };

  const handleBatchClick = (batch: BatchGroup) => {
    // If batch has only one file, navigate directly to it
    if (batch.datasets.length === 1) {
      const dataset = batch.datasets[0];
      storage.setItem("lastViewedDataset", dataset.id.toString());
      storage.setItem(
        "datasetPageState",
        JSON.stringify({
          page,
          pageSize,
          filter_batchName,
          filter_batchId,
          filter_createdAt,
          filter_createdBy,
          statusFilter,
          sortBy,
          sortOrder,
        }),
      );
      navigate(`/data/datasets/batches/${dataset.id}?new=false`);
    } else {
      // Otherwise, expand to show all files
      toggleBatchExpansion(batch.batchId);
    }
  };

  const handleDatasetClick = (e: React.MouseEvent, dataset: DataSetItem) => {
    e.stopPropagation();
    storage.setItem("lastViewedDataset", dataset.id.toString());
    storage.setItem(
      "datasetPageState",
      JSON.stringify({
        page,
        pageSize,
        filter_batchName,
        filter_batchId,
        filter_createdAt,
        filter_createdBy,
        statusFilter,
        sortBy,
        sortOrder,
      }),
    );
    navigate(`/data/datasets/uploads/${dataset.id}?new=false`);
  };

  const handleOpenDashboards = (e: React.MouseEvent, batch: BatchGroup) => {
    e.stopPropagation();
    // For now, navigate to the first dataset's dashboard
    // You might want to create a batch-level dashboard view
    const firstDataset = batch.datasets[0];
    storage.setItem("lastViewedDataset", firstDataset.id.toString());
    storage.setItem(
      "datasetPageState",
      JSON.stringify({
        page,
        pageSize,
        filter_batchName,
        filter_batchId,
        filter_createdAt,
        filter_createdBy,
        statusFilter,
        sortBy,
        sortOrder,
      }),
    );
    navigate(`/data/datasets/dashboard/${firstDataset.id.toString()}`);
    storage.setItem("datasetId", firstDataset.id);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setPageInput("");
      return;
    }
    const num = Number(value);
    if (isNaN(num)) {
      setPageInput(page + 1);
      return;
    }
    if (num < 1) {
      setPageInput(1);
    } else if (num > totalPages) {
      setPageInput(totalPages);
    } else {
      setPageInput(num);
    }
  };

  const handlePageInputBlur = () => {
    if (pageInput === "" || isNaN(pageInput as number)) {
      setPageInput(page + 1);
    }
  };

  return (
    <NeonCard title="Batches">
      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border/30">
              <th className="w-10"></th>
              <SortableTableHead
                searchValue={filter_batchName}
                label="BATCH NAME"
                sortKey="batch_name"
                onSearch={setFilter_batchName}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                searchValue={filter_batchId}
                label="BATCH ID"
                sortKey="batch_id"
                onSearch={setBatchId}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                label="CREATED AT"
                sortKey="created_date"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                datepicker
                dateValue={filter_createdAt}
                onDateSelect={setCreatedAt}
                className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                searchValue={filter_createdBy}
                label="CREATED BY"
                sortKey="created_by"
                onSearch={setCreatedBy}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                label="STATUS"
                sortKey="status"
                selectable={true}
                options={status?.map((val) => ({ label: val, value: val }))}
                selectedValue={statusFilter}
                onSelect={onStatusFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3">
                Files
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3">
                Records
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3">
                Dashboards
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedBatches?.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No batches available
                </td>
              </tr>
            ) : (
              groupedBatches?.map((batch) => {
                const isExpanded = expandedBatches.has(batch.batchId);
                const isHighlighted = highlightedId === batch.batchId;
                const hasMultipleFiles = batch.datasets.length > 1;

                return (
                  <>
                    {/* Batch Row */}
                    <tr
                      key={batch.batchId}
                      ref={isHighlighted ? highlightedRowRef : null}
                      onClick={() => handleBatchClick(batch)}
                      className={`border-b border-border/20 hover:bg-primary/5 cursor-pointer transition-colors ${
                        isHighlighted
                          ? "bg-primary/10 ring-2 ring-primary/30"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-4">
                        {hasMultipleFiles && (
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm font-medium text-foreground">
                          {batch.batchName}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-muted-foreground font-mono">
                          {batch.batchId}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(batch.createdAt)}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-muted-foreground">
                          {batch.createdBy}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <StatusChip status={batch.status} />
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-foreground font-medium">
                          {batch.totalFiles}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm">
                          <span className="text-foreground font-medium">
                            {batch.totalRecords.toLocaleString()}
                          </span>
                          {batch.errorRecords !== 0 && (
                            <>
                              <span className="text-muted-foreground mx-1">
                                |
                              </span>
                              <span className="text-destructive">
                                {batch.errorRecords.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {isDashboardReady(batch.status) ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => handleOpenDashboards(e, batch)}
                                className="text-primary hover:text-primary hover:bg-primary/10 neon-glow"
                              >
                                <LayoutGrid className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open dashboards for this batch</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled
                                className="text-muted-foreground opacity-50 cursor-not-allowed"
                              >
                                <LayoutGrid className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Batch not ready for dashboards</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (batch.datasets.length === 1) {
                              handleDatasetClick(e, batch.datasets[0]);
                            } else {
                              const dataset = batch.datasets[0];
                              storage.setItem(
                                "lastViewedDataset",
                                dataset.id.toString(),
                              );
                              storage.setItem(
                                "datasetPageState",
                                JSON.stringify({
                                  page,
                                  pageSize,
                                  filter_batchName,
                                  filter_batchId,
                                  filter_createdAt,
                                  filter_createdBy,
                                  statusFilter,
                                  sortBy,
                                  sortOrder,
                                }),
                              );
                              navigate(`/data/batches/${dataset.id}?new=false`);
                            }
                          }}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Batch
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded Dataset Rows */}
                    {isExpanded &&
                      hasMultipleFiles &&
                      batch?.datasets?.map((dataset) => (
                        <tr
                          key={dataset.id}
                          onClick={(e) => handleDatasetClick(e, dataset)}
                          className="border-b border-border/10 hover:bg-primary/5 cursor-pointer transition-colors bg-muted/20"
                        >
                          <td className="px-3 py-3"></td>
                          <td className="px-3 py-3 pl-8">
                            <span className="text-sm text-muted-foreground">
                              {dataset.name}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-xs text-muted-foreground font-mono">
                              {dataset.uploadId}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(dataset.uploadedAt)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-xs text-muted-foreground">
                              {dataset.uploadedBy}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <StatusChip status={dataset.status} />
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-xs">
                              <span className="text-foreground">
                                {dataset.totalRecords.toLocaleString()}
                              </span>
                              {dataset.errorRecords !== 0 && (
                                <>
                                  <span className="text-muted-foreground mx-1">
                                    |
                                  </span>
                                  <span className="text-destructive">
                                    {dataset.errorRecords.toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3"></td>
                          <td className="px-5 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDatasetClick(e, dataset)}
                              className="text-primary hover:text-primary hover:bg-primary/10 h-7 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
     {totalRecords > 10 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border/30 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            {page * pageSize + 1} -{" "}
            {Math.min((page + 1) * pageSize, totalRecords)} of {totalRecords}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page + 1 === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </NeonCard>
  );
};

export const BatchTableSkeleton = () => (
  <NeonCard title="Batches">
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </NeonCard>
);
