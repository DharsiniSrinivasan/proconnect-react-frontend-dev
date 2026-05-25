import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrentVsProposed } from "@/mocks/recommendations.mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";

interface ProposedActionCardProps {
  proposedAction: string;
  comparison: CurrentVsProposed[];
  explanations: any;
}

export const ProposedActionCard = ({
  proposedAction,
  comparison,
  explanations,
}: ProposedActionCardProps) => {
  const getChangeColor = (change: string) => {
    if (change.startsWith("-")) return "text-emerald-400";
    if (change.startsWith("+") && !change.includes("%")) return "text-red-400";
    if (change === "0%") return "text-muted-foreground";
    return "text-amber-400";
  };

  return (
    <NeonCard title="Proposed Action" className="h-auto">
      <div className="space-y-5">
        <div className="text-sm text-muted-foreground leading-relaxed">
          {proposedAction
            ?.replace(/\|/g, "\n")
            .split("\n")
            .map((line, index) => {
              const text = line.trim();

              // Highlight Step 1:, Step 2:, and Priority lanes:
              const match = text.match(/^(Step\s\d+:|Priority lanes:)(.*)/);

              return (
                <p key={index} className="mb-1">
                  {match ? (
                    <>
                      <span className="font-semibold text-foreground">
                        {match[1]}
                      </span>
                      {match[2]}
                    </>
                  ) : (
                    text
                  )}
                </p>
              );
            })}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">
                  Metric
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">
                  Current
                </TableHead>
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">
                  Proposed
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Impact
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison?.map((row, index) => (
                <TableRow key={index} className="border-border/30">
                  <TableCell className="font-medium text-foreground">
                    {row.metric}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {row.current}
                  </TableCell>
                  <TableCell className="text-center">
                    <ArrowRight className="w-4 h-4 text-primary mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-foreground font-medium">
                    {row.proposed}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${getChangeColor(row.change)}`}
                  >
                    {row.change}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div></div>
        </div>
        {explanations?.currentVsProposed?.length > 0 && (
          <>
            <div className="text-sm font-bold mx-3 text-foreground mt-4">
              Explanations :
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">
                      Metric
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Calculations
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {explanations?.currentVsProposed.map((row, index) => (
                    <TableRow key={index} className="border-border/30">
                      <TableCell className="font-medium text-foreground">
                        {row.metric}
                      </TableCell>
                      <TableCell className=" text-muted-foreground">
                        {row.calculation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div></div>
            </div>
          </>
        )}
      </div>
    </NeonCard>
  );
};

export const ProposedActionCardSkeleton = () => (
  <NeonCard title="Proposed Action">
    <div className="space-y-5">
      <Skeleton className="h-16 w-full" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  </NeonCard>
);
