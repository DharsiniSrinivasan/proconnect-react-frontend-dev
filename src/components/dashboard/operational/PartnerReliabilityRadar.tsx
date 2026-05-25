/**
 * Partner Reliability Chart
 * Shows % vol on-time by FFC/BDC with low-performer alerts
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Shield, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PartnerReliability } from "@/mocks/operationalDashboard.mock";

interface PartnerReliabilityRadarProps {
  data: PartnerReliability[];
}

export const PartnerReliabilityRadar = ({
  data,
}: PartnerReliabilityRadarProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alertPage, setAlertPage] = useState(1);

  const itemsPerPage = 20; // partners per chart page
  const alertsPerPage = 3; // low-performer alerts per page

  const safeData = data ?? [];
  const lowPerformers = safeData.filter((d) => d?.isLowPerformer);

  // Sort by on-time percentage (lowest first to highlight issues)
  const sortedData = [...safeData].sort(
    (a, b) => (a?.onTimePct ?? 0) - (b?.onTimePct ?? 0),
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const hasPagination = sortedData.length > itemsPerPage;

  // ── Alert pagination ──────────────────────────────────────────────────────
  const totalAlertPages = Math.ceil(lowPerformers.length / alertsPerPage);
  const alertStart = (alertPage - 1) * alertsPerPage;
  const paginatedAlerts = lowPerformers.slice(
    alertStart,
    alertStart + alertsPerPage,
  );
  const hasAlertPagination = lowPerformers.length > alertsPerPage;

  // Prepare chart data
  const chartData = paginatedData?.map((d, idx) => ({
    partner: d?.partner ?? `P${idx + 1}`,
    onTime: d?.onTimePct ?? 0,
    type: d?.type ?? "NA",
    isLow: d?.isLowPerformer ?? false,
  }));

  // Color based on performance
  const getBarColor = (value: number, isLow: boolean) => {
    if (isLow) return "hsl(var(--pink))";
    if (value > 90) return "#52C41A";           // Excellent
    if (value >= 76 && value <= 90) return "#1890FF";  // Good
    if (value >= 61 && value <= 75) return "#FA8C16";  // Fair
    return "hsl(var(--pink))";                 // Poor
  };

  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        {/* ── Title row ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
            <Shield className="h-4 w-4 text-chart-2" />
            Transporter Reliability
            {lowPerformers.length > 0 && (
              <Badge variant="outline" className="text-[10px] ml-2">
                {lowPerformers.length} low
              </Badge>
            )}
          </CardTitle>

          {hasPagination && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}
        </div>

        {/* ── Description ──────────────────────────────────────────────────── */}
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Displays the on-time delivery percentage for each transporter .
          Transporters are sorted from lowest to highest performance.
          Transporters flagged as low performers are highlighted in red and
          listed in the alerts section below.
        </p>
      </CardHeader>

      <CardContent>
        {safeData.length > 0 ? (
          <>
            {/* ── Bar chart ──────────────────────────────────────────────── */}
            <div className="h-[350px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
                  barCategoryGap="5%"
                  barSize={30}
                  maxBarSize={30}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />

                  <XAxis
                    dataKey="partner"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    label={{
                      value: "",
                      position: "insideBottom",
                      offset: -10,
                      style: {
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                        fontWeight: 500,
                      },
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    label={{
                      value: "On-Time Delivery (%)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -2,
                      style: {
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                        fontWeight: 500,
                      },
                    }}
                  />

                  {/* 75 % reference line via Recharts ReferenceLine */}
                  {/* <ReferenceLine
                    y={75}
                    stroke="hsl(var(--chart-3))"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    opacity={0.7}
                    label={{
                      value: "75% threshold",
                      position: "insideTopRight",
                      fontSize: 10,
                      fill: "hsl(var(--chart-3))",
                    }}
                  /> */}

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, _name: string, props: any) => {
                      const type = props?.payload?.type ?? "N/A";
                      return [
                        <div key="tooltip" className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Type: {type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            On-Time:{" "}
                            <span className="font-semibold">{value}%</span>
                          </div>
                        </div>,
                        "",
                      ];
                    }}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
                  />

                  <Bar dataKey="onTime" radius={[4, 4, 0, 0]}>
                    {chartData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.onTime, entry.isLow)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Performance legend ─────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs flex-wrap">
              {[
                { color: "#52C41A", label: "Excellent (>90%)" },
                { color: "#1890FF", label: "Good (76–90%)" },
                { color: "#FA8C16", label: "Fair (61–75%)" },
                { color: "hsl(var(--pink))", label: "Poor (≤60%)" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {/* ── Low performer alerts ───────────────────────────────────── */}
            {lowPerformers.length > 0 && (
              <div className="mt-3 space-y-1">
                {/* Alert header with pagination */}
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-muted-foreground">
                    ⚠️ Attention Required ({lowPerformers.length} transporter
                    {lowPerformers.length !== 1 ? "s" : ""}):
                  </div>

                  {hasAlertPagination && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAlertPage((p) => Math.max(p - 1, 1))}
                        disabled={alertPage === 1}
                        className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous alerts"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {alertPage} / {totalAlertPages}
                      </span>
                      <button
                        onClick={() =>
                          setAlertPage((p) => Math.min(p + 1, totalAlertPages))
                        }
                        disabled={alertPage === totalAlertPages}
                        className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next alerts"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Alert rows */}
                {paginatedAlerts?.map((p, idx) => (
                  <div
                    key={`${p?.partner ?? "transporter"}-${idx}`}
                    className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>
                      {p?.partner ?? "Unknown"} ({p?.type ?? "--"}):{" "}
                      <strong>{p?.onTimePct ?? 0}%</strong> on-time
                    </span>
                  </div>
                ))}

                {/* Showing X–Y of N label */}
                {hasAlertPagination && (
                  <div className="text-[10px] text-muted-foreground text-center pt-0.5">
                    Showing {alertStart + 1}–
                    {Math.min(alertStart + alertsPerPage, lowPerformers.length)}{" "}
                    of {lowPerformers.length} low performers
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-xs text-muted-foreground">
            No partner reliability data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PartnerReliabilityRadarSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36 bg-muted/50" />
      <Skeleton className="h-3 w-full mt-2 bg-muted/30" />
      <Skeleton className="h-3 w-3/4 mt-1 bg-muted/30" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[280px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
