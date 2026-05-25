import { recommendation } from "@/services/recommendationService";
import { create } from "zustand";

interface RecommendationStore {
  recommendationDetails: any;
  recommendationSalesDetails: any;
  loading: boolean;
  error: string | null;
  getCategory: () => Promise<void>;
  getPriority: () => Promise<void>;
  getRecommendation: (id: any) => Promise<any>;
  getSalesRecommendation: (id: any) => Promise<any>;
  reset: () => void;
  categoryData: any[];
  priorityData: any[];
}

export const recommendationStore = create<RecommendationStore>()((set) => ({
  recommendationDetails: null,
  loading: false,
  error: null,
  categoryData: [],
  priorityData: [],
  recommendationSalesDetails: null,

  getRecommendation: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await recommendation.getRecommendationDetails(id);
      set({ recommendationDetails: res, loading: false });
      return res;
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch",
        loading: false,
      });
      throw err;
    }
  },
  getSalesRecommendation: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await recommendation.getSalesRecommendationDetails(id);
      set({ recommendationSalesDetails: res, loading: false });
      return res;
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch",
        loading: false,
      });
      throw err;
    }
  },
  getCategory: async () => {
    set({ loading: true, error: null });
    try {
      const data = await recommendation.getCategory();
      set({ categoryData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ loading: false });
    }
  },
  getPriority: async () => {
    set({ loading: true, error: null });
    try {
      const data = await recommendation.getPriority();
      set({ priorityData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ loading: false });
    }
  },
  reset: () =>
    set({
      recommendationDetails: null,
      priorityData: null,
      categoryData: null,
      error: null,
      recommendationSalesDetails: null,
    }),
}));
