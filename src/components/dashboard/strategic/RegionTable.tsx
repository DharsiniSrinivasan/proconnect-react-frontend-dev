import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";
import type { Region } from "@/mocks/strategicDashboard.mock";

interface RegionTableProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
}

export const RegionTable = ({
  regions,
  selectedRegion,
  onSelectRegion,
}: RegionTableProps) => {
  const formatVolume = (vol: number) => `${(vol / 1000).toFixed(2)}K`;

  return (
    <div className="glass-card neon-border h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Globe className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">Regional Performance</h3>
      </div>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">
                Region
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Unit
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Cost/kg
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                SLA %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Avg TAT
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Util %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Priority
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions?.map((region) => (
              <TableRow
                key={region.id}
                onClick={() => onSelectRegion(region)}
                className={` border-border/30 transition-all duration-200 ${
                  selectedRegion?.id === region.id
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs font-mono text-primary">
                      {region.code}
                    </span>
                    {region.name}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatVolume(region.volumeBoxes)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      region.costPerKg < 18
                        ? "text-success"
                        : region.costPerKg > 20
                          ? "text-destructive"
                          : "text-foreground"
                    }
                  >
                    ₹{region.costPerKg.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      region.slaPercent >= 95
                        ? "text-success"
                        : region.slaPercent < 92
                          ? "text-destructive"
                          : "text-warning"
                    }
                  >
                    {region.slaPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {region.avgTatDays}d
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      region.utilisationPercent > 85
                        ? "text-destructive"
                        : region.utilisationPercent > 75
                          ? "text-warning"
                          : "text-foreground"
                    }
                  >
                    {region.utilisationPercent}%
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      region.priority === "High"
                        ? "chip-danger"
                        : region.priority === "Medium"
                          ? "chip-warning"
                          : "chip-success"
                    }`}
                  >
                    {region.priority}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export const RegionTableSkeleton = () => (
  <div className="glass-card h-full flex flex-col">
    <div className="p-4 border-b border-border/50">
      <div className="skeleton-glow h-5 w-40 rounded" />
    </div>
    <div className="flex-1 p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-glow h-12 w-full rounded" />
      ))}
    </div>
  </div>
);
