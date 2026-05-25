export type MasterStatus =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Suspended"
  | "Approved"
  | "Rejected";
export type FacilityTier = "Mother Hub" | "Satellite Hub" | "Satellite WH";
export type TransportMode = "Road" | "Rail" | "Air" | "Sea";
export type PartnerSegment = "Premium" | "Standard" | "Economy";

export interface MasterOverviewItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  count: number;
  path: string;
  awaitingApproval?: number;
  requested_count:number;
  await_for_approval_count:number;
}
export interface MasterOverview {
  tiles: MasterOverviewItem[];
}

export interface CustomerRow {
  id: string;
  name: string;
  gstin: string;
  billingAddr: string;
  shippingAddr: string;
  status: MasterStatus;
  region: string;
  lastUpdated: string;
}

export interface PartnerRow {
  id: string;
  name: string;
  mode: TransportMode;
  perfScore: number;
  complianceScore: number;
  segment: PartnerSegment;
  activePincodes: number;
  status: MasterStatus;
  contact?: string;
}

export interface FacilityRow {
  id: string;
  name: string;
  tier: FacilityTier;
  region: string;
  capacity: number;
  utilPct: number;
  fixedCost: number;
  status: MasterStatus;
  radius?: number;
}
export interface FacilityItem {
  id?: number;
  geography_master_id?: number;
  fixed_costs?: number;
  service_radius?: number;
  facility_code?: any;
  last_updated?: string;
  last_updated_by?: number;
  name?: string;
  tier_type?: string;
  capacity_threshold?: number;
  status?: string;
  assigned_status?: string;
  customer_name?: string;
  rejection_reason?: string;
  requested_by_name?: string;
  assigned_to_name?: string;
  last_action_at?: any;
  utilPct?: number;

  util_percentage?: number;
  zone?: string;
  radius?: number;
  created_date?: Date;
  created_by?: number;
}

export interface RateCardRow {
  id: string;
  partner: string;
  mode: TransportMode;
  zone: string;
  weightSlab: string;
  qtyBand: string;
  ratePerKg: number;
  effectiveFrom: string;
  effectiveTo: string;
}

export const masterOverviewMock: any = {
  tiles: [
    {
      id: "customers",
      label: "Customer Master",
      count: 1247,
      icon: "Users",
      path: "/master-data/customers",
      description: "Manage customer profiles and addresses",
    },
    {
      id: "partners",
      label: "Transporters",
      count: 34,
      icon: "Handshake",
      path: "/master-data/partners",
      description: "Logistics partner configurations",
    },
    {
      id: "facilities",
      label: "Facility ",
      count: 47,
      icon: "Building2",
      path: "/master-data/facilities",
      description: "Hub and warehouse management",
    },
    {
      id: "rate-cards",
      label: "Rate Cards",
      count: 156,
      icon: "CreditCard",
      path: "/master-data/rate-cards",
      description: "Partner rate configurations",
    },
  ],
};

