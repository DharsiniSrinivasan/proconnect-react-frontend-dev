import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import {
  RecoKpiStrip,
  RecoKpiStripSkeleton,
} from "@/components/recommendations/RecoKpiStrip";
import {
  RecoFeedTable,
  RecoFeedTableSkeleton,
} from "@/components/recommendations/RecoFeedTable";
import { RecoTopBarControls } from "@/components/recommendations/RecoTopBarControls";
import {
  recommendationsMock,
  RecoCategory,
  RecoPriority,
} from "@/mocks/recommendations.mock";

const RecommendationFeedPage = () => {
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<RecoCategory | "ALL">(
    "ALL",
  );
  const statusFilter = "ALL";
  const [priorityFilter, setPriorityFilter] = useState<RecoPriority | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<"impact" | "confidence" | "created">(
    "impact",
  );
  const [activeDataset, setActiveDataset] = useState("DS-2025-Q4-001");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredFeed = useMemo(() => {
    return recommendationsMock.feed.filter((reco) => {
      if (categoryFilter !== "ALL" && reco.category !== categoryFilter)
        return false;
      if (statusFilter !== "ALL" && reco.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && reco.priority !== priorityFilter)
        return false;
      return true;
    });
  }, [categoryFilter, statusFilter, priorityFilter]);

  return (
    <AppShell
      pageTitle="Recommendations Feed"
      pageSubtitle="Actionable Insights"
      lastUpdated="2026-01-01 09:00"
    >
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <p className="text-muted-foreground text-sm">
          {filteredFeed.length} recommendations
        </p>

        <RecoTopBarControls
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
          categoryData={[]}
          priorityData={[]}
        />
      </div>

      {/* KPI Strip */}
      {loading ? (
        <RecoKpiStripSkeleton />
      ) : (
        <RecoKpiStrip metrics={recommendationsMock.metrics} />
      )}

      {/* Feed Table */}
      <NeonCard title="Recommendations" className="mt-6">
        {loading ? (
          <RecoFeedTableSkeleton />
        ) : (
          <RecoFeedTable
            feed={filteredFeed}
            sortBy={sortBy}
            categoryData={[]}
            priorityData={[]}
            categoryFilter={""}
            priorityFilter={""}
          />
        )}
      </NeonCard>
    </AppShell>
  );
};

export default RecommendationFeedPage;
