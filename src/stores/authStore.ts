import { create } from "zustand";
import {
  authService,
  type LoginPayload,
  type LoginResponse,
  type AuthMenuItem,
  authMenuService,
} from "@/services/authService";
import { toast } from "sonner";

export interface AuthState {
  user: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
  menus: AuthMenuItem[];

  login: (payload: LoginPayload, keepMeSignedIn: boolean) => Promise<boolean>;
  logout: () => void;
  getMenu: (role: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    // Load user from storage on startup
    const keepMeSignedIn = localStorage.getItem("keepMeSignedIn") === "true";
    const storage = keepMeSignedIn ? localStorage : sessionStorage;
    const userStr = storage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  })(),
  isLoading: false,
  error: null,
  menus: (() => {
    const keepMeSignedIn = localStorage.getItem("keepMeSignedIn") === "true";
    const storage = keepMeSignedIn ? localStorage : sessionStorage;
    const menusStr = storage.getItem("menus");
    return menusStr ? JSON.parse(menusStr) : [];
  })(),

  login: async (payload, keepMeSignedIn) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      set({ user: response, isLoading: false });

      // Save tokens + user in the selected storage
      const storage = keepMeSignedIn ? localStorage : sessionStorage;
      storage.setItem("access_token", response.access_token);
      storage.setItem("refresh_token", response.refresh_token);
      storage.setItem("user", JSON.stringify(response));
      localStorage.setItem("keepMeSignedIn", JSON.stringify(keepMeSignedIn));

      toast.success(response?.message);
      return true;
    } catch (error: any) {
      set({ error: error?.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, menus: [] });
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
  },

  getMenu: async (role: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authMenuService.getMenu(role);
      set({ menus: response, isLoading: false });

      const keepMeSignedIn = localStorage.getItem("keepMeSignedIn") === "true";
      const storage = keepMeSignedIn ? localStorage : sessionStorage;
      storage.setItem("menus", JSON.stringify(response));

      return true;
    } catch (error: any) {
      set({ error: error?.message, isLoading: false });
      return false;
    }
  },
}));
