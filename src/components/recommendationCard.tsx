import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleCheck, ChevronDown } from "lucide-react";

interface Recommendation {
  id: string;
  generated_at: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  category: string;
  title: string;
  impact?: string;
  whyTriggered?: string[] | string;
  batch_name?: string;
}

const VISIBLE_REASONS = 1;

export default function RecommendationCard({
  reco,
  index,
}: {
  reco: Recommendation;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  let reasons: string[] = [];
  if (Array.isArray(reco.whyTriggered)) {
    reasons = reco.whyTriggered;
  } else if (typeof reco.whyTriggered === "string") {
    try {
      reasons = JSON.parse(reco.whyTriggered);
    } catch {
      reasons = [];
    }
  }

  const hasMore = reasons.length > VISIBLE_REASONS;
  const visibleReasons = expanded ? reasons : reasons.slice(0, VISIBLE_REASONS);

  return (
    <div
      className="p-3 rounded-xl bg-card/60 border border-border/40 
        hover:bg-primary/5 hover:border-primary/30 
        transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${500 + index * 60}ms` }}
    >
      {/* Top Row */}
      {reco.batch_name && (
        <p className="text-xs font-bold text-foreground mt-0.5 p-1 pb-2">
          Batch : {reco.batch_name}
        </p>
      )}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-2 py-0 h-5 font-medium",
              reco.priority === "CRITICAL"
                ? "border-purple-400 text-purple-400"
                : reco.priority === "HIGH"
                  ? "border-orange-500 text-orange-500"
                  : "border-primary text-primary",
            )}
          >
            {reco.priority}
          </Badge>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {reco.category.replace(/_/g, " ")}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {new Date(reco.generated_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm font-semibold text-foreground">{reco.title}</p>

      {reco.impact && (
        <p className="text-xs text-emerald-500 mt-1 font-medium">
          <CircleCheck className="w-3 h-3 inline mr-1" /> {reco.impact}
        </p>
      )}

      {reasons.length > 0 && (
        <div className="mt-2">
          <ul className="text-[11px] text-muted-foreground list-disc ml-4 space-y-1">
            {visibleReasons?.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary 
                hover:text-primary/80 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              />
              {expanded
                ? "View less"
                : `View ${reasons.length - VISIBLE_REASONS} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
