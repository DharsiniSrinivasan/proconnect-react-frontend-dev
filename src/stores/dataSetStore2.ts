// ==============================
// dataSetStore2.ts
// Separate isolated store for DatasetsPage2 (Data Ingestion 2).
// Must NOT share state with dataSetStore.ts.
// ==============================

import { dataSet } from "@/services/dataSetServices";
import { create } from "zustand";

interface DataSetState2 {
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
    batch_name?: string,
    filter_customer?: string,
    name?: string,
    upload_id?: string,
    status?: string,
    uploaded_by?: string,
    uploaded_date?: any,
    dqs?: number,
    sort_by?: string | null,
    sort_order?: string | null,
  ) => Promise<void>;
  setPageSize: (size: number) => void;
}

export const useDataSetStore2 = create<DataSetState2>((set) => ({
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
      console.log(data)
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