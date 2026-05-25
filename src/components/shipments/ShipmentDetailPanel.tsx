import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ShipmentRow,
  TatBand,
  ComplianceTag,
} from "@/mocks/shipments.mock";

interface ShipmentDetailPanelProps {
  shipment: ShipmentRow | null;
  onClose: () => void;
}

const tatBandStyles: Record<TatBand, string> = {
  "Within SLA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Slight Delay": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Major Delay": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Critical: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const complianceStyles: Record<ComplianceTag, string> = {
  Compliant: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Weight Discrepancy": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Document Missing": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Rate Exception": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Address Issue": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const DetailRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className="flex items-start justify-between py-2 border-b border-border/20">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn("text-sm text-foreground text-right", className)}>
      {value}
    </span>
  </div>
);

export const ShipmentDetailPanel = ({
  shipment,
  onClose,
}: ShipmentDetailPanelProps) => {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[320px] glass-card border-l border-primary/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] z-50 transform transition-transform duration-300 overflow-hidden",
        shipment ? "translate-x-0" : "translate-x-full",
      )}
    >
      {shipment && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div>
              <h3 className="font-semibold text-foreground">
                {shipment.invoiceNo}
              </h3>
              <p className="text-xs text-muted-foreground">{shipment.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs border",
                  tatBandStyles[shipment.tatBand],
                )}
              >
                {shipment.tatBand}
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs border",
                  complianceStyles[shipment.complianceTag],
                )}
              >
                {shipment.complianceTag}
              </span>
            </div>

            {/* Route */}
            <div className="glass-card rounded-lg p-3 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">Route</p>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {shipment.originCity}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {shipment.originPincode}
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary to-secondary" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {shipment.destCity}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {shipment.destPincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Shipment Details
              </p>
              <DetailRow label="Document Type" value={shipment.docType} />
              <DetailRow label="Customer" value={shipment.customer} />
              <DetailRow label="Transporter" value={shipment.partner} />
              <DetailRow label="Mode" value={shipment.mode} />
              <DetailRow label="Facility" value={shipment.facility} />
              <DetailRow label="Region" value={shipment.region} />
            </div>

            {/* Weight & Cost */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Weight & Cost
              </p>
              <DetailRow
                label="Net Weight"
                value={`${shipment.netWeight} kg`}
              />
              <DetailRow
                label="Charged Weight"
                value={`${shipment.chargedWeight} kg`}
              />
              <DetailRow
                label="Total Cost"
                value={`₹${shipment.cost.toFixed(2)}`}
                className="font-mono"
              />
              <DetailRow
                label="Cost per Kg"
                value={`₹${shipment.costPerKg}`}
                className="font-mono"
              />
            </div>

            {/* TAT */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Turnaround Time
              </p>
              <DetailRow label="Shipment Date" value={shipment.shipmentDate} />
              <DetailRow
                label="Delivery Date"
                value={shipment.deliveryDate || "—"}
              />
              <DetailRow
                label="Actual TAT"
                value={`${shipment.actualTat} days`}
              />
              <DetailRow
                label="Baseline TAT"
                value={`${shipment.baselineTat} days`}
              />
              <DetailRow
                label="SLA Variance"
                value={`${shipment.slaVariance > 0 ? "+" : ""}${shipment.slaVariance} days`}
                className={
                  shipment.slaVariance > 0
                    ? "text-rose-400"
                    : "text-emerald-400"
                }
              />
            </div>

            {/* Recommendations */}
            {shipment.recoFlags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Linked Recommendations
                </p>
                <div className="space-y-2">
                  {shipment?.recoFlags?.map((flag) => (
                    <Button
                      key={flag}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between text-xs border-primary/30 hover:border-primary"
                    >
                      {flag}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Stub */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Activity Log</p>
              <div className="space-y-2">
                {[
                  { action: "Delivered", time: "2 days ago" },
                  { action: "Out for delivery", time: "3 days ago" },
                  { action: "In transit - Delhi Hub", time: "4 days ago" },
                  { action: "Shipped", time: "5 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">{item.action}</span>
                    <span className="text-muted-foreground ml-auto">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
