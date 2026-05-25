import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  MasterHomeTiles,
  MasterHomeTilesSkeleton,
} from "@/components/master-data/MasterHomeTiles";
import { useTilesStore } from "@/stores/masterStore";

const MasterDataHomePage = () => {
  const [loading, setLoading] = useState(true);
  const currentPage = 1;
  const { data, pageSize, fetchTiles, isLoading } = useTilesStore();
  useEffect(() => {
    fetchTiles(currentPage, pageSize);
    setLoading(isLoading);
  }, [pageSize, currentPage]);
  return (
    <AppShell pageTitle="Master Data Management" lastUpdated="">
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">
          Manage core business entities, configurations, and reference data
        </p>
      </header>

      {loading ? (
        <MasterHomeTilesSkeleton />
      ) : (
        <MasterHomeTiles tiles={data ?? []} />
      )}
    </AppShell>
  );
};

export default MasterDataHomePage;
