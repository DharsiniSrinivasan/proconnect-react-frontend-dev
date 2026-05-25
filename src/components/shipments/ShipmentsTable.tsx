import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  ShipmentRow,
  TatBand,
  ComplianceTag,
} from "@/mocks/shipments.mock";

interface ShipmentsTableProps {
  shipments: ShipmentRow[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (shipment: ShipmentRow) => void;
}

const tatBandStyles: Record<TatBand, string> = {
  "Within SLA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Slight Delay": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Major Delay": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Critical:
    "bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
};

const complianceStyles: Record<ComplianceTag, string> = {
  Compliant: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Weight Discrepancy": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Document Missing": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Rate Exception": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Address Issue": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

export const ShipmentsTable = ({
  shipments,
  selectedIds,
  onSelectionChange,
  onRowClick,
}: ShipmentsTableProps) => {
  const [sortField, setSortField] = useState<keyof ShipmentRow>("shipmentDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handleSort = (field: keyof ShipmentRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedShipments = [...shipments].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedShipments.length / pageSize);
  const paginatedShipments = sortedShipments.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const allSelected =
    paginatedShipments.length > 0 &&
    paginatedShipments.every((s) => selectedIds.includes(s.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(
        selectedIds.filter(
          (id) => !paginatedShipments.some((s) => s.id === id),
        ),
      );
    } else {
      const newIds = [
        ...new Set([...selectedIds, ...paginatedShipments.map((s) => s.id)]),
      ];
      onSelectionChange(newIds);
    }
  };

  const toggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const SortHeader = ({
    field,
    children,
    className,
  }: {
    field: keyof ShipmentRow;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "text-muted-foreground text-[10px] font-medium cursor-pointer hover:text-foreground transition-colors whitespace-nowrap",
        className,
      )}
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        <span className="ml-0.5 text-primary">{sortAsc ? "↑" : "↓"}</span>
      )}
    </TableHead>
  );

  return (
    <NeonCard title="Shipments" className="h-full">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <SortHeader field="invoiceNo">Invoice</SortHeader>
              <TableHead className="text-muted-foreground text-[10px] font-medium whitespace-nowrap">
                Doc Type
              </TableHead>
              <TableHead className="text-muted-foreground text-[10px] font-medium whitespace-nowrap">
                Origin → Dest
              </TableHead>
              <SortHeader field="netWeight">Net/Chg Wt</SortHeader>
              <SortHeader field="cost">Cost</SortHeader>
              <SortHeader field="costPerKg">₹/Kg</SortHeader>
              <SortHeader field="actualTat">Act TAT</SortHeader>
              <SortHeader field="baselineTat">Base TAT</SortHeader>
              <SortHeader field="slaVariance">Variance</SortHeader>
              <TableHead className="text-muted-foreground text-[10px] font-medium whitespace-nowrap">
                TAT Band
              </TableHead>
              <SortHeader field="partner">Transporter</SortHeader>
              <TableHead className="text-muted-foreground text-[10px] font-medium">
                Mode
              </TableHead>
              <SortHeader field="facility">Facility</SortHeader>
              <TableHead className="text-muted-foreground text-[10px] font-medium whitespace-nowrap">
                Compliance
              </TableHead>
              <TableHead className="text-muted-foreground text-[10px] font-medium">
                Reco
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedShipments.map((shipment) => (
              <TableRow
                key={shipment.id}
                className={cn(
                  "border-border/30 cursor-pointer transition-all duration-200",
                  selectedIds.includes(shipment.id)
                    ? "bg-primary/10"
                    : "hover:bg-primary/5",
                )}
                onClick={() => onRowClick(shipment)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(shipment.id)}
                    onCheckedChange={() => toggleRow(shipment.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs text-primary">
                  {shipment.invoiceNo}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {shipment.docType}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="text-foreground">{shipment.originCity}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-foreground">{shipment.destCity}</span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {shipment.netWeight}/{shipment.chargedWeight}
                </TableCell>
                <TableCell className="font-mono text-xs text-foreground">
                  ₹{shipment.cost.toFixed(0)}
                </TableCell>
                <TableCell className="font-mono text-xs text-foreground">
                  ₹{shipment.costPerKg}
                </TableCell>
                <TableCell className="font-mono text-xs text-foreground">
                  {shipment.actualTat}d
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {shipment.baselineTat}d
                </TableCell>
                <TableCell
                  className={cn(
                    "font-mono text-xs font-medium",
                    shipment.slaVariance > 0
                      ? "text-rose-400"
                      : "text-emerald-400",
                  )}
                >
                  {shipment.slaVariance > 0 ? "+" : ""}
                  {shipment.slaVariance}d
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] border",
                      tatBandStyles[shipment.tatBand],
                    )}
                  >
                    {shipment.tatBand}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {shipment.partner}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {shipment.mode}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {shipment.facility}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] border",
                      complianceStyles[shipment.complianceTag],
                    )}
                  >
                    {shipment.complianceTag}
                  </span>
                </TableCell>
                <TableCell>
                  {shipment.recoFlags.length > 0 ? (
                    <span className="text-[10px] font-mono text-primary">
                      {shipment.recoFlags.join(", ")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, shipments.length)} of {shipments.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </NeonCard>
  );
};

export const ShipmentsTableSkeleton = () => (
  <NeonCard title="Shipments" className="h-full">
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-24" />
    </div>
  </NeonCard>
);
