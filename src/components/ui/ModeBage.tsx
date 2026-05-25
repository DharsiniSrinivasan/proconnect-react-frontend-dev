import { cn } from "@/lib/utils";

type ModeType = "rail" | "road" | "air" | "sea";

interface ModeBadgeProps {
  mode: ModeType;
  className?: string;
}

const modeStyles: Record<ModeType, string> = {
  rail: "bg-badge-rail/15 text-badge-rail border-badge-rail/30",
  road: "bg-badge-road/15 text-badge-road border-badge-road/30",
  air: "bg-badge-air/15 text-badge-air border-badge-air/30",
  sea: "bg-badge-sea/15 text-badge-sea border-badge-sea/30",
};

const modeLabels: Record<ModeType, string> = {
  rail: "Rail",
  road: "Road",
  air: "Air",
  sea: "Sea",
};

export const ModeBadge = ({ mode, className }: ModeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        modeStyles[mode],
        className,
      )}
    >
      {modeLabels[mode]}
    </span>
  );
};
