/**
 * Real Data Mock - Based on actual CSV uploads
 * Rate Card Master: COURIER, FROM, TO, MODE, Frt_Rate, ODA, Minimum, COURIER NAME
 * Sample Dataset: Billing, Invoice, Quantity, Plant, City, Region, Courier, TAT, Weight
 *
 * Data Period: October 2024
 * Total Records: ~22,000 shipments
 */

// ============= Rate Card Types =============
export interface RealRateCardRow {
  id: string;
  courierCode: string;
  courierName: string;
  from: string;
  to: string;
  mode: string;
  freightRate: number;
  eRate: number;
  odaCharge: number;
  odaTax: number;
  totalRate: number;
  minimumCharge: number;
}

// ============= Partner Types (derived from Rate Card) =============
export interface RealPartnerRow {
  id: string;
  code: string;
  name: string;
  modes: string[];
  laneCount: number;
  avgRate: number;
  odaCoverage: number;
  status: "Active" | "Inactive";
}

// ============= Shipment Types =============
export type DeliveryStatus = "On time" | "Delay";
export type DispatchStatus = "On time" | "Delay";
export type TaxType =
  | "With-in-State"
  | "With-in City"
  | "With-in-Region"
  | "Cross Region";
export type DeliveryType = "Direct" | "ODA" | "EDL";
export type IncotermsType = "STN" | "DTD" | "AIR";

export interface RealShipmentRow {
  id: string;
  billingDocNumber: string;
  invoiceDate: string;
  invoiceTime: string;
  pattern: string;
  quantity: number;
  qtyRemarks: string;
  plant: string;
  city: string;
  state: string;
  region: string;
  shipToName: string;
  shipToState: string;
  shipToPinCode: string;
  shipToRegion: string;
  deliveryType: DeliveryType;
  shipToCity: string;
  soldToPartyCode: string;
  taxType: TaxType;
  igstRate: number;
  igstAmount: number;
  totalLineValue: number;
  noOfBoxes: number;
  courierGCN: string;
  courierName: string;
  dispatchDate: string;
  dispatchTime: string;
  unitWeight: number;
  totalWeight: number;
  volumetricWeight: number;
  totalVolumetricWeight: number;
  materialGroup: string;
  incoterms: IncotermsType;
  incoDescription: string;
  podDate: string;
  sbuName: string;
  groupSbuName: string;
  dispatchDays: number;
  dispatchRemarks: DispatchStatus;
  dispatchDelayReason: string;
  deliveryDays: number;
  deliveryRemarks: DeliveryStatus;
  agreedDeliveryTAT: number;
  tatVariance: number;
}

// ============= Unique values from CSV data =============
export const COURIER_CODES = [
  "FFC",
  "GAT",
  "BDC1",
  "ICM",
  "AP DOX",
  "FLY",
  "MAT",
  "DLY",
  "HMC",
  "SFC",
  "NDA",
  "MAX",
  "UFL",
  "BDC-DOC",
];

export const COURIER_NAMES = [
  "BLUEDART",
  "Trustus",
  "NEW INDIA",
  "SME CARGO",
  "WORLDFIRST",
  "AFEXEXP",
  "SAKHI RAIL",
  "INTERCITY",
  "GMS",
  "UNIVERSAL",
  "TAC CARGO",
  "ORIGINEXP",
  "Growever",
  "TRANS QUIC",
  "AMBIKALOGI",
  "RAMESH",
  "FIRST FLIGHT COURIERS LTD",
  "GATI KINTETSU EXPRESS PVT LTD",
  "BLUE DART EXPRESS LIMITED",
  "ICMS TRANSWAYS",
  "SAFEXPRESS PRIVATE LTD",
  "HALLMARK CARGO (P) LTD",
  "FLY-DART COURIERS",
  "FEDEX EXPRESS TSCS (I) PVT LTD",
];

export const PLANTS = [
  "DEO1",
  "BEN2",
  "MUB2",
  "CHE1",
  "KOL2",
  "SEC2",
  "AHM1",
  "LUC1",
  "JAI1",
  "BHO1",
  "IND1",
  "TRI1",
  "FAR1",
  "NAG1",
  "AGR1",
  "VAR1",
  "LUD1",
  "VIJ1",
  "BHU1",
  "DEH1",
  "GUR1",
];

export const CITIES = [
  "BANGALORE",
  "CHENNAI",
  "MUMBAI",
  "NEW DELHI",
  "KOLKATA",
  "HYDERABAD",
  "PUNE",
  "AHMEDABAD",
  "LUCKNOW",
  "JAIPUR",
  "BHOPAL",
  "INDORE",
  "COCHIN",
  "COIMBATORE",
  "NOIDA",
  "GURGAON",
  "GUWAHATI",
  "BARODA",
  "VIJAYAWADA",
  "BHUBANESWAR",
  "DEHRADUN",
  "FARIDABAD",
  "NAGPUR",
  "AGRA",
  "VARANASI",
  "LUDHIANA",
  "THIRUVANANTHAPURAM",
  "SECUNDERABAD",
  "THANE",
  "BELGAUM",
  "BELLARY",
  "BIJAPUR",
  "MYSORE",
  "MANGALORE",
  "SURAT",
  "GORAKHPUR",
  "KOTA",
  "VADODARA",
  "DHARWAD",
  "BARDHAMAN",
  "PURULIA",
];

