import { cn } from "@/lib/utils";
import type {
  MasterStatus,
  PartnerSegment,
  FacilityTier,
  TransportMode,
} from "@/mocks/masterData.mock";

const statusStyles: Record<MasterStatus, string> = {
  Active: "bg-teal-500/15 text-teal-600 border-teal-500/30 font-semibold",
  Inactive: "bg-stone-400/15 text-stone-500 border-stone-400/25 font-semibold",
  Pending:
    "bg-orange-500/15 text-orange-600 border-orange-500/30 font-semibold",
  Suspended: "bg-pink-500/15 text-pink-600 border-pink-500/30 font-semibold",
  Approved: "bg-green-500/15 text-green-600 border-green-500/30 font-semibold",
  Rejected: "bg-red-500/15 text-red-600 border-red-500/30 font-semibold",
};

const segmentStyles: Record<PartnerSegment, string> = {
  Premium: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Standard: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Economy: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const tierStyles: Record<FacilityTier, string> = {
  "Mother Hub": "bg-primary/20 text-primary border-primary/30",
  "Satellite Hub": "bg-secondary/20 text-secondary border-secondary/30",
  "Satellite WH": "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
};

const modeStyles: Record<TransportMode, string> = {
  Road: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  Rail: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  Air: "bg-violet-500/20 text-violet-500 border-violet-500/30",
  Sea: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
};

interface ChipProps {
  className?: string;
}

export const StatusChip = ({
  status,
  className,
}: { status: string } & ChipProps) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-full text-xs border",
      statusStyles[status],
      className,
    )}
  >
    {status}
  </span>
);

export const SegmentChip = ({
  segment,
  className,
}: { segment: PartnerSegment } & ChipProps) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-full text-xs border",
      segmentStyles[segment],
      className,
    )}
  >
    {segment}
  </span>
);

export const TierChip = ({
  tier,
  className,
}: { tier: string } & ChipProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs border",
      "whitespace-nowrap",          
      "max-w-[120px] sm:max-w-none", 
      "truncate",                  
      tierStyles[tier],
      className
    )}
    title={tier}
  >
    {tier}
  </span>
);

export const ModeChip = ({
  mode,
  className,
}: { mode: TransportMode } & ChipProps) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-full text-xs border",
      modeStyles[mode],
      className,
    )}
  >
    {mode}
  </span>
);
