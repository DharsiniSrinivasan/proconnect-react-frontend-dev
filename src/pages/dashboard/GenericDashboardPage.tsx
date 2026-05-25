/**
 * Generic Insights Dashboard
 *
 * Landing page showing comprehensive app-wide metrics including:
 * - System overview (users, datasets, masters)
 * - Data quality metrics
 * - Status trends
 * - Alerts & recent activity
 * - Key operational KPIs
 * - Regional performance
 * - Facility utilization
 * - Cost analysis
 *
 * ENHANCED: Added skeleton loaders for each card section
 * FIXED: Grid layout now properly fills space when conditional sections are hidden
 * UPDATED: Empty arrays now show "No data" message instead of loaders
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Gauge,
  Lightbulb,
  AlertTriangle,
  Building2,
  Users,
  Database,
  Handshake,
  CreditCard,
  Activity,
  ChevronRight,
  Upload,
  MessageSquare,
  AlertOctagon,
  InfoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useTilesStore } from "@/stores/masterStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";
// =====================================================
// ALERTS DATA
// =====================================================

interface Alert {
  id: string;
  priority: string;
  title: string;
  description: string;
  created_date: string;
  type: string;
}

const CardSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <Skeleton className="h-5 w-20 rounded" />
    <Skeleton className="h-8 w-32 rounded" />
    <Skeleton className="h-4 w-24 rounded" />
  </div>
);

const AlertSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2 p-3 rounded-lg bg-card/50">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    ))}
  </div>
);

const RegionalSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2 py-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </div>
    ))}
  </div>
);

const ListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    ))}
  </div>
);

const ProgressSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-4 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-2 w-full rounded" />
      </div>
    ))}
  </div>
);

const GridSkeleton = ({ cols = 2 }: { cols?: number }) => (
  <div className={`grid grid-cols-${cols} gap-4 animate-pulse`}>
    {[...Array(cols === 2 ? 2 : 4)].map((_, i) => (
      <div key={i} className="p-4 rounded-lg bg-card/50 space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
    ))}
  </div>
);

// =====================================================
// COMPONENTS
// =====================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: { value: string; isPositive: boolean };
  color?: "primary" | "success" | "warning" | "warning";
  index: number;
  onClick?: () => void;
  isLoading?: boolean;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  color = "primary",
  index,
  onClick,
  isLoading,
}: StatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success text-chart-2",
    warning: "bg-warning text-chart-4",
    destructive: "bg-warning/10 text-warning",
  };

  if (isLoading) {
    return (
      <div
        className="glass-card rounded-xl p-4 animate-fade-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start justify-between">
          <Skeleton className="w-5 h-5 rounded-lg" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>
    );
  }
  const isClickable = !!onClick;
  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!isClickable) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "glass-card rounded-xl p-4 animate-fade-in transition-all duration-200",
        isClickable && "cursor-pointer hover:scale-[1.02] hover:bg-card/80",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isPositive ? "text-chart-2" : "text-warning",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value || "--"}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
};
const AlertLegend = () => {
  const legend = [
    {
      label: "Critical",
      icon: AlertOctagon,
      color: "text-pink-500",
      description: "Requires immediate attention",
    },
    {
      label: "Warning",
      icon: AlertTriangle,
      color: "text-amber-500",
      description: "Potential issue that may need action",
    },
    {
      label: "Info",
      icon: InfoIcon,
      color: "text-blue-500",
      description: "General informational update",
    },
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
      {legend.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-1.5">
            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
            {/* <span className="hidden sm:inline">– {item.description}</span> */}
          </div>
        );
      })}
    </div>
  );
};
const AlertItem = ({ alert, index }: { alert: Alert; index: number }) => {
  const typeConfig = {
    Critical: {
      icon: AlertOctagon,
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-500",
      borderColor: "border-pink-500/30",
    },
    Warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/30",
    },
    Info: {
      icon: InfoIcon,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/30",
    },
  } as const;

  const config =
    typeConfig[alert?.priority as keyof typeof typeConfig] ?? typeConfig.Info;

  const Icon = config.icon;
  const convertUTCtoIST = (utcDateString: string) => {
    const date = new Date(utcDateString);
    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() + istOffset);
  };
  const getTimeAge = (dateString: string) => {
    const istDate = convertUTCtoIST(dateString);
    const diff = Date.now() - istDate.getTime();

    if (diff < 0) return "in the future";

    const mins = Math.floor(diff / 60000);

    if (mins === 0) return "just now";

    if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;

    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border animate-fade-in transition-all duration-200 hover:bg-card/50",
        config.bgColor,
        config.borderColor,
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.textColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", config.textColor)}>
            {alert.title}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
            {alert.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {alert.description}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">
          {getTimeAge(alert.created_date)}
        </p>
      </div>
    </div>
  );
};

