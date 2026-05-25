import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface WhyTriggeredCardProps {
  triggers: string[];
  explanations: any;
}

export const WhyTriggeredCard = ({
  triggers,
  explanations,
}: WhyTriggeredCardProps) => {
  return (
    <NeonCard title="Why Generated" className="h-auto">
      <ul className="space-y-3">
        {triggers?.map((trigger, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-primary" />
            </div>
            <span className="text-muted-foreground leading-relaxed">
              {trigger}
            </span>
          </li>
        ))}
      </ul>

      {explanations?.whyTriggered_explanation?.length > 0 && (
        <>
          <div className="text-sm font-bold text-foreground mt-4">
            Explanations :
          </div>
          <ul className="space-y-3 mt-4">
            {explanations.whyTriggered_explanation.map((trigger, index) => (
              <li
                key={`why-${index}`}
                className="flex items-start gap-3 text-sm"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-3 h-3 text-primary" />
                </div>
                <span className="text-muted-foreground leading-relaxed">
                  {trigger}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </NeonCard>
  );
};

export const WhyTriggeredCardSkeleton = () => (
  <NeonCard title="Why Generated">
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </NeonCard>
);
