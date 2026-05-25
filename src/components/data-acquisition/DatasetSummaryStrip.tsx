import {
  Database,
  TrendingUp,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  ListOrdered,
  XCircle,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  colorClass: string;
}

const SummaryItem = ({
  icon: Icon,
  label,
  value,
  colorClass,
}: SummaryItemProps) => (
  <div className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl border border-border/30">
    <div className={cn("p-2 rounded-lg", colorClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  </div>
);
export interface DatasetSummary {
  totalDatasets?: number;
  analysed?: number;
  ready?: number;
  failed?: number;
  avgDqs?: number;
  totalbatches?: number;
  processed?: number;
  initiate?: number;
  queue?: number;
}

interface DatasetSummaryStripProps {
  summary: DatasetSummary;
}

export const DatasetSummaryStrip = ({ summary }: DatasetSummaryStripProps) => {
  const items: SummaryItemProps[] = [
    {
      icon: Database,
      label: "Total Batches",
      value: summary.totalbatches ?? 0,
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: PlayCircle,
      label: "Initiated",
      value: summary.initiate ?? 0,
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: ListOrdered,
      label: "Queue",
      value: summary.queue ?? 0,
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: Loader,
      label: "Processing",
      value: summary.processed ?? 0,
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      value: summary.analysed ?? 0,
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: CheckCircle2,
      label: "Ready",
      value: summary.ready ?? 0,
      colorClass: "bg-success/20 text-success",
    },
    {
      icon: XCircle,
      label: "Failed",
      value: summary.failed ?? 0,
      colorClass: "bg-destructive/20 text-destructive",
    },
    {
      icon: TrendingUp,
      label: "Avg. DQS",
      value: summary.avgDqs != null ? `${summary.avgDqs.toFixed(2)}%` : "N/A",
      colorClass: "bg-secondary/20 text-secondary",
    },
  ];

  return (
<div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
  {items?.map((item) => (
    <SummaryItem key={item.label} {...item} />
  ))}
</div>
  );
};

export const DatasetSummaryStripSkeleton = () => (
  <div className="flex flex-wrap gap-4">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-[72px] w-[180px] rounded-xl" />
    ))}
  </div>
);
