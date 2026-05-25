import { AppShell } from "@/components/layout/AppShell";
import RecommendationList from "./RecommendationList";

const RecommendationPage = () => {
  return (
    <AppShell pageTitle="Recommendations" pageSubtitle="Smart Suggestions">
      <section>
        <RecommendationList />
      </section>
    </AppShell>
  );
};
export default RecommendationPage;
