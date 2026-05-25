interface KpiItem {
  title: string;
  customer: number | string;
  proconnect: number | string;
  delta: string;
  deltaType?: "positive" | "negative";
  subtitle?: string;
  icon?: React.ReactNode;
}

interface KpiCardsProps {
  kpiData: KpiItem[];
}

const KpiCards = ({ kpiData }: KpiCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {kpiData?.map((kpi) => (
      <div key={kpi.title} className="rounded-lg bg-card p-3  shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          {kpi.icon && (
            <span className="w-4 h-4 text-muted-foreground">{kpi.icon}</span>
          )}
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {kpi.title}
          </p>
        </div>

        <div className="flex gap-6 mb-1">
          <div>
            <p className="text-[11px] text-muted-foreground mb-0.5">Customer</p>
            <p className="text-md font-bold text-foreground">{kpi.customer}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-0.5">
              Proconnect
            </p>
            <p className="text-md font-bold text-foreground">
              {kpi.proconnect}
            </p>
          </div>
        </div>

        <p
          className={`text-sm font-medium mt-2 ${
            kpi.deltaType === "positive" ? "text-primary" : "text-secondary"
          }`}
        >
          {kpi.delta}
        </p>

        {kpi.subtitle && (
          <p className="text-xs text-kpi-positive mt-0.5">{kpi.subtitle}</p>
        )}
      </div>
    ))}
  </div>
);

export default KpiCards;
