import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  MasterHomeTilesSkeleton2,
} from "@/components/master-data/MasterHomeTiles2";
import { useTilesStore } from "@/stores/masterStore";
import { MasterHomeTiles2 } from "@/components/master-data/MasterHomeTiles2";

const MasterDataHomePage2 = () => {
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
        <MasterHomeTilesSkeleton2 />
      ) : (
        <MasterHomeTiles2 tiles={data ?? []} />
      )}
    </AppShell>
  );
};

export default MasterDataHomePage2;
