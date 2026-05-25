/**
 * Dataset Context
 *
 * Provides global dataset selection state across the application.
 * All pages that need to filter by dataset should use useDatasetContext().
 */

import { createContext, useContext, useState, ReactNode } from "react";

export interface DatasetInfo {
  id: string;
  name: string;
  uploadedAt: string;
  recordCount: number;
}

interface DatasetContextValue {
  activeDataset: DatasetInfo | null;
  setActiveDataset: (dataset: DatasetInfo | null) => void;
  availableDatasets: DatasetInfo[];
  setAvailableDatasets: (datasets: DatasetInfo[]) => void;
}

const DatasetContext = createContext<DatasetContextValue | null>(null);

// Default datasets for demo purposes
const defaultDatasets: DatasetInfo[] = [
  {
    id: "ds-live",
    name: "Q4 2025 – Live Operations",
    uploadedAt: "2025-12-31T14:30:00Z",
    recordCount: 2400000,
  },
  {
    id: "ds-q3",
    name: "Q3 2025 – Archived",
    uploadedAt: "2025-09-30T18:00:00Z",
    recordCount: 2100000,
  },
  {
    id: "ds-q2",
    name: "Q2 2025 – Archived",
    uploadedAt: "2025-06-30T18:00:00Z",
    recordCount: 1950000,
  },
  {
    id: "74",
    name: "data dqs.csv",
    uploadedAt: "2026-01-13T06:09:55.387030+00:00",
    recordCount: 1000,
  },
];

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [activeDataset, setActiveDataset] = useState<DatasetInfo | null>(
    defaultDatasets[0],
  );
  const [availableDatasets, setAvailableDatasets] =
    useState<DatasetInfo[]>(defaultDatasets);

  return (
    <DatasetContext.Provider
      value={{
        activeDataset,
        setActiveDataset,
        availableDatasets,
        setAvailableDatasets,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetContext() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("useDatasetContext must be used within DatasetProvider");
  }
  return context;
}
