import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PartnerCostCompare } from "@/mocks/financialDashboard.mock";
import { formatCurrency } from "@/lib/formatters";

interface PartnerCostCompareChartProps {
  data: PartnerCostCompare[];
}

export const PartnerCostCompareChart = ({
  data,
}: PartnerCostCompareChartProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 partners per page for better visibility

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
            Transporter Cost Compare
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
          Transporter-wise spend, freight cost/unit, score, share %.
        </p>
        {safeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={paginatedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(val)=>formatCurrency(val)}
              />
              <YAxis
                type="category"
                dataKey="partner"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                width={65}
              />
              <Tooltip
                wrapperStyle={{
                  width: "auto",
                  maxWidth: "90vw",
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  padding: "clamp(6px, 1vw, 12px)", //  dynamic padding
                  fontSize: "clamp(10px, 1vw, 14px)", //  auto-scale font
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "clamp(10px, 1vw, 14px)",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "clamp(10px, 1vw, 14px)",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Budget Cost" || name === "Actual") {
                    return [formatCurrency(value), name];
                  }
                  if (name === "Budget/Qty" || name === "Actual/Qty") {
                    return [formatCurrency(value), name];
                  }
                  return [formatCurrency(value), name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="actualCost"
                name="Budget Cost"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="ratebook"
                name="Actual"
                fill="hsl(var(--muted-foreground))"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="actualCostPerQty"
                name="Budget/Qty"
                fill="hsl(210 80% 55%)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="ratebookPerQty"
                name="Actual/Qty"
                fill="hsl(150 60% 45%)"
                radius={[0, 4, 4, 0]}
              />
              {/* <Bar dataKey="gap" name="Gap" fill="hsl(0 70% 55%)" radius={[0, 4, 4, 0]} /> */}
              <Bar
                dataKey="totalQty"
                name="Total Qty"
                fill="hsl(35 90% 55%)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="totalInvoices"
                name="Total Invoices"
                fill="hsl(270 60% 55%)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground">
            No freight cost comparison data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PartnerCostCompareChartSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36 bg-muted/50" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full bg-muted/30" />
    </CardContent>
  </Card>
);
