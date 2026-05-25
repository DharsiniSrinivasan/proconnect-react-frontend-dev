import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UploadErrorRow } from "@/mocks/uploadStatus.mock";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { SortableTableHead } from "../sortable-table-head";
import { useDetailStore } from "@/stores/dataSetStore";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from "../ui/table";

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface ErrorsTableProps {
  errors: UploadErrorRow[];
  page: number;
  totalRecords: number;
  isLoading: boolean;
  isDownloading: boolean;
  handleDownload: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  // Filter props
  rowNo: string;
  setRowNo: (value: string) => void;
  errorType: string;
  setErrorType: (value: string) => void;
  fieldName: string;
  setFieldName: (value: string) => void;
  fieldValue: string;
  setFieldValue: (value: string) => void;
  fix: string;
  setFix: (value: string) => void;
  severity: string;
  setSeverity: (value: string) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
}

export const ErrorsTable = ({
  errors,
  totalRecords,
  pageSize,
  isLoading,
  isDownloading,
  handleDownload,
  onPageSizeChange,
  page,
  onPageChange,
  rowNo,
  setRowNo,
  errorType,
  setErrorType,
  fieldName,
  setFieldName,
  fieldValue,
  setFieldValue,
  fix,
  setFix,
  sortBy,
  sortOrder,
  onSort,
}: ErrorsTableProps) => {
  const { errorOptions } = useDetailStore();
  const [pageInput, setPageInput] = useState<number | "">(1);
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

  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);
  return (
    <NeonCard
      title="Validation Errors"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading || totalRecords === 0}
          className="flex items-center gap-1.5 text-xs h-8 hover:text-primary-foreground"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export Excel
            </>
          )}
        </Button>
      }
    >
      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border/30">
              <SortableTableHead
                searchValue={rowNo}
                label="Row no"
                sortKey="row_number"
                onSearch={setRowNo}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              />

              <SortableTableHead
                label="Error type"
                sortKey="error_type"
                selectable={true}
                options={errorOptions?.map((user) => ({
                  label: user,
                  value: user,
                }))}
                selectedValue={errorType}
                onSelect={setErrorType}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              />
              <SortableTableHead
                searchValue={fieldName}
                label="Field name"
                sortKey="field_name"
                onSearch={setFieldName}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              />
              <SortableTableHead
                searchValue={fieldValue}
                label="Field value"
                sortKey="field_value"
                onSearch={setFieldValue}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              />

              <SortableTableHead
                searchValue={fix}
                label="Suggested fix"
                sortKey="suggested_fix"
                onSearch={setFix}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              />

              {/* <SortableTableHead
                label="Severity"
                sortKey="severity"
                selectable={true}
                options={status?.map((user) => ({ label: user, value: user }))}
                selectedValue={severity}
                onSelect={setSeverity}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3"
              /> */}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : errors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-muted-foreground">
                    No errors found in this upload.
                  </p>
                </td>
              </tr>
            ) : (
              errors.map((error) => (
                <tr
                  key={error.id}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-foreground">
                      {error.rowNo?.toLocaleString() ?? "-"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm text-foreground">
                      {error.errorType ?? "--"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm font-mono text-primary">
                      {error.fieldName ?? "--"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      {error.fieldValue || (
                        <em className="text-destructive">empty</em>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm text-muted-foreground">
                      {error.suggestedFix}
                    </span>
                  </td>
                  {/* <td className="px-5 py-4">
                      <StatusChip status={error.severity} />
                    </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onFocus={(e) => e.target.select()}
              className="w-14 h-7 text-center text-xs border rounded bg-background"
            />
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

export const ErrorsTableSkeleton = () => (
  <NeonCard title="Validation Errors">
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  </NeonCard>
);
