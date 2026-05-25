/**
 * Operational Dashboard Page (Standalone) - Day-to-day operations focused
 */

import { AppShell } from "@/components/layout/AppShell";
import { OperationalDashboardEmbed } from "@/components/dashboard/operational/OperationalDashboardEmbed";

const OperationalDashboard = (id) => {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Operational Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            SLA performance, TAT, docket efficiency, and bottlenecks
          </p>
        </header>
        <OperationalDashboardEmbed id={id} />
      </div>
    </AppShell>
  );
};

export default OperationalDashboard;