export const customerMasterMock: CustomerRow[] = [
  {
    id: "CUST-001",
    name: "Reliance Retail Ltd",
    gstin: "27AABCR1234M1Z5",
    billingAddr: "Maker Chambers, Mumbai 400001",
    shippingAddr: "BKC Complex, Mumbai 400051",
    status: "Active",
    region: "West",
    lastUpdated: "2025-12-28",
  },
  {
    id: "CUST-002",
    name: "Tata Consumer Products",
    gstin: "29AAACT5678N1Z2",
    billingAddr: "Prestige Tower, Bangalore 560001",
    shippingAddr: "Whitefield, Bangalore 560066",
    status: "Active",
    region: "South",
    lastUpdated: "2025-12-27",
  },
  {
    id: "CUST-003",
    name: "ITC Limited",
    gstin: "19AABCI9012P1Z8",
    billingAddr: "Virginia House, Kolkata 700071",
    shippingAddr: "Salt Lake, Kolkata 700091",
    status: "Active",
    region: "East",
    lastUpdated: "2025-12-26",
  },
  {
    id: "CUST-004",
    name: "Hindustan Unilever",
    gstin: "27AAACH3456Q1Z4",
    billingAddr: "Unilever House, Mumbai 400099",
    shippingAddr: "Andheri East, Mumbai 400069",
    status: "Pending",
    region: "West",
    lastUpdated: "2025-12-25",
  },
  {
    id: "CUST-005",
    name: "Dabur India Ltd",
    gstin: "09AABCD7890R1Z1",
    billingAddr: "Kaushambi, Ghaziabad 201010",
    shippingAddr: "Noida Sector 62, 201301",
    status: "Active",
    region: "North",
    lastUpdated: "2025-12-24",
  },
  {
    id: "CUST-006",
    name: "Marico Limited",
    gstin: "27AABCM1234S1Z7",
    billingAddr: "Grand Central, Mumbai 400012",
    shippingAddr: "Goregaon, Mumbai 400063",
    status: "Inactive",
    region: "West",
    lastUpdated: "2025-12-20",
  },
  {
    id: "CUST-007",
    name: "Godrej Consumer",
    gstin: "27AABCG5678T1Z3",
    billingAddr: "Pirojshanagar, Mumbai 400079",
    shippingAddr: "Vikhroli, Mumbai 400079",
    status: "Active",
    region: "West",
    lastUpdated: "2025-12-23",
  },
  {
    id: "CUST-008",
    name: "Britannia Industries",
    gstin: "29AABCB9012U1Z9",
    billingAddr: "UB City, Bangalore 560001",
    shippingAddr: "Electronic City, Bangalore 560100",
    status: "Active",
    region: "South",
    lastUpdated: "2025-12-22",
  },
];

export const partnerMasterMock: PartnerRow[] = [
  {
    id: "PTR-001",
    name: "BlueDart Express",
    mode: "Air",
    perfScore: 94,
    complianceScore: 98,
    segment: "Premium",
    activePincodes: 12500,
    status: "Active",
    contact: "bluedart@logistics.com",
  },
  {
    id: "PTR-002",
    name: "Delhivery",
    mode: "Road",
    perfScore: 91,
    complianceScore: 95,
    segment: "Premium",
    activePincodes: 18200,
    status: "Active",
    contact: "ops@delhivery.com",
  },
  {
    id: "PTR-003",
    name: "GATI Express",
    mode: "Road",
    perfScore: 87,
    complianceScore: 92,
    segment: "Standard",
    activePincodes: 9800,
    status: "Active",
    contact: "gati@express.com",
  },
  {
    id: "PTR-004",
    name: "XpressBees",
    mode: "Road",
    perfScore: 89,
    complianceScore: 90,
    segment: "Standard",
    activePincodes: 15600,
    status: "Active",
    contact: "xbees@logistics.com",
  },
  {
    id: "PTR-005",
    name: "Ecom Express",
    mode: "Road",
    perfScore: 85,
    complianceScore: 88,
    segment: "Economy",
    activePincodes: 11200,
    status: "Pending",
    contact: "ecom@express.com",
  },
  {
    id: "PTR-006",
    name: "Shadowfax",
    mode: "Road",
    perfScore: 82,
    complianceScore: 85,
    segment: "Economy",
    activePincodes: 8500,
    status: "Active",
    contact: "shadow@fax.com",
  },
  {
    id: "PTR-007",
    name: "DTDC",
    mode: "Road",
    perfScore: 79,
    complianceScore: 82,
    segment: "Economy",
    activePincodes: 14000,
    status: "Suspended",
    contact: "dtdc@courier.com",
  },
];