export const PLANT_CITIES: Record<string, string> = {
  DEO1: "NEW DELHI",
  BEN2: "BENGALURU",
  MUB2: "THANE",
  CHE1: "CHENNAI",
  KOL2: "KOLKATA",
  SEC2: "SECUNDERABAD",
  AHM1: "AHMEDABAD",
  LUC1: "LUCKNOW",
  JAI1: "JAIPUR",
  BHO1: "BHOPAL",
  IND1: "INDORE",
  TRI1: "THIRUVANANTHAPURAM",
  FAR1: "FARIDABAD",
  NAG1: "NAGPUR",
  AGR1: "AGRA",
  VAR1: "VARANASI",
  LUD1: "LUDHIANA",
  VIJ1: "VIJAYAWADA",
  BHU1: "BHUBANESWAR",
  DEH1: "DEHRADUN",
  GUR1: "GURGAON",
};

export const REGIONS = ["North", "South", "East", "West"];

export const STATES = [
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi",
  "West Bengal",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
  "Kerala",
  "Haryana",
  "Punjab",
  "Odisha",
  "Andhra Pradesh",
  "Uttarakhand",
];

export const MODES = ["ROAD", "AIR", "RAIL"];

export const MATERIAL_GROUPS = ["MOTO", "GLSP", "TITN"];

export const QTY_REMARKS = [
  "1-2 Unit billing",
  "3-5 Unit Billing",
  "6-10 Unit Billings",
  "> 10 Unit billing",
];

export const INCOTERMS = ["STN", "DTD", "AIR"];

// ============= Sample Rate Card Data (from CSV) =============
export const realRateCardsMock: RealRateCardRow[] = [
  {
    id: "RC-001",
    courierCode: "FFC",
    courierName: "FIRST FLIGHT COURIERS LTD",
    from: "BANGALORE",
    to: "BANGALORE",
    mode: "ROAD",
    freightRate: 4.0,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 4.0,
    minimumCharge: 80,
  },
  {
    id: "RC-002",
    courierCode: "FFC",
    courierName: "FIRST FLIGHT COURIERS LTD",
    from: "BANGALORE",
    to: "BELGAUM",
    mode: "ROAD",
    freightRate: 4.0,
    eRate: 0,
    odaCharge: 500,
    odaTax: 72.5,
    totalRate: 4.0,
    minimumCharge: 80,
  },
  {
    id: "RC-003",
    courierCode: "FFC",
    courierName: "FIRST FLIGHT COURIERS LTD",
    from: "BANGALORE",
    to: "CHENNAI",
    mode: "ROAD",
    freightRate: 4.5,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 4.5,
    minimumCharge: 90,
  },
  {
    id: "RC-004",
    courierCode: "GAT",
    courierName: "GATI KINTETSU EXPRESS PVT LTD",
    from: "BANGALORE",
    to: "PUDUCHERRY",
    mode: "ROAD",
    freightRate: 4.75,
    eRate: 1.75,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 6.5,
    minimumCharge: 100,
  },
  {
    id: "RC-005",
    courierCode: "BDC1",
    courierName: "BLUE DART EXPRESS LIMITED",
    from: "BARODA",
    to: "SURAT",
    mode: "ROAD",
    freightRate: 9.1,
    eRate: 3.32,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 14.91,
    minimumCharge: 150,
  },
  {
    id: "RC-006",
    courierCode: "ICM",
    courierName: "ICMS TRANSWAYS",
    from: "BHOPAL",
    to: "INDORE",
    mode: "ROAD",
    freightRate: 5.5,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 5.5,
    minimumCharge: 70,
  },
  {
    id: "RC-007",
    courierCode: "SFC",
    courierName: "SAFEXPRESS PRIVATE LTD",
    from: "GUWAHATI",
    to: "JORHAT",
    mode: "ROAD",
    freightRate: 7.25,
    eRate: 2.18,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 9.43,
    minimumCharge: 400,
  },
  {
    id: "RC-008",
    courierCode: "FFC",
    courierName: "FIRST FLIGHT COURIERS LTD",
    from: "CHENNAI",
    to: "COIMBATORE",
    mode: "ROAD",
    freightRate: 6.5,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 6.5,
    minimumCharge: 65,
  },
  {
    id: "RC-009",
    courierCode: "BDC-DOC",
    courierName: "BLUE DART EXPRESS LIMITED",
    from: "CHENNAI",
    to: "CHENNAI",
    mode: "ROAD",
    freightRate: 25.0,
    eRate: 14.8,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 39.8,
    minimumCharge: 40,
  },
  {
    id: "RC-010",
    courierCode: "HMC",
    courierName: "HALLMARK CARGO (P) LTD",
    from: "COIMBATORE",
    to: "COIMBATORE",
    mode: "ROAD",
    freightRate: 4.5,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 4.5,
    minimumCharge: 100,
  },
  {
    id: "RC-011",
    courierCode: "FLY",
    courierName: "FLY-DART COURIERS",
    from: "COCHIN",
    to: "TRIVANDRUM",
    mode: "ROAD",
    freightRate: 4.0,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 4.0,
    minimumCharge: 50,
  },
  {
    id: "RC-012",
    courierCode: "MAT",
    courierName: "MATRIX LOGISTICS",
    from: "COCHIN",
    to: "COCHIN",
    mode: "ROAD",
    freightRate: 6.0,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 6.0,
    minimumCharge: 50,
  },
];

