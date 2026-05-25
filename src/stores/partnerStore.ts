import { partners } from "@/services/partnerService";
import { toast } from "sonner";
import { create } from "zustand";

interface PartnerState {
  partners: any[];
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  modes: any[];
  statuses: any[];
  // actions
  fetchPartners: (
    pageNo?: number,
    pageSize?: number,
    status?: string,
    search?: string,
    mode?: string[],
    filter_name?: string,
    filter_email?: string,
    otif_percent?: number,
    filter_code?: string,
    sortBy?: string,
    sortOrder?: string,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request?: string,
  ) => Promise<void>;
  fetchPartnerById: (id: string | number) => Promise<any>;
  fetchPartnerContract: (id: number) => Promise<any>;
  updatePartner: (id: string | any, partnerData: any) => Promise<boolean>;
  statusUpdate: ( payload: any) => Promise<boolean>;
  getmodes: () => Promise<void>;
  getStatus: () => Promise<void>;
  createPartner: (partnerData: any) => Promise<any>;
  deletePartner: (id: string) => Promise<void>;
  setPageSize: (size: number) => void;
}
export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  isLoading: false,
  modes: [],
  statuses: [],
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  /* ===================== FETCH PARTNERS ===================== */
  fetchPartners: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    status?: string,
    search?: string,
    mode?: string[],
    filter_name?: string,
    filter_email?: string,
    otif_percent?: number,
    filter_code?: string,
    sortBy?: string,
    sortOrder?: string,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request?: string,
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await partners.getPartnerList(
        pageNo,
        pageSize,
        status,
        search,
        mode,
        filter_name,
        filter_email,
        otif_percent,
        filter_code,
        sortBy,
        sortOrder,
        filter_customer,
        filter_assigned_status,
        filter_assigneeId,
        filter_requestedId,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request,
      );
      set({
        partners: data?.data?.items || [],
        total: data?.data?.pagination?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch partners",
        isLoading: false,
      });
    }
  },
  fetchPartnerById: async (id: string) => {
    set({ isLoading: false, error: null });
    try {
      const data = await partners.getPartnerById(id);
      set({
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch partner",
        isLoading: false,
      });
      return null;
    }
  },
  fetchPartnerContract: async (id) => {
    set({ isLoading: false, error: null });
    try {
      const data = await partners.getPartnerContract(id);
      set({
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch",
        isLoading: false,
      });
      return null;
    }
  },

  updatePartner: async (id: string, partnerData: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await partners.updatePartner(id, partnerData);

      const { pageNo, pageSize, fetchPartners } = get();
      await fetchPartners(pageNo, pageSize);

      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to update partner",
        isLoading: false,
      });

      return null;
    }
  },

  getmodes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await partners.getmodes(); // call your service
      set({ modes: data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch modes",
        isLoading: false,
      });
    }
  },
  getStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await partners.getStatus(); // call your service
      set({ statuses: data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch statuses",
        isLoading: false,
      });
    }
  },
  createPartner: async (partnerData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await partners.createPartner(partnerData);
      const { pageNo, pageSize, fetchPartners } = get();
      await fetchPartners(pageNo, pageSize);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to create partner",
        isLoading: false,
      });
      return error;
    }
  },
  deletePartner: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await partners.deletePartner(id); // capture response

      // refresh current page
      // const { pageNo, pageSize, fetchPartners } = get();
      // await fetchPartners(pageNo, pageSize);

      set({ isLoading: false });

      return response; //  return response to caller
    } catch (error: any) {
      set({
        error: error?.message || "Failed to delete partner",
        isLoading: false,
      });
      throw error; // allow UI to catch
    }
  },

    statusUpdate: async (payload: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await partners.statusChange(payload);


      const { pageNo, pageSize, fetchPartners } = get();
      await fetchPartners(pageNo, pageSize);

      set({ isLoading: false });
      toast.success(response?.message || "Status change request submitted successfully");
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed",
        isLoading: false,
      });

      return null;
    }
  },
}));
