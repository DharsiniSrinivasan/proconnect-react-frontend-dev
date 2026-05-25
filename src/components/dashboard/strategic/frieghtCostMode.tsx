import React, { useMemo } from "react";

/* ===================== TYPES ===================== */

interface FreightBlock {
  freight: number;
  quantity: number;
  freightPerQty: number;
}

interface FreightRow {
  region: string;
  directLocation: FreightBlock;
  oda: FreightBlock;
  grandTotal: FreightBlock;
}

interface MonthData {
  month: string;
  data: FreightRow[];
}

interface FreightTableProps {
  monthData: MonthData;
}

/* ===================== HELPERS ===================== */

const formatNumber = (num: number, decimals = 2): string =>
  num?.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const calcFreightPerQty = (freight: number, quantity: number) =>
  quantity > 0 ? freight / quantity : 0;

const getEmptyBlock = (): FreightBlock => ({
  freight: 0,
  quantity: 0,
  freightPerQty: 0,
});

const calculateTotals = (rows: FreightRow[]) => {
  const total = rows?.reduce(
    (acc, row) => {
      acc.directLocation.freight += row.directLocation.freight;
      acc.directLocation.quantity += row.directLocation.quantity;

      acc.oda.freight += row.oda.freight;
      acc.oda.quantity += row.oda.quantity;

      acc.grandTotal.freight += row.grandTotal.freight;
      acc.grandTotal.quantity += row.grandTotal.quantity;

      return acc;
    },
    {
      directLocation: getEmptyBlock(),
      oda: getEmptyBlock(),
      grandTotal: getEmptyBlock(),
    },
  );

  return {
    directLocation: {
      ...total?.directLocation,
      freightPerQty: calcFreightPerQty(
        total?.directLocation.freight,
        total?.directLocation.quantity,
      ),
    },
    oda: {
      ...total?.oda,
      freightPerQty: calcFreightPerQty(total?.oda.freight, total?.oda.quantity),
    },
    grandTotal: {
      ...total?.grandTotal,
      freightPerQty: calcFreightPerQty(
        total?.grandTotal.freight,
        total?.grandTotal.quantity,
      ),
    },
  };
};

/* ===================== COMPONENT ===================== */

const FreighCostMode: React.FC<FreightTableProps> = ({ monthData }) => {
  const totals = useMemo(
    () => calculateTotals(monthData.data),
    [monthData.data],
  );

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden mb-4 border border-border">
      {/* Month Header with Glassmorphism */}
      <div className="bg-table-header-main text-center py-3 font-bold text-lg border-b-2 border-primary/30">
        {monthData.month}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          {/* ===================== HEADER ===================== */}
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="border px-2 py-1.5 bg-table-month-header-pink"
              >
                Region
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1.5 text-center bg-table-month-header-pink"
              >
                Direct Location
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1.5 text-center bg-table-month-header-orange"
              >
                ODA
              </th>
              <th
                colSpan={3}
                className="border px-2 py-1.5 text-center bg-table-month-header-red"
              >
                Grand Total
              </th>
            </tr>
            <tr>
              {["Freight", "Quantity", "Freight / Qty"].map((h) => (
                <th
                  key={`d-${h}`}
                  className="border px-2 py-1 text-right bg-table-month-header-pink"
                >
                  {h}
                </th>
              ))}
              {["Freight", "Quantity", "Freight / Qty"].map((h) => (
                <th
                  key={`o-${h}`}
                  className="border px-2 py-1 text-right bg-table-month-header-orange"
                >
                  {h}
                </th>
              ))}
              {["Freight", "Quantity", "Freight / Qty"].map((h) => (
                <th
                  key={`g-${h}`}
                  className="border px-2 py-1 text-right bg-table-month-header-red"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* ===================== BODY ===================== */}
          <tbody>
            {monthData?.data?.map((row, i) => (
              <tr key={row.region} className={i % 2 ? "bg-table-row-alt text-sm" : "text-sm"}>
                <td className="border px-2 py-1.5 font-medium">{row.region}</td>

                {[row.directLocation, row.oda, row.grandTotal].flatMap(
                  (b, idx) => [
                    <td
                      key={`f-${idx}`}
                      className="border px-2 py-1.5 text-right"
                    >
                      {formatNumber(b.freight)}
                    </td>,
                    <td
                      key={`q-${idx}`}
                      className="border px-2 py-1.5 text-right"
                    >
                      {formatNumber(b.quantity, 0)}
                    </td>,
                    <td
                      key={`fpq-${idx}`}
                      className="border px-2 py-1.5 text-right"
                    >
                      {formatNumber(b.freightPerQty)}
                    </td>,
                  ],
                )}
              </tr>
            ))}

            {/* ===================== GRAND TOTAL ===================== */}
            <tr className="bg-table-row-grand font-semibold">
              <td className="border px-2 py-1.5">Grand Total</td>

              {[totals.directLocation, totals.oda, totals.grandTotal].flatMap(
                (b, idx) => [
                  <td
                    key={`tf-${idx}`}
                    className="border px-2 py-1.5 text-right"
                  >
                    {formatNumber(b.freight)}
                  </td>,
                  <td
                    key={`tq-${idx}`}
                    className="border px-2 py-1.5 text-right"
                  >
                    {formatNumber(b.quantity, 0)}
                  </td>,
                  <td
                    key={`tfpq-${idx}`}
                    className="border px-2 py-1.5 text-right"
                  >
                    {formatNumber(b.freightPerQty)}
                  </td>,
                ],
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreighCostMode;
