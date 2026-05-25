import { useState } from "react";

export interface CustomerToday {
  cost: string;
  tat: string;
  otif: string;
  mode: string;
  partner: string;
}

export interface WithProconnect {
  cost: string;
  tat: string;
  otif: string;
  saving: string;
}

export interface SalesRecommendation {
  title: string;
  customerToday: CustomerToday;
  withProconnect: WithProconnect;
  tags: string[];
}

export interface SalesRecommendationsProps {
  salesRecommendations: SalesRecommendation[];
}

const SalesRecommendations = ({ salesRecommendations }) => {
  const [highImpactOnly, setHighImpactOnly] = useState(false);

  const filtered = highImpactOnly
    ? salesRecommendations.filter((r) => {
        const saving = parseInt(r.withProconnect.saving.replace(/[₹,]/g, ""));
        const cost = parseInt(r.customerToday.cost.replace(/[₹,]/g, ""));
        const pct = (saving / cost) * 100;
        return pct >= 20;
      })
    : salesRecommendations;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Sales Recommendations
        </h3>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${highImpactOnly ? "bg-primary" : "bg-border"}`}
            onClick={() => setHighImpactOnly(!highImpactOnly)}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${highImpactOnly ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
          High-impact only (&gt;20% savings or &gt;1d TAT)
        </label>
      </div>

      <div className="space-y-6 glass-card p-5">
        {filtered?.map((rec, i) => (
          <div key={i} className="rounded-lg border border-border p-5">
            <h4 className="font-semibold text-foreground mb-4">{rec.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4  bg-primary/10">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground mb-3">
                  CUSTOMER TODAY
                </p>
                <div className="space-y-1.5 text-sm text-foreground">
                  <p>
                    Cost: <span>{rec.customerToday.cost}</span>
                  </p>
                  <p>
                    TAT: <span>{rec.customerToday.tat}</span>
                  </p>
                  <p>
                    OTIF: <span>{rec.customerToday.otif}</span>
                  </p>
                  <p>
                    Mode: <span>{rec.customerToday.mode}</span>
                  </p>
                  <p>
                    Partner: <span>{rec.customerToday.partner}</span>
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                <p className="text-xs font-semibold tracking-wide text-primary mb-3">
                  WITH PROCONNECT
                </p>
                <div className="space-y-1.5 text-sm text-foreground">
                  <p>
                    Cost: <span>{rec.withProconnect.cost}</span>
                  </p>
                  <p>
                    TAT: <span>{rec.withProconnect.tat}</span>
                  </p>
                  <p>
                    OTIF: <span>{rec.withProconnect.otif}</span>
                  </p>
                  <p className="text-primary font-medium pt-1">
                    Customer would have saved {rec.withProconnect.saving} on
                    this lane
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 ">
              {rec?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-primary/40 text-primary  bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesRecommendations;
