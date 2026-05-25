import { strategic } from "@/services/strategicService";
import { create } from "zustand";

interface StrategicState {
  data: any;
  isLoading: boolean;
  error: string | null;
  fetchStrategic: (id: string | number) => Promise<void>;
  resetData: () => void;
}

export const useStrategicStore = create<StrategicState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  resetData: () => set({ data: null }),

  fetchStrategic: async (id: string | number = 0) => {
    set({ isLoading: true, error: null });

    try {
      const data = await strategic.getStrategic(id);
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
