import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Building2 } from "lucide-react";
import type { Facility } from "@/mocks/strategicDashboard.mock";

interface FacilityTableProps {
  facilities: Facility[];
}

const statusStyles: Record<Facility["status"], string> = {
  Expand: "chip-success",
  Monitor: "chip-primary",
  Optimise: "chip-warning",
  Defer: "chip-danger",
};

const tierStyles: Record<Facility["tier"], string> = {
  "Tier 1": "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary",
  "Tier 2": "bg-accent/20 text-accent",
  "Tier 3": "bg-muted text-muted-foreground",
};

export const FacilityTable = ({ facilities }: FacilityTableProps) => {
  return (
    <div className="glass-card neon-border h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">
          Facility ROI & Capacity
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium min-w-[140px]">
                Facility
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Facility
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Tier
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Util %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Shipments
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                On-Time %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities?.map((facility) => (
              <TableRow
                key={facility.id}
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {facility.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {facility.plant}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${tierStyles[facility.tier]}`}
                  >
                    {facility.tier}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      facility.utilisationPercent > 85
                        ? "text-destructive"
                        : facility.utilisationPercent > 75
                          ? "text-warning"
                          : "text-foreground"
                    }
                  >
                    {facility.utilisationPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {facility.shipmentCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      facility.onTimeRate >= 90
                        ? "text-success"
                        : facility.onTimeRate < 85
                          ? "text-destructive"
                          : "text-foreground"
                    }
                  >
                    {facility.onTimeRate}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[facility.status]}`}
                  >
                    {facility.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export const FacilityTableSkeleton = () => (
  <div className="glass-card h-full flex flex-col">
    <div className="p-4 border-b border-border/50">
      <div className="skeleton-glow h-5 w-44 rounded" />
    </div>
    <div className="flex-1 p-4 space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton-glow h-10 w-full rounded" />
      ))}
    </div>
  </div>
);