const ActivityItem = ({
  event,
  index,
}: {
  event: any | null | undefined;
  index: number;
}) => {
  if (!event) return null;

  const actionConfig: Record<
    string,
    { icon: React.ElementType; color: string }
  > = {
    Upload: { icon: Upload, color: "text-chart-2" },
    "Master Edit": { icon: Database, color: "text-chart-4" },
    "Recommendation Decision": { icon: Lightbulb, color: "text-primary" },
    "AI Chat": { icon: MessageSquare, color: "text-chart-5" },
    Login: { icon: Users, color: "text-muted-foreground" },
  };

  const config = actionConfig[event.action ?? ""] || {
    icon: Activity,
    color: "text-muted-foreground",
  };
  const Icon = config.icon;

  return (
    <div
      className="flex items-start gap-3 py-2.5 border-b border-border/20 last:border-0 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("p-1.5 rounded-md bg-card/50", config.color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-1">
          {(() => {
            try {
              const parsed =
                typeof event.details === "string"
                  ? JSON.parse(event.details)
                  : event.details;

              return parsed?.message ?? "No details";
            } catch {
              return "No details";
            }
          })()}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {event.user ?? "Unknown user"}
          </span>
          <span className="text-[10px] text-muted-foreground/50">•</span>
          <span className="text-xs text-muted-foreground/70">
            {event.created_date
              ? new Date(event.created_date).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "--"}
          </span>
        </div>
      </div>
    </div>
  );
};

