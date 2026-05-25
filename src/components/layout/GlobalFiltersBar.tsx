import { useState } from "react";
import { Calendar, ChevronDown, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDecisionAssistant } from "@/components/layout/AppShell";

export type DateRange =
  | "today"
  | "7days"
  | "30days"
  | "this-month"
  | "qtd"
  | "ytd"
  | "custom";

export interface ViewOption {
  value: string;
  label: string;
}

export interface GlobalFiltersBarProps {
  showDateRange?: boolean;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  showViewToggle?: boolean;
  viewOptions?: ViewOption[];
  activeView?: string;
  onViewChange?: (view: string) => void;
  activeDataset?: string;
  onDatasetChange?: (dataset: string) => void;
  onOpenDecisionAssistant?: () => void;
  datasetOptions?: string[];
}

const defaultDateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "this-month", label: "This Month" },
  { value: "qtd", label: "QTD" },
  { value: "ytd", label: "YTD" },
  { value: "custom", label: "Custom" },
];

const defaultDatasets = [
  "Q4 2025 – Live Operations",
  "Q3 2025 – Historical",
  "Q2 2025 – Historical",
  "FY 2025 – Consolidated",
];

export const GlobalFiltersBar = ({
  showDateRange = true,
  dateRange: externalDateRange,
  onDateRangeChange,
  showViewToggle = true,
  viewOptions = [
    { value: "all", label: "All" },
    { value: "region", label: "Region" },
    { value: "partner", label: "Transporter" },
    { value: "facility", label: "Facility" },
  ],
  activeView: externalActiveView,
  onViewChange,
  activeDataset: externalActiveDataset,
  onDatasetChange,
  onOpenDecisionAssistant,
  datasetOptions = defaultDatasets,
}: GlobalFiltersBarProps) => {
  const { openDecisionAssistant } = useDecisionAssistant();
  const [internalDateRange, setInternalDateRange] =
    useState<DateRange>("7days");
  const [internalActiveView, setInternalActiveView] = useState(
    viewOptions[0]?.value || "all",
  );
  const [internalActiveDataset, setInternalActiveDataset] = useState(
    datasetOptions[0],
  );

  const dateRange = externalDateRange ?? internalDateRange;
  const activeView = externalActiveView ?? internalActiveView;
  const activeDataset = externalActiveDataset ?? internalActiveDataset;

  const handleDateRangeChange = (range: DateRange) => {
    setInternalDateRange(range);
    onDateRangeChange?.(range);
  };

  const handleViewChange = (view: string) => {
    setInternalActiveView(view);
    onViewChange?.(view);
  };

  const handleDatasetChange = (dataset: string) => {
    setInternalActiveDataset(dataset);
    onDatasetChange?.(dataset);
  };

  const handleOpenDecisionAssistant = () => {
    onOpenDecisionAssistant?.();
    openDecisionAssistant();
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-card/30 border border-border/30 backdrop-blur-sm">
      {/* Left Section: Date Range */}
      <div className="flex items-center gap-3 flex-wrap">
        {showDateRange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-2 border-border/50 bg-background/50 hover:bg-background/80"
              >
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {
                    defaultDateRangeOptions.find(
                      (opt) => opt.value === dateRange,
                    )?.label
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card border-border/50">
              {defaultDateRangeOptions?.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={cn(
                    "cursor-pointer",
                    dateRange === option.value && "bg-primary/10 text-primary",
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Middle Section: View Toggle */}
      {showViewToggle && viewOptions.length > 0 && (
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border border-border/30">
          <span className="text-xs text-muted-foreground px-2 hidden sm:inline">
            View:
          </span>
          {viewOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleViewChange(option.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                activeView === option.value
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Section: Dataset + Decision Assistant */}
      <div className="flex items-center gap-3">
        {/* Active Dataset Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-2 border-border/50 bg-background/50 hover:bg-background/80"
            >
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm max-w-[160px] truncate hidden sm:inline">
                {activeDataset}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass-card border-border/50"
          >
            {datasetOptions.map((dataset) => (
              <DropdownMenuItem
                key={dataset}
                onClick={() => handleDatasetChange(dataset)}
                className={cn(
                  "cursor-pointer",
                  activeDataset === dataset && "bg-primary/10 text-primary",
                )}
              >
                {dataset}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Decision Assistant Button */}
        <Button
          onClick={handleOpenDecisionAssistant}
          className="h-9 gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Decision Assistant</span>
        </Button>
      </div>
    </div>
  );
};

export const GlobalFiltersBarSkeleton = () => (
  <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-card/30 border border-border/30 backdrop-blur-sm animate-pulse">
    <div className="h-9 w-32 bg-muted/30 rounded-md" />
    <div className="h-9 w-64 bg-muted/30 rounded-md" />
    <div className="flex gap-3">
      <div className="h-9 w-40 bg-muted/30 rounded-md" />
      <div className="h-9 w-36 bg-muted/30 rounded-md" />
    </div>
  </div>
);
