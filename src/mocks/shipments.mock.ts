export type DocumentType =
  | "B2B Invoice"
  | "B2C Invoice"
  | "Credit Note"
  | "Debit Note"
  | "Delivery Challan";
export type TatBand =
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
  tatBand: TatBand;
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

export interface ShipmentsMock {
  shipments: ShipmentRow[];
  summary: ShipmentFiltersSummary;
}

const partners = [
  "BlueDart Express",
  "Delhivery",
  "GATI Express",
  "XpressBees",
  "Ecom Express",
  "Shadowfax",
];
const modes = ["Road", "Air", "Rail"];
const facilities = [
  "Mumbai Hub",
  "Delhi Hub",
  "Bangalore Hub",
  "Chennai Sat",
  "Hyderabad Sat",
  "Pune WH",
];
const docTypes: DocumentType[] = [
  "B2B Invoice",
  "B2C Invoice",
  "Credit Note",
  "Debit Note",
  "Delivery Challan",
];
const tatBands: TatBand[] = [
  "Within SLA",
  "Slight Delay",
  "Major Delay",
  "Critical",
];
const complianceTags: ComplianceTag[] = [
  "Compliant",
  "Weight Discrepancy",
  "Document Missing",
  "Rate Exception",
  "Address Issue",
];
const recoFlagOptions = ["REC-001", "REC-002", "REC-003", "REC-005", "REC-007"];
const cities = [
  { city: "Mumbai", pincode: "400001", region: "West" },
  { city: "Delhi", pincode: "110001", region: "North" },
  { city: "Bangalore", pincode: "560001", region: "South" },
  { city: "Chennai", pincode: "600001", region: "South" },
  { city: "Hyderabad", pincode: "500001", region: "South" },
  { city: "Pune", pincode: "411001", region: "West" },
  { city: "Kolkata", pincode: "700001", region: "East" },
  { city: "Ahmedabad", pincode: "380001", region: "West" },
  { city: "Jaipur", pincode: "302001", region: "North" },
  { city: "Lucknow", pincode: "226001", region: "North" },
];
const customers = [
  "Reliance Retail",
  "Tata Consumer",
  "ITC Limited",
  "Hindustan Unilever",
  "Dabur India",
  "Marico",
  "Godrej Consumer",
  "Britannia",
];

const generateShipments = (): ShipmentRow[] => {
  const shipments: ShipmentRow[] = [];
  for (let i = 1; i <= 150; i++) {
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let dest = cities[Math.floor(Math.random() * cities.length)];
    while (dest.city === origin.city) {
      dest = cities[Math.floor(Math.random() * cities.length)];
    }
    const netWeight = Math.round((0.5 + Math.random() * 15) * 100) / 100;
    const chargedWeight =
      Math.round((netWeight + Math.random() * 2) * 100) / 100;
    const costPerKg = Math.round((30 + Math.random() * 60) * 100) / 100;
    const cost = Math.round(chargedWeight * costPerKg * 100) / 100;
    const baselineTat = Math.floor(2 + Math.random() * 4);
    const actualTat = Math.floor(baselineTat + (Math.random() - 0.3) * 3);
    const slaVariance = actualTat - baselineTat;
    let tatBand: TatBand = "Within SLA";
    if (slaVariance > 2) tatBand = "Critical";
    else if (slaVariance > 1) tatBand = "Major Delay";
    else if (slaVariance > 0) tatBand = "Slight Delay";

    const shipmentDate = new Date(2025, 11, Math.floor(1 + Math.random() * 28));
    const deliveryDate = new Date(shipmentDate);
    deliveryDate.setDate(deliveryDate.getDate() + actualTat);

    const recoFlags: string[] = [];
    if (Math.random() > 0.7) {
      recoFlags.push(
        recoFlagOptions[Math.floor(Math.random() * recoFlagOptions.length)],
      );
    }

    shipments.push({
      id: `SHP-${String(i).padStart(5, "0")}`,
      invoiceNo: `INV-${String(1000 + i)}`,
      docType: docTypes[Math.floor(Math.random() * docTypes.length)],
      originPincode: origin.pincode,
      originCity: origin.city,
      destPincode: dest.pincode,
      destCity: dest.city,
      netWeight,
      chargedWeight,
      cost,
      costPerKg,
      actualTat,
      baselineTat,
      slaVariance,
      tatBand,
      partner: partners[Math.floor(Math.random() * partners.length)],
      mode: modes[Math.floor(Math.random() * modes.length)],
      facility: facilities[Math.floor(Math.random() * facilities.length)],
      complianceTag:
        complianceTags[Math.floor(Math.random() * complianceTags.length)],
      recoFlags,
      shipmentDate: shipmentDate.toISOString().split("T")[0],
      deliveryDate: deliveryDate.toISOString().split("T")[0],
      customer: customers[Math.floor(Math.random() * customers.length)],
      region: origin.region,
    });
  }
  return shipments;
};

const shipments = generateShipments();

const calculateSummary = (data: ShipmentRow[]): ShipmentFiltersSummary => {
  const total = data.length;
  const avgCostPerKg =
    total > 0
      ? Math.round((data.reduce((s, r) => s + r.costPerKg, 0) / total) * 100) /
        100
      : 0;
  const avgTat =
    total > 0
      ? Math.round((data.reduce((s, r) => s + r.actualTat, 0) / total) * 10) /
        10
      : 0;
  const withinSla = data.filter((r) => r.tatBand === "Within SLA").length;
  const slaPct = total > 0 ? Math.round((withinSla / total) * 1000) / 10 : 0;
  const highRisk = data.filter(
    (r) => r.tatBand === "Critical" || r.tatBand === "Major Delay",
  ).length;
  const highRiskPct =
    total > 0 ? Math.round((highRisk / total) * 1000) / 10 : 0;
  return { filteredRecords: total, avgCostPerKg, avgTat, slaPct, highRiskPct };
};

export const shipmentsMock: ShipmentsMock = {
  shipments,
  summary: calculateSummary(shipments),
};

export const calculateFilteredSummary = calculateSummary;