const DatasetStatusChart = ({ status_counts }: any) => {
  const ready = status_counts?.ready ?? 0;
  const analysed = status_counts?.analyzed ?? 0;
  const processing = status_counts?.processed ?? 0;
  const failed = status_counts?.failed ?? 0;
  const total = status_counts?.total ?? 0;

  const safePct = (value: number) => (total > 0 ? (value / total) * 100 : 0);

  const statuses = [
    {
      label: "Ready",
      value: ready,
      color: "bg-success",
      pct: safePct(ready),
    },
    {
      label: "Analysed",
      value: analysed,
      color: "bg-secondary",
      pct: safePct(analysed),
    },
    {
      label: "Processing",
      value: processing,
      color: "bg-warning",
      pct: safePct(processing),
    },
    {
      label: "Failed",
      value: failed,
      color: "bg-warning",
      pct: safePct(failed),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden bg-card/50">
        {statuses.map((s) => (
          <div
            key={s.label}
            className={cn("h-full transition-all", s.color)}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statuses.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full", s.color)} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className="text-xs font-medium text-foreground ml-auto">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Region {
  region: string;
  shipments: number;
  on_time_percentage: number;
  avg_tat_days: number;
  delayed_shipments: number;
  delayed: number;
}

interface RegionalPerformanceProps {
  regions: Region[];
  isLoading?: boolean;
}

const RegionalPerformance = ({
  regions,
  isLoading,
}: RegionalPerformanceProps) => {
  if (isLoading) {
    return <RegionalSkeleton />;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mt-4 mx-2 mb-2">
        An overview of logistics performance across regions, highlighting
        freight costs, delivery timelines, and operational efficiency
      </p>
      {Array.isArray(regions) &&
        regions.map((region, i) => (
          <div
            key={region.region ?? i}
            className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {region?.region ?? "--"}
              </p>
              <p className="text-xs text-muted-foreground">
                {region?.shipments?.toLocaleString() ?? "--"} shipments
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    region.on_time_percentage >= 90
                      ? "text-chart-2"
                      : region.on_time_percentage >= 85
                        ? "text-chart-4"
                        : "text-warning",
                  )}
                >
                  {region?.on_time_percentage ?? 0}%
                </p>
                <p className="text-[10px] text-muted-foreground">On-Time</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {region?.avg_tat_days ?? "--"}d
                </p>
                <p className="text-[10px] text-muted-foreground">Avg TAT</p>
              </div>

              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    region.delayed <= 400
                      ? "text-chart-2"
                      : region.delayed <= 500
                        ? "text-chart-4"
                        : "text-warning",
                  )}
                >
                  {region?.delayed ?? 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Delayed</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const FacilityUtilizationPanel = ({
  facilities,
  isLoading,
}: {
  facilities?: any[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <ProgressSkeleton rows={3} />;
  }

  if (!Array.isArray(facilities) || facilities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No facility utilization data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {facilities.map((facility, i) => {
        const utilization = Number(facility?.utilization_percentage ?? 0);

        return (
          <div
            key={facility?.id ?? i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{facility?.facility_name ?? "--"}</span>

              <span
                className={cn(
                  "text-sm font-medium",
                  utilization >= 90
                    ? "text-warning"
                    : utilization >= 75
                      ? "text-chart-4"
                      : "text-chart-2",
                )}
              >
                {utilization.toFixed(2)}%
              </span>
            </div>

            <Progress
              value={utilization}
              className={cn(
                "h-2",
                utilization >= 90
                  ? "[&>div]:bg-warning"
                  : utilization >= 75
                    ? "[&>div]:bg-chart-4"
                    : "[&>div]:bg-chart-2",
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

interface Courier {
  courier_name?: string;
  totalValue?: number;
  on_time_percentage?: number;
  shipments?: number;
}

interface CourierPerformancePanelProps {
  couriers?: Courier[] | null;
  totalValue?: number;
  isLoading?: boolean;
}

const CourierPerformancePanel = ({
  couriers = [],
  totalValue = 0,
  isLoading,
}: CourierPerformancePanelProps) => {
  if (isLoading) {
    return <ListSkeleton rows={4} />;
  }

  if (!Array.isArray(couriers) || couriers.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No transporter performance data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {couriers.map((courier, i) => {
        const pct = courier.on_time_percentage;

        return (
          <div
            key={courier?.courier_name ?? i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm text-foreground truncate max-w-[140px]"
                  title={courier?.courier_name ?? ""}
                >
                  {courier?.courier_name ?? "Unknown Courier"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-xs font-medium",
                    (courier?.on_time_percentage ?? 0) >= 90
                      ? "text-chart-2"
                      : (courier?.on_time_percentage ?? 0) >= 85
                        ? "text-chart-4"
                        : "text-warning",
                  )}
                >
                  {courier?.on_time_percentage ?? 0}%
                </span>

                <span className="text-sm font-medium text-foreground">
                  {(courier?.shipments ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Progress value={pct} className="h-1.5 cursor-pointer" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>On-Time Percentage: {pct}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      })}

      <div className="pt-2 border-t border-border/30 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Total Shipments
        </span>
        <span className="text-lg font-bold text-foreground">
          {(totalValue ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

interface SLATrendItem {
  period?: string;
  week?: string;
  sla_percentage?: number;
  breaches?: number;
}

interface SLATrendPanelProps {
  slaData?: {
    items?: SLATrendItem[] | null;
  } | null;
  monthly_average?: number;
  isLoading?: boolean;
}

const SLATrendPanel = ({
  slaData,
  monthly_average = 0,
  isLoading,
}: SLATrendPanelProps) => {
  if (isLoading) {
    return <ListSkeleton rows={4} />;
  }

  const trends = Array.isArray(slaData) ? slaData : [];

  if (!trends.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No SLA trend data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground pb-2 border-b border-border/30">
        <span>Period</span>
        <span className="text-center">SLA %</span>
        <span className="text-right">Breaches</span>
      </div>

      {trends.map((t, i) => {
        const sla = Number(t?.sla_percentage ?? 0);
        const breaches = Number(t?.breaches ?? 0);

        return (
          <div
            key={t?.period ?? i}
            className="grid grid-cols-3 gap-2 py-1.5 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-sm text-foreground">{t?.period ?? "-"}</span>

            <span
              className={cn(
                "text-sm font-medium text-center",
                sla >= 94
                  ? "text-chart-2"
                  : sla >= 92
                    ? "text-chart-4"
                    : "text-warning",
              )}
            >
              {sla}%
            </span>

            <span
              className={cn(
                "text-sm text-right",
                breaches <= 160
                  ? "text-chart-2"
                  : breaches <= 200
                    ? "text-chart-4"
                    : "text-warning",
              )}
            >
              {breaches}
            </span>
          </div>
        );
      })}

      <div className="pt-2 border-t border-border/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Monthly Avg</span>
        <span className="text-sm font-medium text-chart-2">
          {monthly_average}%
        </span>
      </div>
    </div>
  );
};

interface Partner {
  partner_id?: number;
  name?: string;
  lane_count?: number;
  transport_mode?: string;
  average_rate?: string;
  avg_oda_percentage?: string;
}

interface PartnerHealthListProps {
  topPartners?: Partner[] | null;
  isLoading?: boolean;
}

const PartnerHealthList = ({
  topPartners = [],
  isLoading,
}: PartnerHealthListProps) => {
  if (isLoading) {
    return <ListSkeleton rows={3} />;
  }

  if (!Array.isArray(topPartners) || topPartners.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No partner data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topPartners.map((partner, i) => (
        <div
          key={partner?.partner_id ?? i}
          className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex flex-col flex-1 min-w-0">
            <p
              className="text-sm font-medium text-foreground truncate"
              title={partner?.name ?? ""}
            >
              {partner?.name ?? "Unknown Partner"}
            </p>
            <p className="text-xs text-muted-foreground">
              {partner?.lane_count ?? 0} lanes • {partner?.transport_mode ?? ""}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 min-w-[140px] justify-end">
            <div className="text-right w-[70px]">
              <p className="text-sm font-medium text-emerald-400">
                {partner?.average_rate ?? "0"}
              </p>
              <p className="text-[10px] text-muted-foreground">Avg Rate</p>
            </div>

            <div className="text-right w-[50px]">
              <p
                className={cn(
                  "text-sm font-medium",
                  Number(partner?.avg_oda_percentage ?? 0) >= 30
                    ? "text-chart-4"
                    : "text-chart-2",
                )}
              >
                {partner?.avg_oda_percentage ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">ODA</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickActions = ({ navigate }: { navigate: (path: string) => void }) => {
  const actions = [
    {
      icon: Upload,
      label: "Upload Data",
      path: "/data/new-upload",
      color: "text-chart-2",
    },
    {
      icon: Database,
      label: "View Datasets",
      path: "/data/datasets",
      color: "text-primary",
    },
    {
      icon: Lightbulb,
      label: "Recommendations",
      path: "/recommendations/feed",
      color: "text-chart-4",
    },
    {
      icon: Users,
      label: "Master Data",
      path: "/master-data",
      color: "text-chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, i) => (
        <Button
          key={action.path}
          variant="ghost"
          className="h-auto py-3 flex flex-col items-center gap-2 bg-card/30 hover:bg-primary/10 border border-border/30"
          onClick={() => navigate(action.path)}
        >
          <action.icon className={cn("w-5 h-5", action.color)} />
          <span className="text-xs font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const GenericDashboardPage = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const {
    fetchSummary,
    fetchAlerts,
    // fetchRegionalPerformance,
    // fetchFacilityUtilization,
    // fetchTopCouriers,
    // fetchSlaTrends,
    // fetchPending,
    fetchPartnerHealth,
    fetchAudits,
    summary,
    alerts,
    // regional,
    // facilityUtil,
    // topCouriers,
    // total_shipments,
    // slaTrends,
    // pending,
    partnerHealth,
    audits,
  } = useDashboardStore();

  const { fetchTiles, data } = useTilesStore();
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const customerCount =
    data.find((item) => item.id === "customers")?.count || 0;
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchAlerts();
    // fetchRegionalPerformance();
    // fetchFacilityUtilization();
    // fetchTopCouriers();
    // fetchSlaTrends();
    // fetchPending();
    fetchPartnerHealth();

    if (hasPermission("manage-master-data")) {
      fetchTiles();
    }

    if (hasPermission("monitor-real-time-audit")) {
      fetchAudits(
        0,
        5,
        "all",
        "all",
        "all",
        "all",
        null,
        "timestamp",
        "Z_TO_A",
      );
    }
  }, []);

  if (loading) {
    return (
      <AppShell pageTitle="Insights Dashboard" pageSubtitle="Loading...">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }



  const bottomRowItemCount = [
    hasPermission("monitor-real-time-audit"), // Recent Activity (conditional)
    hasPermission("access-recommendations-dashboard"), // Recent Activity (conditional)
  ].filter(Boolean).length;
  const FacilityItemCount = [
    true, // Facility
    hasPermission("manage-master-data"), // Master data
  ].filter(Boolean).length;

  return (
    <AppShell
      pageTitle="Insights Dashboard"
      pageSubtitle="System Overview & Analytics"
      lastUpdated={new Date().toISOString()}
    >
      {/* System Overview Stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hasPermission("manage-users") && (
          <StatCard
            icon={Users}
            label="Active Users"
            value={summary?.users?.active_total ?? ""}
            color="primary"
            index={0}
            onClick={() => navigate("/admin/users")}
          />
        )}
        <StatCard
          icon={Database}
          label="Total Batches"
          value={summary?.batches?.total ?? ""}
          trend={
            summary?.batches?.this_week_added === "-0" ||
            summary?.batches?.this_week_added === "+0" ||
            summary?.batches?.this_week_added === "0"
              ? null
              : {
                  value: `${summary?.batches?.this_week_added ?? "--"} This week`,
                  isPositive: summary?.batches?.isPositive,
                }
          }
          color="success"
          index={1}
          onClick={() => navigate("/data/datasets")}
        />
        <StatCard
          icon={Gauge}
          label="Avg Data Quality"
          value={`${summary?.avg_data_quality?.percentage ?? 0}%`}
          color={
            Math.round(summary?.avg_data_quality?.percentage ?? 0) >= 85
              ? "success"
              : "warning"
          }
          index={2}
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={customerCount ?? ""}
          color="primary"
          index={3}
        />
      </section>

      {/* Main Content Grid - Row 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <NeonCard
          title="Active Alerts"
          className="animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-xs text-muted-foreground mt-4 mb-2">
            Current operational alerts requiring attention across the network.
          </p>
          <AlertLegend />
          {alerts === undefined || alerts === null ? (
            <AlertSkeleton />
          ) : !Array.isArray(alerts) || alerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No alerts available
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {alerts.map((alert, i) => (
                <AlertItem key={alert.id} alert={alert} index={i} />
              ))}
            </div>
          )}
        </NeonCard>
        <NeonCard
          title="Transporters Health"
          className="animate-fade-in"
          style={{ animationDelay: "550ms" }}
        >
          <p className="text-xs text-muted-foreground mt-4 mb-2">
            A concise assessment of transporter performance, reliability, and
            operational efficiency.
          </p>
          {partnerHealth === undefined || partnerHealth === null ? (
            <ListSkeleton rows={3} />
          ) : !Array.isArray(partnerHealth) || partnerHealth.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center p-4 mt-12">
              No transporter data available
            </div>
          ) : (
            <>
              <PartnerHealthList topPartners={partnerHealth} />
              {hasPermission("access-transporter") &&
                partnerHealth.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => navigate("/master-data/page/transporters")}
                  >
                    View All Transporters
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
            </>
          )}
        </NeonCard>

        {/* Regional Performance
        <NeonCard title="Regional Performance" className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          {regional === undefined || regional === null ? (
            <RegionalSkeleton />
          ) : !Array.isArray(regional) || regional.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No regional data available
            </div>
          ) : (
            <RegionalPerformance regions={regional} />
          )}
        </NeonCard> */}
      </section>

      {/* Main Content Grid - Row 2 (FIXED: Dynamic columns) */}
      <section className={`grid grid-cols-1 gap-6 lg:grid-cols-3`}>
        {/* Partner Health */}

        {/* Courier Performance */}
        {/* <NeonCard title="Top Transporters" className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-xs text-muted-foreground mt-4 mb-3">Leading transporters based on performance and service efficiency.</p>
          {topCouriers === undefined || topCouriers === null ? (
            <ListSkeleton rows={4} />
          ) : !Array.isArray(topCouriers) || topCouriers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No transporter data available
            </div>
          ) : (
            <CourierPerformancePanel couriers={topCouriers} totalValue={total_shipments ?? 0} />
          )}
        </NeonCard> */}

        {/* SLA Trends */}
        {/* <NeonCard title={`SLA Trends (${formattedDate ?? "--"})`} className="animate-fade-in" style={{ animationDelay: "450ms" }}>
          <p className="text-xs text-muted-foreground mt-4 mb-3">Summary of on-time performance and SLA compliance for February 2026</p>
          {slaTrends?.weekly === undefined || slaTrends?.weekly === null ? (
            <ListSkeleton rows={4} />
          ) : !Array.isArray(slaTrends?.weekly) || slaTrends.weekly.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No SLA data available
            </div>
          ) : (
            <SLATrendPanel slaData={slaTrends?.weekly} monthly_average={slaTrends?.monthly_avg} />
          )}
        </NeonCard> */}
      </section>

      {/* Facility Utilization Row */}
      <section
        className={`grid grid-cols-1 gap-6 ${
          FacilityItemCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
        }`}
      >
        {/* Facility Utilization */}
        {/* <NeonCard title="Facility Utilization" className="animate-fade-in" style={{ animationDelay: "350ms" }}>
          <p className="text-xs text-muted-foreground mt-4 mb-3">Overview of warehouse and hub capacity usage across facilities</p>
          {facilityUtil === undefined || facilityUtil === null ? (
            <ProgressSkeleton rows={3} />
          ) : !Array.isArray(facilityUtil) || facilityUtil.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No facility data available
            </div>
          ) : (
            <>
              <FacilityUtilizationPanel facilities={facilityUtil} />
              {hasPermission('access-facilities') && facilityUtil.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => navigate("/master-data/facilities")}
                >
                  View All Facilities
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </>
          )}
        </NeonCard> */}
        {/* Master Data Overview (conditional) */}
        {hasPermission("access-overview") && (
          <NeonCard
            title="Master Data Overview"
            className="animate-fade-in"
            style={{ animationDelay: "700ms" }}
          >
            <p className="text-xs text-muted-foreground mt-4 mb-2">
              Unified view of customer, transporter, facility, and rate card
              master data ensuring accuracy and consistency.
            </p>
            {data === undefined || data === null ? (
              <GridSkeleton cols={2} />
            ) : !Array.isArray(data) || data.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No master data available
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data.map((tile, i) => {
                  const iconMap: Record<string, React.ElementType> = {
                    Users: Users,
                    Handshake: Handshake,
                    Building2: Building2,
                    CreditCard: CreditCard,
                  };
                  const Icon = iconMap[tile.icon] || Database;

                  return (
                    <div
                      key={tile.id}
                      role="button"
                      tabIndex={0}
                      className="p-4 rounded-lg bg-card/50 border border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => navigate(tile.path)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(tile.path);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {tile.count.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tile.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </NeonCard>
        )}
        {hasPermission("monitor-real-time-audit") && (
          <NeonCard
            title="Recent Activity"
            className="animate-fade-in"
            style={{ animationDelay: "650ms" }}
          >
            <p className="text-xs text-muted-foreground mt-4 mb-2">
              Latest audit logs and compliance updates across operations
            </p>
            {audits === undefined || audits === null ? (
              <ListSkeleton rows={5} />
            ) : !Array.isArray(audits) || audits.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No activity data available
              </div>
            ) : (
              <div className="space-y-1">
                {audits.map((event, i) => (
                  <ActivityItem key={event.audit_id} event={event} index={i} />
                ))}
              </div>
            )}
            {audits && audits.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => navigate("/admin/audit")}
              >
                View Audit Trail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </NeonCard>
        )}
        <div />
      </section>
      <section
        className={`grid grid-cols-1 gap-6 ${
          bottomRowItemCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
        }`}
      >
        {/* Recent Activity */}

        {/* Pending Recommendations */}
        {/* {
          hasPermission("access-recommendations-dashboard") && (
            <NeonCard
              title="Recommendations"
              className="animate-fade-in flex flex-col"
              style={{ animationDelay: "500ms" }}
            >
              <p className="text-xs text-muted-foreground mt-4 mb-2">
                Key actions to optimize performance and improve efficiency.
              </p>

              {pending === undefined || pending === null ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : !Array.isArray(pending) || pending.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No recommendations available
                </div>
              ) : (
                <div className="flex-1 max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scroll">
                  {pending.map((reco, i) => (
                    <RecommendationCard key={reco.id} reco={reco} index={i} />
                  ))}
                </div>
              )}
            </NeonCard>
          )
        } */}
      </section>
    </AppShell>
  );
};

export default GenericDashboardPage;
