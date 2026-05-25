/**
 * Forecast Centre Page (Standalone)
 */

import { AppShell } from "@/components/layout/AppShell";
import { ForecastCentreEmbed } from "@/components/dashboard/forecast/ForecastCentreEmbed";

const ForecastCentrePage = () => {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Forecast Centre
          </h1>
          <p className="text-sm text-muted-foreground">
            Demand, cost, TAT, and capacity projections
          </p>
        </header>
        <ForecastCentreEmbed />
      </div>
    </AppShell>
  );
};

export default ForecastCentrePage;
