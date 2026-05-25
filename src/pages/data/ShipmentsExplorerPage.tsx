import { useState, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalFiltersBar } from "@/components/layout/GlobalFiltersBar";
import {
  ShipmentFilters,
  ShipmentFiltersSkeleton,
  ShipmentFiltersState,
  defaultFilters,
} from "@/components/shipments/ShipmentFilters";
import {
  ShipmentSummaryStrip,
  ShipmentSummaryStripSkeleton,
} from "@/components/shipments/ShipmentSummaryStrip";
import {
  ShipmentsTable,
  ShipmentsTableSkeleton,
} from "@/components/shipments/ShipmentsTable";
import { ShipmentDetailPanel } from "@/components/shipments/ShipmentDetailPanel";
import {
  shipmentsMock,
  calculateFilteredSummary,
  ShipmentRow,
  TatBand,
} from "@/mocks/shipments.mock";

const ShipmentsExplorerPage = () => {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [filters, setFilters] = useState<ShipmentFiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailShipment, setDetailShipment] = useState<ShipmentRow | null>(
    null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShipments(shipmentsMock.shipments);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      if (filters.dateFrom && s.shipmentDate < filters.dateFrom) return false;
      if (filters.dateTo && s.shipmentDate > filters.dateTo) return false;
      if (
        filters.originPincode &&
        !s.originPincode.includes(filters.originPincode)
      )
        return false;
      if (filters.destPincode && !s.destPincode.includes(filters.destPincode))
        return false;
      if (filters.mode !== "All" && s.mode !== filters.mode) return false;
      if (filters.partner !== "All" && s.partner !== filters.partner)
        return false;
      if (filters.facility !== "All" && s.facility !== filters.facility)
        return false;
      if (filters.docType !== "All" && s.docType !== filters.docType)
        return false;
      if (
        filters.compliance !== "All" &&
        s.complianceTag !== filters.compliance
      )
        return false;
      if (
        filters.recommendation &&
        !s.recoFlags.some((r) => r.includes(filters.recommendation))
      )
        return false;
      if (filters.slaRisk !== "All") {
        const riskMap: Record<string, TatBand[]> = {
          Low: ["Within SLA"],
          Medium: ["Slight Delay"],
          High: ["Major Delay"],
          Critical: ["Critical"],
        };
        if (!riskMap[filters.slaRisk]?.includes(s.tatBand)) return false;
      }
      if (filters.weightBand !== "All") {
        const [min, max] = filters.weightBand
          .replace(" kg", "")
          .replace("+", "-999")
          .split("-")
          .map(Number);
        if (s.chargedWeight < min || s.chargedWeight > max) return false;
      }
      return true;
    });
  }, [shipments, filters]);

  const summary = useMemo(
    () => calculateFilteredSummary(filteredShipments),
    [filteredShipments],
  );

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <AppShell pageTitle="Shipments Explorer" lastUpdated="5 minutes ago">
      {/* Global Filters */}
      <GlobalFiltersBar
        showDateRange={true}
        showViewToggle={true}
        viewOptions={[
          { value: "all", label: "All" },
          { value: "region", label: "Region" },
          { value: "partner", label: "Transporter" },
          { value: "facility", label: "Facility" },
        ]}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Strategic</span>
        <ChevronRight className="w-3 h-3" />
        <span>West</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">Shipments</span>
      </div>

      {/* Filters */}
      <section className="mb-6">
        {loading ? (
          <ShipmentFiltersSkeleton />
        ) : (
          <ShipmentFilters
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
          />
        )}
      </section>

      {/* Summary Strip */}
      <section className="mb-6">
        {loading ? (
          <ShipmentSummaryStripSkeleton />
        ) : (
          <ShipmentSummaryStrip summary={summary} />
        )}
      </section>

      {/* Table */}
      <section>
        {loading ? (
          <ShipmentsTableSkeleton />
        ) : (
          <ShipmentsTable
            shipments={filteredShipments}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={setDetailShipment}
          />
        )}
      </section>

      {/* Detail Panel */}
      <ShipmentDetailPanel
        shipment={detailShipment}
        onClose={() => setDetailShipment(null)}
      />

      {/* Overlay when panel is open */}
      {detailShipment && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close details"
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          onClick={() => setDetailShipment(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDetailShipment(null);
            }
          }}
        />
      )}
    </AppShell>
  );
};

export default ShipmentsExplorerPage;
