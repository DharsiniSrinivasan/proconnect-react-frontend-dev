import { NeonCard } from "@/components/ui/neon-card";
import { cn } from "@/lib/utils";

interface FreightData {
  geo: string;
  month: string;
  freight: number;
  totalInv: number;
  bandLabel: string;
  billedQty: number;
  totalInvAll: number;
  freightPerQty: number;
  totalFreightAll: number;
  totalBilledQtyAll: number;
  totalFreightPerQtyAll: number;
}

interface FreightTableProps {
  data: FreightData[];
}

const getGeoCellClass = (geo: string) => {
  if (geo?.includes("Cross")) return "bg-geo-cross-region";
  if (geo?.includes("City")) return "bg-geo-with-in-city";
  if (geo?.includes("Region") && !geo?.includes("Cross"))
    return "bg-geo-with-in-region";
  if (geo?.includes("State")) return "bg-geo-with-in-state";
  return "";
};
const getFullMonthName = (month: string) => {
  const date = new Date(`2024 ${month} 1`);
  return isNaN(date.getTime())
    ? month
    : date.toLocaleString("en-US", { month: "long" });
};

const formatNumber = (value: number) => {
  if (value === 0) return "0";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function FreightTable({ data }: FreightTableProps) {
  // Group data by month
  const months = [...new Set(data?.map((d) => d.month))];

  // Group data by band label
  const bandGroups = data?.reduce(
    (acc, item) => {
      if (!acc[item.bandLabel]) {
        acc[item.bandLabel] = [];
      }
      acc[item.bandLabel].push(item);
      return acc;
    },
    {} as Record<string, FreightData[]>,
  );

  // Calculate totals for each band
  const calculateBandTotal = (items: FreightData[]) => {
    return {
      totalInv: items.reduce((sum, i) => sum + i.totalInv, 0),
      billedQty: items.reduce((sum, i) => sum + i.billedQty, 0),
      freight: items.reduce((sum, i) => sum + i.freight, 0),
      freightPerQty:
        items.reduce((sum, i) => sum + i.freight, 0) /
          items.reduce((sum, i) => sum + i.billedQty, 0) || 0,
    };
  };

  const cellClass = "border border-border px-3 py-1.5 text-sm text-foreground";
  const headerCellClass =
    "border border-border px-3 py-1.5 text-sm font-bold text-foreground";

  return (
    <NeonCard title="Billing Pattern" className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {/* Main Month Headers */}
          <thead>
            <tr>
              <th
                className={cn(headerCellClass, "bg-table-header-main")}
                rowSpan={2}
              >
                Billing Pattern
              </th>
              {months.map((month) => (
                <th
                  key={month}
                  className={cn(
                    headerCellClass,
                    "bg-table-header-main text-center",
                  )}
                  colSpan={5}
                >
                  {getFullMonthName(month)}
                </th>
              ))}
            </tr>
            <tr>
              {months.map((month) => (
                <>
                  <th
                    key={`${month}-geo`}
                    className={cn(headerCellClass, "bg-table-header-sub")}
                  >
                    IGST/Local
                  </th>
                  <th
                    key={`${month}-inv`}
                    className={cn(
                      headerCellClass,
                      "bg-table-header-sub text-right",
                    )}
                  >
                    Total Inv
                  </th>
                  <th
                    key={`${month}-qty`}
                    className={cn(
                      headerCellClass,
                      "bg-table-header-sub text-right",
                    )}
                  >
                    Billed Quantity
                  </th>
                  <th
                    key={`${month}-freight`}
                    className={cn(
                      headerCellClass,
                      "bg-table-header-sub text-right",
                    )}
                  >
                    Freight
                  </th>
                  <th
                    key={`${month}-fpq`}
                    className={cn(
                      headerCellClass,
                      "bg-table-header-sub text-right",
                    )}
                  >
                    Freight per qty
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(bandGroups ?? {}).map(([bandLabel, items]) => {
              const geoGroups = [...new Set(items?.map((i) => i.geo))];

              return (
                <>
                  {/* Individual rows for each geo within the band */}
                  {geoGroups.map((geo, geoIndex) => (
                    <tr key={`${bandLabel}-${geo}`}>
                      {geoIndex === 0 && (
                        <td
                          className={cn(cellClass, "font-semibold  ")}
                          rowSpan={geoGroups.length}
                        >
                          {bandLabel}
                        </td>
                      )}
                      {months.map((month) => {
                        const item = items.find(
                          (i) => i.geo === geo && i.month === month,
                        );
                        if (item) {
                          return (
                            <>
                              <td
                                key={`${month}-${geo}-geo`}
                                className={cn(cellClass, getGeoCellClass(geo))}
                              >
                                {geo}
                              </td>
                              <td
                                key={`${month}-${geo}-inv`}
                                className={cn(cellClass, "text-right  ")}
                              >
                                {item.totalInv}
                              </td>
                              <td
                                key={`${month}-${geo}-qty`}
                                className={cn(cellClass, "text-right  ")}
                              >
                                {item.billedQty}
                              </td>
                              <td
                                key={`${month}-${geo}-freight`}
                                className={cn(cellClass, "text-right  ")}
                              >
                                {formatNumber(item.freight)}
                              </td>
                              <td
                                key={`${month}-${geo}-fpq`}
                                className={cn(cellClass, "text-right  ")}
                              >
                                {formatNumber(item.freightPerQty)}
                              </td>
                            </>
                          );
                        }
                        return (
                          <>
                            <td
                              key={`${month}-${geo}-geo`}
                              className={cn(cellClass, getGeoCellClass(geo))}
                            >
                              {geo}
                            </td>
                            <td
                              key={`${month}-${geo}-inv`}
                              className={cn(cellClass, "text-right  ")}
                            >
                              -
                            </td>
                            <td
                              key={`${month}-${geo}-qty`}
                              className={cn(cellClass, "text-right  ")}
                            >
                              -
                            </td>
                            <td
                              key={`${month}-${geo}-freight`}
                              className={cn(cellClass, "text-right  ")}
                            >
                              -
                            </td>
                            <td
                              key={`${month}-${geo}-fpq`}
                              className={cn(cellClass, "text-right  ")}
                            >
                              -
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Band Total Row */}
                  <tr>
                    <td
                      className={cn(cellClass, "font-bold bg-table-row-total")}
                    >
                      {bandLabel} Total
                    </td>
                    {months.map((month) => {
                      const monthItems = items.filter((i) => i.month === month);
                      const monthTotal = calculateBandTotal(monthItems);
                      return (
                        <>
                          <td
                            key={`${month}-total-geo`}
                            className={cn(cellClass, "bg-table-row-total")}
                          ></td>
                          <td
                            key={`${month}-total-inv`}
                            className={cn(
                              cellClass,
                              "text-right font-bold bg-table-row-total",
                            )}
                          >
                            {monthTotal.totalInv}
                          </td>
                          <td
                            key={`${month}-total-qty`}
                            className={cn(
                              cellClass,
                              "text-right font-bold bg-table-row-total",
                            )}
                          >
                            {monthTotal.billedQty}
                          </td>
                          <td
                            key={`${month}-total-freight`}
                            className={cn(
                              cellClass,
                              "text-right font-bold bg-table-row-total",
                            )}
                          >
                            {formatNumber(monthTotal.freight)}
                          </td>
                          <td
                            key={`${month}-total-fpq`}
                            className={cn(
                              cellClass,
                              "text-right font-bold bg-table-row-total",
                            )}
                          >
                            {formatNumber(monthTotal.freightPerQty)}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                </>
              );
            })}
            {/* Grand Total Row */}
            <tr>
              <td className={cn(cellClass, "font-bold bg-table-row-grand")}>
                Grand Total
              </td>
              {months.map((month) => {
                const monthItems = data.filter((i) => i.month === month);
                const monthTotal = calculateBandTotal(monthItems);
                return (
                  <>
                    <td
                      key={`${month}-grand-geo`}
                      className={cn(cellClass, "bg-table-row-grand")}
                    ></td>
                    <td
                      key={`${month}-grand-inv`}
                      className={cn(
                        cellClass,
                        "text-right font-bold bg-table-row-grand",
                      )}
                    >
                      {monthTotal.totalInv}
                    </td>
                    <td
                      key={`${month}-grand-qty`}
                      className={cn(
                        cellClass,
                        "text-right font-bold bg-table-row-grand",
                      )}
                    >
                      {monthTotal.billedQty}
                    </td>
                    <td
                      key={`${month}-grand-freight`}
                      className={cn(
                        cellClass,
                        "text-right font-bold bg-table-row-grand",
                      )}
                    >
                      {formatNumber(monthTotal.freight)}
                    </td>
                    <td
                      key={`${month}-grand-fpq`}
                      className={cn(
                        cellClass,
                        "text-right font-bold bg-table-row-grand",
                      )}
                    >
                      {formatNumber(monthTotal.freightPerQty)}
                    </td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </NeonCard>
  );
}
