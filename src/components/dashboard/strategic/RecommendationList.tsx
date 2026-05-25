import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/mocks/strategicDashboard.mock";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const impactColors: Record<Recommendation["impact"], string> = {
  High: "text-success",
  Medium: "text-warning",
  Low: "text-muted-foreground",
};

const statusStyles: Record<Recommendation["status"], string> = {
  New: "chip-secondary",
  "In Review": "chip-warning",
  Approved: "chip-success",
  Implemented: "chip-primary",
};

const categoryIcons: Record<Recommendation["category"], string> = {
  "Cost Optimisation": "💰",
  "Network Expansion": "🌐",
  "Partner Strategy": "🤝",
  "Capacity Planning": "📊",
  "Risk Mitigation": "🛡️",
  "TAT Improvement": "⏱️",
};

export const RecommendationList = ({
  recommendations,
}: RecommendationListProps) => {
  return (
    <div className="glass-card neon-border">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">
            Key Strategic Recommendations
          </h3>
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary hover:text-primary hover:bg-primary/10"
        >
          View all recommendations
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
      <div className="divide-y divide-border/30">
        {recommendations?.slice(0, 5)?.map((rec, index) => (
          <div
            key={rec.id}
            className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{categoryIcons[rec.category]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {rec.id}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[rec.status]}`}
                  >
                    {rec.status}
                  </span>
                </div>
                <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {rec.title}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="opacity-70">Impact:</span>
                    <span className={`font-medium ${impactColors[rec.impact]}`}>
                      {rec.impact}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="opacity-70">Confidence:</span>
                    <span className="font-mono text-foreground">
                      {rec.confidencePercent}%
                    </span>
                  </span>
                  <span className="text-muted-foreground/70">
                    {rec.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecommendationListSkeleton = () => (
  <div className="glass-card">
    <div className="p-4 border-b border-border/50 flex items-center justify-between">
      <div className="skeleton-glow h-5 w-56 rounded" />
      <div className="skeleton-glow h-8 w-40 rounded" />
    </div>
    <div className="divide-y divide-border/30">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-start gap-3">
            <div className="skeleton-glow w-8 h-8 rounded" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-glow h-4 w-32 rounded" />
              <div className="skeleton-glow h-4 w-full rounded" />
              <div className="skeleton-glow h-3 w-48 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
