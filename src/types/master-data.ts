/**
 * Master Data types
 */

export type MasterStatus = "Active" | "Inactive" | "Pending" | "Suspended";
export type FacilityTier = "Mother Hub" | "Satellite Hub" | "Satellite WH";
export type TransportMode = "Road" | "Rail" | "Air" | "Sea";
export type PartnerSegment = "Premium" | "Standard" | "Economy";

export interface MasterOverviewItem {
  id: string;
  label: string;
  count: number;
  icon: string;
  path: string;
  description: string;
}
export interface SaveRequest {
  name?: string;
  gstin?: string;
  billing_address?: string;
  shipping_address?: string;
  status?: string;
  region?: string;
  pin_code?: string;
}
export interface FacilitySaveRequest {
  name?: string;
  tier_type?: string;
  geography_master_id?: number;
  capacity_threshold?: number;
  fixed_costs?: number;
  status?: string;
  service_radius?: number;
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
