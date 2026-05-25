import { operational } from "@/services/operationalService";
import { create } from "zustand";

interface OperationalState {
  data: any;
  isLoading: boolean;
  error: string | null;
  fetchOperational: (id: string | number) => Promise<void>;
  resetData: () => void;
}

export const useOperationalStore = create<OperationalState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  resetData: () => set({ data: null }),

  fetchOperational: async (id: string | number = 0) => {
    set({ isLoading: true, error: null });

    try {
      const data = await operational.getOperational(id);

      set({
        data: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },
}));
