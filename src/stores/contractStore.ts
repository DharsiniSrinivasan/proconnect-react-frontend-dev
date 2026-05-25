import { contractService } from "@/services/contractService";
import { toast } from "sonner";
import { create } from "zustand";

interface Contract {
  id: string;
  contract_no: string;
  valid_from: string;
  valid_to: string;
  status: string;
  region: string;
  [key: string]: any;
}

export interface ContractSave {
  partner_id: number;
  contract_no: string;
  valid_from: string;
  valid_to: string;
  assigned_to: number;
}
interface ContractState {
  selectedContract: Contract | null;
  contractData: any;
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  search: string;
  filterPartnerName: string;
  filterCustomerName: string;
  filterContractNo: string;
  filterValidFrom: string;
  filterValidTo: string;
  sortBy: string;
  sortOrder: string;
  setPageNo: (page: number) => void;
  setPageSize: (size: number) => void;
  fetchContracts: (
    pageNo?: number,
    pageSize?: number,
    search?: string,
    filterPartnerName?: string,
    filterCustomerName?: string,
    filterContractNo?: string,
    filterValidFrom?: any,
    filterValidTo?: any,
    status?: string,
    sortBy?: string,
    sortOrder?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request?: string,
  ) => Promise<void>;
  saveContract: (request?: ContractSave) => Promise<boolean>;
  getContractById: (id: number) => Promise<Contract | null>;
  updateContract: (id: number, request: ContractSave) => Promise<boolean>;
  statusUpdateContract: ( payload: any) => Promise<boolean>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contractData: [],
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  search: "",
  filterPartnerName: "",
  filterCustomerName: "",
  filterContractNo: "",
  filterValidFrom: "",
  filterValidTo: "",
  sortBy: "",
  sortOrder: "",
  selectedContract: null,

  setPageNo: (page) => set({ pageNo: page }),
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1, // reset to first page
    }),

  fetchContracts: async (
    pageNo = get().pageNo,
    pageSize = get().pageSize,
    search = get().search,
    filterPartnerName = get().filterPartnerName,
    filterCustomerName = get().filterCustomerName,
    filterContractNo = get().filterContractNo,
    filterValidFrom = get().filterValidFrom,
    filterValidTo = get().filterValidTo,
    status = "",
    sortBy = get().sortBy,
    sortOrder = get().sortOrder,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request?: string,
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const response = await contractService.getContractList(
        pageNo,
        pageSize,
        search,
        filterPartnerName,
        filterCustomerName,
        filterContractNo,
        filterValidFrom,
        filterValidTo,
        status,
        sortBy,
        sortOrder,
        filter_assigned_status,
        filter_assigneeId,
        filter_requestedId,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request,
      );
      set({
        contractData: response.data?.items || [],
        total: response.data?.pagination?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  saveContract: async (request: ContractSave) => {
    set({ isLoading: true, error: null });
    try {
      const response = await contractService.saveContract(request);
      const { pageNo, pageSize, fetchContracts } = get();
      await fetchContracts(pageNo, pageSize);

      set({ isLoading: false });
         if(response.status_code==200||response.status_code===201){
         toast.success(response?.message||"Contractor created successfully");
       }
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.message || "Failed to save",
        isLoading: false,
      });
      return false;
    }
  },
  getContractById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await contractService.getContractById(id);

      const contract = response?.data || null;

      set({
        selectedContract: contract,
        isLoading: false,
      });

      return contract;
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch contract",
        isLoading: false,
      });

      return null;
    }
  },
  updateContract: async (id: number, request: ContractSave) => {
    set({ isLoading: true, error: null });

    try {
      const response = await contractService.updateContract(id, request);

      const { pageNo, pageSize, fetchContracts } = get();

      // refresh list after update
      await fetchContracts(pageNo, pageSize);

      set({ isLoading: false });
       if(response.status_code==200||response.status_code===201){
        toast.success(response?.message||"Contractor updated successfully");
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
     statusUpdateContract: async (payload: any) => {
      set({ isLoading: true, error: null });
  
      try {
        const response = await contractService.statusChangeContract(payload);
  
  
        const { pageNo, pageSize, fetchContracts } = get();
        await fetchContracts(pageNo, pageSize);
  
        set({ isLoading: false });
        toast.success(response?.message || "Status change request submitted successfully");
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
