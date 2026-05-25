import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationDetail } from "@/mocks/recommendations.mock";
import { RecoStatusChip } from "./RecoStatusChip";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecoHeaderProps {
  recommendation: RecommendationDetail;
}

export const RecoHeader = ({ recommendation }: RecoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-primary-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-primary font-mono">{recommendation?.id}</span>
            : {recommendation?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <RecoStatusChip type="category" value={recommendation?.category} />
            <RecoStatusChip type="priority" value={recommendation?.priority} />
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
              <span>Confidence:</span>
              <span className="font-semibold">
                {recommendation?.confidencePct}%
              </span>
            </div>
            <RecoStatusChip type="status" value={recommendation?.status} />
          </div>
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => handleAction('Approve')}
          >
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            onClick={() => handleAction('Reject')}
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
            onClick={() => handleAction('Mark Implemented')}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Mark Implemented
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 text-muted-foreground hover:text-foreground"
            onClick={() => handleAction('Assign Owner')}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Assign Owner
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export const RecoHeaderSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-32" />
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="space-y-3">
        <Skeleton className="h-8 w-96" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  </div>
);
