import {
  FacilityAgreement,
  facilityAgreementService,
} from "@/services/leaseService";
import { toast } from "sonner";
import { create } from "zustand";

interface LeaseAgreement {
  facility_id: number;
  agreement_number: string;
  category: string | null;
  start_date: null;
  end_date: null;
  rent_amount: number;
  assigned_to: number;
}
interface FetchAgreementsParams {
  pageNo?: number;
  pageSize?: number;
  search?: string;
  filterAgreementNo?: string;
  filterCategory?: string;
  filterFrom?: string;
  filterTo?: string;
  sortBy?: string;
  sortOrder?: string;
  approvalStatus?: string;
  approvalUserId?: number | null;
  requestUserId?: number | null;
  filterReason?: string;
  filterLastAction?: string;
}
interface FacilityAgreementStore {
  leaseData: FacilityAgreement[];
  total: number;
  pageNo: number;
  pageSize: number;
  search: string;
  facility_id: number | null;
  category: string | null;
  sort_field: string;
  sort_order: "Z_TO_A" | "A_TO_Z" | "";
  isLoading: boolean;
  error: string | null;
  selectedAgreement: FacilityAgreement | null;
  facilityAgreementCategory: any[];
  facilityMaster: any[];

  setPageNo: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setFacilityId: (id: number | null) => void;
  setCategory: (cat: string | null) => void;
  setSort: (field: string, order: "Z_TO_A" | "A_TO_Z") => void;
  saveLease: (lease: LeaseAgreement) => Promise<boolean>;
  getAgreementById: (id: number) => Promise<any | null>;
  fetchAgreements: (
    pageNo?: number,
    pageSize?: number,
    search?: string,
    filterAgreementNo?: string,
    filterCategory?: string,
    filterFrom?: string,
    filterTo?: string,
    sortBy?: string,
    sortOrder?: string,
    approvalStatus?: string,
    approvalUserId?: number | null,
    requestUserId?: number | null,
    filterReason?: string,
    filterLastAction?: string,
    filter_assignee_name?: string,
    filter_request_name?: string,
    filterRentAmount?: string,
    statusFilter?: string,
  ) => Promise<void>;
  getAgreementCategory: () => Promise<void>;
  getFacilityCategory: (id) => any;
  getListAllFacilities: () => Promise<void>;
  updateAgreement: (id: number, request: LeaseAgreement) => Promise<boolean>;
  statusUpdate: (payload: any) => Promise<boolean>;
}

