import { create } from "zustand";
import { facilityDashboardService } from "@/services/facilityDashboardService";

interface FacilityState {
  facilityDetail: any | null;
  getDetailFacility: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useFacilityDashboardStore = create<FacilityState>((set) => ({
  facilityDetail: null,
  isLoading: false,
  error: null,

  getDetailFacility: async (id: string) => {

    set({ isLoading: true, error: null });

    try {
      const data = await facilityDashboardService.getDetailFacility(id);
      set({
        facilityDetail: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch facility",
      });
    }
  },
}));
