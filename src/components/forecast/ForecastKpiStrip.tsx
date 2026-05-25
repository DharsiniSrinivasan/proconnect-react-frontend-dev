import type { ForecastKpi } from "@/mocks/forecasts.mock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ForecastKpiStripProps {
  kpis: ForecastKpi[];
}

const formatEvaluated = (evaluated: string) => {
  const match = evaluated.match(/([\d.]+) \* ([\d.]+) = ([\d.]+)/);

  if (!match) return evaluated;

  const base = parseFloat(match[1]).toFixed(2);
  const factor = parseFloat(match[2]).toFixed(2);
  const result = parseFloat(match[3]).toFixed(2);

  return `${base} * ${factor} = ${result}`;
};
/* ---------- Helpers ---------- */

const formatShortNumber = (num: number): string => {
  if (num >= 10000000)
    return (num / 10000000).toFixed(2).replace(/\.00$/, "") + "Cr";
  if (num >= 100000)
    return (num / 100000).toFixed(2).replace(/\.00$/, "") + "L";
  if (num >= 1000) return (num / 1000).toFixed(2).replace(/\.00$/, "") + "K";
  return Math.round(num).toString();
};

const formatCurrency = (num: number): string => {
  return "₹ " + num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const formatKpiValue = (kpi: ForecastKpi): string => {
  if (kpi.value === null || kpi.value === undefined || kpi.value === "") {
    return "-";
  }

  const numericValue = Number(kpi.value);

  if (isNaN(numericValue)) return kpi.value;

  if (kpi.id.includes("vol")) {
    return formatShortNumber(numericValue);
  }

  if (
    kpi.id.includes("freight") ||
    kpi.id.includes("scenario") ||
    kpi.id.includes("savings") ||
    kpi.id.includes("oda")
  ) {
    return formatCurrency(numericValue);
  }

  if (kpi.id.includes("growth")) {
    return numericValue.toFixed(1).replace(/\.0$/, "") + "%";
  }

  return Math.round(numericValue).toString();
};

/* ---------- Component ---------- */






export const ForecastKpiStrip = ({ kpis }: ForecastKpiStripProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-4">
        {kpis?.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-gradient-to-br from-muted/30 border border-border/50 to-transparent rounded-xl p-4 min-w-[140px] sm:min-w-[160px] flex-1 hover:scale-[1.02] transition-transform"
          >
            {/* Label + Info */}
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-muted-foreground tracking-wide">
                {kpi.label}
              </p>

             {/* Info icon if calculation or explanation exists */}
{(kpi.calculation || kpi.explanation) && (
  <>
    {/* Desktop Tooltip */}
    <div className="hidden sm:block">
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
        </TooltipTrigger>

        <TooltipPrimitive.Portal>
          <TooltipContent side="top" sideOffset={8} className="z-[9999] max-w-xs text-xs">
            <div className="space-y-1">
              {kpi.calculation && (
                <>
                  <p className="font-medium">Formula</p>
                  <p className="text-muted-foreground">{kpi.calculation.formula}</p>

                  <p className="font-medium mt-2">Calculation</p>
                  <p className="text-primary">{kpi.calculation.evaluated}</p>
                </>
              )}

              {kpi.explanation && (
                <>
                  <p className="font-medium mt-2">Explanation</p>
                  <p className="text-muted-foreground">{kpi.explanation}</p>
                </>
              )}
            </div>
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </div>

    {/* Mobile Popover */}
    <div className="block sm:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
        </PopoverTrigger>

        <PopoverContent className="w-[90vw] max-w-[150px] sm:w-64 text-xs p-3" align="center" side="bottom">
          <div className="space-y-1 break-words">
            {kpi.calculation && (
              <>
                <p className="font-medium">Formula</p>
                <p className="text-muted-foreground">{kpi.calculation.formula}</p>

                <p className="font-medium mt-2">Calculation</p>
                <p className="text-primary">{kpi.calculation.evaluated}</p>
              </>
            )}

            {kpi.explanation && (
              <>
                <p className="font-medium mt-2">Explanation</p>
                <p className="text-muted-foreground">{kpi.explanation}</p>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </>
)}
            </div>

            {/* Value */}
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">
              {formatKpiValue(kpi)}
            </p>

            {/* Subtext */}
          {kpi.subtext && (
  <>
    {/* Desktop */}
    <div className="hidden sm:block max-w-[140px]">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-xs text-muted-foreground truncate block cursor-default">
            {kpi.subtext}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs max-w-xs break-words">
          {kpi.subtext}
        </TooltipContent>
      </Tooltip>
    </div>

    {/* Mobile */}
    <div className="block sm:hidden max-w-[120px]">
      <Popover>
        <PopoverTrigger asChild>
          <span className="text-xs text-muted-foreground truncate block cursor-pointer">
            {kpi.subtext}
          </span>
        </PopoverTrigger>
        <PopoverContent className="text-xs p-3 w-[90vw] max-w-[200px] break-words">
          {kpi.subtext}
        </PopoverContent>
      </Popover>
    </div>
  </>
)}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};
/* ---------- Skeleton ---------- */

export const ForecastKpiStripSkeleton = () => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="skeleton-glow w-4 h-4 rounded" />
        <div className="skeleton-glow h-4 w-32 rounded" />
      </div>
      <div className="skeleton-glow h-7 w-24 rounded" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-glow h-24 rounded-xl" />
      ))}
    </div>
  </div>
);