export const useFacilityAgreementStore = create<FacilityAgreementStore>(
  (set, get) => ({
    leaseData: [],
    facilityMaster: [],
    facilityAgreementCategory: [],
    total: 0,

    pageNo: 1,
    pageSize: 10,
    search: "",
    facility_id: null,
    category: null,
    sort_field: "",
    sort_order: "",

    isLoading: false,
    error: null,
    selectedAgreement: null,

    setPageNo: (page) => set({ pageNo: page }),
    setPageSize: (size) => set({ pageSize: size, pageNo: 1 }),
    setSearch: (search) => set({ search, pageNo: 1 }),
    setFacilityId: (facility_id) => set({ facility_id, pageNo: 1 }),
    setCategory: (category) => set({ category, pageNo: 1 }),
    setSort: (sort_field, sort_order) =>
      set({ sort_field, sort_order, pageNo: 1 }),

    fetchAgreements: async (
      pageNo: number = 1,
      pageSize: number = 10,
      search: string = "",
      filterAgreementNo: string = "",
      filterCategory: string = "",
      filterFrom: string = "",
      filterTo: string = "",
      sortBy: string = "",
      sortOrder: string = "",
      approvalStatus?: string,
      approvalUserId?: number,
      requestUserId?: number,
      filterReason?: string,
      filterLastAction?: any,
      filter_assignee_name?: string,
      filter_request_name?: string,
      filterRentAmount?: string,
      statusFilter?: string,
    ) => {
      set({ isLoading: true, error: null });

      const currentPage = pageNo !== undefined ? pageNo : get().pageNo;
      const currentPageSize =
        pageSize !== undefined ? pageSize : get().pageSize;
      const currentSearch = search !== undefined ? search : get().search;
      const facility_id = get().facility_id;
      try {
        const res: any = await facilityAgreementService.getList(
          currentPage,
          currentPageSize,
          currentSearch,
          facility_id,
          filterCategory || get().category,
          sortBy || get().sort_field,
          sortOrder || get().sort_order,
          filterAgreementNo,
          filterFrom,
          filterTo,
          approvalStatus,
          approvalUserId,
          requestUserId,
          filterReason,
          filterLastAction,
          filter_assignee_name,
          filter_request_name,
          filterRentAmount,
          statusFilter,
        );

        set({
          leaseData: res?.data?.items || [],
          total: res?.data?.meta?.total_records || 0,
        });
      } catch (err: any) {
        console.error(err);
        set({
          leaseData: [],
          total: 0,
          error: err?.response?.data?.message || "Failed to fetch leases",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    saveLease: async (lease: LeaseAgreement) => {
      set({ isLoading: true, error: null });

      try {
        const res: any = await facilityAgreementService.saveLease(lease);
        // const { pageNo, pageSize, fetchAgreements } = get();
        // await fetchAgreements(pageNo, pageSize);
        set({ isLoading: false });
           if(res.status_code==200||res.status_code===201){
        toast.success(res?.message||"Created successfully");
       }
        if (res) {
          return true;
        } else {
          return false;
        }
      } catch (err: any) {
        set({
          error: err?.message || "Failed to save",
          isLoading: false,
        });
        return false;
      }
    },

    getAgreementById: async (id: number) => {
      set({ isLoading: false, error: null });

      try {
        const response = await facilityAgreementService.getAgreementById(id);
        const agreement = response?.data || null;

        set({ selectedAgreement: agreement });

        return agreement;
      } catch (error: any) {
        set({
          error: error?.message || "Failed to fetch agreement",
        });
        return null;
      } finally {
        set({ isLoading: false });
      }
    },

    getAgreementCategory: async () => {
      set({ isLoading: true, error: null });

      try {
        const res = await facilityAgreementService.getAgreementCategory();

        set({
          facilityAgreementCategory: res?.data || [],
        });
      } catch (error: any) {
        set({ error: error?.message || "Failed to fetch categories" });
      } finally {
        set({ isLoading: false });
      }
    },
    getFacilityCategory: async (id: string | number) => {
      set({ isLoading: true, error: null });

      try {
        const res = await facilityAgreementService.getCategory(id);
        return res?.data?.category || []
      } catch (error: any) {
        set({ error: error?.message || "Failed to fetch categories" });
      } finally {
        set({ isLoading: false });
      }
    },
    getListAllFacilities: async () => {
      set({ isLoading: true, error: null });

      try {
        const res = await facilityAgreementService.getListAllFacilities();

        set({
          facilityMaster: res?.data?.items || [],
        });
      } catch (error: any) {
        set({ error: error?.message || "Failed to fetch facilities" });
      } finally {
        set({ isLoading: false });
      }
    },

    updateAgreement: async (id: number, request: LeaseAgreement) => {
      set({ isLoading: true, error: null });

      try {
        const response = await facilityAgreementService.updateAgreement(
          id,
          request,
        );

        // const { pageNo, pageSize, fetchAgreements } = get();

        // refresh list after update
        // await fetchAgreements(pageNo, pageSize);

        set({ isLoading: false });
        if (response.status_code == 200 || response.status_code === 201) {
          toast.success(response?.message || "Updated successfully");
        }
        return !!response;
      } catch (error: any) {
        set({
          error: error?.message || "Failed to update",
          isLoading: false,
        });

        return false;
      }
    },
    statusUpdate: async (payload: any) => {
      set({ isLoading: true, error: null });

      try {
        const response = await facilityAgreementService.statusChange(payload);


        // const { pageNo, pageSize, fetchAgreements } = get();
        // await fetchAgreements(pageNo, pageSize);

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
  }),
);
