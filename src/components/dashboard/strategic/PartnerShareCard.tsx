/**
 * Partner Market Share - Enhanced list with detailed metrics
 */
import { formatNumber } from "@/lib/formatters";
import { Users, BadgePercent, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PartnerShare {
  code: string;
  name: string;
  freightShare: number;
  volumeShare: number;
  switchOppValue: number;
}

interface PartnerShareCardProps {
  data: PartnerShare[];
}

const generateRandomColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 30);
    const lightness = 45 + Math.floor(Math.random() * 20);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};


export const PartnerShareCard = ({ data }: PartnerShareCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const safeData = Array.isArray(data) ? data : [];
  const hasData = safeData.length > 0;
  const totalPages = Math.ceil(safeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = safeData.slice(startIndex, endIndex);
  const hasPagination = safeData.length > itemsPerPage;
  const efficiencyData = safeData.map((p) => ({
    ...p,
    efficiency: (p?.volumeShare ?? 0) - (p?.freightShare ?? 0),
  }));

  const mostEfficient =
    efficiencyData.reduce(
      (a, b) => (a.efficiency > b.efficiency ? a : b),
      efficiencyData[0],
    ) ?? null;

  const leastEfficient =
    efficiencyData.reduce(
      (a, b) => (a.efficiency < b.efficiency ? a : b),
      efficiencyData[0],
    ) ?? null;

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="glass-card neon-border p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Transporters Market Share
          </h3>
        </div>
      </div>

      {/* Card description */}
      <p className="text-xs text-muted-foreground mb-4">
Compares freight and unit share per transporter to reveal efficiency gaps and utilization mismatches.
      </p>

      {/* Main */}
      {hasData ? (
        <div className="flex-1 flex flex-col">
        {/* Summary pills */}
<div className="flex items-stretch gap-4 mb-3 rounded-lg bg-muted/30 border border-border/40">
  {/* Left section - Total count */}
  <div className="flex flex-col justify-center px-4 py-3">
    <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
      Total Transporters
    </span>
    <span className="text-lg font-bold text-foreground font-mono">
      {formatNumber(safeData.length)}
    </span>
  </div>

  {/* Divider */}
  <div className="w-px bg-border/50" />

  {/* Right section - Performance metrics */}
  <div className="flex-1 grid grid-cols-2 gap-4 px-4 py-3 text-xs">
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">
        Most Efficient
      </p>
      <p className="font-semibold text-success truncate">
        {mostEfficient?.name ?? "--"}
      </p>
      <p className="text-[10px] text-muted-foreground">
        High vol, low freight cost
      </p>
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">
        Needs Review
      </p>
      <p className="font-semibold text-warning truncate">
        {leastEfficient?.name ?? "--"}
      </p>
      <p className="text-[10px] text-muted-foreground">
        High freight cost, low vol
      </p>
    </div>
  </div>
</div>

          {/* Partner list */}
          <div className="space-y-2 flex-1">
            {/* Column Headers */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-semibold mb-1 pb-1 border-b border-border/30">
              <div className="w-2.5" />
              <span className="flex-1">Transporter</span>
              <span className="w-16 text-center">
                Freight <br /> Share
              </span>
              <span className="w-16 text-center">
                Unit <br /> Share
              </span>
              <span className="w-16 text-right">Tat</span>
            </div>

            {paginatedData.map((partner, i) => {
              const actualIndex = startIndex + i;
              const efficiency =
                (partner?.volumeShare ?? 0) - (partner?.freightShare ?? 0);
              const isEfficient = efficiency > 0;

              return (
                <div key={partner?.code ?? actualIndex}>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isEfficient ? "bg-success" : "bg-warning"
                      }`}
                    />
                    <span className="font-medium text-foreground flex-1 truncate">
                      {partner?.name ?? "—"}
                    </span>
                    <div className="w-16 flex flex-col items-center">
                      <span className="font-mono text-foreground">
                        {partner?.freightShare ?? 0}%
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        of freight
                      </span>
                    </div>
                    <div className="w-16 flex flex-col items-center">
                      <span className="font-mono text-muted-foreground">
                        {partner?.volumeShare ?? 0}%
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        of volume
                      </span>
                    </div>
                    <div className="w-16 flex flex-col items-end">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isEfficient ? "text-success" : "text-warning"
                        }`}
                      >
                        {isEfficient ? "+" : ""}
                        {efficiency.toFixed(2)}%
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {isEfficient ? "efficient" : "review"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 ml-4 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isEfficient ? "bg-success" : "bg-warning"
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(efficiency) * 5, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasPagination && (
            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border/30">
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
      ) : (
        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
          No partner share data available
        </div>
      )}

    

      <div className="mt-2 space-y-1">
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <BadgePercent className="w-3 h-3" />
          Efficiency = Unit Share − Freight Share
        </p>
        <p className="text-[10px] text-muted-foreground pl-4">
          Positive efficiency indicates higher unit contribution relative to
          freight costs
        </p>
      </div>
    </div>
  );
};

export const PartnerShareCardSkeleton = () => (
  <div className="glass-card p-5 h-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="skeleton-glow w-4 h-4 rounded" />
      <div className="skeleton-glow h-4 w-32 rounded" />
    </div>
    <div className="skeleton-glow h-3 w-3/4 rounded mb-4" />
    <div className="flex gap-2 mb-3">
      <div className="skeleton-glow h-10 w-24 rounded-lg" />
      <div className="skeleton-glow h-10 w-28 rounded-lg" />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="skeleton-glow h-4 w-full rounded" />
          <div className="skeleton-glow h-1 w-3/4 rounded ml-4" />
        </div>
      ))}
    </div>
    <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <div className="skeleton-glow h-3 w-20 rounded" />
        <div className="skeleton-glow h-4 w-16 rounded" />
        <div className="skeleton-glow h-3 w-24 rounded" />
      </div>
      <div className="space-y-1">
        <div className="skeleton-glow h-3 w-20 rounded" />
        <div className="skeleton-glow h-4 w-16 rounded" />
        <div className="skeleton-glow h-3 w-24 rounded" />
      </div>
    </div>
  </div>
);
