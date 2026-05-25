import React, { Fragment, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NeonCard } from "@/components/ui/neon-card";

export interface QuantityWiseRow {
  geo: string;
  month: string;
  freight: number;
  totalInv: number;
  bandLabel: string;
  billedQty: number;
  freightPerQty: number;
}

interface Props {
  data: QuantityWiseRow[];
}

export const BillingWisePattern = ({ data }: Props) => {
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
    return Array.from(new Set(data?.map((d) => d.bandLabel)));
  }, [data]);

  const GEOS = [
    "Cross-Region",
    "With-in City",
    "With-in-Region",
    "With-in-State",
  ];

  // Helper to get data or return defaults
  const getCellData = (band: string, geo: string, month: string) => {
    return (
      data.find(
        (d) => d.bandLabel === band && d.geo === geo && d.month === month,
      ) || {
        totalInv: 0,
        billedQty: 0,
        freight: 0,
        freightPerQty: 0,
      }
    );
  };

  // Helper for band totals
  const getBandTotal = (band: string, month: string) => {
    const filtered = data.filter(
      (d) => d.bandLabel === band && d.month === month,
    );
    const totalInv = filtered.reduce((acc, curr) => acc + curr.totalInv, 0);
    const billedQty = filtered.reduce((acc, curr) => acc + curr.billedQty, 0);
    const freight = filtered.reduce((acc, curr) => acc + curr.freight, 0);
    return {
      totalInv,
      billedQty,
      freight,
      freightPerQty: billedQty > 0 ? freight / billedQty : 0,
    };
  };

  return (
    <NeonCard title="Billing Pattern" className="w-full">
      <ScrollArea className="h-[600px] w-full overflow-x-auto ">
        <Table className="border-collapse border min-w-[1600px]">
          <TableHeader>
            {/* Top Header: Months */}
            <TableRow>
              <TableHead
                className="border border-slate-400  font-bold text-center"
                rowSpan={2}
              >
                Billing Pattern
              </TableHead>
              {MONTHS.map((month) => (
                <TableHead
                  key={month}
                  colSpan={4}
                  className="border border-slate-400  text-2xl font-bold text-center"
                >
                  {month}
                </TableHead>
              ))}
            </TableRow>
            {/* Sub Header: Metrics */}
            <TableRow>
              {MONTHS.map((month) => (
                <Fragment key={`sub-${month}`}>
                  <TableHead className=" border border-slate-400 text-xs">
                    IGST/local
                  </TableHead>
                  <TableHead className=" border border-slate-400 text-xs">
                    Billed Quantity
                  </TableHead>
                  <TableHead className=" border border-slate-400 text-xs">
                    Freight
                  </TableHead>
                  <TableHead className=" border border-slate-400 text-xs">
                    Freight per qty
                  </TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {BANDS.map((band) => (
              <Fragment key={band}>
                {/* Individual Geo Rows */}
                {GEOS.map((geo, index) => (
                  <TableRow key={`${band}-${geo}`}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={GEOS.length + 1}
                        className="font-bold border border-slate-300 text-center align-middle w-40"
                      >
                        {band}
                      </TableCell>
                    )}
                    <TableCell className="border border-slate-300 text-xs">
                      {geo}
                    </TableCell>
                    {MONTHS.map((month) => {
                      const d = getCellData(band, geo, month);
                      return (
                        <Fragment key={`${band}-${geo}-${month}`}>
                          <TableCell className="text-center border border-slate-300">
                            {d.totalInv}
                          </TableCell>
                          <TableCell className="text-center border border-slate-300">
                            {d.billedQty}
                          </TableCell>
                          <TableCell className="text-center border border-slate-300">
                            {d.freight.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center border border-slate-300">
                            {d.freightPerQty.toFixed(2)}
                          </TableCell>
                        </Fragment>
                      );
                    })}
                  </TableRow>
                ))}

                {/* Band Total Row */}
                <TableRow className=" font-bold">
                  <TableCell className="border border-slate-300">
                    {band} Total
                  </TableCell>
                  {MONTHS.map((month) => {
                    const totals = getBandTotal(band, month);
                    return (
                      <Fragment key={`total-${band}-${month}`}>
                        <TableCell className="text-center border border-slate-300">
                          {totals.totalInv}
                        </TableCell>
                        <TableCell className="text-center border border-slate-300">
                          {totals.billedQty}
                        </TableCell>
                        <TableCell className="text-center border border-slate-300">
                          {totals.freight.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border border-slate-300">
                          {totals.freightPerQty.toFixed(2)}
                        </TableCell>
                      </Fragment>
                    );
                  })}
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </NeonCard>
  );
};
