import { useState, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NeonCard } from "@/components/ui/neon-card";
import { cn } from "@/lib/utils";
import { RecoStatusChip } from "../recommendations/RecoStatusChip";
import { ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface LaneOpportunityRow {
  id?: string;
  scope: string;
  category: string;
  currentPerformance?: string;
  optimizedPerformance?: string;
  potentialImpact: string;
  priority: string;
  confidencePct?: number;
}

export interface CurrentVsProposedEntry {
  metric: string;
  current: string;
  proposed: string;
  change: string;
}

export interface DetailEntry {
  whyTriggered?: string[];
  [key: string]: unknown;
  currentVsProposed?: CurrentVsProposedEntry[];
}

export interface OpportunityImpactTableProps {
  readonly rows: LaneOpportunityRow[];
  readonly details?: Record<string, DetailEntry>;
  readonly className?: string;
}

export function OpportunityImpactTable({
  rows,
  details,
  className,
}: OpportunityImpactTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id?: string) => {
    if (!id) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <NeonCard title="Recommendations" className={cn("w-full", className)}>
      <p className="text-xs text-muted-foreground mb-4">
        High-level opportunity by lane/scope. Current vs optimized performance
        and potential impact.
      </p>
      <div className="w-full overflow-x-auto rounded-lg border border-border/50">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-border/50 bg-muted/20">
              <TableHead className="w-8"></TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Lane / Scope
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Category
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Current Performance
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Optimized Performance
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Potential Impact
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Priority
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Confidence
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              rows?.map((row) => {
                const isExpanded = expandedId === row.id;
                const detail = row.id && details ? details[row.id] : undefined;
                const hasDetail = !!detail?.whyTriggered?.length;

                return (
                  <Fragment key={row.id ?? row.scope}>
                    {/* Main row */}
                    <TableRow
                      className="cursor-pointer border-border/30 hover:bg-muted/40 transition-colors"
                      onClick={() => toggle(row.id)}
                    >
                      <TableCell className="w-8">
                        {hasDetail && (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-300 ease-in-out",
                              isExpanded && "rotate-180"
                            )}
                          />
                        )}
                      </TableCell>

                      <TableCell className="font-medium text-sm">
                        <div className="whitespace-normal break-words">
                          {row.scope}
                        </div>
                      </TableCell>

                      <TableCell>
                        <RecoStatusChip type="category" value={row.category} />
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        <div className="truncate">
                          {row.currentPerformance ?? "—"}
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-pointer">
                                {row.optimizedPerformance ?? "—"}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>
                                {row.optimizedPerformance ??
                                  "No optimized performance available"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-pointer">
                                {row.potentialImpact ?? "—"}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>
                                {row.potentialImpact ??
                                  "No potential impact available"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <RecoStatusChip
                          type="priority"
                          value={row.priority ?? ""}
                        />
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        {row.confidencePct != null
                          ? `${row.confidencePct}%`
                          : "—"}
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail row */}
                    {isExpanded && hasDetail && (
                      <TableRow className="border-border hover:bg-transparent">
                        <TableCell colSpan={8} className="p-0">
                          <div
                            className={cn(
                              "border-t border-border bg-muted/30 px-4 md:px-10 overflow-hidden transition-all duration-300 ease-in-out",
                              isExpanded ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
                            )}
                          >
                            <div className="space-y-4 transition-opacity duration-300">
                              {detail!.currentVsProposed &&
                                detail!.currentVsProposed.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                                      Customer vs Proconnect
                                    </h4>
                                    <div className="rounded-md border border-border overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-muted/50">
                                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                              Customer
                                            </th>
                                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                              Proconnect
                                            </th>
                                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                              Change
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {detail!.currentVsProposed?.map(
                                            (entry, i) => (
                                              <tr
                                                key={i}
                                                className="border-t border-border"
                                              >
                                                <td className="px-3 py-2 text-muted-foreground">
                                                  {entry.current}
                                                </td>
                                                <td className="px-3 py-2 text-muted-foreground">
                                                  {entry.proposed}
                                                </td>
                                                <td className="px-3 py-2 text-primary font-medium">
                                                  {entry.change}
                                                </td>
                                              </tr>
                                            ),
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              <div className="space-y-2">
                                <ul className="space-y-1.5">
                                  {detail!.whyTriggered!?.map((reason, i) => (
                                    <li
                                      key={i}
                                      className="flex gap-2 text-sm text-primary"
                                    >
                                      <span className="text-primary  shrink-0">
                                        •
                                      </span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>


    </NeonCard>
  );
}

export function OpportunityImpactTableSkeleton({
  className,
}: {
  className?: string;
}) {
  // Number of skeleton rows to show
  const skeletonRows = Array.from({ length: 5 });

  return (
    <NeonCard title="Recommendations" className={cn("w-full", className)}>
      <p className="text-xs text-muted-foreground mb-4">
        High-level opportunity by lane/scope. Current vs optimized performance
        and potential impact.
      </p>

      <div className="overflow-x-auto rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="w-6"></TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Lane / Scope
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Category
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Current Performance
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Optimized Performance
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Potential Impact
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Priority
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Confidence
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows?.map((_, idx) => (
              <TableRow key={idx} className="border-border/30 animate-pulse">
                <TableCell>
                  <div className="h-4 w-4 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted/50 rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted/50 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </NeonCard>
  );
}
