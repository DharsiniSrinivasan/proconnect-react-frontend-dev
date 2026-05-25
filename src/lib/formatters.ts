/**
 * Formatters
 * Common formatting utilities for the D2R application
 */

/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: number } = {},
): string {
  const { compact = true } = options;

  if (compact) {
      if (value >= 1_00_00_000)
      return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.00$/, "")}Cr`;
    if (value >= 1_00_000)
      return `₹${(value / 1_00_000).toFixed(2).replace(/\.00$/, "")}L`;
    if (value >= 1_000)
      return `₹${(value / 1_000).toFixed(2).replace(/\.00$/, "")}K`;
    return `₹${value}`;
  }else {
    return `₹${value.toLocaleString("en-IN")}`;
  }
}

/**
 * Format a number as percentage
 */
export function formatPercentage(
  value: number,
  options: { decimals?: number; showSign?: boolean } = {},
): string {
  const { decimals = 1, showSign = false } = options;
  const formatted = value.toFixed(decimals);
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${formatted}%`;
}

/**
 * Format a date string or Date object
 */
export function formatDate(
  date: string | Date,
  format: "short" | "long" | "relative" | "datetime" = "short",
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return String(date);
  }

  switch (format) {
    case "short":
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    case "long":
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    case "datetime":
      return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "relative": {
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(d, "short");
    }

    default:
      return d.toLocaleDateString("en-IN");
  }
}

/**
 * Format a number with compact notation (K, L, Cr)
 */
export function formatNumber(
  value: number,
  options: { compact?: boolean; decimals?: number } = {},
): string {
  const { compact = true, decimals = 0 } = options;

  if (compact) {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)}Cr`;
    }
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)}L`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
  }else{
     return `${value.toLocaleString("en-IN")}`;
  }

  return value.toLocaleString("en-IN");
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}
