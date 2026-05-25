import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { StatusChip } from "./StatusChip";
import { DqsChip } from "./DqsChip";
import { Skeleton } from "@/components/ui/skeleton";
import { DataSetItem } from "@/types";
import { SortableTableHead } from "../sortable-table-head";
import { getStorage } from "@/utils/storage";
import { useEffect, useRef, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { usePermission } from "@/utils/userPermission";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface DatasetTableProps {
  datasets: DataSetItem[];
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  isLoading: boolean;
  batch_name: string;
  setBatch_name: (value: string) => void;
  filter_name: string;
  setFilter_name: (value: string) => void;
  filter_customer: string;
  setFilter_customer: (value: string) => void;
  filter_uploadId: string;
  setUploadId: (value: string) => void;
  filter_uploadAt: Date | null;
  setUploadAt: (value: Date | null) => void;
  filter_uploadBy: string;
  setUploadBy: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  filter_dqs: string;
  setDqs: (value: string) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
}

const isDashboardReady = (status: string): boolean => {
  return status === "READY";
};

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export const DatasetTable = ({
  datasets,
  totalRecords,
  pageSize,
  isLoading,
  onPageSizeChange,
  page,
  onPageChange,
  batch_name,
  setBatch_name,
  filter_name,
  setFilter_name,
  filter_customer,
  setFilter_customer,
  filter_uploadId,
  setUploadId,
  filter_uploadAt,
  setUploadAt,
  filter_uploadBy,
  setUploadBy,
  statusFilter,
  onStatusFilterChange,
  filter_dqs,
  setDqs,
  sortBy,
  sortOrder,
  onSort,
}: DatasetTableProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pageInput, setPageInput] = useState<number | "">(1);
  const storage = getStorage();
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);
  const highlightedId = searchParams.get("highlight");
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
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
  useEffect(() => {
    if (highlightedId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedId, datasets]);
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

  const handleRowClick = (uploadId: string) => {
  storage.setItem("lastViewedDataset", uploadId);

  storage.setItem(
    "datasetPageState",
    JSON.stringify({
      page,
      pageSize,
      filter_name,
      filter_uploadId,
      filter_uploadAt,
      filter_uploadBy,
      statusFilter,
      filter_dqs,
      sortBy,
      sortOrder,
    }),
  );

  const basePath = location.pathname.startsWith("/data2")
    ? "/data2"
    : "/data";

  navigate(`${basePath}/datasets/uploads/${uploadId}?new=false`);
};
  const handleOpenDashboards = (e: React.MouseEvent, dataset: DataSetItem) => {
    e.stopPropagation();
    storage.setItem("lastViewedDataset", dataset.id.toString());
    storage.setItem(
      "datasetPageState",
      JSON.stringify({
        page,
        pageSize,
        filter_name,
        filter_uploadId,
        filter_uploadAt,
        filter_uploadBy,
        statusFilter,
        filter_dqs,
        sortBy,
        sortOrder,
      }),
    );
    const tabPermissions = [
      { key: "strategic", perm: "access-strategic-dashboard" },
      { key: "operational", perm: "access-operational-dashboard" },
      { key: "financial", perm: "access-financial-dashboard" },
      { key: "facility", perm: "access-facility-analytics-dashboard" },
      { key: "forecast", perm: "access-forecast-dashboard" },
      { key: "forecast", perm: "access-forecast-dashboard" },
      { key: "recommendations", perm: "access-recommendations-dashboard" },
    ];

    const allowedTab = tabPermissions.find((tab) =>
      hasPermission(tab.perm),
    )?.key;
    navigate(
      `/data/datasets/dashboard/${dataset.id.toString()}/${allowedTab}/${dataset?.customer_type}`,
    );
    storage.setItem("datasetId", dataset.id);
    storage.setItem("customer_id", dataset?.customer_id);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);
  // Handle page input validation and change
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setPageInput("");
      return;
    }

    const num = Number(value);

    // Check for NaN or invalid number
    if (isNaN(num)) {
      setPageInput(page + 1);
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
      setPageInput(page + 1);
    }
  };

  return (
    <NeonCard title="Batches" count={String(totalRecords)}>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border/30">
              <SortableTableHead
                searchValue={batch_name}
                label="Batch"
                sortKey="batch_name"
                onSearch={setBatch_name}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                searchValue={filter_customer}
                label="Customer"
                sortKey="customer_name"
                onSearch={setFilter_customer}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                searchValue={filter_name}
                label="File Name"
                sortKey="name"
                onSearch={setFilter_name}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                label="Uploaded On"
                sortKey="created_date"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                datepicker
                dateValue={filter_uploadAt}
                onDateSelect={setUploadAt}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                searchValue={filter_uploadBy}
                label="Uploaded By"
                sortKey="uploaded_by"
                onSearch={setUploadBy}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <SortableTableHead
                label="Status"
                sortKey="status"
                selectable={true}
                options={status?.map((val) => ({ label: val, value: val }))}
                selectedValue={statusFilter}
                onSelect={onStatusFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
              <th className="text-left text-sm font-medium text-muted-foreground  tracking-wider px-3 py-3">
                Records
              </th>
              <SortableTableHead
                searchValue={filter_dqs}
                label="DQS"
                sortKey="data_quality_score"
                onSearch={setDqs}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
              />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 8 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : datasets?.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No records available
                </td>
              </tr>
            ) : (
              datasets?.map((dataset) => {
                const isHighlighted = highlightedId === dataset.id.toString();

                return (
                  <tr
                    key={dataset.id}
                    ref={isHighlighted ? highlightedRowRef : null}
                    onClick={(e) => {
                      if (isDashboardReady(dataset.status)) {
                        handleOpenDashboards(e, dataset);
                      } else {
                        e.stopPropagation();
                        handleRowClick(dataset.id);
                      }
                    }}
                    className={`border-b border-border/20 hover:bg-primary/5 cursor-pointer transition-colors ${
                      isHighlighted
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-4 max-w-[150px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-foreground truncate block cursor-pointer">
                            {dataset.batch_name || "--"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          {dataset.batch_name || "--"}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-3 py-4 max-w-[150px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-foreground truncate block cursor-pointer">
                            {dataset.customer_name || "--"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {dataset.customer_name || "--"}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-3 py-4 max-w-[150px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-foreground truncate block cursor-pointer">
                            {dataset.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {dataset.name}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(dataset.uploadedAt)}
                      </span>
                    </td>
                    <td className="px-3 py-4 max-w-[150px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-foreground truncate block cursor-pointer">
                            {dataset.uploadedBy}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {dataset.uploadedBy}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-3 py-4">
                      <StatusChip status={dataset.status} />
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm">
                        <span className="text-foreground font-medium">
                           {dataset.totalRecords.toLocaleString("en-IN")}
                        </span>
                        {dataset.errorRecords != 0 && (
                          <span className="text-muted-foreground mx-1">|</span>
                        )}
                        <span className="text-destructive">
                          {dataset.errorRecords != 0
                            ? dataset.errorRecords.toLocaleString("en-IN")
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <DqsChip score={dataset.dataQualityScore} />
                    </td>
                  </tr>
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
                onPageChange(1);
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            {start}–{end} of {totalRecords}
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
            {/* Jump to page */}
           
            <span className="text-xs px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === totalPages}
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

export const DatasetTableSkeleton = () => (
  <NeonCard title="Batches">
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </NeonCard>
);
