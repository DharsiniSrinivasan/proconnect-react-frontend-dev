import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HighDensityPin } from "@/mocks/facilityDashboard.mock";
import { formatNumber } from "@/lib/formatters";

interface HighDensityPinsCardProps {
  data: HighDensityPin[];
}



export const HighDensityPinsCard = ({ data }: HighDensityPinsCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const safeData = Array.isArray(data) ? data : [];

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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          High-Density Pincodes
        </CardTitle>

        {hasPagination && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded p-1 hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-xs text-muted-foreground">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded p-1 hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">
          Top 10 by volume with cross-region %.
        </p>
        {paginatedData.length > 0 ? (
          <div className="space-y-3">
            {paginatedData?.map((pin) => (
              <div
                key={pin.rank}
                className="flex items-center justify-between rounded-lg border p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">
                    {pin.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {pin.pincode}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {pin.region}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {formatNumber(pin.billedQty)}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        pin.crossRegPercent > 0
                          ? "text-warning"
                          : "text-muted-foreground",
                      )}
                    >
                      {pin.crossRegPercent}% Cross-Reg
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {pin.tierRec.replace(" Hub", "").replace(" WH", "")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No high-density pincode data available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const HighDensityPinsCardSkeleton = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <div className="h-5 w-48 animate-pulse rounded bg-muted" />
    </CardHeader>
    <CardContent className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
      ))}
    </CardContent>
  </Card>
);
