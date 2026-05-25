import client from "@/interceptor/client";

export const auditDetails = {
  async getAuditInfo(
    page: number = 0,
    size: number = 10,
    user?: string,
    action?: string,
    module?: string,
    subModuleFilter?: string,
    datefilter?: any,
    sort_by?: string,
    sort_order?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size,
      };
      if (user && user !== "all") params.filter_user = user;
      if (action && action !== "all") params.filter_action = action;
      if (module && module !== "all") params.filter_module = module;
      if (subModuleFilter && subModuleFilter !== "all")
        params.filter_sub_module = subModuleFilter;
      if (sort_by) params.sort_by = sort_by;
      if (sort_order) params.sort_order = sort_order;
      let formattedDate = "";

      if (datefilter) {
        if (typeof datefilter === "string") {
          formattedDate = datefilter;
        } else if (datefilter instanceof Date && !isNaN(datefilter.getTime())) {
          formattedDate = `${datefilter.getFullYear()}-${String(
            datefilter.getMonth() + 1,
          ).padStart(2, "0")}-${String(datefilter.getDate()).padStart(2, "0")}`;
        }
      }

      if (formattedDate) {
        params.filter_days = formattedDate;
      }

      const response: any = await client.get("admin/audit-log/", {
        params,
        base: "apiBaseUrl",
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async geListUSers(): Promise<any> {
    try {
      const response: any = await client.get("admin/users/all_users/dropdown", {
        base: "apiBaseUrl",
      });

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async getAssigneeUsers(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/users/assign_users/dropdown",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async geListActions(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/audit-log/actions/dropdown",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async geListModules(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/audit-log/modules/dropdown",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async geListSubModules(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/audit-log/sub_modules/dropdown",
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
};
