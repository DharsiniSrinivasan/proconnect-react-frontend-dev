import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecoCategory, RecoPriority } from "@/mocks/recommendations.mock";
import { recommendation } from "@/services/recommendationService";
import { getStorage } from "@/utils/storage";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface RecoTopBarControlsProps {
  categoryFilter: any | "all";
  setCategoryFilter: (value: any | "all") => void;
  priorityFilter: any | "all";
  setPriorityFilter: (value: any | "all") => void;
  sortBy: "impact" | "confidence" | "created";
  setSortBy: (value: "impact" | "confidence" | "created") => void;
  activeDataset: string;
  setActiveDataset: (value: string) => void;
  categoryData: RecoCategory[];
  priorityData: RecoPriority[];
}

export const RecoTopBarControls = ({
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  categoryData,
  priorityData,
}: RecoTopBarControlsProps) => {
  const storage = getStorage();
  const datasetId = storage.getItem("datasetId");
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    if (!datasetId) return;

    try {
      await recommendation.exportRecommendation(datasetId);
    } catch (err: any) {
      console.error(err);
    }
    finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="flex flex-shrink-0 flex-col sm:flex-row flex-wrap items-center gap-3 ">
      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-[190px] bg-background/50 border-border/50 capitalize">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categoryData?.map((category: string) => {
            const value = category.toUpperCase().replace(/ /g, "_");
            return (
              <SelectItem key={value} value={value}>
                {category}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-full sm:w-[130px] bg-background/50 border-border/50 capitalize">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {priorityData?.map((priority: string) => (
            <SelectItem key={priority} value={priority.toLowerCase()}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full sm:w-auto text-xs font-medium gap-1.5 hover:text-primary-foreground flex justify-center sm:justify-start"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </>
        )}
      </Button>
    </div>
  );
};
