import { Search, X, Save, Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export interface ShipmentFiltersState {
  dateFrom: string;
  dateTo: string;
  originPincode: string;
  destPincode: string;
  mode: string;
  partner: string;
  facility: string;
  docType: string;
  weightBand: string;
  qtyBand: string;
  compliance: string;
  recommendation: string;
  slaRisk: string;
}

interface ShipmentFiltersProps {
  filters: ShipmentFiltersState;
  onChange: (filters: ShipmentFiltersState) => void;
  onClear: () => void;
}

const MODES = ["All", "Road", "Air", "Rail"];
const PARTNERS = [
  "All",
  "BlueDart Express",
  "Delhivery",
  "GATI Express",
  "XpressBees",
  "Ecom Express",
  "Shadowfax",
];
const FACILITIES = [
  "All",
  "Mumbai Hub",
  "Delhi Hub",
  "Bangalore Hub",
  "Chennai Sat",
  "Hyderabad Sat",
  "Pune WH",
];
const DOC_TYPES = [
  "All",
  "B2B Invoice",
  "B2C Invoice",
  "Credit Note",
  "Debit Note",
  "Delivery Challan",
];
const WEIGHT_BANDS = ["All", "0-1 kg", "1-5 kg", "5-10 kg", "10+ kg"];
const QTY_BANDS = ["All", "1-10", "10-50", "50-100", "100+"];
const COMPLIANCE = [
  "All",
  "Compliant",
  "Weight Discrepancy",
  "Document Missing",
  "Rate Exception",
  "Address Issue",
];
const SLA_RISK = ["All", "Low", "Medium", "High", "Critical"];

export const ShipmentFilters = ({
  filters,
  onChange,
  onClear,
}: ShipmentFiltersProps) => {
  const update = (key: keyof ShipmentFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSaveView = () => {
    toast.info("Save view coming soon", {
      description: "This feature is under development",
    });
  };

  const handleExport = () => {
    toast.info("CSV export coming soon", {
      description: "This feature is under development",
    });
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-border/30">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Filters</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {/* Date Range */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From Date</label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update("dateFrom", e.target.value)}
              className="w-full h-8 pl-7 pr-2 rounded-md bg-card/50 border border-border/50 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To Date</label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update("dateTo", e.target.value)}
              className="w-full h-8 pl-7 pr-2 rounded-md bg-card/50 border border-border/50 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Origin Pincode */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Origin Pincode
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g., 400001"
              value={filters.originPincode}
              onChange={(e) => update("originPincode", e.target.value)}
              className="w-full h-8 pl-7 pr-2 rounded-md bg-card/50 border border-border/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Dest Pincode */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Dest Pincode</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g., 110001"
              value={filters.destPincode}
              onChange={(e) => update("destPincode", e.target.value)}
              className="w-full h-8 pl-7 pr-2 rounded-md bg-card/50 border border-border/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Mode</label>
          <Select value={filters.mode} onValueChange={(v) => update("mode", v)}>
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Partner */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Partner</label>
          <Select
            value={filters.partner}
            onValueChange={(v) => update("partner", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTNERS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Facility */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Facility</label>
          <Select
            value={filters.facility}
            onValueChange={(v) => update("facility", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FACILITIES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Type */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Doc Type</label>
          <Select
            value={filters.docType}
            onValueChange={(v) => update("docType", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weight Band */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Weight Band</label>
          <Select
            value={filters.weightBand}
            onValueChange={(v) => update("weightBand", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEIGHT_BANDS.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Compliance */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Compliance</label>
          <Select
            value={filters.compliance}
            onValueChange={(v) => update("compliance", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPLIANCE.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SLA Risk */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">SLA Risk</label>
          <Select
            value={filters.slaRisk}
            onValueChange={(v) => update("slaRisk", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SLA_RISK.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recommendation */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Recommendation
          </label>
          <input
            type="text"
            placeholder="e.g., REC-001"
            value={filters.recommendation}
            onChange={(e) => update("recommendation", e.target.value)}
            className="w-full h-8 px-2 rounded-md bg-card/50 border border-border/50 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={onClear}
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={handleSaveView}
        >
          <Save className="w-3.5 h-3.5" />
          Save View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={handleExport}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export const ShipmentFiltersSkeleton = () => (
  <div className="glass-card rounded-xl p-4 border border-border/30">
    <Skeleton className="h-4 w-20 mb-4" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-28" />
    </div>
  </div>
);

export const defaultFilters: ShipmentFiltersState = {
  dateFrom: "",
  dateTo: "",
  originPincode: "",
  destPincode: "",
  mode: "All",
  partner: "All",
  facility: "All",
  docType: "All",
  weightBand: "All",
  qtyBand: "All",
  compliance: "All",
  recommendation: "",
  slaRisk: "All",
};
