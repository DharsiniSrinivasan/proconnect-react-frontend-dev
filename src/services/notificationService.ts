import client from "@/interceptor/client";
export const notification = {
  async getNotificationInfo(
    page = 0,
    limit = 10,
    is_read?: boolean,
    search?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        limit,
      };

      // ✅ only send search if not empty
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }

      // ✅ send actual boolean value
      if (is_read !== undefined) {
        params.is_read = is_read;
      }

      const response: any = await client.get("admin/user_notification/all", {
        params,
        base: "apiBaseUrl",
      });

      return response.data;
    } catch (error: any) {
      console.error("Notification API error:", error?.response);
      throw new Error(error?.response?.data?.message || "Unauthorized access");
    }
  },
  async markNotificationRead(id: string | number): Promise<any> {
    try {
      const response: any = await client.put(
        `admin/user_notification/user-notification/mark-read/${id}`,
        {}, // empty body
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Mark notification read error:", error?.response);
      throw new Error(
        error?.response?.data?.message || "Unable to mark notification as read",
      );
    }
  },
  async markAllNotificationRead(): Promise<any> {
    try {
      const response: any = await client.put(
        `admin/user_notification/mark-all-read`,
        {}, // empty body
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Mark notification read error:", error?.response);
      throw new Error(
        error?.response?.data?.message || "Unable to mark notification as read",
      );
    }
  },
};
