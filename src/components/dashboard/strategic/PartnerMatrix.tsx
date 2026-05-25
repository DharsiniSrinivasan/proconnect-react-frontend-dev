import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Users, Plane, Truck, Train, Shuffle } from "lucide-react";
import type { Partner } from "@/mocks/strategicDashboard.mock";

interface PartnerMatrixProps {
  partners: Partner[];
}

const modeIcons: Record<Partner["mode"], React.ReactNode> = {
  Air: <Plane className="w-4 h-4" />,
  Road: <Truck className="w-4 h-4" />,
  Rail: <Train className="w-4 h-4" />,
  "Multi-modal": <Shuffle className="w-4 h-4" />,
};

const tierColors: Record<Partner["tier"], string> = {
  Platinum:
    "bg-gradient-to-r from-primary/30 to-secondary/30 text-primary border-primary/50",
  Gold: "bg-warning/20 text-warning border-warning/40",
  Silver: "bg-muted text-muted-foreground border-border",
  Bronze: "bg-muted/50 text-muted-foreground/80 border-border/50",
};

export const PartnerMatrix = ({ partners }: PartnerMatrixProps) => {
  const getCostIndexColor = (index: number) => {
    if (index < 0.9) return "chip-success";
    if (index > 1.1) return "chip-danger";
    return "chip-warning";
  };

  return (
    <div className="glass-card neon-border">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Transporter Reliability Matrix
        </h3>
      </div>
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium min-w-[160px]">
                Partner
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Mode
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-center">
                Cost Index
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                SLA %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Avg TAT
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                ODA %
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Score
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-center">
                Tier
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow
                key={partner.id}
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {partner.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {modeIcons[partner.mode]}
                    <span className="text-sm">{partner.mode}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-mono font-medium ${getCostIndexColor(partner.costIndex)}`}
                  >
                    {partner.costIndex.toFixed(2)}×
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      partner.slaPercent >= 95
                        ? "text-success"
                        : partner.slaPercent < 90
                          ? "text-destructive"
                          : "text-foreground"
                    }
                  >
                    {partner.slaPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {partner.avgTat}d
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {partner.odaCoveragePercent}%
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                        style={{ width: `${partner.overallScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm w-8">
                      {partner.overallScore}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${tierColors[partner.tier]}`}
                  >
                    {partner.tier}
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

export const PartnerMatrixSkeleton = () => (
  <div className="glass-card">
    <div className="p-4 border-b border-border/50">
      <div className="skeleton-glow h-5 w-48 rounded" />
    </div>
    <div className="p-4 space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-glow h-12 w-full rounded" />
      ))}
    </div>
  </div>
);
