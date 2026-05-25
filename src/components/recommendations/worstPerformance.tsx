import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../master-data/MasterDataTables';
import { NeonCard } from '../ui/neon-card';
import { Skeleton } from '../ui/skeleton';


interface WorstPerformanceProps {
  worstDetails?: string[];
}



export function WorstPerformance({ worstDetails }: WorstPerformanceProps) {
  const metrics = worstDetails || [];
  return (
    <NeonCard className="h-auto">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-card-foreground">Worst Performance</h2>
        <p className="text-sm text-muted-foreground mt-1">Critical metrics requiring immediate attention</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs uppercase tracking-wider">Metric</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell>
                <span className="font-medium text-card-foreground">{metric}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          These metrics indicate performance below SLA standards. Review operations for corrective actions.
        </p>
      </div>
    </NeonCard>
  );
}

export const WorstPerformanceSkeleton = () => {
  return (
    <NeonCard className="h-auto">
      <div className="mb-5 space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="space-y-0">
        <div className="flex items-center gap-4 py-3 px-4 border-b border-border">
          <Skeleton className="h-4 w-20" />
        </div>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 px-4 border-b border-border/50 last:border-0">
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border flex justify-center">
        <Skeleton className="h-3 w-96" />
      </div>
    </NeonCard>
  );
};

