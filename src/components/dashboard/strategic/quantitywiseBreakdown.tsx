import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NeonCard } from "@/components/ui/neon-card";

export interface QuantityWiseRow {
  month: string;
  bandCode: string;
  bandLabel: string;
  invoices: number;
  quantity: number;
  totalFreight: number;
  freightPerQty: number;
}

interface Props {
  data: QuantityWiseRow[];
}

export const QuantityWiseBreakdown = ({ data }: Props) => {
  const MONTHS = useMemo(() => {
    const monthsSet = new Set(data?.map((d) => d.month));
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return allMonths.filter((m) => monthsSet.has(m));
  }, [data]);

  const BANDS = useMemo(() => {
    const map = new Map<string, { code: string; label: string }>();
    data?.forEach((d) =>
      map.set(d.bandCode, { code: d.bandCode, label: d.bandLabel }),
    );
    return Array.from(map.values());
  }, [data]);

  const lookup = useMemo(() => {
    const map = new Map<string, QuantityWiseRow>();
    data?.forEach((row) => {
      map.set(`${row.bandCode}-${row.month}`, row);
    });
    return map;
  }, [data]);

  const getVal = (bandCode: string, month: string): QuantityWiseRow => {
    return (
      lookup.get(`${bandCode}-${month}`) || {
        month,
        bandCode,
        bandLabel: "",
        invoices: 0,
        quantity: 0,
        totalFreight: 0,
        freightPerQty: 0,
      }
    );
  };

  const metrics: {
    label: string;
    key: keyof QuantityWiseRow;
    format?: (v: number) => string;
    highlightCheck?: (v: number) => boolean;
  }[] = [
    { label: "Invoices", key: "invoices" },
    { label: "Quantity", key: "quantity" },
    {
      label: "Total Freight",
      key: "totalFreight",
      format: (v) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      label: "Freight per qty",
      key: "freightPerQty",
      format: (v) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      highlightCheck: (v) => v > 10000,
    },
  ];

  return (
    <NeonCard title="Quantity Wise Breakdown" className="h-full">
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          <Table className="border-collapse border border-border">
            <TableHeader>
              {/* Band header row */}
              <TableRow className="bg-table-header-main">
                <TableHead
                  rowSpan={2}
                  className="band-group-corner py-1 !h-8 font-semibold text-foreground sticky left-0 z-20 min-w-[140px] border-separate border-spacing-0 border border-border"
                >
                  Billing Unit
                </TableHead>
                {BANDS.map((band) => (
                  <TableHead
                    key={band.code}
                    colSpan={MONTHS.length}
                    className="band-group-header py-1 !h-8 text-foreground text-right font-semibold text-sm border border-border"
                  >
                    {band.label}
                  </TableHead>
                ))}
              </TableRow>
              {/* Month sub-header row */}
              <TableRow className="border-b border-border">
                {BANDS.map((band) =>
                  MONTHS.map((month) => (
                    <TableHead
                      key={`${band.code}-${month}`}
                      className="bg-table-row-total py-1 !h-8 text-foreground text-right min-w-[110px] font-semibold text-xs border-r border-border"
                    >
                      {month}
                    </TableHead>
                  )),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow
                  key={metric.label}
                  className="border border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="metric-label-cell border py-1 !h-8 whitespace-nowrap sticky left-0 z-10 font-semibold border-r border-border">
                    {metric.label}
                  </TableCell>
                  {BANDS.map((band) =>
                    MONTHS.map((month) => {
                      const row = getVal(band.code, month);
                      const rawValue = row[metric.key] as number;
                      const formatted = metric.format
                        ? metric.format(rawValue)
                        : rawValue.toLocaleString();
                      const isHighlighted = metric.highlightCheck?.(rawValue);
                      return (
                        <TableCell
                          key={`${band.code}-${month}-${metric.key}`}
                          className={`metric-value py-1 text-right !h-8 border-r border-border ${isHighlighted ? "highlight-danger" : ""}`}
                        >
                          {formatted}
                        </TableCell>
                      );
                    }),
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </NeonCard>
  );
};
