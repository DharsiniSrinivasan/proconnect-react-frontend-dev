import { dataSet } from "@/services/dataSetServices";
import { create } from "zustand";

interface DataSetState {
  data: any[];
  summary: any;
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  fetchDataSet: (
    pageNo?: number,
    pageSize?: number,
    filter_customer?: string,
    batch_name?: string,
    name?: string,
    upload_id?: string,
    status?: string,
    uploaded_by?: string,
    uploaded_date?: string,
    dqs?: number,
    sort_by?: string,
    sort_order?: string,
  ) => Promise<void>;
  setPageSize: (size: number) => void;
}
interface BatchState {
  data: any[];
  summary: any;
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  saveBatch: (batch_name: string, customerId: number) => Promise<any>;
  fetchBatch: (
    batch_id: string,
    pageNo: number,
    pageSize: number,
  ) => Promise<any>;
  setPageSize: (size: number) => void;
}
interface DetailState {
  detailData: any;
  errorOptions: any;
  isLoading: boolean;
  error: string | null;
  pageNo: number;
  pageSize: number;
  total: number;
  setPageSize: (size: number) => void;
  fetchDetail: (
    dataset_id: string,
    pageNo?: number,
    pageSize?: number,
    error_type?: string,
    severity?: string,
    field_name?: string,
    field_value?: string,
    row_number?: number,
    suggested_fix?: string,
    sort_by?: string,
    sort_order?: string,
  ) => Promise<void>;
  retryDataset: (dataset_id: string, customer_id: string) => Promise<any>;
  fetchErrorOptions: () => Promise<void>;
  resetData: () => void;
}
interface NewDetailState {
  newdata: any;
  isLoading: boolean;
  error: string | null;
  fetchNewDetail: (dataset_id: string) => Promise<void>;
  resetData: () => void;
}
interface AirflowState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  triggerAirflow: (upload_id: string, customer_id: string) => Promise<void>;
}

export const useDataSetStore = create<DataSetState>((set) => ({
  data: [],
  summary: {
    totalDatasets: 0,
    analysed: 0,
    completedWithErrors: 0,
    inQuarantine: 0,
    avgDqs: 0,
  },
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1,
    }),
  fetchDataSet: async (
    pageNo = 1,
    pageSize = 10,
    batch_name = "",
    filter_customer = "",
    name = "",
    upload_id = "",
    status = "",
    uploaded_by = "",
    uploaded_date = "",
    dqs = 0,
    sort_by = "",
    sort_order = "",
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await dataSet.getList(
        pageNo,
        pageSize,
        batch_name,
        filter_customer,
        name,
        upload_id,
        status,
        uploaded_by,
        uploaded_date,
        dqs,
        sort_by,
        sort_order,
      );
      set({
        data: data?.data?.items,
        summary: data?.data?.summary,
        total: data?.data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export const useDetailStore = create<DetailState>((set) => ({
  detailData: [],
  errorOptions: [],
  isLoading: false,
  error: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1,
    }),
  resetData: () => set({ detailData: null }),
  retryDataset: async (dataset_id: "", customer_id = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await dataSet.retryUpload(dataset_id, customer_id);
      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchDetail: async (
    dataset_id: "",
    pageNo = 1,
    pageSize = 10,
    error_type = "",
    severity = "",
    field_name = "",
    field_value = "",
    row_number = 0,
    suggested_fix = "",
    sort_by = "",
    sort_order = "",
  ) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await dataSet.getDetail(
        dataset_id,
        pageNo,
        pageSize,
        error_type,
        severity,
        field_name,
        field_value,
        row_number,
        suggested_fix,
        sort_by,
        sort_order,
      );
      set({
        detailData: data,
        isLoading: false,
        total: data?.validationErrors?.pagination?.total || 0,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchErrorOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dataSet.getErrorOptions();
      set({
        errorOptions: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
export const useNewDetailStore = create<NewDetailState>((set) => ({
  newdata: null,
  isLoading: false,
  error: null,
  resetData: () => set({ newdata: null }),
  fetchNewDetail: async (upload_id: "") => {
    set({ isLoading: true });
    try {
      const data = await dataSet.getNewDetail(upload_id);
      set({
        newdata: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
export const useAirflowStore = create<AirflowState>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  triggerAirflow: async (upload_id: "0", customer_id: "0") => {
    set({ isLoading: true });
    try {
      const data = await dataSet.triggerAirFlow(upload_id, customer_id);
      set({
        data: data?.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
export const useBatchStore = create<BatchState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  summary: null,
  pageNo: 1,
  pageSize: 10,
  total: 0,
  setPageSize: (size) =>
    set({
      pageSize: size,
      pageNo: 1,
    }),
  saveBatch: async (batch_name: "", customerId: 0) => {
    set({ isLoading: true });
    try {
      const data = await dataSet.saveBatchName(batch_name, customerId);
      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchBatch: async (batch_id = "", pageNo = 1, pageSize = 10) => {
    set({ isLoading: true, error: null, pageNo, pageSize });
    try {
      const data = await dataSet.getBatchlist(batch_id, pageNo, pageSize);
      set({
        data: data?.data?.items,
        summary: data?.data?.summary,
        total: data?.data?.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
