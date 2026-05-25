import { cn } from "@/lib/utils";

interface DqsChipProps {
  score: number;
  className?: string;
}

export const DqsChip = ({ score, className }: DqsChipProps) => {
 

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-muted/40 text-muted-foreground border-muted-foreground/40",
       // getColorClass(),
        className,
      )}
    >
      {score === 0 ? "—" : `${score}%`}
    </span>
  );
};
