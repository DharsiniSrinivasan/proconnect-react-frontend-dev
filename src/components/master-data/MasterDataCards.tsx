import React from "react";
import {
  Eye,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// CARD COMPONENTS - Unified Design System
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={cn(
      "rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200",
      className,
    )}
  >
    {children}
  </div>
);

interface StatCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  variant?: "default" | "success" | "warning" | "error";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  icon,
  trend,
  variant = "default",
}) => {
  const variantStyles = {
    default: "border-primary/30 bg-primary/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    error: "border-error/30 bg-error/5",
  };

  const trendColor =
    trend && trend > 0
      ? "text-success"
      : trend && trend < 0
        ? "text-error"
        : "";

  return (
    <Card className={variantStyles[variant]}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">
                {typeof value === "number" ? value.toLocaleString() : value}
              </h3>
              {trend !== undefined && (
                <span
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1",
                    trendColor,
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface MasterDataCardProps {
  icon?: React.ReactNode;
  title: string;
  count: number;
  description?: string;
  status?: "pending" | "active" | "archived";
  onView?: () => void;
  onAdd?: () => void;
  loading?: boolean;
}

export const MasterDataCard: React.FC<MasterDataCardProps> = ({
  icon,
  title,
  count,
  description,
  status = "active",
  onView,
  onAdd,
  loading = false,
}) => {
  const statusConfig = {
    pending: {
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
      badgeText: "Pending",
      badgeBg: "bg-warning/20",
      badgeColour: "text-warning",
    },
    active: {
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
      badgeText: "Active",
      badgeBg: "bg-success/20",
      badgeColour: "text-success",
    },
    archived: {
      bgColor: "bg-muted/10",
      borderColor: "border-muted/30",
      badgeText: "Archived",
      badgeBg: "bg-muted/20",
      badgeColour: "text-muted-foreground",
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        "group hover:shadow-lg hover:border-primary/50 overflow-hidden",
        config.borderColor,
        config.bgColor,
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all duration-200">
              <div className="w-6 h-6 text-primary">{icon}</div>
            </div>
          )}
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              config.badgeBg,
              config.badgeColour,
            )}
          >
            {config.badgeText}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-3xl font-bold text-primary mb-2">
          {count.toLocaleString()}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/30">
          {onView && (
            <button
              onClick={onView}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

interface RecordCardProps {
  title: string;
  subtitle?: string;
  fields: Array<{
    label: string;
    value: string | number | React.ReactNode;
    highlight?: boolean;
  }>;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "error" | "info";
  };
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
  }>;
  onHover?: boolean;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  title,
  subtitle,
  fields,
  badge,
  actions,
  onHover = true,
}) => {
  const badgeColorMap = {
    default: "bg-primary/20 text-primary border-primary/30",
    success: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    error: "bg-error/20 text-error border-error/30",
    info: "bg-info/20 text-info border-info/30",
  };

  return (
    <Card
      className={cn(
        "group transition-all duration-200",
        onHover && "hover:border-primary/50 hover:shadow-md",
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium border whitespace-nowrap ml-2",
                badgeColorMap[badge.variant || "default"],
              )}
            >
              {badge.text}
            </span>
          )}
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {fields?.map((field, index) => (
            <div
              key={index}
              className={cn(
                "text-xs",
                field.highlight &&
                  "col-span-2 p-2 rounded bg-primary/5 border border-primary/20",
              )}
            >
              <p className="text-muted-foreground font-medium mb-0.5">
                {field.label}
              </p>
              <p className="text-foreground font-semibold">{field.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 pt-3 border-t border-border/30">
            {actions?.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200",
                  action.variant === "danger"
                    ? "bg-error/10 text-error border border-error/30 hover:bg-error/20"
                    : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20",
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

interface StatusBadgeProps {
  status: "active" | "pending" | "archived" | "error" | "success";
  icon?: React.ReactNode;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  icon,
  label,
}) => {
  const statusConfig = {
    active: "bg-success/20 text-success border-success/30",
    pending: "bg-warning/20 text-warning border-warning/30",
    archived: "bg-muted/20 text-muted-foreground border-muted/30",
    error: "bg-error/20 text-error border-error/30",
    success: "bg-success/20 text-success border-success/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        statusConfig[status],
      )}
    >
      {icon}
      {label || status}
    </span>
  );
};

interface ApprovalBadgeProps {
  count: number;
  type: "awaiting" | "rejected" | "approved";
}

export const ApprovalBadge: React.FC<ApprovalBadgeProps> = ({
  count,
  type,
}) => {
  const typeConfig = {
    awaiting: {
      icon: <Clock className="w-3 h-3" />,
      text: "Awaiting",
      color: "bg-warning/20 text-warning border-warning/30",
    },
    rejected: {
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Rejected",
      color: "bg-error/20 text-error border-error/30",
    },
    approved: {
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Approved",
      color: "bg-success/20 text-success border-success/30",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-sm",
        config.color,
      )}
    >
      {config.icon}
      <span>{count}</span>
      <span className="text-xs">{config.text}</span>
    </div>
  );
};

// Skeleton Loaders
export const CardSkeleton: React.FC = () => (
  <Card>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
        <div className="w-16 h-6 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-6 w-32 rounded bg-muted animate-pulse mb-2" />
      <div className="h-4 w-full rounded bg-muted animate-pulse mb-4" />
      <div className="flex gap-2">
        <div className="flex-1 h-9 rounded bg-muted animate-pulse" />
        <div className="flex-1 h-9 rounded bg-muted animate-pulse" />
      </div>
    </div>
  </Card>
);

export const RecordCardSkeleton: React.FC = () => (
  <Card>
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-4 w-32 rounded bg-muted animate-pulse mb-2" />
          <div className="h-3 w-24 rounded bg-muted/50 animate-pulse" />
        </div>
        <div className="w-16 h-6 rounded bg-muted animate-pulse" />
      </div>
      <div className="space-y-2 mb-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-3 w-full rounded bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    </div>
  </Card>
);
