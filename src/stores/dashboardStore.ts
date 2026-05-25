import { auditDetails } from "@/services/auditService";
import { dashboard } from "@/services/dashboardService";
import { create } from "zustand";

interface DashboardState {
  summary: any;
  alerts: any;
  regional: any;
  facilityUtil: any;
  topCouriers: any;
  slaTrends: any;
  pending: any;
  partnerHealth: any;
  recents: any;
  total_shipments: any;
  isLoading: boolean;
  audits: any[];
  error: string | null;
  fetchSummary: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchRegionalPerformance: () => Promise<void>;
  fetchFacilityUtilization: () => Promise<void>;
  fetchTopCouriers: () => Promise<void>;
  fetchSlaTrends: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchPartnerHealth: () => Promise<void>;
  fetchRecents: () => Promise<void>;
  fetchAudits: (
    pageNo?: number,
    pageSize?: number,
    user?: string,
    action?: string,
    module?: string,
    subModuleFilter?: string,
    datefilter?: any,
    sort_by?: string,
    sort_order?: string,
  ) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  summary: {},
  alerts: null,
  regional: null,
  status: {},
  facilityUtil: null,
  topCouriers: null,
  slaTrends: {},
  pending: null,
  partnerHealth: null,
  audits: null,
  recents: {},
  total_shipments: 0,
  isLoading: false,
  error: null,

  fetchSummary: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getDashboardSummary();
      set({
        summary: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchAlerts: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getAlerts(1, 10);
      set({
        alerts: data?.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchRegionalPerformance: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getRegionalPerformance();
      set({
        regional: data?.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
 
  fetchFacilityUtilization: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getFacilityUtilization();
      set({
        facilityUtil: data?.data?.items || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchTopCouriers: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getTopCouriers();
      set({
        topCouriers: data?.data?.items || [],
        total_shipments: data?.data?.total_shipments || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchSlaTrends: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getSlaTrends();
      set({
        slaTrends: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchPending: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getPending();
      set({
        pending: data?.data?.items || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchPartnerHealth: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getPartnerHealth();
      set({
        partnerHealth: data?.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchRecents: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getRecent();
      set({
        recents: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
  fetchAudits: async (
    pageNo = 1,
    pageSize = 10,
    user?: string,
    action?: string,
    module?: string,
    subModuleFilter?: string,
    datefilter?: any,
    sort_by?: string,
    sort_order?: string,
  ) => {
    set({ isLoading: true, error: null });

    try {
      const data = await auditDetails.getAuditInfo(
        pageNo,
        pageSize,
        user,
        action,
        module,
        subModuleFilter,
        datefilter,
        sort_by,
        sort_order,
      );

      set({
        audits: data?.data?.events || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch audit logs",
        isLoading: false,
      });
    }
  },
}));
