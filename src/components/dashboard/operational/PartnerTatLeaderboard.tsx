/**
 * Transporter TAT Leaderboard
 * Ranked list of partners by avg TAT with mode filter
 */

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plane, Truck, Ship, Train } from "lucide-react";
import type {
  PartnerTatRank,
  TransportMode,
} from "@/mocks/operationalDashboard.mock";
import { formatNumber } from "@/lib/formatters";

interface PartnerTatLeaderboardProps {
  data: PartnerTatRank[];
}

export const PartnerTatLeaderboard = ({
  data
}: PartnerTatLeaderboardProps) => {
  const [modeFilter, setModeFilter] = useState<TransportMode | "ALL">("ALL");

  const safeData = data ?? [];

  const filteredData =
    modeFilter === "ALL"
      ? safeData
      : safeData.filter((p) => p?.mode === modeFilter);

  const getRankStyle = (rank?: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (rank === 2)
      return "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/30";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
    return "bg-muted/20 border-border/50";
  };

  const modes = [
    { key: "ALL", label: "All", icon: null },
    { key: "ROAD", label: "Road", icon: <Truck className="h-3 w-3" /> },
    { key: "AIR", label: "Air", icon: <Plane className="h-3 w-3" /> },
    { key: "SEA", label: "Sea", icon: <Ship className="h-3 w-3" /> },
    { key: "RAIL", label: "Rail", icon: <Train className="h-3 w-3" /> },
  ] as const;


  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Transporters TAT Rank
          </CardTitle>

          <div className="flex flex-wrap gap-1">
            {modes?.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setModeFilter(key as TransportMode | "ALL")}
                title={label}
                className={`px-2 py-1 text-[10px] rounded-md transition-colors flex items-center gap-1 ${modeFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className="hidden md:inline">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Transporters ranked by average TAT. Filter by mode to compare road,
          air, sea, and rail transporters across zones.
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {filteredData?.map((partner, idx) => {
            const rank = partner?.rank ?? idx + 1;
            const avgTat = partner?.avgTat ?? 0;

            return (
              <div
                key={partner?.id ?? `${partner?.partner}-${idx}`}
                className={`flex items-center justify-between p-3 rounded-lg border ${getRankStyle(
                  rank
                )}`}
              >
                {/* Left Section - Rank and Partner Info */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full bg-background/50 text-foreground flex-shrink-0">
                    {rank}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {partner?.partner ?? "--"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {partner?.zone ?? "Unknown"} Zone
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatNumber(partner?.invoiceCount) ?? "--"} Shipments
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span
                        className={`text-[10px] font-bold  ${avgTat === null
                            ? "text-muted-foreground"
                            : avgTat < 0
                              ? "text-green-500"
                              : avgTat === 0
                                ? "text-blue-500"
                                : "text-orange-500"
                          }`}
                      >
                        {avgTat === null
                          ? "--"
                          : avgTat < 0
                            ? `${Math.abs(avgTat)} ${Math.abs(avgTat) === 1 ? "day" : "days"} Ahead`
                            : avgTat === 0
                              ? "On Time"
                              : `${avgTat} ${avgTat === 1 ? "day" : "days"} Delay`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Mode Badge */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {partner?.mode && (
                    <Badge variant="outline" className="text-[10px] whitespace-nowrap">
                      {partner.mode}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-6">
              No partner TAT data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const PartnerTatLeaderboardSkeleton = () => (
  <Card className="glass-card">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);