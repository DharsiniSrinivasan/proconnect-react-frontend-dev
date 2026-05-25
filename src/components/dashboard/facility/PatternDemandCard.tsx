import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PatternDemandApiPoint } from "@/mocks/facilityDashboard.mock";
import { formatNumber } from "@/lib/formatters";

interface PatternDemandCardProps {
  data: PatternDemandApiPoint[];
}



export const PatternDemandCard = ({ data }: PatternDemandCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 pincodes per page

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
            Pattern Demand by Pincode
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
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground mb-2">
          Patterns split with tier recommendation.
        </p>
        {paginatedData.length > 0 ? (
          paginatedData?.map((point) => (
            <div
              key={point.pincode}
              className="p-3 rounded-lg bg-muted/20 border border-border/50"
            >
              <div className="mb-2">
                  <span className="text-sm font-medium text-foreground">
                   {point.facilityName|| "--"}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                  {point.facilityCode||"--"}
                  </Badge>
                </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {point.pincode}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {point.geo}
                  </Badge>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    point.tierRec === "Mother Hub" &&
                      "bg-primary/20 text-primary border-primary/30",
                    point.tierRec === "Satellite Hub" &&
                      "bg-accent/20 text-accent-foreground border-accent/30",
                    point.tierRec === "Satellite WH" &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {point.tierRec}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs flex-wrap">
                {point?.labelConfigArray?.map((slab) => {
                  const value = point[slab.key as keyof typeof point] as number;

                  return (
                    <span key={slab?.key} className="text-muted-foreground">
                      {slab?.description}:{" "}
                      <span className="text-foreground font-medium">
                        {formatNumber(value)}
                      </span>
                    </span>
                  );
                })}

                <span className="text-muted-foreground">
                  Total:{" "}
                  <span className="text-primary font-medium">
                    {formatNumber(point.total)}
                  </span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground">
            No pattern demand data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PatternDemandCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-44 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </CardContent>
  </Card>
);
