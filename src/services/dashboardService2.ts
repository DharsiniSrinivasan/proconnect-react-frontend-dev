import client from "@/interceptor/client";

export const dashboard = {
  // =====================================================
  // SUMMARY
  // =====================================================

  async getDashboardSummary(): Promise<any> {
    try {
      const response: any = await client.get(
        "dashboards/dashboard/summary",
        {
          base: "apiBaseUrl",
        },
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch summary",
      );
    }
  },

  // =====================================================
  // ALERTS
  // =====================================================

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
      throw new Error(
        error?.response?.data?.message || "Failed to fetch alerts",
      );
    }
  },

  // =====================================================
  // PARTNER HEALTH
  // =====================================================

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
      throw new Error(
        error?.response?.data?.message ||
          "Failed to fetch partner health",
      );
    }
  },
};