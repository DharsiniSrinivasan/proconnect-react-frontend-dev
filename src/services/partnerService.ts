import client from "@/interceptor/client";

export const partners = {
  async getPartnerList(
    page: number = 1,
    size: number = 10,
    status?: string,
    search?: string,
    mode?: string[],
    filter_name?: string,
    filter_email?: string,
    otif_percent?: number,
    filter_code?: string,
    sortBy?: string,
    sortOrder?: string,
    filter_customer?: string,
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

      if (status && status !== "all") {
        params.append("status", status);
      }

      if (otif_percent) {
        params.append("otif_percent", String(otif_percent));
      }
      if (filter_name) {
        params.append("filter_name", filter_name);
      }
      if (filter_assignee_name) {
        params.append("filter_assignee_name", filter_assignee_name);
      }
      const formattedUploadAt = filter_last_action
        ? `${filter_last_action.getFullYear()}-${String(filter_last_action.getMonth() + 1).padStart(2, "0")}-${String(filter_last_action.getDate()).padStart(2, "0")}`
        : "";
      if (formattedUploadAt && formattedUploadAt !== "") {
        params.append("filter_last_action", formattedUploadAt);
      }
      if (filter_reason) {
        params.append("rejection_reason", filter_reason);
      }
      if (filter_customer) {
        params.append("customer_name", filter_customer);
      }
      if (filter_code) {
        params.append("code", filter_code);
      }

      if (filter_email) {
        params.append("filter_email", filter_email);
      }
      if (filter_request) {
        params.append("filter_request_name", filter_request);
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

      if (Array.isArray(mode) && mode.length > 0) {
        mode.forEach((m: string) => {
          params.append("mode", m);
        });
      }

      if (sortBy) {
        params.append("sort_by", sortBy);
      }

      if (sortOrder) {
        params.append("sort_order", sortOrder);
      }

      if (search) {
        params.append("search", search);
      }

      const response: any = await client.get("master_data/partners/", {
        params,
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch partners",
      );
    }
  },
  async getPartnerById(id: string): Promise<any> {
    try {
      const response: any = await client.get(`master_data/partners/${id}`, {
        base: "apiBaseUrl",
      });
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch partner",
      );
    }
  },
  async getPartnerContract(id: number): Promise<any> {
    try {
      const response: any = await client.get(
        `partner-contracts/partner/${id}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },

  async updatePartner(id: string, partnerData: any): Promise<any> {
    try {
      const response: any = await client.put(
        `master_data/partners/${id}`,
        partnerData,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update partner",
      );
    }
  },
  async deletePartner(id: string): Promise<any> {
    try {
      const response: any = await client.delete(`master_data/partners/${id}`, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to delete partner",
      );
    }
  },
  async getmodes(): Promise<any> {
    try {
      const response: any = await client.get(
        "master_data/partners/partner_transport-modes",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch modes",
      );
    }
  },

  async getStatus(): Promise<any> {
    try {
      const response: any = await client.get(
        "master_data/partners/partner_statuses",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch statuses",
      );
    }
  },
  async createPartner(partnerData: any): Promise<any> {
    try {
      const response: any = await client.post(
        "master_data/partners/",
        partnerData,
        {
          base: "apiBaseUrl",
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed",
      );
    }
  },

    async statusChange(payload: any): Promise<any> {
    try {
      const response: any = await client.put(
        `master_data/partners/status-change-request`,
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
