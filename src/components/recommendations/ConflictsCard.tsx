import { NeonCard } from "@/components/ui/neon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConflictItem } from "@/mocks/recommendations.mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

interface ConflictsCardProps {
  conflicts: ConflictItem[];
}

export const ConflictsCard = ({ conflicts }: ConflictsCardProps) => {
  if (conflicts.length === 0) return null;

  return (
    <NeonCard>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-foreground">Conflicts</h3>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
          {conflicts.length} found
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Conflicting ID
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Type
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Resolution
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conflicts?.map((conflict, index) => (
              <TableRow key={index} className="border-border/30">
                <TableCell className="font-mono text-primary">
                  {conflict.conflictingId}
                </TableCell>
                <TableCell className="text-foreground">
                  {conflict.type}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {conflict.resolution}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </NeonCard>
  );
};

export const ConflictsCardSkeleton = () => (
  <NeonCard>
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-5 h-5" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  </NeonCard>
);
