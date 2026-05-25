// ==============================
// dataSetServices.ts
// ==============================

import client from "@/interceptor/client";

export const dataSet = {

  // GET BATCH TABLE API
  async getBatchlist(
    batch_id = "",
    page: number = 1,
    size: number = 10,
  ): Promise<any> {

    try {

      // QUERY PARAMS
      const params: any = {
        page: page,
        limit: size,
      };

      // API REQUEST
      const response: any = await client.get(
        `data_ingestion/batches/${batch_id}`,
        {
          base: "apiBaseUrl",
          params,
        }
      );

      // RETURN API RESPONSE
      return response.data;

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        "Failed to fetch batch data"
      );

    }
  },
};