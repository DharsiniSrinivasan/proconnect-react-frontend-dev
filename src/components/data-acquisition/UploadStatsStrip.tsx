import {
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  colorClass: string;
}

const StatItem = ({ icon: Icon, label, value, colorClass }: StatItemProps) => (
  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 glass-card rounded-lg sm:rounded-xl border border-border/30">
    <div className={cn("p-1.5 sm:p-2 rounded-lg", colorClass)}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-xs text-muted-foreground truncate">{label}</p>
      <p className="text-base sm:text-lg font-semibold text-foreground truncate">{value}</p>
    </div>
  </div>
);

interface UploadStatsStripProps {
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  dataQualityScore: number;
  quarantineCount: number;
}

const formatToIndianCompact = (num: number): string => {
  const format = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(2);

  if (num >= 1e7) return `${format(num / 1e7)}Cr`;
  if (num >= 1e5) return `${format(num / 1e5)}L`;
  if (num >= 1e3) return `${format(num / 1e3)}K`;

  return format(num);
};

export const UploadStatsStrip = ({
  totalRecords,
  validRecords,
  errorRecords,
  dataQualityScore,
  quarantineCount,
}: UploadStatsStripProps) => {
  const items: StatItemProps[] = [
    {
      icon: FileText,
      label: "Total Records",
      value: formatToIndianCompact(totalRecords ?? 0),
      colorClass: "bg-primary/20 text-primary",
    },
    {
      icon: CheckCircle,
      label: "Valid Records",
      value: formatToIndianCompact(validRecords ?? 0),
      colorClass: "bg-chart-2/20 text-chart-2",
    },
    {
      icon: XCircle,
      label: "Error Records",
      value: formatToIndianCompact(errorRecords ?? 0),
      colorClass: "bg-destructive/20 text-destructive",
    },
    {
      icon: TrendingUp,
      label: "Data Quality Score",
      value:
        typeof dataQualityScore === "number"
          ? `${dataQualityScore.toFixed(2)}%`
          : "—",
      colorClass: "bg-secondary/20 text-secondary",
    },
    {
      icon: Shield,
      label: "Error Count",
      value: formatToIndianCompact(quarantineCount ?? 0),
      colorClass: "bg-chart-5/20 text-chart-5",
    },
  ];

  return (
    <div className="w-full">

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
        {items?.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>

      <div className="hidden md:flex flex-wrap gap-4">
        {items?.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};

export const UploadStatsStripSkeleton = () => (
  <div className="w-full">
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-[60px] sm:h-[72px] w-full rounded-lg sm:rounded-xl" />
      ))}
    </div>
    <div className="hidden md:flex flex-wrap gap-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-[72px] w-[180px] rounded-xl" />
      ))}
    </div>
  </div>
);