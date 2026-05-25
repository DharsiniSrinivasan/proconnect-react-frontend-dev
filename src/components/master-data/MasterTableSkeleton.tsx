import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";

interface MasterTableSkeletonProps {
  title: string;
  columns?: number;
  rows?: number;
}

export const MasterTableSkeleton = ({
  title,
  columns = 8,
  rows = 6,
}: MasterTableSkeletonProps) => (
  <NeonCard title={title} className="h-full">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </NeonCard>
);
