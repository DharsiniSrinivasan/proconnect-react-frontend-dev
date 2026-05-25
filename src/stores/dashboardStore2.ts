import { auditDetails } from "@/services/auditService";
import { dashboard } from "@/services/dashboardService";
import { create } from "zustand";

interface DashboardState {
  summary: any;
  alerts: any;
  partnerHealth: any;
  audits: any[];

  isLoading: boolean;
  error: string | null;

  fetchDashboardSummary: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchPartnerHealth: () => Promise<void>;

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

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: {},
  alerts: null,
  partnerHealth: null,
  audits: [],

  isLoading: false,
  error: null,

  // =====================================================
  // SUMMARY
  // =====================================================

  fetchDashboardSummary: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await dashboard.getDashboardSummary();

      set({
        summary: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch summary",
        isLoading: false,
      });
    }
  },

  // =====================================================
  // ALERTS
  // =====================================================

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
        error: error?.message || "Failed to fetch alerts",
        isLoading: false,
      });
    }
  },

  // =====================================================
  // PARTNER HEALTH
  // =====================================================

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
        error: error?.message || "Failed to fetch partner health",
        isLoading: false,
      });
    }
  },

  // =====================================================
  // AUDITS
  // =====================================================

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