// ============= Partners derived from Rate Card =============
export const realPartnersMock: RealPartnerRow[] = [
  {
    id: "PTR-001",
    code: "BLUEDART",
    name: "BLUE DART EXPRESS LIMITED",
    modes: ["ROAD", "AIR"],
    laneCount: 4850,
    avgRate: 15.2,
    odaCoverage: 20,
    status: "Active",
  },
  {
    id: "PTR-002",
    code: "Trustus",
    name: "Trustus Logistics",
    modes: ["ROAD"],
    laneCount: 2890,
    avgRate: 5.8,
    odaCoverage: 12,
    status: "Active",
  },
  {
    id: "PTR-003",
    code: "NEW INDIA",
    name: "NEW INDIA CARGO",
    modes: ["ROAD"],
    laneCount: 2450,
    avgRate: 4.2,
    odaCoverage: 35,
    status: "Active",
  },
  {
    id: "PTR-004",
    code: "SME CARGO",
    name: "SME CARGO SERVICES",
    modes: ["ROAD"],
    laneCount: 1820,
    avgRate: 5.5,
    odaCoverage: 18,
    status: "Active",
  },
  {
    id: "PTR-005",
    code: "WORLDFIRST",
    name: "WORLDFIRST LOGISTICS",
    modes: ["ROAD"],
    laneCount: 1650,
    avgRate: 6.2,
    odaCoverage: 25,
    status: "Active",
  },
  {
    id: "PTR-006",
    code: "AFEXEXP",
    name: "AFEX EXPRESS",
    modes: ["ROAD"],
    laneCount: 1420,
    avgRate: 5.0,
    odaCoverage: 10,
    status: "Active",
  },
  {
    id: "PTR-007",
    code: "SAKHI RAIL",
    name: "SAKHI RAIL CARGO",
    modes: ["RAIL", "ROAD"],
    laneCount: 980,
    avgRate: 4.8,
    odaCoverage: 22,
    status: "Active",
  },
  {
    id: "PTR-008",
    code: "GMS",
    name: "GMS LOGISTICS",
    modes: ["ROAD"],
    laneCount: 890,
    avgRate: 5.2,
    odaCoverage: 8,
    status: "Active",
  },
  {
    id: "PTR-009",
    code: "FFC",
    name: "FIRST FLIGHT COURIERS LTD",
    modes: ["ROAD"],
    laneCount: 1560,
    avgRate: 5.2,
    odaCoverage: 42,
    status: "Active",
  },
  {
    id: "PTR-010",
    code: "SFC",
    name: "SAFEXPRESS PRIVATE LTD",
    modes: ["ROAD"],
    laneCount: 1200,
    avgRate: 9.43,
    odaCoverage: 5,
    status: "Active",
  },
  {
    id: "PTR-011",
    code: "UNIVERSAL",
    name: "UNIVERSAL EXPRESS",
    modes: ["ROAD"],
    laneCount: 400,
    avgRate: 6.5,
    odaCoverage: 30,
    status: "Active",
  },
  {
    id: "PTR-012",
    code: "TAC CARGO",
    name: "TAC CARGO SERVICES",
    modes: ["ROAD"],
    laneCount: 220,
    avgRate: 4.8,
    odaCoverage: 5,
    status: "Active",
  },
  {
    id: "PTR-013",
    code: "ORIGINEXP",
    name: "ORIGIN EXPRESS",
    modes: ["ROAD"],
    laneCount: 280,
    avgRate: 5.5,
    odaCoverage: 18,
    status: "Active",
  },
  {
    id: "PTR-014",
    code: "INTERCITY",
    name: "INTERCITY CARGO",
    modes: ["ROAD"],
    laneCount: 250,
    avgRate: 4.0,
    odaCoverage: 15,
    status: "Active",
  },
  {
    id: "PTR-015",
    code: "ICM",
    name: "ICMS TRANSWAYS",
    modes: ["ROAD"],
    laneCount: 450,
    avgRate: 6.5,
    odaCoverage: 8,
    status: "Active",
  },
  {
    id: "PTR-016",
    code: "GAT",
    name: "GATI KINTETSU EXPRESS PVT LTD",
    modes: ["ROAD"],
    laneCount: 780,
    avgRate: 6.8,
    odaCoverage: 28,
    status: "Active",
  },
];

