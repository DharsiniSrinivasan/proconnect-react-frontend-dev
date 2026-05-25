import client from "@/interceptor/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  access_token: string;
  refresh_token: string;
  message: string;
  role: string;
  user_id: number;
}

export interface AuthMenuItem {
  permissionFlag: string;
  status: boolean;
  id: number;
  name: string;
  route: string;
}
export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await client.post("auth/login", payload, {
        base: "apiBaseUrl",
      });

      if ("data" in response) {
        return response.data as LoginResponse;
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      throw error;
    }
  },
};

export const authMenuService = {
  async getMenu(role: string): Promise<AuthMenuItem[]> {
    try {
      const response = await client.get(`/admin/roles/${role.toLowerCase()}`, {
        base: "apiBaseUrl",
      });

      if ("data" in response) {
        return response.data as AuthMenuItem[];
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      throw error;
    }
  },
};
