import { AppShell } from "@/components/layout/AppShell";
import { GlobalFiltersBar } from "@/components/layout/GlobalFiltersBar";
import { FinancialDashboardEmbed } from "@/components/dashboard/financial/FinancialDashboardEmbed";

const FinancialDashboard = () => {
  return (
    <AppShell
      pageTitle="Financial Overview"
      pageSubtitle="Logistics Economics"
      lastUpdated="2025-12-31T18:45:00Z"
    >
      <GlobalFiltersBar
        showDateRange={true}
        showViewToggle={true}
        viewOptions={[
          { value: "total", label: "Total" },
          { value: "partner", label: "Partner" },
          { value: "region", label: "Region" },
        ]}
      />
      <FinancialDashboardEmbed />
    </AppShell>
  );
};

export default FinancialDashboard;
