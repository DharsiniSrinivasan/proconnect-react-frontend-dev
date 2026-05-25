import { create } from "zustand";
import { user } from "@/services/userService";
interface UserState {
  users: any[];
  currentUser: any | null;
  isLoading: boolean;
  error: string | null;
  roles: any[];
  pageNo: number;
  pageSize: number;
  total: number;
  permissions: any[];
  permissionDetails: any[];
  permissionList: any[];
  limit: number;
  modulesData: any[];
  screenData: any[];
  profileUser: any | null;
  setCurrentUser: (user: any) => void;
  fetchUsers: (
    pageNo?: number,
    pageSize?: number,
    status?: string,
    search?: string,
    role?: string,
    filter_name?: string,
    filter_email?: string,
    filter_last_login?: string,
    sort_by?: string,
    sort_order?: string,
  ) => Promise<void>;
  saveUser: (formData: FormData) => Promise<boolean>;
  getUserById: (id: string | number) => Promise<any>;
  updateUser: (
    formData: FormData | any,
    id: string | number,
  ) => Promise<boolean>;
  userStatusChange: (id: string | number) => Promise<boolean>;
  getRoles: () => Promise<void>;
  getRolebyPermission: (role: string) => Promise<void>;
  getRoleByIdPermission: (role: string) => Promise<void>;
  getPermissionList: (
    pageNo?: number,
    limit?: number,
    filter_role_name?: string,
    sort_by?: string,
    sort_order?: string,
    filter_description?: string,
    filter_module_access?: string,
    filter_screenaccess?: string,
  ) => Promise<void>;
  setPageSize: (size: number) => void;
  getProfileUserById: (id: string | number) => Promise<any>;
  getModuleAccess: () => Promise<void>;
  getScreenAccess: () => Promise<void>;
}
export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  roles: [],
  pageNo: 1,
  pageSize: 10,
  total: 0,
  permissions: [],
  permissionDetails: [],
  permissionList: [],
  limit: 10,
  currentUser: null,
  profileUser: null,
  modulesData: [],
  screenData: [],
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  setCurrentUser: (user) => set({ currentUser: user }),
  fetchUsers: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    status?,
    search?,
    role?,
    filter_name = "",
    filter_email = "",
    filter_last_login = "",
    sort_by = "",
    sort_order = "",
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });

    try {
      const data = await user.getUserInfo(
        pageNo,
        pageSize,
        status,
        search,
        role,
        filter_name,
        filter_email,
        filter_last_login,
        sort_by,
        sort_order,
      );

      set({
        users: data?.data?.items || [],
        total: data?.data?.total,
      });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },
  getPermissionList: async (
    pageNo = 1,
    limit = 10,
    filter_role_name: string,
    sort_by: string,
    sort_order: string,
    filter_description: string,
    filter_module_access: string,
    filter_screenaccess: string,
  ) => {
    set({ isLoading: true, error: null, pageNo, limit });
    try {
      const data = await user.getPermisionDetails(
        pageNo,
        limit,
        filter_role_name,
        sort_by,
        sort_order,
        filter_description,
        filter_module_access,
        filter_screenaccess,
      );
      set({
        permissionList: data?.data?.data || [],
        total: data?.pagination?.totalRecords || 0,
      });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },
  saveUser: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await user.saveUser(formData);
      const { pageNo, pageSize, fetchUsers } = get();
      await fetchUsers(pageNo, pageSize);
      return true;
    } catch (error: any) {
      set({ error: error?.message || "Failed to save user" });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getUserById: async (id: string | number) => {
    set({ isLoading: false, error: null });
    try {
      const res = await user.getUserById(id);
      set({ currentUser: res });
      return res;
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch user" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getProfileUserById: async (id: string | number) => {
    set({ isLoading: false, error: null });
    try {
      const res = await user.getUserById(id);
      set({ profileUser: res });
      return res;
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch user" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (formData: FormData, id: string | number) => {
    set({ isLoading: true, error: null });
    try {
     const response = await user.updateUser(formData, id);
      await get().getUserById(id);
      const { pageNo, pageSize, fetchUsers } = get();
      await fetchUsers(pageNo, pageSize);
      return response;
    } catch (error: any) {
      set({ error: error?.message || "Failed to update user" });
      throw error;
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  userStatusChange: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await user.userStatusChange(id);
      const { pageNo, pageSize, fetchUsers } = get();
      await fetchUsers(pageNo, pageSize);
      return response;
    } catch (error: any) {
      set({ error: error?.message || "Failed to change user status" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await user.getRoleList();
      set({ roles: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch roles" });
    } finally {
      set({ isLoading: false });
    }
  },
  getModuleAccess: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await user.getModuleAccess();
      set({ modulesData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  getScreenAccess: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await user.getScreenAccess();
      set({ screenData: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  getRolebyPermission: async (role: string | any) => {
    set({ isLoading: true, error: null });
    try {
      const data = await user.getRolebyPermission(role);
      set({ permissions: data });
      return data;
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch role permissions" });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  getRoleByIdPermission: async (role: string | any) => {
    set({ isLoading: true, error: null });
    try {
      const data = await user.getRoleByIdPermission(role);
      set({ permissionDetails: data });
      return data;
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch role permissions" });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
}));
