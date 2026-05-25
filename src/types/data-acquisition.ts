/**
 * Data Acquisition types
 * Used for Batches, Uploads, and related functionality
 */

export type DatasetStatus =
  | "PROCESSING"
  | "ANALYSED"
  | "RECOMMENDATION_READY"
  | "FAILED";

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
export interface DataSetItem {
  id?: string;
  name?: string;
  uploadId?: string;
  customer_name?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  status?: string;
  totalRecords?: number;
  validRecords?: number;
  errorRecords?: number;
  dataQualityScore?: number;
  batch_name?: string;
  customer_type?: string;
  customer_id?: number | any;
}
export interface NewDataSet {
  uploadId?: string;
  fileName?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  currentStage?: string;
  status?: string;
  stages?: Stage[];
  stats?: Stats;
  errors?: any[];
}

export interface Stage {
  stage?: string;
  label?: string;
  status?: string;
  startedAt?: string | null;
  completedAt?: null;
  details?: null;
}

export interface Stats {
  totalRecords?: number;
  validRecords?: number;
  errorRecords?: number;
  warningRecords?: number;
  dataQualityScore?: number;
  quarantineCount?: number;
}

export interface DatasetListData {
  summary: DatasetSummary;
  datasets: Dataset[];
}

// ============= Upload Status =============

export type UploadStage =
  | "UPLOAD"
  | "VALIDATION"
  | "PROFILING"
  | "ANALYSIS"
  | "RECOMMENDATION"
  | "COMPLETE";
export type StageStatus = "pending" | "in_progress" | "completed" | "failed";

export interface UploadStageItem {
  stage: UploadStage;
  label: string;
  status: StageStatus;
  startedAt?: string;
  completedAt?: string;
  details?: string;
}

export interface UploadError {
  row: number;
  column: string;
  value: string;
  error: string;
  severity: "error" | "warning";
}

export interface UploadStats {
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  warningRecords: number;
  dataQualityScore: number;
}

export interface UploadStatusData {
  uploadId: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  currentStage: UploadStage;
  stages: UploadStageItem[];
  stats: UploadStats;
  errors: UploadError[];
}
