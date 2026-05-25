import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DemandClusterPoint } from "@/mocks/facilityDashboard.mock";
import { formatNumber } from "@/lib/formatters";

interface DemandClustersCardProps {
  data: DemandClusterPoint[];
}



export const DemandClustersCard = ({ data }: DemandClustersCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 clusters per page

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
            Demand Clusters
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
          Region–facility demand ranking (High/Medium/Low)
        </p>
        {paginatedData.length > 0 ? (
          paginatedData?.map((cluster) => (
            <div
              key={cluster.clusterId}
              className="p-3 rounded-lg bg-muted/20 border border-border/50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {cluster.region}
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      cluster.density === "High" &&
                        "bg-primary/20 text-primary",
                      cluster.density === "Medium" &&
                        "bg-accent/20 text-accent",
                      cluster.density === "Low" &&
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {cluster.density}
                  </Badge>
                </div>
                {cluster.assignedFacility ? (
                  <span className="text-xs text-emerald-400">
                    {cluster.assignedFacility}
                  </span>
                ) : (
                  <span className="text-xs text-amber-400">Unassigned</span>
                )}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  Pincodes:{" "}
                  <span className="text-foreground font-medium">
                    {cluster.pincodes}
                  </span>
                </span>
                <span>
                  Units:{" "}
                  <span className="text-foreground font-medium">
                    {formatNumber(cluster.totalVol)}
                  </span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground">
            No demand cluster data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DemandClustersCardSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-32 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </CardContent>
  </Card>
);
