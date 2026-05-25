import client from "@/interceptor/client";

export const dashboard = {
  async getDashboardSummary(): Promise<any> {
    try {
      const response: any = await client.get("dashboards/dashboard/summary", {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getAlerts(page: number, page_size: number): Promise<any> {
    try {
      const response: any = await client.get(
        `admin/notifications/?page=${page}&page_size=${page_size}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getRegionalPerformance(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/regional_performance",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },

  async getFacilityUtilization(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/facility_utilization",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getTopCouriers(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/top_couriers",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getSlaTrends(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/sla/current_month",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getPending(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/pending_recommendations",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getPartnerHealth(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/partners_health",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getRecent(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/recent_activity",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
};
