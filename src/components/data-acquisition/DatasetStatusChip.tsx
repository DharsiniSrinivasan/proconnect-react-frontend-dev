import { cn } from "@/lib/utils";

interface DatasetStatusChipProps {
  status?: string | undefined;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PROCESSING: {
    label: "Processing",
    className: "bg-primary/20 text-primary border-primary/40",
  },
  ANALYSED: {
    label: "Analytics",
    className: "bg-secondary/20 text-secondary border-secondary/40",
  },
  ANALYSING: {
    label: "Analytics",
    className: "bg-secondary/20 text-secondary border-secondary/40",
  },
  READY: {
    label: "Ready",
    className: "bg-chart-2/20 text-chart-2 border-chart-2/40",
  },
  FAILED: {
    label: "Failed",
    className: "bg-destructive/20 text-destructive border-destructive/40",
  },
  INITIATED: {
    label: "Initiated",
    className: "bg-muted/40 text-muted-foreground border-muted-foreground/40",
  },
  INITIATE: {
    label: "Initiated",
    className: "bg-muted/40 text-muted-foreground border-muted-foreground/40",
  },
  QUEUED: {
    label: "Queued",
    className: "bg-chart-4/20 text-chart-4 border-chart-4/40",
  },
  QUEUE: {
    label: "Queued",
    className: "bg-chart-4/20 text-chart-4 border-chart-4/40",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-chart-2/20 text-chart-2 border-chart-2/40",
  },
  COMPLETED_WITH_ERRORS: {
    label: "Completed with Errors",
    className: "bg-chart-5/20 text-chart-5 border-chart-5/40",
  },
  CRITICAL: {
    label: "Critical",
    className: "bg-destructive/20 text-destructive border-destructive/40",
  },
  WARNING: {
    label: "Warning",
    className: "bg-chart-5/20 text-chart-5 border-chart-5/40",
  },
  UPLOADED: {
    label: "Uploaded",
    className: "bg-chart-2/20 text-chart-2 border-chart-2/40",
  },
};

export const DatasetStatusChip = ({
  status,
  className,
}: DatasetStatusChipProps) => {
  const config = statusConfig[
    status?.toUpperCase() as keyof typeof statusConfig
  ] ?? {
    label: "Unknown",
    className: "bg-muted/30 text-muted-foreground border-muted/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};
