import client from "@/interceptor/client";

export const DownloadReport = {
  async getDownload(downloadXlsx = false): Promise<any[] | void> {
    try {
      const endpoint = `/data_ingestion/datasets/download-excel`;

      if (downloadXlsx) {
        // Request Excel file as Blob
        const response = await client.get(endpoint, {
          base: "apiBaseUrl",
          responseType: "blob",
        });

        if ("data" in response) {
          // Create a download link for the file
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const contentDisposition = response.headers?.["content-disposition"];
         
          let downloadedFileName: string;

          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match?.[1]) {
              downloadedFileName = match[1];
            
            }
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", downloadedFileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error("Invalid response");
        }
      } else {
        // Return JSON data
        const response = await client.get(endpoint, { base: "apiBaseUrl" });
        if ("data" in response) {
          return response.data?.data?.items as any[];
        } else {
          throw new Error(response?.message);
        }
      }
    } catch (error) {
      throw error;
    }
  },
};
export const DownloadError = {
  async getDownload(
    downloadXlsx = false,
    datasetId: string,
  ): Promise<any[] | void> {
    try {
      const endpoint = `data_ingestion/datasets/download/error-file/${datasetId}`;

      if (downloadXlsx) {
        // Request Excel file as Blob
        const response = await client.get(endpoint, {
          base: "apiBaseUrl",
          responseType: "blob",
        });

        if ("data" in response) {
          // Create a download link for the file
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const contentDisposition = response.headers?.["content-disposition"];
          let downloadedFileName;

          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match?.[1]) {
              downloadedFileName = match[1];
            }
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            downloadedFileName || "error_list.xlsx",
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error("Invalid response");
        }
      } else {
        // Return JSON data
        const response = await client.get(endpoint, { base: "apiBaseUrl" });
        if ("data" in response) {
          return response.data?.data?.items as any[];
        } else {
          throw new Error(response?.message);
        }
      }
    } catch (error) {
      throw error;
    }
  },
};
export const DownloadUpload = {
  async getDownload(
    downloadXlsx = false,
    datasetId: string,
  ): Promise<any[] | void> {
    try {
      const endpoint = `data_ingestion/datasets/download/${datasetId}`;

      if (downloadXlsx) {
        // Request Excel file as Blob
        const response = await client.get(endpoint, {
          base: "apiBaseUrl",
          responseType: "blob",
        });

        if ("data" in response) {
          // Create a download link for the file
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const contentDisposition = response.headers?.["content-disposition"];
          let downloadedFileName: string | undefined;

          if (contentDisposition) {
            // Try RFC 5987 'filename*=' first (URL-encoded)
            const filenameStarMatch = contentDisposition.match(
              /filename\*=\s*utf-8''([^;]+)/i,
            );
            if (filenameStarMatch?.[1]) {
              downloadedFileName = decodeURIComponent(filenameStarMatch[1]);
            } else {
              // Fallback to regular 'filename='
              const filenameMatch =
                contentDisposition.match(/filename="?([^"]+)"?/i);
              if (filenameMatch?.[1]) {
                downloadedFileName = filenameMatch[1];
              }
            }

           
          }
         
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", downloadedFileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error("Invalid response");
        }
      } else {
        // Return JSON data
        const response = await client.get(endpoint, { base: "apiBaseUrl" });
        if ("data" in response) {
          return response.data?.data?.items as any[];
        } else {
          throw new Error(response?.message);
        }
      }
    } catch (error) {
      throw error;
    }
  },
};

