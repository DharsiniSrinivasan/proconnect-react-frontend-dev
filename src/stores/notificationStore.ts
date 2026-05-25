import { notification } from "@/services/notificationService";
import { create } from "zustand";

interface NotificationStore {
  notificationData: any[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search?: string;
  isRead?: boolean;
  total: number;
  fetchNotifications: (
    page?: number,
    limit?: number,
    isRead?: boolean,
    search?: string,
  ) => Promise<void>;

  setSearch: (search: string) => void;
  reset: () => void;
  setPageSize: (size: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notificationData: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  search: "",
  isRead: false,
  total: 0,
  setPageSize: (size) =>
    set({
      limit: size,
      page: 1,
    }),
  fetchNotifications: async (
    page = get().page,
    limit = get().limit,
    isRead = get().isRead,
    search = get().search,
  ) => {
    try {
      set({ loading: true, error: null });

      const response = await notification.getNotificationInfo(
        page,
        limit,
        isRead,
        search,
      );

      set({
        notificationData: response?.data || response || [],
        page,
        limit,
        total: response?.totalCount || 0,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
  },

  reset: () => {
    set({
      notificationData: [],
      loading: false,
      error: null,
      page: 1,
      search: "",
    });
  },
}));
