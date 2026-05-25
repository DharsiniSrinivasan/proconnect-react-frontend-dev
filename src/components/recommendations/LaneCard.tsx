import { Badge } from "@/components/ui/badge";
import { LaneData } from "@/pages/data/laneData";
import {
  Plane,
  Truck,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface LaneCardProps {
  data: LaneData;
  index: number;
}

const LaneCard = ({ data, index }: LaneCardProps) => {
  const { metrics } = data;
  const isOnTime = metrics.otifPct >= 80;
  const [from, to] = data.lane.split(" → ");

  const tierLabel = data.tierType.replace(/_/g, " ");

  return (
    <div
      className="bg-card rounded-lg border overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="p-4 border-b bg-secondary/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-card-foreground">{from}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-card-foreground">{to}</span>
          </div>
          <div className="flex items-center gap-2">
            {data.transportMode === "AIR" ? (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Plane className="h-3 w-3" /> Air
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Truck className="h-3 w-3" /> Road
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {tierLabel}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.transporterName} ·{" "}
          <span className="font-mono text-xs">
            {data.plantCode} → {data.toCityCode}
          </span>
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Cost */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
          <p className="text-lg font-bold font-mono text-card-foreground">
            ₹{metrics.totalCost.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Rate Book Cost</p>
          <p className="text-lg font-bold font-mono text-card-foreground">
            ₹{metrics.rateBookCost.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Savings</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-metric-positive" />
            <p className="text-lg font-bold font-mono text-metric-positive">
              ₹{metrics.savings.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-metric-positive">{metrics.savingsPct}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Rate Gap</p>
          <div className="flex items-center gap-1">
            {metrics.rateGap < 0 ? (
              <TrendingDown className="h-4 w-4 text-metric-negative" />
            ) : (
              <TrendingUp className="h-4 w-4 text-metric-positive" />
            )}
            <p
              className={`text-lg font-bold font-mono ${metrics.rateGap < 0 ? "text-metric-negative" : "text-metric-positive"}`}
            >
              ₹{Math.abs(metrics.rateGap).toFixed(1)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Budget: ₹{metrics.budgetRatePerQty} · Actual: ₹
            {metrics.actualRatePerQty}
          </p>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="px-4 pb-4 flex flex-wrap items-center gap-4 border-t pt-3">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            TAT:{" "}
            <span className="font-mono font-medium text-card-foreground">
              {metrics.avgTat}d
            </span>{" "}
            / {metrics.promisedTat}d promised
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isOnTime ? (
            <CheckCircle className="h-3.5 w-3.5 text-metric-positive" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-metric-negative" />
          )}
          <span
            className={`text-xs font-medium ${isOnTime ? "text-metric-positive" : "text-metric-negative"}`}
          >
            OTIF: {metrics.otifPct}%
          </span>
          <span className="text-xs text-muted-foreground">
            ({metrics.onTimeCount} on-time, {metrics.delayedCount} delayed)
          </span>
        </div>
        <div className="text-xs text-muted-foreground ml-auto">
          {metrics.shipmentCount} shipments · {metrics.totalQty} qty ·{" "}
          {metrics.totalInvoices} invoices
        </div>
      </div>
    </div>
  );
};

export default LaneCard;