export const uploadFileData = {
  async uploadFile(zipFile: File, batch_id: number): Promise<any> {
    try {
      const endpoint = `/data_ingestion/datasets/upload`;
      const response: any = await client.post(
        endpoint,
        { file: zipFile, batch_id: batch_id },
        {
          base: "apiBaseUrl",
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response ?? null;
    } catch (err) {
      throw err;
    }
  },
  async NewuploadFile(
    zipFile: File,
    batch_name: string,
    customerId: number,
    budget_per_qty: number,
  ): Promise<any> {
    try {
      const endpoint = `/data_ingestion/datasets/new_upload`;
      const response: any = await client.post(
        endpoint,
        {
          file: zipFile,
          batch_name: batch_name,
          customer_id: customerId,
          budget_per_qty: budget_per_qty,
        },
        {
          base: "apiBaseUrl",
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response ?? null;
    } catch (err) {
      throw err;
    }
  },
};

export const dataSet = {
  async getList(
    page: number = 1,
    size: number = 10,
    batch_name = "",
    filter_customer = "",
    name = "",
    upload_id = "",
    status = "",
    uploaded_by = "",
    uploaded_date = null,
    dqs = 0,
    sort_by = "",
    sort_order = "",
  ): Promise<any> {
    try {
      const params: any = {
        page,
        limit: size,
      };
      const formattedUploadAt = uploaded_date
        ? `${uploaded_date.getFullYear()}-${String(uploaded_date.getMonth() + 1).padStart(2, "0")}-${String(uploaded_date.getDate()).padStart(2, "0")}`
        : "";

      if (batch_name) params.batch_name = batch_name;
      if (filter_customer) params.customer_name = filter_customer;
      if (name) params.name = name;
      if (upload_id) params.upload_id = upload_id;
      if (status && status !== "all") params.status = status;
      if (uploaded_by) params.uploaded_by = uploaded_by;
      if (uploaded_date) params.uploaded_date = formattedUploadAt;
      if (dqs && dqs !== 0) params.dqs = dqs;
      if (sort_by) params.sort_by = sort_by;
      if (sort_order) params.sort_order = sort_order;

      const response: any = await client.get(`/data_ingestion/datasets/`, {
        base: "apiBaseUrl",
        params,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getDetail(
    id = "",
    page: number = 1,
    size: number = 10,
    error_type = "",
    severity = "",
    field_name = "",
    field_value = "",
    row_number = 0,
    suggested_fix = "",
    sort_by = "",
    sort_order = "",
  ): Promise<any> {
    try {
      const params: any = {
        page: page,
        size: size,
      };
      if (error_type && error_type != "all") params.error_type = error_type;
      if (severity && severity != "all") params.severity = severity;
      if (field_name) params.field_name = field_name;
      if (field_value) params.field_value = field_value;
      if (row_number > 0) params.row_number = row_number;
      if (suggested_fix) params.suggested_fix = suggested_fix;
      if (sort_by) params.sort_by = sort_by;
      if (sort_order) params.sort_order = sort_order;
      const response: any = await client.get(`/data_ingestion/datasets/${id}`, {
        base: "apiBaseUrl",
        params,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getNewDetail(upload_id = ""): Promise<any> {
    try {
      const response: any = await client.get(
        `/data_ingestion/datasets/uploads/${upload_id}`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async triggerAirFlow(upload_id = "0", customer_id = "0"): Promise<any> {
    try {
      const response: any = await client.post(
        `/data_ingestion/datasets/trigger-airflow?dataset_id=${upload_id}&customer_id=${customer_id}`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save data");
    }
  },
  async retryUpload(dataset_id = "", customer_id = ""): Promise<any> {
    try {
      const response: any = await client.post(
        `/data_ingestion/datasets/trigger-retry_logic?dataset_id=${dataset_id}&customer_id=${customer_id}`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save data");
    }
  },
  async saveBatchName(batch_name = "", customerId = 0): Promise<any> {
    try {
      const request = {
        name: batch_name,
        customer_id: customerId,
      };
      const response: any = await client.post(
        `data_ingestion/batches/create`,
        request,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save data");
    }
  },
  async getBatchlist(
    batch_id = "",
    page: number = 1,
    size: number = 10,
  ): Promise<any> {
    try {
      const params: any = {
        page: page,
        limit: size,
      };
      const response: any = await client.get(
        `data_ingestion/batches/${batch_id}`,
        { base: "apiBaseUrl", params },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to save data");
    }
  },
  async getErrorOptions(): Promise<any> {
    try {
      const response: any = await client.get(
        `/data_ingestion/datasets/validation-error-types/dropdown`,
        { base: "apiBaseUrl" },
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },

  // airflow/event
  async triggerAirFlowEvent(
    dataset_id: number,
    processing_status: string,
  ): Promise<any> {
    try {
      const payload = {
        dataset_id,
        processing_status,
      };
      const response: any = await client.post(`/airflow/event`, payload, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to trigger airflow event",
      );
    }
  },
async getBatchNameExists(batch_name = ""): Promise<any> {
  try {
    const response: any = await client.get(
      `data_ingestion/datasets/validate_batch_name`,
      {
        params: { batch_name },
        base: "apiBaseUrl",
      }
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to validate batch name"
    );
  }
}
};
