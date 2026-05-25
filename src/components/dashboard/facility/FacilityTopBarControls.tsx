import { Bot, Database, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FacilityTopBarControlsProps {
  tierFilter: string;
  setTierFilter: (tier: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export const FacilityTopBarControls = ({
  tierFilter,
  setTierFilter,
  viewMode,
  setViewMode,
}: FacilityTopBarControlsProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tier Filter */}
      <Select value={tierFilter} onValueChange={setTierFilter}>
        <SelectTrigger className="w-[150px] h-9 bg-card/50 border-border/50">
          <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder="All Tiers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="mother">Mother Hub</SelectItem>
          <SelectItem value="satellite-hub">Satellite Hub</SelectItem>
          <SelectItem value="satellite-wh">Satellite WH</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode */}
      <div className="flex items-center rounded-lg border border-border/50 bg-card/50 p-1">
        {["Utilisation", "Demand Forecast", "ROI", "Expansion"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === mode
                ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Active Dataset */}
      <Select defaultValue="q4-2025">
        <SelectTrigger className="w-[160px] h-9 bg-card/50 border-border/50">
          <Database className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="q4-2025">Q4 2025 Dataset</SelectItem>
          <SelectItem value="q3-2025">Q3 2025 Dataset</SelectItem>
          <SelectItem value="q2-2025">Q2 2025 Dataset</SelectItem>
        </SelectContent>
      </Select>

      {/* Decision Assistant */}
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 border-primary/30 hover:border-primary hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
      >
        <Bot className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">Decision Assistant</span>
      </Button>
    </div>
  );
};