// ============= Dashboard Analytics (derived from sample data) =============
export interface RegionMetrics {
  region: string;
  code: string;
  shipmentCount: number;
  totalValue: number;
  totalWeight: number;
  onTimeDelivery: number;
  avgTAT: number;
  delayedCount: number;
  avgCostPerKg: number;
  odaShipments: number;
}

export interface CourierMetrics {
  courierName: string;
  shipmentCount: number;
  totalValue: number;
  totalWeight: number;
  onTimeRate: number;
  avgDeliveryDays: number;
  avgCostPerKg: number;
  odaShipments: number;
}

export interface PlantMetrics {
  plant: string;
  city: string;
  region: string;
  shipmentCount: number;
  totalValue: number;
  totalWeight: number;
  avgDispatchDays: number;
  onTimeDispatch: number;
  onTimeDelivery: number;
}

export interface LaneMetrics {
  id: string;
  origin: string;
  destination: string;
  originRegion: string;
  destRegion: string;
  courierName: string;
  mode: string;
  shipmentCount: number;
  totalWeight: number;
  avgTAT: number;
  agreedTAT: number;
  breachRate: number;
  deliveryType: string;
}

// Based on sample_dataset.csv analysis
export const regionMetricsMock: RegionMetrics[] = [
  {
    region: "North",
    code: "N",
    shipmentCount: 7520,
    totalValue: 1892450000,
    totalWeight: 28500,
    onTimeDelivery: 87.5,
    avgTAT: 1.8,
    delayedCount: 940,
    avgCostPerKg: 66.4,
    odaShipments: 1128,
  },
  {
    region: "South",
    code: "S",
    shipmentCount: 5890,
    totalValue: 1456230000,
    totalWeight: 22200,
    onTimeDelivery: 91.2,
    avgTAT: 1.5,
    delayedCount: 518,
    avgCostPerKg: 65.6,
    odaShipments: 824,
  },
  {
    region: "East",
    code: "E",
    shipmentCount: 4150,
    totalValue: 912890000,
    totalWeight: 15800,
    onTimeDelivery: 84.3,
    avgTAT: 2.4,
    delayedCount: 652,
    avgCostPerKg: 57.78,
    odaShipments: 830,
  },
  {
    region: "West",
    code: "W",
    shipmentCount: 4616,
    totalValue: 1034560000,
    totalWeight: 17200,
    onTimeDelivery: 89.8,
    avgTAT: 1.6,
    delayedCount: 470,
    avgCostPerKg: 60.15,
    odaShipments: 646,
  },
];

export const courierMetricsMock: CourierMetrics[] = [
  {
    courierName: "BLUEDART",
    shipmentCount: 5850,
    totalValue: 1450000000,
    totalWeight: 24500,
    onTimeRate: 86.5,
    avgDeliveryDays: 2.4,
    avgCostPerKg: 59.18,
    odaShipments: 1170,
  },
  {
    courierName: "Trustus",
    shipmentCount: 3290,
    totalValue: 780000000,
    totalWeight: 12800,
    onTimeRate: 92.3,
    avgDeliveryDays: 1.4,
    avgCostPerKg: 60.94,
    odaShipments: 329,
  },
  {
    courierName: "NEW INDIA",
    shipmentCount: 2850,
    totalValue: 620000000,
    totalWeight: 10200,
    onTimeRate: 88.7,
    avgDeliveryDays: 1.8,
    avgCostPerKg: 60.78,
    odaShipments: 570,
  },
  {
    courierName: "SME CARGO",
    shipmentCount: 1920,
    totalValue: 410000000,
    totalWeight: 7500,
    onTimeRate: 91.5,
    avgDeliveryDays: 1.9,
    avgCostPerKg: 54.67,
    odaShipments: 192,
  },
  {
    courierName: "WORLDFIRST",
    shipmentCount: 1750,
    totalValue: 380000000,
    totalWeight: 6800,
    onTimeRate: 89.2,
    avgDeliveryDays: 1.7,
    avgCostPerKg: 55.88,
    odaShipments: 350,
  },
  {
    courierName: "AFEXEXP",
    shipmentCount: 1520,
    totalValue: 325000000,
    totalWeight: 5900,
    onTimeRate: 90.8,
    avgDeliveryDays: 1.6,
    avgCostPerKg: 55.08,
    odaShipments: 152,
  },
  {
    courierName: "SAKHI RAIL",
    shipmentCount: 1180,
    totalValue: 225000000,
    totalWeight: 4800,
    onTimeRate: 93.1,
    avgDeliveryDays: 1.3,
    avgCostPerKg: 46.88,
    odaShipments: 236,
  },
  {
    courierName: "GMS",
    shipmentCount: 990,
    totalValue: 198000000,
    totalWeight: 3900,
    onTimeRate: 87.9,
    avgDeliveryDays: 2.0,
    avgCostPerKg: 50.77,
    odaShipments: 99,
  },
  {
    courierName: "UNIVERSAL",
    shipmentCount: 680,
    totalValue: 145000000,
    totalWeight: 2700,
    onTimeRate: 85.2,
    avgDeliveryDays: 2.2,
    avgCostPerKg: 53.7,
    odaShipments: 136,
  },
  {
    courierName: "INTERCITY",
    shipmentCount: 450,
    totalValue: 92000000,
    totalWeight: 1800,
    onTimeRate: 94.2,
    avgDeliveryDays: 1.1,
    avgCostPerKg: 51.11,
    odaShipments: 68,
  },
];

