import client from "@/interceptor/client";

export const helpService = {
  async saveRequest(request: any): Promise<any> {
    try {
      const response: any = await client.post(
        "/support/contact_via_mail",
        request,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save data");
    }
  },
};
