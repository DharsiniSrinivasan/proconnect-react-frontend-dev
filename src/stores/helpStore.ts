import { helpService } from "@/services/helpService";
import { create } from "zustand";

export const useHelpStore = create<any>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  saveHelpRequest: async (request: any) => {
    set({ isLoading: true, error: null });
    try {
      await helpService.saveRequest(request);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to save data",
        isLoading: false,
      });
      return false;
    }
  },
}));
