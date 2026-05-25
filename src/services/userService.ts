import client from "@/interceptor/client";

export const user = {
  async getUserInfo(
    page: number = 1,
    size: number = 10,
    status?: string,
    search?: string,
    role?: string,
    filter_name?: string,
    filter_email?: string,
    filter_last_login?: any,
    sort_by?: string,
    sort_order?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size,
      };

      if (status && status !== "all") {
        params.status = status;
      }
      if (role && role !== "all") {
        params.role = role;
      }

      if (search && search !== "") {
        params.search = search;
      }
      if (filter_name && filter_name !== "") {
        params.filter_name = filter_name;
      }
      if (filter_email && filter_email !== "") {
        params.filter_email = filter_email;
      }
      const formattedUploadAt = filter_last_login
        ? `${filter_last_login.getFullYear()}-${String(filter_last_login.getMonth() + 1).padStart(2, "0")}-${String(filter_last_login.getDate()).padStart(2, "0")}`
        : "";
      if (formattedUploadAt && formattedUploadAt !== "") {
        params.filter_last_login = formattedUploadAt;
      }
      if (sort_by && sort_by !== "") {
        params.sort_by = sort_by;
      }
      if (sort_order && sort_order !== "") {
        params.sort_order = sort_order;
      }
      const response: any = await client.get("admin/users/", {
        params,
        base: "apiBaseUrl",
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch users",
      );
    }
  },

  // Save new user
  async saveUser(formData: FormData): Promise<any> {
    try {
      const response: any = await client.post("admin/users/", formData, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save user");
    }
  },
  async getRoleList(): Promise<any> {
    try {
      const response: any = await client.get("admin/roles/", {
        base: "apiBaseUrl",
      });

      return response?.data?.data?.roles;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch roles",
      );
    }
  },

  async getRolebyPermission(role: string): Promise<any> {
    try {
      const response: any = await client.get(`admin/roles/${role}`, {
        base: "apiBaseUrl",
      });

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch role permissions",
      );
    }
  },

  async getRoleByIdPermission(roleName: string): Promise<any> {
    try {
      const response: any = await client.get(
        `admin/roles/${roleName.toLowerCase()}`,
        {
          base: "apiBaseUrl",
        },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch role permissions",
      );
    }
  },

  async getUserById(id: string | number): Promise<any> {
    try {
      const response: any = await client.get(`admin/users/${id}`, {
        base: "apiBaseUrl",
      });

      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch user by id",
      );
    }
  },

  async updateUser(formData: FormData, id: string | number): Promise<any> {
    try {
      const response: any = await client.put(`admin/users/${id}`, formData, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update user",
      );
    }
  },
  async userStatusChange(id: string | number): Promise<any> {
    try {
      const response: any = await client.put(`admin/users/${id}/status`, {
        base: "apiBaseUrl",
      });

      return response?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch user by id",
      );
    }
  },
  async getPermisionDetails(
    page: number = 1,
    limit: number = 20,
    filter_role_name?: string,
    sort_by?: string,
    sort_order?: string,
    filter_description?: string,
    filter_module_access?: string,
    filter_screenaccess?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        limit,
      };
      if (filter_role_name && filter_role_name !== "all") {
        params.filter_role_name = filter_role_name;
      }
      if (filter_module_access && filter_module_access !== "all") {
        params.filter_module_access = filter_module_access;
      }
      if (filter_screenaccess && filter_screenaccess !== "all") {
        params.filter_screenaccess = filter_screenaccess;
      }
      if (sort_by && sort_by !== "") {
        params.sort_by = sort_by;
      }
      if (sort_order && sort_order !== "") {
        params.sort_order = sort_order;
      }
      if (filter_description && filter_description !== "") {
        params.filter_description = filter_description;
      }
      const response: any = await client.get(
        "admin/roles/list_role_permissions",
        {
          params,
          base: "apiBaseUrl",
        },
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch Data");
    }
  },
  async getModuleAccess(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/roles/module-access/dropdown",
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data?.moduleAccess;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async getScreenAccess(): Promise<any> {
    try {
      const response: any = await client.get(
        "admin/roles/screen-access/dropdown",
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data?.screenAccess;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
};