export const facilityMasterMock: FacilityRow[] = [
  {
    id: "FAC-001",
    name: "Mumbai Central Hub",
    tier: "Mother Hub",
    region: "West",
    capacity: 50000,
    utilPct: 88,
    fixedCost: 2500000,
    status: "Active",
    radius: 150,
  },
  {
    id: "FAC-002",
    name: "Delhi NCR Hub",
    tier: "Mother Hub",
    region: "North",
    capacity: 45000,
    utilPct: 82,
    fixedCost: 2200000,
    status: "Active",
    radius: 120,
  },
  {
    id: "FAC-003",
    name: "Bangalore Hub",
    tier: "Mother Hub",
    region: "South",
    capacity: 40000,
    utilPct: 75,
    fixedCost: 1800000,
    status: "Active",
    radius: 100,
  },
  {
    id: "FAC-004",
    name: "Chennai Satellite",
    tier: "Satellite Hub",
    region: "South",
    capacity: 25000,
    utilPct: 91,
    fixedCost: 800000,
    status: "Active",
    radius: 60,
  },
  {
    id: "FAC-005",
    name: "Hyderabad Satellite",
    tier: "Satellite Hub",
    region: "South",
    capacity: 22000,
    utilPct: 78,
    fixedCost: 750000,
    status: "Active",
    radius: 55,
  },
  {
    id: "FAC-006",
    name: "Pune Warehouse",
    tier: "Satellite WH",
    region: "West",
    capacity: 18000,
    utilPct: 65,
    fixedCost: 450000,
    status: "Active",
    radius: 40,
  },
  {
    id: "FAC-007",
    name: "Kolkata Warehouse",
    tier: "Satellite WH",
    region: "East",
    capacity: 15000,
    utilPct: 72,
    fixedCost: 400000,
    status: "Pending",
    radius: 35,
  },
  {
    id: "FAC-008",
    name: "Ahmedabad Satellite",
    tier: "Satellite Hub",
    region: "West",
    capacity: 20000,
    utilPct: 86,
    fixedCost: 650000,
    status: "Active",
    radius: 50,
  },
];

export const rateCardsMock: RateCardRow[] = [
  {
    id: "RC-001",
    partner: "BlueDart Express",
    mode: "Air",
    zone: "Metro-Metro",
    weightSlab: "0-0.5 kg",
    qtyBand: "1-100",
    ratePerKg: 85,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-06-30",
  },
  {
    id: "RC-002",
    partner: "BlueDart Express",
    mode: "Air",
    zone: "Metro-Metro",
    weightSlab: "0.5-1 kg",
    qtyBand: "1-100",
    ratePerKg: 72,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-06-30",
  },
  {
    id: "RC-003",
    partner: "Delhivery",
    mode: "Road",
    zone: "Metro-Metro",
    weightSlab: "0-0.5 kg",
    qtyBand: "1-100",
    ratePerKg: 45,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
  },
  {
    id: "RC-004",
    partner: "Delhivery",
    mode: "Road",
    zone: "Metro-Tier1",
    weightSlab: "0-0.5 kg",
    qtyBand: "1-100",
    ratePerKg: 52,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
  },
  {
    id: "RC-005",
    partner: "GATI Express",
    mode: "Road",
    zone: "Metro-Tier2",
    weightSlab: "0-1 kg",
    qtyBand: "100-500",
    ratePerKg: 38,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-06-30",
  },
  {
    id: "RC-006",
    partner: "XpressBees",
    mode: "Road",
    zone: "Tier1-Tier1",
    weightSlab: "0-0.5 kg",
    qtyBand: "1-100",
    ratePerKg: 42,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
  },
  {
    id: "RC-007",
    partner: "Ecom Express",
    mode: "Road",
    zone: "Metro-Rural",
    weightSlab: "0-1 kg",
    qtyBand: "1-100",
    ratePerKg: 65,
    effectiveFrom: "2025-02-01",
    effectiveTo: "2025-07-31",
  },
  {
    id: "RC-008",
    partner: "Shadowfax",
    mode: "Road",
    zone: "Metro-Metro",
    weightSlab: "0-0.5 kg",
    qtyBand: "500+",
    ratePerKg: 32,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
  },
];
