import { create } from "zustand";
import { financial } from "@/services/financialService";

interface FinancialState {
  financialDetail: any | null;
  getDetailFinancial: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useFinancialStore = create<FinancialState>((set) => ({
  financialDetail: null,
  isLoading: false,
  error: null,

  getDetailFinancial: async (id: string) => {

    set({ isLoading: true, error: null });

    try {
      const data = await financial.getDetailFinancial(id);

      set({
        financialDetail: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch financial",
      });
    }
  },
}));
