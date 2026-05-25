/**
 * Facility Dashboard Page (Standalone)
 */

import { AppShell } from "@/components/layout/AppShell";
import { FacilityDashboardEmbed } from "@/components/dashboard/facility/FacilityDashboardEmbed";

const FacilityDashboard = () => {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Facility Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Tier utilization, capacity gaps, and expansion planning
          </p>
        </header>
        <FacilityDashboardEmbed />
      </div>
    </AppShell>
  );
};

export default FacilityDashboard;
