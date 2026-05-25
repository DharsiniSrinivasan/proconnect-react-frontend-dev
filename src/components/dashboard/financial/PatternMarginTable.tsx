import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PatternMarginRow } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface PatternMarginTableProps {
  data: PatternMarginRow[];
}



export const PatternMarginTable = ({ data }: PatternMarginTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 patterns per page

  const safeData = Array.isArray(data) ? data : [];

  // Pagination calculations
  const totalPages = Math.ceil(safeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = safeData.slice(startIndex, endIndex);
  const hasPagination = safeData.length > itemsPerPage;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            Per Pattern Margin
          </CardTitle>

          {hasPagination && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>

              <span className="text-xs text-muted-foreground font-mono">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">
          Invoice value minus landed freight cost per band.
        </p>
        {paginatedData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground text-xs">
                  Pattern
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Budget
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Freight Cost
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Margin %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData?.map((row, idx) => (
                <TableRow key={idx} className="border-border/30">
                  <TableCell className="text-foreground text-xs font-medium">
                    {row.pattern}
                  </TableCell>
                  <TableCell className="text-foreground text-xs text-right">
                    {formatCurrency(row.budget)}
                  </TableCell>
                  <TableCell className="text-foreground text-xs text-right">
                    {formatCurrency(row.freight)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        row.status === "healthy" &&
                          "bg-emerald-500/20 text-emerald-500",
                        row.status === "warning" &&
                          "bg-amber-500/20 text-amber-500",
                        row.status === "critical" &&
                          "bg-pink-500/20 text-pink-500",
                      )}
                    >
                      {row.marginPercent.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground">
            No pattern margin data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PatternMarginTableSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-32 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full bg-muted/30" />
        ))}
      </div>
    </CardContent>
  </Card>
);
