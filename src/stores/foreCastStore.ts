import { forecast } from "@/services/forecastService";
import { create } from "zustand";

interface ForecastStore {
  forecastDetails: any;
  loading: boolean;
  error: string | null;

  getForecast: (id: any) => Promise<any>;
  reset: () => void;
}

export const forecastStore = create<ForecastStore>()((set) => ({
  forecastDetails: null,
  loading: false,
  error: null,

  getForecast: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await forecast.getforecastDetails(id);
      set({ forecastDetails: res, loading: false });
      return res;
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch forecast",
        loading: false,
      });
      throw err;
    }
  },

  reset: () => set({ forecastDetails: null, error: null }),
}));
