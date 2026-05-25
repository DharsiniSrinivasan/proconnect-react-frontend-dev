import client from "@/interceptor/client";
export const rateCard = {
  async getCardList(
    page: number = 1,
    size: number = 10,
    status?: string,
    search?: string,
    mode?: string,
    filter_code?: string,
    filter_name?: string,
    filter_from?: string,
    filter_to?: string,
    filter_frt_rate?: number,
    filter_erate?: number,
    filter_oda_rate?: number,
    filter_total_rate?: number,
    filter_minimum?: number,
    filter_oda_service_charge?: number,
    sort_by?: string,
    sort_order?: string,
    filter_tat_days?: number,
    filter_customer?: string,
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size,
      };

      if (status && status !== "all") {
        params.status = status;
      }

      if (mode && mode !== "all") {
        params.mode = mode;
      }

      if (search?.trim()) {
        params.search = encodeURIComponent(search); // axios auto encodes -> SME%20CARGO
      }
      if (filter_code?.trim()) {
        params.filter_code = filter_code;
      }

      if (filter_name?.trim()) {
        params.filter_name = filter_name;
      }
      if (filter_customer?.trim()) {
        params.filter_customer_name = filter_customer;
      }

      if (filter_from?.trim()) {
        params.filter_from = filter_from;
      }

      if (filter_to?.trim()) {
        params.filter_to = filter_to;
      }

      if (filter_frt_rate !== 0) {
        params.filter_frt_rate = filter_frt_rate;
      }

      if (filter_erate !== 0) {
        params.filter_erate = filter_erate;
      }

      if (filter_oda_rate !== 0) {
        params.filter_oda_rate = filter_oda_rate;
      }

      if (filter_total_rate !== 0) {
        params.filter_total_rate = filter_total_rate;
      }

      if (filter_minimum !== 0) {
        params.filter_minimum = filter_minimum;
      }
      if (filter_oda_service_charge !== 0) {
        params.filter_oda_service_charge = filter_oda_service_charge;
      }

      if (filter_tat_days !== 0) {
        params.filter_tat_days = filter_tat_days;
      }

      if (sort_by) {
        params.sort_by = sort_by;
      }

      if (sort_order) {
        params.sort_order = sort_order;
      }
      if (filter_assigned_status?.trim() && filter_assigned_status !== "all") {
        params.assigned_status = filter_assigned_status;
      }

      if (filter_assigneeId !== undefined) {
        params.assigned_to = filter_assigneeId;
      }

      if (filter_requestedId !== undefined) {
        params.requested_by = filter_requestedId;
      }

      if (filter_reason?.trim()) {
        params.filter_reason = filter_reason;
      }

      if (filter_assignee_name?.trim()) {
        params.filter_assignee_name = filter_assignee_name;
      }
      if (filter_request_name?.trim()) {
        params.filter_request_name = filter_request_name;
      }

      if (filter_last_action?.trim()) {
        params.filter_last_action = filter_last_action;
      }
      const response: any = await client.get("master_data/rate-cards/", {
        params,
        base: "apiBaseUrl",
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch rate cards",
      );
    }
  },
  async fetchCardById(id: string): Promise<any> {
    try {
      const response: any = await client.get(`master_data/rate-cards/${id}`, {
        base: "apiBaseUrl",
      });
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch rate cards",
      );
    }
  },
  async fetchContractById(id: string): Promise<any> {
    try {
      const response: any = await client.get(
        `partner-contracts/partner/${id}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch rate cards",
      );
    }
  },
  async updateCards(id: string, rateCardData: any): Promise<any> {
    try {
      const response: any = await client.put(
        `master_data/rate-cards/${id}`,
        rateCardData,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update rate cards",
      );
    }
  },
  async createCards(rateCardData: any): Promise<any> {
    try {
      const response: any = await client.post(
        `master_data/rate-cards/`,
        rateCardData,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update rate cards",
      );
    }
  },
  async deleteRateCard(id: string): Promise<any> {
    try {
      const response: any = await client.delete(
        `master_data/rate-cards/${id}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to delete rate card",
      );
    }
  },
  async getPartners(): Promise<any> {
    try {
      const response: any = await client.get(
        "/master_data/partners/partners_master",
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch partners",
      );
    }
  },
  async getCity(): Promise<any> {
    try {
      const response: any = await client.get(
        "/master_data/geography/distinct_city",
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch city");
    }
  },
      async statusChangeRateCard(payload: any): Promise<any> {
      try {
        const response: any = await client.put(
          `master_data/rate-cards/status-change-request`,
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
