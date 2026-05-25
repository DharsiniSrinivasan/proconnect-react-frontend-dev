import { create } from "zustand";
import { appearance } from "@/services/appearanceService";

interface AppearanceState {
  data: any;
  image: any;
  isLoading: boolean;
  error: string | null;
  imagedata: any;
  fetchAppearance: () => Promise<void>;
  fetchLogoImage: () => Promise<void>;
  saveAppearance: (request: SaveRequest[]) => Promise<boolean>;
  saveLogoImage: (formData: FormData) => Promise<void>;
}
export interface SaveRequest {
  id?: string;
  name?: string;
  brand?: Brand;
  settings?: Settings;
}

export interface Brand {
  logoImage?: string;
  name?: string;
  tagLine?: string;
}

export interface Settings {
  preset?: string;
  themeMode?: string;
  accentColor?: string;
  compactMode?: boolean;
  motionEnabled?: boolean;
}

export const useAppearanceStore = create<AppearanceState>((set, get) => ({
  data: null,
  image: null,
  imagedata: null,
  isLoading: false,
  error: null,

  fetchAppearance: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await appearance.getAppearance();
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
  fetchLogoImage: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await appearance.getLogoImage();
      set({
        image: data?.data?.base64,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch data",
        isLoading: false,
      });
    }
  },

  saveAppearance: async (request: SaveRequest[]) => {
    set({ isLoading: true, error: null });
    try {
      await appearance.saveAppearance(request);
      const { fetchAppearance } = get();
      await fetchAppearance();
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
  saveLogoImage: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appearance.saveLogoImage(formData);

      set({
        imagedata: response?.data?.path,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to save data",
        isLoading: false,
      });
    }
  },
}));
