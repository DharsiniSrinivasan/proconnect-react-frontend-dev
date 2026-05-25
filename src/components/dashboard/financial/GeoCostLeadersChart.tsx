import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { GeoCostLeader } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface GeoCostLeadersChartProps {
  data: GeoCostLeader[];
}

export const GeoCostLeadersChart = ({ data }: GeoCostLeadersChartProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const safeData = Array.isArray(data) ? data : [];

  const totalPages = Math.max(1, Math.ceil(safeData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = safeData.slice(startIndex, endIndex);
  const hasPagination = safeData.length > itemsPerPage;

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <Card className="bg-gradient-to-br from-background to-muted/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-semibold">
            Geo Freight Cost Leaders
          </CardTitle>
          {hasPagination && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded p-1 hover:bg-accent disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded p-1 hover:bg-accent disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">
          Avg freight cost/unit by geo corridor.
        </p>

        {/* Legend */}
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-gradient-to-r from-violet-400 to-violet-600" />
            Within budget
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
            Over budget
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-0.5 bg-foreground/50" />
            Budget target
          </span>
        </div>

        {paginatedData.length > 0 ? (
          <div className="space-y-5">
            {paginatedData.map((item, idx) => {
              const underBudget = item.budget_gap >= 0;
              const max = Math.max(item.cost, item.budget, 1);
              const costPct = (item.cost / max) * 100;
              const budgetPct = (item.budget / max) * 100;

              return (
                <div key={idx} className="border-l-2 border-violet-400/40 pl-3">
                  {/* Header: Geo + Cost */}
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-medium text-foreground">
                      {item.geo}{" "}
                      <span className="text-muted-foreground">
                        · {item.pattern}
                      </span>
                    </div>
                    <div className="text-base font-semibold text-violet-500">
                      {formatCurrency(item.cost)}
                    </div>
                  </div>

                  {/* Budget comparison row */}
                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">
                      Budget:{" "}
                      <span className="text-foreground/80">
                        {formatCurrency(item.budget)}
                      </span>
                    </span>
                    <span
                      className={`font-medium ${
                        underBudget ? "text-green-600" : "text-red-500"
                      }`}
                      title={
                        underBudget
                          ? "Saved vs budget"
                          : "Exceeded budget"
                      }
                    >
                      {underBudget ? "↓ Saved " : "↑ Over "}
                      {formatCurrency(Math.abs(item.budget_gap))}{" "}
                      <span className="text-muted-foreground">
                        ({((item.cost / item.budget) * 100).toFixed(0)}% of budget)
                      </span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    {/* Cost bar */}
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                        underBudget
                          ? "bg-gradient-to-r from-violet-400 to-violet-600"
                          : "bg-gradient-to-r from-orange-400 to-red-500"
                      }`}
                      style={{ width: `${costPct}%` }}
                    />
                    {/* Budget threshold tick */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground/40"
                      style={{ left: `${budgetPct}%` }}
                      title="Budget threshold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No geo freight cost leader data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const GeoCostLeadersChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-48" />
    </CardHeader>
    <CardContent className="space-y-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </CardContent>
  </Card>
);
