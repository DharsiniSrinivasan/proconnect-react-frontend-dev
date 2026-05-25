/**
 * Strategic Dashboard Page (Standalone) - Executive overview focused
 */

import { AppShell } from "@/components/layout/AppShell";
import { StrategicDashboardEmbed } from "@/components/dashboard/strategic/StrategicDashboardEmbed";

const Index = () => {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Strategic Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Executive insights, savings opportunities, and what-if scenarios
          </p>
        </header>
        <StrategicDashboardEmbed />
      </div>
    </AppShell>
  );
};

export default Index;
