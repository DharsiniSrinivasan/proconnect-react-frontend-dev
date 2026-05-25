import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DateRange = "today" | "7days" | "30days" | "custom";
type ViewMode = "network" | "lanes" | "partners";

interface OpsTopBarControlsProps {
  activeDataset?: string;
  onDateRangeChange?: (range: DateRange) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "custom", label: "Custom" },
];

const viewModeOptions: { value: ViewMode; label: string }[] = [
  { value: "network", label: "Network" },
  { value: "lanes", label: "Lanes" },
  { value: "partners", label: "Partners" },
];

export const OpsTopBarControls = ({
  activeDataset = "Live Network Feed",
  onDateRangeChange,
  onViewModeChange,
}: OpsTopBarControlsProps) => {
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [viewMode, setViewMode] = useState<ViewMode>("network");

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Date Range Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-border/50 bg-background/50 hover:bg-background/80"
          >
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {dateRangeOptions.find((opt) => opt.value === dateRange)?.label}
            <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card border-border/50">
          {dateRangeOptions?.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleDateRangeChange(option.value)}
              className={cn(
                "",
                dateRange === option.value && "bg-primary/10 text-primary",
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Dataset */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-border/50 bg-background/50 hover:bg-background/80"
          >
            {activeDataset}
            <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card border-border/50">
          <DropdownMenuItem className="">Live Network Feed</DropdownMenuItem>
          <DropdownMenuItem className="">
            Historical - Dec 2025
          </DropdownMenuItem>
          <DropdownMenuItem className="">
            Historical - Nov 2025
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Segmented Control */}
      <div className="flex items-center rounded-lg border border-border/50 bg-background/50 p-1">
        {viewModeOptions?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleViewModeChange(option.value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
              viewMode === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
