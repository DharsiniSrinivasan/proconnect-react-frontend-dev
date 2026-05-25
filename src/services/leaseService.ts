import client from "@/interceptor/client";

export interface FacilityAgreement {
  id: number;
  facility_id: number;
  agreement_no: string;
  category: string;
  created_date: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  facility_id?: number | null;
  category?: string | null;
  sort_field?: string;
  sort_order?: "Z_TO_A" | "A_TO_Z" | "";
}

export interface LeaseAgreement {
  facility_id: number;
  agreement_number: string;
  category: string | null;
  start_date: null;
  end_date: null;
  rent_amount: number;
  assigned_to: number;
}

export const facilityAgreementService = {
  async getList(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    facility_id?: number | null,
    category: string = "",
    sort_field: string = "",
    sort_order: string = "",
    agreement_no: string = "",
    from_date: string = "",
    to_date: string = "",
    approval_status?: string,
    approval_user_id?: number,
    request_user_id?: number,
    filter_reason?: string,
    filter_last_action?: any,
    filter_assignee_name?: string,
    filter_request_name?: string,
    filterRentAmount?: string,
    statusFilter?: string,
  ): Promise<{ results: FacilityAgreement[]; total: number }> {
    try {
      const params = new URLSearchParams();

      params.append("page", String(page+1));
      params.append("limit", String(limit));

      if (search) {
        params.append("search", search);
      }

      if (facility_id != null) {
        params.append("facility_id", String(facility_id));
      }

      if (category && category !== "all") {
        params.append("category", category);
      }
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sort_field) {
        params.append("sort_by", sort_field);
      }

      if (sort_order) {
        params.append("sort_order", sort_order);
      }

      if (agreement_no) {
        params.append("filter_agreement_number", agreement_no);
      }
      if (filterRentAmount) {
        params.append("filter_rent_amount", filterRentAmount);
      }

      if (from_date) {
        params.append("start_date", from_date);
      }

      if (to_date) {
        params.append("end_date", to_date);
      }

      if (approval_status && approval_status != "all") {
        params.append("assigned_status", approval_status);
      }

      if (approval_user_id) {
        params.append("assigned_to", String(approval_user_id));
      }
      if (filter_request_name) {
        params.append("filter_requested_by_name", String(filter_request_name));
      }
      if (filter_assignee_name) {
        params.append("filter_assigned_to_name", String(filter_assignee_name));
      }

      if (request_user_id) {
        params.append("requested_by", String(request_user_id));
      }

      if (filter_reason) {
        params.append("rejection_reason", filter_reason);
      }

      // Format date for filter_last_action if it's a Date object
      const formattedLastAction = filter_last_action
        ? filter_last_action instanceof Date
          ? `${filter_last_action.getFullYear()}-${String(filter_last_action.getMonth() + 1).padStart(2, "0")}-${String(filter_last_action.getDate()).padStart(2, "0")}`
          : filter_last_action
        : "";

      if (formattedLastAction) {
        params.append("filter_last_action", formattedLastAction);
      }

      const response: any = await client.get(
        "data_ingestion/facility-agreements/list",
        {
          params,
          base: "apiBaseUrl",
        },
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch facility agreements",
      );
    }
  },
  async saveLease(request: LeaseAgreement): Promise<any> {
    try {
      const response: any = await client.post(
        "/data_ingestion/facility-agreements/create",
        request,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed");
    }
  },

  async getAgreementById(id: number): Promise<any> {
    try {
      const response: any = await client.get(
        `/data_ingestion/facility-agreements/${id}`,
        { base: "apiBaseUrl" },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async deleteAgreement(id: number): Promise<any> {
    try {
      const response: any = await client.delete(
        `/data_ingestion/facility-agreements/${id}`,
        { base: "apiBaseUrl" },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },

  async getAgreementCategory(): Promise<any> {
    try {
      const response: any = await client.get(
        "data_ingestion/facility-agreements/categories",
        { base: "apiBaseUrl" },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async getCategory(id): Promise<any> {
    try {
      const response: any = await client.get(
        `data_ingestion/facility-agreements/facility-info/${id}`,
        { base: "apiBaseUrl" },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async getListAllFacilities(): Promise<any> {
    try {
      const response: any = await client.get(
        "master_data/facilities/all?sort_order=Z_TO_A",
        { base: "apiBaseUrl" },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async updateAgreement(id: number, request: LeaseAgreement): Promise<any> {
    try {
      const response: any = await client.put(
        `data_ingestion/facility-agreements/${id}`,
        request,
        {
          base: "apiBaseUrl",
        },
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to update");
    }
  },
    async statusChange(payload: any): Promise<any> {
        try {
          const response: any = await client.put(
            `/data_ingestion/facility-agreements/status-change-request`,
            payload,
            {
              base: "apiBaseUrl",
            },
          );
          return response.data;
        } catch (error: any) {
          throw new Error(
            error?.response?.data?.message || "Failed",
          );
        }
      },
};
