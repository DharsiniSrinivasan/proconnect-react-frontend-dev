import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EconomicsMatrixRow } from "@/mocks/facilityDashboard.mock";

interface EconomicsMatrixTableProps {
  data: EconomicsMatrixRow[];
}

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value}`;
};

export const EconomicsMatrixTable = ({ data }: EconomicsMatrixTableProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Economics Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground text-xs">
                  Tier
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Geo
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Rent
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  ₹/Qty
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Total
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  ROI %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="text-xs font-medium text-foreground">
                    {row.tier}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.geo}
                  </TableCell>
                  <TableCell className="text-xs text-right text-foreground">
                    {formatCurrency(row.rentCost)}
                  </TableCell>
                  <TableCell className="text-xs text-right text-foreground">
                    ₹{row.freightPerQty.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-right text-foreground">
                    {formatCurrency(row.totalCost)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-xs text-right font-medium",
                      row.roi >= 25 && "text-emerald-400",
                      row.roi >= 18 && row.roi < 25 && "text-amber-400",
                      row.roi < 18 && "text-muted-foreground",
                    )}
                  >
                    {row.roi.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const EconomicsMatrixTableSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-32 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-48 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
