export type UploadStep =
  | "INITIATED"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "COMPLETED_WITH_ERRORS";
export type ErrorSeverity = "CRITICAL" | "WARNING";

export interface UploadErrorRow {
  id: string;
  rowNo: number;
  errorType: string;
  fieldName: string;
  fieldValue: string;
  suggestedFix: string;
  severity: ErrorSeverity;
}

export interface UploadStatusMock {
  uploadId: string;
  datasetName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: UploadStep;
  currentStep: number;
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  dataQualityScore: number;
  quarantineCount: number;
  errors: UploadErrorRow[];
}

export const uploadStatusMock: UploadStatusMock = {
  uploadId: "UPL-2025-1201",
  datasetName: "Q4 2025 North Region Sales",
  uploadedBy: "Priya Sharma",
  uploadedAt: "2025-12-01T09:30:00Z",
  status: "COMPLETED_WITH_ERRORS",
  currentStep: 4,
  totalRecords: 45230,
  validRecords: 44890,
  errorRecords: 340,
  dataQualityScore: 92.4,
  quarantineCount: 12,
  errors: [
    {
      id: "ERR-001",
      rowNo: 142,
      errorType: "Missing Required Field",
      fieldName: "retailer_id",
      fieldValue: "",
      suggestedFix: "Provide a valid retailer ID from master data",
      severity: "CRITICAL",
    },
    {
      id: "ERR-002",
      rowNo: 589,
      errorType: "Invalid Format",
      fieldName: "delivery_date",
      fieldValue: "32-12-2025",
      suggestedFix: "Use DD-MM-YYYY format with valid date",
      severity: "CRITICAL",
    },
    {
      id: "ERR-003",
      rowNo: 1023,
      errorType: "Value Out of Range",
      fieldName: "quantity",
      fieldValue: "-50",
      suggestedFix: "Quantity must be a positive integer",
      severity: "WARNING",
    },
    {
      id: "ERR-004",
      rowNo: 1567,
      errorType: "Duplicate Entry",
      fieldName: "transaction_id",
      fieldValue: "TXN-2025-78901",
      suggestedFix: "Remove duplicate or assign unique transaction ID",
      severity: "CRITICAL",
    },
    {
      id: "ERR-005",
      rowNo: 2890,
      errorType: "Reference Not Found",
      fieldName: "product_sku",
      fieldValue: "SKU-INVALID-123",
      suggestedFix: "Verify SKU exists in product master",
      severity: "WARNING",
    },
    {
      id: "ERR-006",
      rowNo: 3421,
      errorType: "Data Type Mismatch",
      fieldName: "unit_price",
      fieldValue: "N/A",
      suggestedFix: "Provide numeric value for unit price",
      severity: "CRITICAL",
    },
    {
      id: "ERR-007",
      rowNo: 4102,
      errorType: "Invalid Pincode",
      fieldName: "delivery_pincode",
      fieldValue: "9999999",
      suggestedFix: "Use valid 6-digit Indian pincode",
      severity: "WARNING",
    },
    {
      id: "ERR-008",
      rowNo: 5678,
      errorType: "Missing Required Field",
      fieldName: "partner_code",
      fieldValue: "",
      suggestedFix: "Assign a valid logistics partner code",
      severity: "CRITICAL",
    },
  ],
};

// Mock for new uploads in processing state
export const processingUploadMock: UploadStatusMock = {
  uploadId: "UPL-MOCK-NEW",
  datasetName: "New Upload Dataset",
  uploadedBy: "Arun Kumar",
  uploadedAt: new Date().toISOString(),
  status: "PROCESSING",
  currentStep: 2,
  totalRecords: 0,
  validRecords: 0,
  errorRecords: 0,
  dataQualityScore: 0,
  quarantineCount: 0,
  errors: [],
};