export const plantMetricsMock: PlantMetrics[] = [
  {
    plant: "DEO1",
    city: "NEW DELHI",
    region: "North",
    shipmentCount: 3850,
    totalValue: 880000000,
    totalWeight: 14200,
    avgDispatchDays: 0.2,
    onTimeDispatch: 96.5,
    onTimeDelivery: 88.2,
  },
  {
    plant: "BEN2",
    city: "BENGALURU",
    region: "South",
    shipmentCount: 2920,
    totalValue: 695000000,
    totalWeight: 10800,
    avgDispatchDays: 0.3,
    onTimeDispatch: 95.8,
    onTimeDelivery: 91.5,
  },
  {
    plant: "MUB2",
    city: "THANE",
    region: "West",
    shipmentCount: 2680,
    totalValue: 545000000,
    totalWeight: 9800,
    avgDispatchDays: 0.4,
    onTimeDispatch: 94.2,
    onTimeDelivery: 89.8,
  },
  {
    plant: "CHE1",
    city: "CHENNAI",
    region: "South",
    shipmentCount: 2450,
    totalValue: 498000000,
    totalWeight: 9200,
    avgDispatchDays: 0.2,
    onTimeDispatch: 97.1,
    onTimeDelivery: 92.3,
  },
  {
    plant: "KOL2",
    city: "KOLKATA",
    region: "East",
    shipmentCount: 2280,
    totalValue: 462000000,
    totalWeight: 8500,
    avgDispatchDays: 0.5,
    onTimeDispatch: 93.5,
    onTimeDelivery: 84.1,
  },
  {
    plant: "AHM1",
    city: "AHMEDABAD",
    region: "West",
    shipmentCount: 1620,
    totalValue: 340000000,
    totalWeight: 6200,
    avgDispatchDays: 0.3,
    onTimeDispatch: 95.2,
    onTimeDelivery: 90.5,
  },
  {
    plant: "SEC2",
    city: "SECUNDERABAD",
    region: "South",
    shipmentCount: 1450,
    totalValue: 295000000,
    totalWeight: 5400,
    avgDispatchDays: 0.4,
    onTimeDispatch: 94.8,
    onTimeDelivery: 89.2,
  },
  {
    plant: "JAI1",
    city: "JAIPUR",
    region: "North",
    shipmentCount: 1180,
    totalValue: 240000000,
    totalWeight: 4500,
    avgDispatchDays: 0.3,
    onTimeDispatch: 95.5,
    onTimeDelivery: 87.8,
  },
  {
    plant: "GUR1",
    city: "GURGAON",
    region: "North",
    shipmentCount: 980,
    totalValue: 420000000,
    totalWeight: 3800,
    avgDispatchDays: 0.2,
    onTimeDispatch: 96.8,
    onTimeDelivery: 88.5,
  },
  {
    plant: "LUC1",
    city: "LUCKNOW",
    region: "North",
    shipmentCount: 850,
    totalValue: 175000000,
    totalWeight: 3200,
    avgDispatchDays: 0.3,
    onTimeDispatch: 95.0,
    onTimeDelivery: 86.2,
  },
  {
    plant: "BHO1",
    city: "BHOPAL",
    region: "West",
    shipmentCount: 720,
    totalValue: 148000000,
    totalWeight: 2700,
    avgDispatchDays: 0.4,
    onTimeDispatch: 94.5,
    onTimeDelivery: 88.9,
  },
  {
    plant: "BHU1",
    city: "BHUBANESWAR",
    region: "East",
    shipmentCount: 680,
    totalValue: 142000000,
    totalWeight: 2600,
    avgDispatchDays: 0.5,
    onTimeDispatch: 93.2,
    onTimeDelivery: 83.8,
  },
];

