export type DatasetStatus =
  | "PROCESSING"
  | "ANALYSED"
  | "RECOMMENDATION_READY"
  | "FAILED"
  | "UPLOADED";

export interface DatasetSummary {
  totalDatasets: number;
  analysed: number;
  completedWithErrors: number;
  inQuarantine: number;
  avgDqs: number;
}

export interface Dataset {
  id: string;
  name: string;
  uploadId: string;
  uploadedAt: string;
  uploadedBy: string;
  status: DatasetStatus;
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  dataQualityScore: number;
}

export interface DatasetListMock {
  summary: DatasetSummary;
  datasets: Dataset[];
}

export const datasetListMock: DatasetListMock = {
  summary: {
    totalDatasets: 24,
    analysed: 18,
    completedWithErrors: 4,
    inQuarantine: 2,
    avgDqs: 87.3,
  },
  datasets: [
    {
      id: "DS-001",
      name: "Q4 2025 North Region Sales",
      uploadId: "UPL-2025-1201",
      uploadedAt: "2025-12-01T09:30:00Z",
      uploadedBy: "Priya Sharma",
      status: "RECOMMENDATION_READY",
      totalRecords: 45230,
      validRecords: 44890,
      errorRecords: 340,
      dataQualityScore: 92.4,
    },
    {
      id: "74",
      name: "Q4 2025 North Region Sales",
      uploadId: "UPL-2025-1201",
      uploadedAt: "2025-12-01T09:30:00Z",
      uploadedBy: "Priya Sharma",
      status: "RECOMMENDATION_READY",
      totalRecords: 45230,
      validRecords: 44890,
      errorRecords: 340,
      dataQualityScore: 92.4,
    },
    {
      id: "DS-002",
      name: "West Zone Inventory Sync",
      uploadId: "UPL-2025-1128",
      uploadedAt: "2025-11-28T14:15:00Z",
      uploadedBy: "Amit Patel",
      status: "ANALYSED",
      totalRecords: 28400,
      validRecords: 27950,
      errorRecords: 450,
      dataQualityScore: 88.1,
    },
    {
      id: "DS-003",
      name: "Partner Delivery Metrics",
      uploadId: "UPL-2025-1125",
      uploadedAt: "2025-11-25T11:00:00Z",
      uploadedBy: "Kavitha Nair",
      status: "PROCESSING",
      totalRecords: 15600,
      validRecords: 0,
      errorRecords: 0,
      dataQualityScore: 0,
    },
    {
      id: "DS-004",
      name: "Retailer Master Data Update",
      uploadId: "UPL-2025-1120",
      uploadedAt: "2025-11-20T16:45:00Z",
      uploadedBy: "Rahul Verma",
      status: "FAILED",
      totalRecords: 8920,
      validRecords: 0,
      errorRecords: 8920,
      dataQualityScore: 0,
    },
    {
      id: "DS-005",
      name: "South Region Returns Analysis",
      uploadId: "UPL-2025-1118",
      uploadedAt: "2025-11-18T08:20:00Z",
      uploadedBy: "Deepa Krishnan",
      status: "RECOMMENDATION_READY",
      totalRecords: 12340,
      validRecords: 12100,
      errorRecords: 240,
      dataQualityScore: 94.8,
    },
    {
      id: "DS-006",
      name: "Hub Capacity Planning Data",
      uploadId: "UPL-2025-1115",
      uploadedAt: "2025-11-15T13:30:00Z",
      uploadedBy: "Sanjay Gupta",
      status: "ANALYSED",
      totalRecords: 6780,
      validRecords: 6540,
      errorRecords: 240,
      dataQualityScore: 85.2,
    },
  ],
};
