import { AppShell } from "@/components/layout/AppShell";
import ForeCastList from "./ForeCastTable";
const ForecastPage = () => {
  return (
    <AppShell
      pageTitle="Forecast Insights"
      pageSubtitle="Trends & Predictive Insights"
    >
        <ForeCastList />
    </AppShell>
  );
};
export default ForecastPage;
