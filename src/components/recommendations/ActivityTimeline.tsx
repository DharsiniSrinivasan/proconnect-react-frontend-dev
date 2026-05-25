import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "@/mocks/recommendations.mock";
import { Circle } from "lucide-react";

interface ActivityTimelineProps {
  activity: ActivityItem[];
}

export const ActivityTimeline = ({ activity }: ActivityTimelineProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <NeonCard title="Activity">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border/50" />

        <div className="space-y-4">
          {activity?.map((item, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Timeline dot */}
              <div
                className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center ${
                  index === 0
                    ? "bg-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                    : "bg-muted border border-border"
                }`}
              >
                <Circle
                  className={`w-2 h-2 ${index === 0 ? "fill-white text-white" : "fill-muted-foreground text-muted-foreground"}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <p className="text-sm text-foreground font-medium">
                  {item.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {item.by}
                  </span>
                  <span className="text-xs text-muted-foreground/50">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NeonCard>
  );
};

export const ActivityTimelineSkeleton = () => (
  <NeonCard title="Activity">
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  </NeonCard>
);
