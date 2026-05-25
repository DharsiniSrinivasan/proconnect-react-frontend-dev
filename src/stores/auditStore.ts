import { auditDetails } from "@/services/auditService";
import { create } from "zustand";

interface AuditState {
  audits: any[];
  isLoading: boolean;
  error: string | null;
  summary?: any;
  pageNo: number;
  pageSize: number;
  total: number;
  usersData?: any[];
  assigneeData?: any[];
  actionsData?: any[];
  modulesData?: any[];
  subModulesData?: any[];
  setPageSize: (size: number) => void;

  /* ===================== FETCH AUDITS ===================== */
  fetchAudits: (
    pageNo?: number,
    pageSize?: number,
    user?: string,
    action?: string,
    subModuleFilter?: string,
    module?: string,
    datefilter?: any,
    sort_by?: string,
    sort_order?: string,
  ) => Promise<void>;
  geListUSers: () => Promise<any>;
  getAssigneeList: () => Promise<any>;
  geListActions: () => Promise<any>;
  geListModules: () => Promise<any>;
  geListSubModules: () => Promise<any>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  audits: [],
  isLoading: false,
  error: null,
  summary: {},
  pageNo: 1,
  pageSize: 10,
  total: 0,
  usersData: [],
  assigneeData: [],
  actionsData: [],
  modulesData: [],
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  /* ===================== FETCH AUDITS ===================== */
  fetchAudits: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    user,
    action,
    module,
    subModuleFilter,
    datefilter,
    sort_by,
    sort_order,
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });

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
        summary: data?.data?.summary,
        audits: data?.data?.events || [],
        total: data?.data?.pagination?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch audit logs",
        isLoading: false,
      });
    }
  },
  geListUSers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await auditDetails.geListUSers();
      set({ usersData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  getAssigneeList: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await auditDetails.getAssigneeUsers();
      set({ assigneeData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  geListActions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await auditDetails.geListActions();
      set({ actionsData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  geListModules: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await auditDetails.geListModules();
      set({ modulesData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  geListSubModules: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await auditDetails.geListSubModules();
      set({ subModulesData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
