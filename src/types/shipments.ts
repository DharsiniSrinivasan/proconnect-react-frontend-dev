/**
 * Shipments Explorer types
 */

export type DocumentType =
  | "B2B Invoice"
  | "B2C Invoice"
  | "Credit Note"
  | "Debit Note"
  | "Delivery Challan";
export type ShipmentTatBand =
  | "Within SLA"
  | "Slight Delay"
  | "Major Delay"
  | "Critical";
export type ComplianceTag =
  | "Compliant"
  | "Weight Discrepancy"
  | "Document Missing"
  | "Rate Exception"
  | "Address Issue";
export type SlaRisk = "Low" | "Medium" | "High" | "Critical";

export interface ShipmentRow {
  id: string;
  invoiceNo: string;
  docType: DocumentType;
  originPincode: string;
  originCity: string;
  destPincode: string;
  destCity: string;
  netWeight: number;
  chargedWeight: number;
  cost: number;
  costPerKg: number;
  actualTat: number;
  baselineTat: number;
  slaVariance: number;
  tatBand: ShipmentTatBand;
  partner: string;
  mode: string;
  facility: string;
  complianceTag: ComplianceTag;
  recoFlags: string[];
  shipmentDate: string;
  deliveryDate?: string;
  customer: string;
  region: string;
}

export interface ShipmentFiltersSummary {
  filteredRecords: number;
  avgCostPerKg: number;
  avgTat: number;
  slaPct: number;
  highRiskPct: number;
}

export interface ShipmentsData {
  shipments: ShipmentRow[];
  summary: ShipmentFiltersSummary;
}