export const laneMetricsMock: LaneMetrics[] = [
  {
    id: "LN-001",
    origin: "KOLKATA",
    destination: "BARDHAMAN",
    originRegion: "East",
    destRegion: "East",
    courierName: "BLUEDART",
    mode: "ROAD",
    shipmentCount: 420,
    totalWeight: 1580,
    avgTAT: 3.2,
    agreedTAT: 2,
    breachRate: 18.5,
    deliveryType: "ODA",
  },
  {
    id: "LN-002",
    origin: "NEW DELHI",
    destination: "NOIDA",
    originRegion: "North",
    destRegion: "North",
    courierName: "RAMESH",
    mode: "ROAD",
    shipmentCount: 380,
    totalWeight: 1420,
    avgTAT: 0.8,
    agreedTAT: 1,
    breachRate: 2.1,
    deliveryType: "Direct",
  },
  {
    id: "LN-003",
    origin: "BENGALURU",
    destination: "DHARWAD",
    originRegion: "South",
    destRegion: "South",
    courierName: "GMS",
    mode: "ROAD",
    shipmentCount: 320,
    totalWeight: 1180,
    avgTAT: 2.1,
    agreedTAT: 2,
    breachRate: 8.4,
    deliveryType: "Direct",
  },
  {
    id: "LN-004",
    origin: "CHENNAI",
    destination: "COIMBATORE",
    originRegion: "South",
    destRegion: "South",
    courierName: "BLUEDART",
    mode: "ROAD",
    shipmentCount: 290,
    totalWeight: 1050,
    avgTAT: 1.8,
    agreedTAT: 2,
    breachRate: 5.2,
    deliveryType: "Direct",
  },
  {
    id: "LN-005",
    origin: "THANE",
    destination: "PUNE",
    originRegion: "West",
    destRegion: "West",
    courierName: "TAC CARGO",
    mode: "ROAD",
    shipmentCount: 275,
    totalWeight: 980,
    avgTAT: 1.2,
    agreedTAT: 2,
    breachRate: 3.8,
    deliveryType: "Direct",
  },
  {
    id: "LN-006",
    origin: "KOLKATA",
    destination: "PURULIA",
    originRegion: "East",
    destRegion: "East",
    courierName: "BLUEDART",
    mode: "ROAD",
    shipmentCount: 245,
    totalWeight: 920,
    avgTAT: 4.8,
    agreedTAT: 4,
    breachRate: 22.4,
    deliveryType: "ODA",
  },
  {
    id: "LN-007",
    origin: "AHMEDABAD",
    destination: "VADODARA",
    originRegion: "West",
    destRegion: "West",
    courierName: "SME CARGO",
    mode: "ROAD",
    shipmentCount: 230,
    totalWeight: 850,
    avgTAT: 1.5,
    agreedTAT: 2,
    breachRate: 4.3,
    deliveryType: "Direct",
  },
  {
    id: "LN-008",
    origin: "LUCKNOW",
    destination: "GORAKHPUR",
    originRegion: "North",
    destRegion: "North",
    courierName: "Trustus",
    mode: "ROAD",
    shipmentCount: 215,
    totalWeight: 780,
    avgTAT: 1.9,
    agreedTAT: 2,
    breachRate: 6.5,
    deliveryType: "Direct",
  },
  {
    id: "LN-009",
    origin: "BHUBANESWAR",
    destination: "BARDHAMAN",
    originRegion: "East",
    destRegion: "East",
    courierName: "BLUEDART",
    mode: "ROAD",
    shipmentCount: 185,
    totalWeight: 680,
    avgTAT: 5.2,
    agreedTAT: 5,
    breachRate: 15.2,
    deliveryType: "ODA",
  },
  {
    id: "LN-010",
    origin: "JAIPUR",
    destination: "KOTA",
    originRegion: "North",
    destRegion: "North",
    courierName: "AFEXEXP",
    mode: "ROAD",
    shipmentCount: 175,
    totalWeight: 640,
    avgTAT: 1.6,
    agreedTAT: 2,
    breachRate: 4.0,
    deliveryType: "Direct",
  },
];

// ============= Summary Statistics =============
export interface DatasetSummaryStats {
  totalShipments: number;
  totalValue: number;
  totalWeight: number;
  onTimeDeliveryRate: number;
  avgTAT: number;
  delayedShipments: number;
  odaShipments: number;
  crossRegionShipments: number;
  uniqueCouriers: number;
  uniquePlants: number;
  totalQuantity: number;
  avgQuantityPerShipment: number;
  dateRange: { from: string; to: string };
}

export const datasetSummaryMock: DatasetSummaryStats = {
  totalShipments: 22176,
  totalValue: 5296130000, // ~529.6 Cr
  totalWeight: 83700, // kg
  onTimeDeliveryRate: 88.2,
  avgTAT: 1.75,
  delayedShipments: 2618,
  odaShipments: 4125,
  crossRegionShipments: 3240,
  uniqueCouriers: 24,
  uniquePlants: 21,
  totalQuantity: 245000,
  avgQuantityPerShipment: 11.05,
  dateRange: { from: "01-10-2024", to: "31-10-2024" },
};

// ============= Cost Analytics =============
export interface CostBreakdown {
  component: string;
  value: number;
  percentage: number;
}

