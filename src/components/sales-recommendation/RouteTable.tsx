import { useState } from "react";

interface Route {
  origin: string;
  destination: string;
  product: string;
  units: number;
  custMode: string;
  propMode: string;
  custCost: number;
  pcCost: number;
  savings: number;
  savingsPct: number;
  custTAT: string;
  pcTAT: string;
  tatDelta: string;
}

interface Props {
  routeData: Route[];
}

const RouteTable = ({ routeData }: Props) => {
  const [opportunityType, setOpportunityType] = useState("all");
  const [minSavings, setMinSavings] = useState(0);

  const filtered = routeData?.filter((r) => r.savingsPct >= minSavings);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-card border border-border p-5">
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Opportunity Type
            </label>
            <select
              value={opportunityType}
              onChange={(e) => setOpportunityType(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground min-w-[160px]"
            >
              <option value="all">All types</option>
              <option value="cost">Cost Optimization</option>
              <option value="tat">TAT Reduction</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Min Savings %
            </label>
            <input
              type="number"
              value={minSavings}
              onChange={(e) => setMinSavings(Number(e.target.value))}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground w-20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border p-5 overflow-x-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Route-level Business Case
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="pb-3 pr-4 font-medium">Origin</th>
              <th className="pb-3 pr-4 font-medium">Destination</th>
              <th className="pb-3 pr-4 font-medium">Product / SKU</th>
              <th className="pb-3 pr-4 font-medium text-right">Units</th>
              <th className="pb-3 pr-4 font-medium">Cust. Mode</th>
              <th className="pb-3 pr-4 font-medium">Prop. Mode</th>
              <th className="pb-3 pr-4 font-medium text-right">
                Cust. Cost (₹)
              </th>
              <th className="pb-3 pr-4 font-medium text-right">PC Cost (₹)</th>
              <th className="pb-3 pr-4 font-medium text-right">Savings</th>
              <th className="pb-3 pr-4 font-medium">Cust. TAT</th>
              <th className="pb-3 pr-4 font-medium">PC TAT</th>
              <th className="pb-3 font-medium">TAT Δ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-3 pr-4 font-medium text-foreground">
                  {r.origin}
                </td>
                <td className="py-3 pr-4 text-foreground">{r.destination}</td>
                <td className="py-3 pr-4 text-foreground">{r.product}</td>
                <td className="py-3 pr-4 text-right text-foreground">
                  {r.units}
                </td>
                <td className="py-3 pr-4 text-foreground">{r.custMode}</td>
                <td className="py-3 pr-4 text-foreground">{r.propMode}</td>
                <td className="py-3 pr-4 text-right text-foreground">
                  ₹{r.custCost.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-right text-primary font-medium">
                  ₹{r.pcCost.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-right text-success font-semibold">
                  ₹{r.savings.toLocaleString()} ({r.savingsPct}%)
                </td>
                <td className="py-3 pr-4 text-foreground">{r.custTAT}</td>
                <td className="py-3 pr-4 text-foreground">{r.pcTAT}</td>
                <td className="py-3 text-success font-medium">{r.tatDelta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteTable;
