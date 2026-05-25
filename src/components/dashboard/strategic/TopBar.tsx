import { ChevronDown, Sparkles, Eye, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface TopBarProps {
  activeDataset: string;
  lastUpdated: string;
}

type ViewMode = "all" | "region" | "partner" | "facility";

export const TopBar = ({ activeDataset, lastUpdated }: TopBarProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const viewModes: { value: ViewMode; label: string }[] = [
    { value: "all", label: "All" },
    { value: "region", label: "Region" },
    { value: "partner", label: "Transporter" },
    { value: "facility", label: "Facility" },
  ];

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Strategic Overview –{" "}
            <span className="text-primary neon-text">D2R Network</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Dataset Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-2 border-border/50 bg-muted/30 hover:bg-muted/50"
            >
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm max-w-[180px] truncate">
                {activeDataset}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-popover border-border/50"
          >
            <DropdownMenuItem className="cursor-pointer">
              Q4 2025 – Live Operations
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Q3 2025 – Historical
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Q2 2025 – Historical
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              FY 2025 – Consolidated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border border-border/30">
          <span className="text-xs text-muted-foreground px-2">View:</span>
          {viewModes?.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                viewMode === mode.value
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted/50"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </Button>

        {/* Decision Assistant Button */}
        <Button className="h-9 gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30">
          <Sparkles className="w-4 h-4" />
          Decision Assistant
        </Button>
      </div>
    </header>
  );
};
