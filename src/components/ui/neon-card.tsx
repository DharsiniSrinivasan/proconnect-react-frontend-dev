import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface NeonCardProps {
  title?: string;
  count?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const NeonCard = ({
  title,
  count,
  action,
  children,
  className,
  style,
}: NeonCardProps) => {
  return (
    <div
      className={cn("glass-card rounded-xl p-5 h-full", className)}
      style={style}
    >
      {(title || action || count) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {title && (
              <h3 className="text-sm md:text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full" />
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-4">
            {count && (
              <span className="text-sm font-semibold text-muted-foreground">
                Total Records: {count}
              </span>
            )}
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