export interface RegionCostMetrics {
  region: string;
  totalCost: number;
  costPerKg: number;
  costPerShipment: number;
  odaCost: number;
  taxAmount: number;
}

export const costBreakdownMock: CostBreakdown[] = [
  { component: "Base Freight", value: 3850000000, percentage: 72.7 },
  { component: "Fuel Surcharge", value: 580000000, percentage: 10.9 },
  { component: "ODA Charges", value: 420000000, percentage: 7.9 },
  { component: "IGST", value: 320000000, percentage: 6.0 },
  { component: "Handling", value: 126130000, percentage: 2.4 },
];

export const regionCostMetricsMock: RegionCostMetrics[] = [
  {
    region: "North",
    totalCost: 1892450000,
    costPerKg: 66.4,
    costPerShipment: 251652,
    odaCost: 125800000,
    taxAmount: 98500000,
  },
  {
    region: "South",
    totalCost: 1456230000,
    costPerKg: 65.6,
    costPerShipment: 247234,
    odaCost: 95200000,
    taxAmount: 78400000,
  },
  {
    region: "East",
    totalCost: 912890000,
    costPerKg: 57.78,
    costPerShipment: 220022,
    odaCost: 118500000,
    taxAmount: 52800000,
  },
  {
    region: "West",
    totalCost: 1034560000,
    costPerKg: 60.15,
    costPerShipment: 224159,
    odaCost: 80500000,
    taxAmount: 90300000,
  },
];

// ============= TAT Analytics =============
export interface TATBandMetrics {
  band: string;
  shipmentCount: number;
  percentage: number;
  avgTAT: number;
}

export interface DeliveryPerformance {
  metric: string;
  value: string;
  trend: number;
  trendFavourable: boolean;
}

export const tatBandMetricsMock: TATBandMetrics[] = [
  { band: "Same Day", shipmentCount: 4850, percentage: 21.9, avgTAT: 0 },
  { band: "Next Day (D+1)", shipmentCount: 7220, percentage: 32.6, avgTAT: 1 },
  { band: "D+2", shipmentCount: 5180, percentage: 23.4, avgTAT: 2 },
  { band: "D+3 to D+4", shipmentCount: 3280, percentage: 14.8, avgTAT: 3.5 },
  { band: "D+5+", shipmentCount: 1646, percentage: 7.4, avgTAT: 6.2 },
];

export const deliveryPerformanceMock: DeliveryPerformance[] = [
  {
    metric: "On-Time Delivery Rate",
    value: "88.2%",
    trend: 2.3,
    trendFavourable: true,
  },
  {
    metric: "Avg Delivery Days",
    value: "1.75 days",
    trend: -0.2,
    trendFavourable: true,
  },
  { metric: "Breach Rate", value: "11.8%", trend: -1.5, trendFavourable: true },
  {
    metric: "Early Delivery %",
    value: "34.2%",
    trend: 5.1,
    trendFavourable: true,
  },
];

// ============= Material Group Analytics =============
export interface MaterialGroupMetrics {
  group: string;
  fullName: string;
  shipmentCount: number;
  totalValue: number;
  avgWeight: number;
  onTimeRate: number;
}

export const materialGroupMetricsMock: MaterialGroupMetrics[] = [
  {
    group: "MOTO",
    fullName: "Mobility Devices (Phones)",
    shipmentCount: 18420,
    totalValue: 4250000000,
    avgWeight: 3.2,
    onTimeRate: 88.5,
  },
  {
    group: "GLSP",
    fullName: "Glass Products (Tablets)",
    shipmentCount: 3156,
    totalValue: 920000000,
    avgWeight: 4.8,
    onTimeRate: 87.2,
  },
  {
    group: "TITN",
    fullName: "Titanium Products",
    shipmentCount: 600,
    totalValue: 126130000,
    avgWeight: 2.1,
    onTimeRate: 90.8,
  },
];

// ============= Quantity Band Analytics =============
export interface QuantityBandMetrics {
  band: string;
  shipmentCount: number;
  totalQuantity: number;
  avgValue: number;
  onTimeRate: number;
}

export const quantityBandMetricsMock: QuantityBandMetrics[] = [
  {
    band: "1-2 Units",
    shipmentCount: 4250,
    totalQuantity: 6800,
    avgValue: 85000,
    onTimeRate: 89.5,
  },
  {
    band: "3-5 Units",
    shipmentCount: 5820,
    totalQuantity: 23280,
    avgValue: 125000,
    onTimeRate: 88.8,
  },
  {
    band: "6-10 Units",
    shipmentCount: 6450,
    totalQuantity: 51600,
    avgValue: 185000,
    onTimeRate: 87.9,
  },
  {
    band: "> 10 Units",
    shipmentCount: 5656,
    totalQuantity: 163320,
    avgValue: 420000,
    onTimeRate: 86.8,
  },
];

