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
import type { ExpansionPriorityRow } from "@/mocks/facilityDashboard.mock";

interface ExpansionPriorityTableProps {
  data: ExpansionPriorityRow[];
}

export const ExpansionPriorityTable = ({
  data,
}: ExpansionPriorityTableProps) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Expansion Priority Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground text-xs">
                  #
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Pin
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Region
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Vol Growth
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Gap %
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Payback
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Score
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  +20% Vol
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row) => (
                <TableRow
                  key={row.pincode}
                  className="border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="text-xs font-bold text-muted-foreground">
                    {row.rank}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {row.pincode}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.region}
                  </TableCell>
                  <TableCell className="text-xs text-right text-emerald-400">
                    +{row.volGrowth}%
                  </TableCell>
                  <TableCell className="text-xs text-right text-amber-400">
                    {row.capacityGap}%
                  </TableCell>
                  <TableCell className="text-xs text-right text-foreground">
                    {row.paybackMonths}mo
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-xs text-right font-bold",
                      row.score >= 85 && "text-primary",
                      row.score >= 75 && row.score < 85 && "text-emerald-400",
                      row.score < 75 && "text-muted-foreground",
                    )}
                  >
                    {row.score.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground">
                    {row.whatIfVol20.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Score = weighted (vol growth + gap + payback) • +20% Vol = what-if
          scenario
        </p>
      </CardContent>
    </Card>
  );
};

export const ExpansionPriorityTableSkeleton = () => (
  <Card className="glass-card neon-border">
    <CardHeader className="pb-2">
      <div className="h-5 w-44 bg-muted/30 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-48 bg-muted/20 rounded animate-pulse" />
    </CardContent>
  </Card>
);
