import client from "@/interceptor/client";
import { ContractSave } from "@/stores/contractStore";
import { toast } from "sonner";
export interface Contract {
  partner_id: number;
  contract_no: string;
  valid_from: string;
  valid_to: string;
  assigned_to: number;
}
export const contractService = {
  async getContractList(
    page: number = 1,
    size: number = 10,
    search: string = "",
    filter_partner_name: string = "",
    filter_customer_name: string = "",
    filter_contract_no: string = "",
    filter_valid_from: string = "",
    filter_valid_to: string = "",
    filter_status: string = "",
    sort_by: string = "",
    sort_order: string = "",
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: any,
    filter_request?: string,
  ): Promise<any> {
    try {
      const params = new URLSearchParams();

      params.append("page", String(page + 1));
      params.append("size", String(size));

      if (search) {
        params.append("search", search);
      }

      if (filter_partner_name) {
        params.append("filter_partner_name", filter_partner_name);
      }

      if (filter_customer_name) {
        params.append("filter_customer_name", filter_customer_name);
      }

      if (filter_contract_no) {
        params.append("filter_contract_no", filter_contract_no);
      }

      if (filter_valid_from) {
        params.append("filter_valid_from", filter_valid_from);
      }

      if (filter_valid_to) {
        params.append("filter_valid_to", filter_valid_to);
      }

      if (filter_status && filter_status !== "" && filter_status != "all") {
        params.append("filter_status", filter_status);
      }
      if (sort_by) {
        params.append("sort_by", sort_by);
      }

      if (sort_order) {
        params.append("sort_order", sort_order);
      }

      if (filter_assigned_status && filter_assigned_status !== "all") {
        params.append("assigned_status", filter_assigned_status);
      }

      if (filter_assigneeId) {
        params.append("assigned_to", String(filter_assigneeId));
      }

      if (filter_requestedId) {
        params.append("requested_by", String(filter_requestedId));
      }

      if (filter_reason) {
        params.append("rejection_reason", filter_reason);
      }

      if (filter_assignee_name) {
        params.append("filter_assignee_name", filter_assignee_name);
      }
      if (filter_request) {
        params.append("filter_request", filter_request);
      }

      // Format date for filter_last_action if it's a Date object
      const formattedUploadAt = filter_last_action
        ? `${filter_last_action.getFullYear()}-${String(filter_last_action.getMonth() + 1).padStart(2, "0")}-${String(filter_last_action.getDate()).padStart(2, "0")}`
        : "";
      if (formattedUploadAt && formattedUploadAt !== "") {
        params.append("filter_last_action", formattedUploadAt);
      }

      const response: any = await client.get("/partner-contracts/", {
        params,
        base: "apiBaseUrl",
      });

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async saveContract(request: Contract): Promise<any> {
    try {
      const response: any = await client.post("/partner-contracts/", request, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed");
    }
  },
  async getContractById(id: number): Promise<any> {
    try {
      const response: any = await client.get(`/partner-contracts/${id}`, {
        base: "apiBaseUrl",
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async updateContract(id: number, request: ContractSave): Promise<any> {
    try {
      const response: any = await client.put(
        `/partner-contracts/${id}`,
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
  async deleteContract(id: string): Promise<any> {
    try {
      const response: any = await client.delete(`partner-contracts/${id}`, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to delete",
      );
    }
  },

  async statusChangeContract(payload: any): Promise<any> {
    try {
      const response: any = await client.put(
        `partner-contracts/status-change-request`,
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
