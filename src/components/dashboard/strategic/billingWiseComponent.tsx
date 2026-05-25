import  { Fragment, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";
import { ComboBox } from "@/components/search-select/combo-box";

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

const METRIC_COLS = [
  "Total Inv",
  "Billed Qty",
  "Freight",
  "Freight/Qty",
] as const;

const formatNumber = (n: number, decimals = 0) => {
  if (n === 0) return "–";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const BillingWisePattern = ({ data }: Props) => {
  const BANDS = useMemo(() => {
    return Array.from(new Set(data?.map((d) => d.bandLabel)));
  }, [data]);
  const [collapsedBands, setCollapsedBands] = useState<Set<string>>(new Set());
  const [selectedBand, setSelectedBand] = useState<string | null>(
    BANDS.length > 0 ? BANDS[0] : null
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

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


  const GEOS = [
    "With-in-State",
    "With-in-Region",
    "With-in City",
    "Cross-Region",
  ];

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

  const getGrandTotal = (month: string) => {
    const filtered = data.filter((d) => d.month === month);
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

  const toggleBand = (band: string) => {
    setCollapsedBands((prev) => {
      const next = new Set(prev);
      if (next.has(band)) next.delete(band);
      else next.add(band);
      return next;
    });
  };
  const monthsoptions: any = MONTHS?.map((month: any,index:any) => ({
    id: index,
    label: month,
    value: month,
  }));
  const MobileCardView = () => (
    <div className="space-y-3 p-3">
      {/* Band Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
        {BANDS?.map((band) => (
          <button
            key={band}
            onClick={() => {
              setSelectedBand(selectedBand === band ? null : band);
              setSelectedMonth(null);
            }}
            className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-all ${selectedBand === band
              ? "bg-[hsl(var(--table-band-total-bg))] text-[hsl(var(--table-band-total-fg))]"
              : "bg-[hsl(var(--table-stripe))] text-foreground hover:bg-[hsl(var(--table-row-hover))]"
              }`}
          >
            {band}
          </button>
        ))}
      </div>

      {/* Selected Band Data */}
      {selectedBand && (
        <div className="space-y-3 bg-[hsl(var(--table-stripe))] rounded-lg p-3 mt-2">
          {/* Month Selector Dropdown */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Select Month
            </label>
            <select
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
              className="bg-card border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--table-band-total-bg))]"
            >
              <option value="">-- Choose a month --</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div> */}
          <ComboBox
            options={monthsoptions}
            selectedValue={selectedMonth || ""}
            placeholder="Select Month"
            renderOption={(option: any) => (
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{option.value}</span>
              </div>
            )}
            onValueChange={(value:any) => {
             const month = monthsoptions?.find((item) => item.id === Number(value));
              setSelectedMonth(month?.value || null)
            }}
          />
          {/* Month Details */}
          {selectedMonth && (
            <div className="space-y-3 pt-2 border-t border-border">
              {/* Band Totals for Selected Month */}
              <div className="bg-[hsl(var(--table-band-total-bg))] text-[hsl(var(--table-band-total-fg))] rounded p-3">
                <div className="text-xs font-bold mb-2">{selectedBand} - {selectedMonth}</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground opacity-80 text-[10px]">Total Inv</div>
                    <div className=" font-bold text-sm">
                      {formatNumber(getBandTotal(selectedBand, selectedMonth).totalInv)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground opacity-80 text-[10px]">Billed Qty</div>
                    <div className=" font-bold text-sm">
                      {formatNumber(getBandTotal(selectedBand, selectedMonth).billedQty)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground opacity-80 text-[10px]">Freight</div>
                    <div className=" font-bold text-sm">
                      {formatNumber(getBandTotal(selectedBand, selectedMonth).freight, 2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground opacity-80 text-[10px]">Freight/Qty</div>
                    <div className=" font-bold text-sm">
                      {formatNumber(getBandTotal(selectedBand, selectedMonth).freightPerQty, 2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Geography Breakdown */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Geography Breakdown
                </div>
                <div className="space-y-2">
                  {GEOS?.map((geo) => {
                    const d = getCellData(selectedBand, geo, selectedMonth);
                    if (d.totalInv === 0) return null;

                    return (
                      <div
                        key={geo}
                        className="bg-card rounded p-2.5 border border-border"
                      >
                        <div className="text-xs font-semibold text-foreground mb-2">
                          {geo}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-muted-foreground">Total Inv</span>
                            <div className=" font-bold">
                              {formatNumber(d.totalInv)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Billed Qty</span>
                            <div className=" font-bold">
                              {formatNumber(d.billedQty)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Freight Cost</span>
                            <div className=" font-bold">
                              {formatNumber(d.freight, 2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Freight Cost/Qty</span>
                            <div className=" font-bold">
                              {formatNumber(d.freightPerQty, 2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grand Total Summary */}
      {!selectedMonth && (
        <div className="bg-[hsl(var(--table-grand-total-bg))] text-[hsl(var(--table-grand-total-fg))] rounded-lg p-3">
          <div className="text-xs font-bold mb-3">Grand Total - All Months</div>
          <div className="space-y-2">
            {MONTHS?.map((month) => {
              const totals = getGrandTotal(month);
              return (
                <div key={month} className="flex justify-between text-xs bg-card bg-opacity-20 rounded p-2">
                  <span className="font-medium">{month}</span>
                  <div className="flex gap-4 text-[10px]">
                    <div className="text-center">
                      <div className="text-muted-foreground opacity-70">Inv</div>
                      <div className=" font-bold">{formatNumber(totals.totalInv)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground opacity-70">Qty</div>
                      <div className=" font-bold">{formatNumber(totals.billedQty)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground opacity-70">Frt Cost</div>
                      <div className=" font-bold">{formatNumber(totals.freight, 2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground opacity-70">Frt Cost/Qty</div>
                      <div className=" font-bold">{formatNumber(totals.freightPerQty, 2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="w-full animate-fade-in">
      <div className="overflow-x-auto border border-border shadow-sm bg-card">
        <Table>
          <TableHeader>
            {/* Month header row */}
            <TableRow className="bg-[hsl(var(--table-header-bg))] text-primary-foreground hover:bg-[hsl(var(--table-header-bg))]">
              <TableHead
                colSpan={2}
                className="bg-[hsl(var(--table-header-bg))] text-primary-foreground font-semibold text-sm sticky left-0 z-10 min-w-[200px] hover:bg-[hsl(var(--table-header-bg))]"
              >
                Billing Pattern
              </TableHead>
              {MONTHS?.map((month) => (
                <TableHead
                  key={month}
                  colSpan={4}
                  className="text-center text-primary-foreground font-semibold text-sm border-l border-primary-foreground"
                >
                  {month}
                </TableHead>
              ))}
            </TableRow>
            {/* Metrics sub-header */}
            <TableRow className="bg-[hsl(var(--table-grand-total-bg))] border-none text-[hsl(var(--table-header-fg))] hover:bg-[hsl(var(--table-grand-total-bg))]">
              <TableHead className="text-xs bg-[hsl(var(--table-grand-total-bg))] text-foreground font-semibold sticky left-0 z-10 min-w-[200px]">
                Band
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-foreground min-w-[140px] sticky left-[120px] z-20 bg-[hsl(var(--table-grand-total-bg))]"
              >
                Geography
              </TableHead>
              {MONTHS?.map((month) => (
                <Fragment key={month}>
                  {METRIC_COLS?.map((col) => (
                    <TableHead
                      key={`${month}-${col}`}
                      className="text-xs font-semibold text-foreground text-right min-w-[90px] border-l border-border first:border-l-2"
                    >
                      {col}
                    </TableHead>
                  ))}
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {BANDS?.map((band) => {
              const isCollapsed = collapsedBands.has(band);
              return (
                <Fragment key={band}>
                  {/* Band Total Row (clickable) */}
                  <TableRow
                    className="bg-[hsl(var(--table-band-total-bg))] text-[hsl(var(--table-band-total-fg))] hover:bg-[hsl(var(--table-row-hover))] transition-colors"
                    onClick={() => toggleBand(band)}
                  >
                    <TableCell
                      colSpan={2}
                      className="font-semibold text-sm text-table-band-total-foreground sticky left-0 z-10 bg-[hsl(var(--table-band-total-bg))] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        {band}
                      </div>
                    </TableCell>
                    {MONTHS?.map((month) => {
                      const totals = getBandTotal(band, month);
                      return (
                        <Fragment key={month}>
                          <TableCell className="text-right font-semibold text-sm text-table-band-total-foreground border-l-2 border-border ">
                            {formatNumber(totals.totalInv)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm text-table-band-total-foreground ">
                            {formatNumber(totals.billedQty)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm text-table-band-total-foreground ">
                            {formatNumber(totals.freight, 2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm text-table-band-total-foreground ">
                            {formatNumber(totals.freightPerQty, 2)}
                          </TableCell>
                        </Fragment>
                      );
                    })}
                  </TableRow>

                  {/* Geo detail rows */}
                  {!isCollapsed &&
                    GEOS?.map((geo, geoIdx) => {
                      const hasData = MONTHS.some((m) => {
                        const d = getCellData(band, geo, m);
                        return d.totalInv > 0;
                      });
                      if (!hasData) return null;
                      return (
                        <TableRow
                          key={`${band}-${geo}`}
                          className="hover:bg-[hsl(var(--table-row-hover))] transition-colors even:bg-[hsl(var(--table-stripe))]"
                        >
                          <TableCell className="sticky left-0 z-10 bg-card" />
                          <TableCell
                            className="text-sm text-muted-foreground pl-6 sticky left-[120px] z-10 bg-card"
                          >
                            {geo}
                          </TableCell>
                          {MONTHS?.map((month) => {
                            const d = getCellData(band, geo, month);
                            return (
                              <Fragment key={month}>
                                <TableCell className="text-right text-sm  border-l-2 border-border">
                                  {formatNumber(d.totalInv)}
                                </TableCell>
                                <TableCell className="text-right text-sm ">
                                  {formatNumber(d.billedQty)}
                                </TableCell>
                                <TableCell className="text-right text-sm ">
                                  {formatNumber(d.freight, 2)}
                                </TableCell>
                                <TableCell className="text-right text-sm ">
                                  {formatNumber(d.freightPerQty, 2)}
                                </TableCell>
                              </Fragment>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </Fragment>
              );
            })}

            {/* Grand Total */}
            <TableRow className="bg-[hsl(var(--table-grand-total-bg))] text-[hsl(var(--table-grand-total-fg))] border-t-2 border-primary">
              <TableCell
                colSpan={2}
                className="font-bold text-sm text-table-grand-total-foreground sticky left-0 z-10 bg-[hsl(var(--table-grand-total-bg))]"
              >
                Grand Total
              </TableCell>
              {MONTHS?.map((month) => {
                const totals = getGrandTotal(month);
                return (
                  <Fragment key={month}>
                    <TableCell className="text-right font-bold text-sm text-table-grand-total-foreground border-l-2 border-border ">
                      {formatNumber(totals.totalInv)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm text-table-grand-total-foreground ">
                      {formatNumber(totals.billedQty)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm text-table-grand-total-foreground ">
                      {formatNumber(totals.freight, 2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm text-table-grand-total-foreground ">
                      {formatNumber(totals.freightPerQty, 2)}
                    </TableCell>
                  </Fragment>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <NeonCard title="Billing Pattern" className="w-full">
      <div className="md:hidden">
        <MobileCardView />
      </div>

      <div className="hidden md:block">
        <DesktopTableView />
      </div>
    </NeonCard>
  );
};