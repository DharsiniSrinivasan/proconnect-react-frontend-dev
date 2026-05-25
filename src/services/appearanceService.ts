import client from "@/interceptor/client";
import { SaveRequest } from "@/stores/appearanceStore";

export const appearance = {
  async getAppearance(): Promise<any> {
    try {
      const response: any = await client.get("/admin/appearance/", {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getLogoImage(): Promise<any> {
    try {
      const response: any = await client.get("/admin/appearance/get_logo", {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async saveAppearance(request: SaveRequest[]): Promise<any> {
    try {
      const response: any = await client.post("/admin/appearance/", request);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async saveLogoImage(formData: FormData): Promise<any> {
    try {
      const response: any = await client.post(
        "/admin/appearance/logo",
        formData,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to save logo image",
      );
    }
  },
};
