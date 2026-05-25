import { useState } from "react";
import { Calendar, Download, FileImage, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FinTopBarControls = () => {
  const [dateRange, setDateRange] = useState("this-month");
  const [activeDataset, setActiveDataset] = useState("Q4-2025");
  const [viewMode, setViewMode] = useState("total");

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Date Range */}
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-muted/20 border-border/50">
          <Calendar className="w-3 h-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="qtd">QTD</SelectItem>
          <SelectItem value="ytd">YTD</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Dataset */}
      <Select value={activeDataset} onValueChange={setActiveDataset}>
        <SelectTrigger className="w-[120px] h-8 text-xs bg-muted/20 border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Q4-2025">Q4 2025</SelectItem>
          <SelectItem value="Q3-2025">Q3 2025</SelectItem>
          <SelectItem value="FY-2025">FY 2025</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode */}
      <div className="flex rounded-lg border border-border/50 overflow-hidden">
        {["total", "region", "partner", "tier"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 text-xs capitalize transition-colors ${
              viewMode === mode
                ? "bg-primary text-primary-foreground"
                : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
            }`}
          >
            {mode === "tier" ? "Facility Tier" : mode}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Export PNG"
        >
          <FileImage className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Export PDF"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Export Excel"
        >
          <FileSpreadsheet className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
