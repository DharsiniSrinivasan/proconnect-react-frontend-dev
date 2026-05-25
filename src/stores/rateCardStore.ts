import { rateCard } from "@/services/rateCardService";
import { toast } from "sonner";
import { create } from "zustand";

interface RateCardState {
  rateCards: any[];
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  modes: any[];
  statuses: any[];
  partnerts: any[];
  cities: any[];
  partnerContract: any;
  fetchCards: (
    pageNo?: number,
    pageSize?: number,
    status?: string,
    search?: string,
    mode?: string | string[],
    filter_code?: string,
    filter_name?: string,
    filter_from?: string,
    filter_to?: string,
    filter_frt_rate?: number,
    filter_erate?: number,
    filter_oda_rate?: number,
    filter_total_rate?: number,
    filter_minimum?: number,
    filterOdaService?: number,
    sort_by?: string,
    sort_order?: string,
    filter_tat_days?: number,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
  ) => Promise<void>;
  fetchCardById: (id: string) => Promise<any>;
  updateCards: (id: string, rateCardData: any) => Promise<boolean>;
  createRateCard: (rateCardData: any) => Promise<boolean>;
  deleteRateCard: (id: any) => Promise<void>;
  getContract: (id: any) => Promise<any>;
  getMasterPartner: () => Promise<void>;
  getCity: () => Promise<void>;
  setPageSize: (size: number) => void;
  statusChangeRateCard: (payload: any) => Promise<void>;
}

export const rateCardStore = create<RateCardState>((set, get) => ({
  rateCards: [],
  isLoading: false,
  modes: [],
  partnerContract: [],
  statuses: [],
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  partnerts: [],
  cities: [],
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  fetchCards: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    status?: string,
    search?: string,
    mode?: string,
    filter_code?: string,
    filter_name?: string,
    filter_from?: string,
    filter_to?: string,
    filter_frt_rate?: number,
    filter_erate?: number,
    filter_oda_rate?: number,
    filter_total_rate?: number,
    filter_minimum?: number,
    filterOdaService?: number,
    sort_by?: string,
    sort_order?: string,
    filter_tat_days?: number,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await rateCard.getCardList(
        pageNo,
        pageSize,
        status,
        search,
        mode,
        filter_code,
        filter_name,
        filter_from,
        filter_to,
        filter_frt_rate,
        filter_erate,
        filter_oda_rate,
        filter_total_rate,
        filter_minimum,
        filterOdaService,
        sort_by,
        sort_order,
        filter_tat_days,
        filter_customer,
        filter_assigned_status,
        filter_assigneeId,
        filter_requestedId,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request_name,
      );
      set({
        rateCards: data?.data?.items || [],
        total: data?.data?.pagination?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch rate cards",
        isLoading: false,
      });
    }
  },

  fetchCardById: async (id: string) => {
    set({ isLoading: false, error: null });
    try {
      const data = await rateCard.fetchCardById(id);
      set({ isLoading: false });
      return data;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch rate card",
        isLoading: false,
      });
      return null;
    }
  },
  getContract: async (id: string) => {
    set({ isLoading: false, error: null });
    try {
      const data = await rateCard.fetchContractById(id);
      set({ isLoading: false });
      return data;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch rate card",
        isLoading: false,
      });
      return null;
    }
  },

  updateCards: async (id: string, rateCardData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await rateCard.updateCards(id, rateCardData);
      const { pageNo, pageSize, fetchCards } = get();
      await fetchCards(pageNo, pageSize);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to update rate card",
        isLoading: false,
      });
      throw error;
    }
  },

  createRateCard: async (rateCardData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rateCard.createCards(rateCardData); // <-- capture response

      const { pageNo, pageSize, fetchCards } = get();
      await fetchCards(pageNo, pageSize);

      set({ isLoading: false });

      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to create rate card",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRateCard: async (id: any): Promise<void> => {
    set({ isLoading: false, error: null });

    try {
      const response = await rateCard.deleteRateCard(id);

      const { pageNo, pageSize, fetchCards } = get();
      await fetchCards(pageNo, pageSize);

      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to delete rate card",
        isLoading: false,
      });
      throw error;
    }
  },

  getMasterPartner: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rateCard.getPartners(); // call your service
      set({ partnerts: data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch modes",
        isLoading: false,
      });
    }
  },
  getCity: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rateCard.getCity(); // call your service
      set({ cities: data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch cities",
        isLoading: false,
      });
    }
  },
  statusChangeRateCard: async (payload: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rateCard.statusChangeRateCard(payload); // call your service
      const { pageNo, pageSize, fetchCards } = get();
      await fetchCards(pageNo, pageSize);
      set({ isLoading: false });
       toast.success(response?.message || "Status change request submitted successfully");
      
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to change status",
        isLoading: false,
      });
    }
    },
}));
