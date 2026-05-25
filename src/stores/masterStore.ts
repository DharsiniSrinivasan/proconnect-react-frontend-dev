import { masterData } from "@/services/masterService";
import { SaveRequest } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface TilesState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  fetchTiles: (pageNo?: number, pageSize?: number) => Promise<void>;
  updateStatus: (request?: any, type?: string) => Promise<boolean>;
}
export interface CustomerRow {
  customer_id: string;
  name: string;
  gstin: string;
  billing_address: string;
  shipping_address: string;
  status: string;
  region: string;
  lastUpdated: string;
  last_updated: string;
  pin_code: string;
  vendor_code: string;
}
interface CustomerState {
  data: any[];
  dropdownList: any[];
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  status: string[];
  region: string[];
  fetchCustomer: (
    pageNo?: number,
    pageSize?: number,
    search?: string,
    status?: string,
    region?: string,
    filter_name?: string,
    filter_gstin?: string,
    filter_billing_address?: string,
    filter_shipping_address?: string,
    sort_by?: string,
    sort_order?: string,
    dateFilter?: Date | null,
    filter_vendor?: string,
    filter_shipping_pincode?: string,
  ) => Promise<void>;
  customerDropDown: () => Promise<void>;
  fetchStatus: () => Promise<void>;
  fetchRegion: () => Promise<void>;
  saveCustomer: (request?: SaveRequest) => Promise<boolean>;
  updateCustomer: (
    request?: SaveRequest,
    id?: number | string,
  ) => Promise<boolean>;
  deleteCustomer: (id?: number | string) => Promise<boolean>;
  setPageSize: (size: number) => void;
  customerStatusUpdate: (payload: any) => Promise<any>;
}
interface FacilityState {
  data: any[];
  geography: any[];
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  status: string[];
  tiers: string[];
  categoryList: any[];
  categoryDropDown: () => Promise<void>;
  fetchFacility: (
    pageNo?: number,
    pageSize?: number,
    search?: string,
    status?: string,
    tiers?: string,
    filter_name?: string,
    filter_region?: string,
    capacity?: number,
    fixed_cost?: number,
    sort_by?: string,
    sort_order?: string,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
    filter_facility_code?: string,
  ) => Promise<void>;
  fetchGeography: (
    pageNo?: number,
    pageSize?: number,
    search?: string,
  ) => Promise<void>;
  fetchStatus: () => Promise<void>;
  fetchTiers: () => Promise<void>;
  saveFacility: (request?: SaveRequest) => Promise<boolean>;
  updateFacility: (
    request?: SaveRequest,
    id?: number | string,
  ) => Promise<boolean>;
  deleteFacility: (id?: number | string) => Promise<boolean>;
  setPageSize: (size: number) => void;
  statusUpdate: (payload: any) => Promise<boolean>;
}
export const useTilesStore = create<TilesState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,

  fetchTiles: async (pageNo = 1, pageSize = 10) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await masterData.getTilesList(pageNo, pageSize);
      set({
        data: data?.data?.items,
        total: data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateStatus: async (request: any, type: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.updateApprovalStatus(request, type);
      set({ isLoading: false });
      if (response.status_code == 200 || response.status_code === 201) {
        toast.success(response?.message || "Status updated successfully");
      }
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to update status",
        isLoading: false,
      });
      return false;
    }
  },
}));
export const useCustomerStore = create<CustomerState>((set, get) => ({
  data: [],
  dropdownList: [],
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  status: [],
  region: [],
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  fetchCustomer: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    search = "",
    status = "",
    region = "",
    filter_name = "",
    filter_gstin = "",
    filter_billing_address = "",
    filter_shipping_address = "",
    sort_by = "",
    sort_order = "",
    dateFilter = null,
    filter_vendor = "",
    filter_shipping_pincode = "",
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await masterData.getCustomerList(
        pageNo,
        pageSize,
        search,
        status,
        region,
        filter_name,
        filter_gstin,
        filter_billing_address,
        filter_shipping_address,
        sort_by,
        sort_order,
        dateFilter,
        filter_vendor,
        filter_shipping_pincode,
      );
      set({
        data: data?.data?.items || [],
        total: data?.data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  customerDropDown: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getCustomerDropDown();
      set({
        dropdownList: data?.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getStatusList();
      set({
        status: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch status",
        isLoading: false,
      });
    }
  },
  fetchRegion: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getRegionList();
      set({
        region: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch region",
        isLoading: false,
      });
    }
  },
  saveCustomer: async (request: SaveRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.saveCustomer(request);
      const { pageNo, pageSize, fetchCustomer } = get();
      await fetchCustomer(pageNo, pageSize);

      set({ isLoading: false });
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to save customer",
        isLoading: false,
      });
      return false;
    }
  },
  customerStatusUpdate: async (payload: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await masterData.customerStatuschange(payload);


      const { pageNo, pageSize, fetchCustomer } = get();
      await fetchCustomer(pageNo, pageSize);

      set({ isLoading: false });
      if (response) {
        toast.success(response?.message || "Status change request submitted successfully");
      }
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed",
        isLoading: false,
      });

      return null;
    }
  },
  updateCustomer: async (request: SaveRequest, id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.updateCustomer(request, id);
      const { pageNo, pageSize, fetchCustomer } = get();
      await fetchCustomer(pageNo, pageSize);
      set({ isLoading: false });
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to update customer",
        isLoading: false,
      });
      return false;
    }
  },
  deleteCustomer: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      await masterData.deleteCustomer(id);
      const { pageNo, pageSize, fetchCustomer } = get();
      await fetchCustomer(pageNo, pageSize);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to delete customer",
        isLoading: false,
      });
      return false;
    }
  },
}));
export const useFacilityStore = create<FacilityState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  status: [],
  categoryList: [],
  tiers: [],
  geography: [],
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),
  categoryDropDown: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getCategoryDropDown();
      set({
        categoryList: data?.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchFacility: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    search = "",
    status = "",
    tiers = "",
    filter_name = "",
    filter_region = "",
    capacity = 0,
    fixed_cost = 0,
    sort_by = "",
    sort_order = "",
    filter_customer,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
    filter_facility_code?: string,
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await masterData.getFacilityList(
        pageNo,
        pageSize,
        search,
        status,
        tiers,
        filter_name,
        filter_region,
        capacity,
        fixed_cost,
        sort_by,
        sort_order,
        filter_customer,
        filter_assigned_status,
        filter_assigneeId,
        filter_requestedId,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request_name,
        filter_facility_code,
      );
      set({
        data: data?.data?.items || [],
        total: data?.data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchGeography: async (pageNo = 1, pageSize = 10, search = "") => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await masterData.getGeographyList(pageNo, pageSize, search);
      set({
        geography: data?.data?.items || [],
        total: data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getFacilityStatusList();
      set({
        status: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch status",
        isLoading: false,
      });
    }
  },
  fetchTiers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterData.getTiersList();
      set({
        tiers: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch region",
        isLoading: false,
      });
    }
  },
  saveFacility: async (request: SaveRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.saveFacility(request);
      const { pageNo, pageSize, fetchFacility } = get();
      await fetchFacility(pageNo, pageSize);
      set({ isLoading: false });
      if (response.status_code == 200 || response.status_code === 201) {
        toast.success(response?.message || "Created successfully");
      }
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to save customer",
        isLoading: false,
      });
      return false;
    }
  },
  updateFacility: async (request: SaveRequest, id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.updateFacility(request, id);
      const { pageNo, pageSize, fetchFacility } = get();
      await fetchFacility(pageNo, pageSize);
      set({ isLoading: false });
       if (response.status_code == 200 || response.status_code === 201) {
        toast.success(response?.message || "Updated successfully");
      }
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to update customer",
        isLoading: false,
      });
      return false;
    }
  },
  deleteFacility: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await masterData.deleteFacility(id);
      const { pageNo, pageSize, fetchFacility } = get();
      await fetchFacility(pageNo, pageSize);
      set({ isLoading: false });
      if (response.status_code == 200 || response.status_code === 201) {
        toast.success(response?.message || "Deleted successfully");
      }
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to delete customer",
        isLoading: false,
      });
      return false;
    }
  },
  statusUpdate: async (payload: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await masterData.statusChange(payload);


      const { pageNo, pageSize, fetchFacility } = get();
      await fetchFacility(pageNo, pageSize);

      set({ isLoading: false });
      if (response) {
        toast.success(response?.message || "Status change request submitted successfully");
      }
      return response;
    } catch (error: any) {
      set({
        error: error?.message || "Failed",
        isLoading: false,
      });

      return null;
    }
  },

}));
