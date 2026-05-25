import { NeonCard } from "@/components/ui/neon-card";
import {
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { TableCell, TableHead, TableRow } from "../ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface ErrorTypeSummaryRow {
  id: string;
  errorType: string;
  count: number;
}

interface ErrorTypeSummaryProps {
  errors: ErrorTypeSummaryRow[];
  page: number;
  totalRecords: number;
  isLoading: boolean;
  isDownloading: boolean;
  handleDownload: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  searchValue: string;
  onSearch: (value: string) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
}

export const ErrorTypeSummary = ({
  errors,
  totalRecords,
  pageSize,
  isLoading,
  isDownloading,
  handleDownload,
  onPageSizeChange,
  page,
  onPageChange,
  searchValue,
  onSearch,
  sortBy,
  sortOrder,
  onSort,
}: ErrorTypeSummaryProps) => {
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);
  return (
    <NeonCard
      title={isMobile ? "Error Summary" : "Validations Error Type Summary"}
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading || errors.length === 0}
          className="flex items-center gap-1.5 text-xs h-8 hover:text-primary-foreground"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Errors</span>
            </>
          )}
        </Button>
      }
    >
      
      <div className="hidden md:block overflow-x-auto -mx-5">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-sm font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                S.No
              </th>
              <TableHead className="text-left text-sm font-medium text-muted-foreground tracking-wider px-5 py-3">
                Error type
              </TableHead>
              <TableHead className="text-left text-sm font-medium text-muted-foreground tracking-wider px-5 py-3">
                Count
              </TableHead>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 3 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : errors.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center">
                  <p className="text-muted-foreground">No error types found.</p>
                </td>
              </tr>
            ) : (
              errors?.map((error, index) => (
                <tr
                  key={error.id}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm text-foreground">{index + 1}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-foreground">
                      {error.errorType}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold">
                      {error?.count?.toLocaleString() || "-"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3 px-2">
        {isLoading ? (
          Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
            <div key={rowIndex} className="space-y-2 p-4 bg-muted/30 rounded-lg">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : errors.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No error types found.</p>
          </div>
        ) : (
           <div className="space-y-3">
      {errors.map((error) => (
        <div
          key={error.id}
          className="bg-background-primary border border-border-tertiary rounded-lg p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Error type
              </p>
              <p className="text-xs font-medium text-text-primary break-words">
                {error.errorType || "-"}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Count
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {error.count.toLocaleString() || "-"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
        )}
      </div>
    </NeonCard>
  );
};

export const ErrorTypeSummarySkeleton = () => (
  <NeonCard title="Error Type Summary">
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  </NeonCard>
);