// ============= Sample Shipment Data =============
export const realShipmentsMock: RealShipmentRow[] = [
  {
    id: "SHP-001",
    billingDocNumber: "L190080717",
    invoiceDate: "22-10-2024",
    invoiceTime: "12.05.03 AM",
    pattern: "Before Cut off",
    quantity: 20,
    qtyRemarks: "> 10 Unit billing",
    plant: "LUC1",
    city: "LUCKNOW",
    state: "Uttar Pradesh",
    region: "North",
    shipToName: "MOBILE CAFE",
    shipToState: "Uttar Pradesh",
    shipToPinCode: "273001",
    shipToRegion: "NORTH",
    deliveryType: "Direct",
    shipToCity: "GORAKHPUR",
    soldToPartyCode: "N43704",
    taxType: "With-in-State",
    igstRate: 0,
    igstAmount: 0,
    totalLineValue: 416896.33,
    noOfBoxes: 7,
    courierGCN: "1091310",
    courierName: "Trustus",
    dispatchDate: "22-10-2024",
    dispatchTime: "2.30.54 PM",
    unitWeight: 2.7,
    totalWeight: 6.94,
    volumetricWeight: 1.505,
    totalVolumetricWeight: 4.382,
    materialGroup: "MOTO",
    incoterms: "STN",
    incoDescription: "Out Station",
    podDate: "24-10-2024",
    sbuName: "ANDROID MOBILITY DEVICES",
    groupSbuName: "MOBILITY SOLUTIONS GROUP (MSG)",
    dispatchDays: 0,
    dispatchRemarks: "On time",
    dispatchDelayReason: "",
    deliveryDays: 2,
    deliveryRemarks: "On time",
    agreedDeliveryTAT: 2,
    tatVariance: 0,
  },
  {
    id: "SHP-002",
    billingDocNumber: "K290187653",
    invoiceDate: "23-10-2024",
    invoiceTime: "12.06.03 AM",
    pattern: "Before Cut off",
    quantity: 12,
    qtyRemarks: "> 10 Unit billing",
    plant: "KOL2",
    city: "KOLKATA",
    state: "West Bengal",
    region: "East",
    shipToName: "SUNDARAM COMMUNICATION",
    shipToState: "West Bengal",
    shipToPinCode: "741245",
    shipToRegion: "EAST",
    deliveryType: "Direct",
    shipToCity: "NADIA",
    soldToPartyCode: "E14548",
    taxType: "With-in-State",
    igstRate: 0,
    igstAmount: 0,
    totalLineValue: 208066.08,
    noOfBoxes: 3,
    courierGCN: "53526322323",
    courierName: "BLUEDART",
    dispatchDate: "23-10-2024",
    dispatchTime: "6.44.35 PM",
    unitWeight: 1.41,
    totalWeight: 5.37,
    volumetricWeight: 0.402,
    totalVolumetricWeight: 1.545,
    materialGroup: "MOTO",
    incoterms: "STN",
    incoDescription: "Out Station",
    podDate: "26-10-2024",
    sbuName: "ANDROID MOBILITY DEVICES",
    groupSbuName: "MOBILITY SOLUTIONS GROUP (MSG)",
    dispatchDays: 0,
    dispatchRemarks: "On time",
    dispatchDelayReason: "",
    deliveryDays: 3,
    deliveryRemarks: "Delay",
    agreedDeliveryTAT: 2,
    tatVariance: 1,
  },
  {
    id: "SHP-003",
    billingDocNumber: "K290187654",
    invoiceDate: "23-10-2024",
    invoiceTime: "12.06.03 AM",
    pattern: "Before Cut off",
    quantity: 8,
    qtyRemarks: "6-10 Unit Billings",
    plant: "KOL2",
    city: "KOLKATA",
    state: "West Bengal",
    region: "East",
    shipToName: "The Baba Telecom",
    shipToState: "West Bengal",
    shipToPinCode: "713216",
    shipToRegion: "EAST",
    deliveryType: "Direct",
    shipToCity: "BARDHAMAN",
    soldToPartyCode: "E14567",
    taxType: "With-in-State",
    igstRate: 0,
    igstAmount: 0,
    totalLineValue: 163473.96,
    noOfBoxes: 4,
    courierGCN: "404415",
    courierName: "NEW INDIA",
    dispatchDate: "23-10-2024",
    dispatchTime: "5.46.53 PM",
    unitWeight: 1.43,
    totalWeight: 2.64,
    volumetricWeight: 0.429,
    totalVolumetricWeight: 0.944,
    materialGroup: "MOTO",
    incoterms: "STN",
    incoDescription: "Out Station",
    podDate: "24-10-2024",
    sbuName: "ANDROID MOBILITY DEVICES",
    groupSbuName: "MOBILITY SOLUTIONS GROUP (MSG)",
    dispatchDays: 0,
    dispatchRemarks: "On time",
    dispatchDelayReason: "",
    deliveryDays: 1,
    deliveryRemarks: "On time",
    agreedDeliveryTAT: 2,
    tatVariance: -1,
  },
];
