import client from "@/interceptor/client";
import { FacilitySaveRequest, SaveRequest } from "@/types";

export const uploadFileData = {
  async uploadFile(
    zipFile: File,
    screen = "",
    assigned_to?: number,
  ): Promise<any> {
    try {
      let endpoint = ``;
      if (screen === "Transporter") {
        endpoint = `/master_data/partners/import`;
      } else if (screen === "Customer") {
        endpoint = `/master_data/customers/import`;
      } else if (screen === "Facility") {
        endpoint = `/master_data/facilities/import`;
      } else if (screen === "RateCard") {
        endpoint = `/master_data/rate-cards/import`;
      } else if (screen === "contract") {
        endpoint = `partner-contracts/import`;
      } else if (screen === "agreeement") {
        endpoint = `data_ingestion/facility-agreements/import`;
      }

      const formData = new FormData();
      formData.append("file ", zipFile);
      if (assigned_to) {
        endpoint += `?assigned_to=${assigned_to}`;
      }

      const response: any = await client.post(
        endpoint,
        { file: zipFile },
        {
          base: "apiBaseUrl",
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response?.data ?? null;
    } catch (err) {
      throw err;
    }
  },
};

export const masterData = {
  async getDownload(
    downloadXlsx = false,
    screen = "",
    fileName: string,
  ): Promise<any[] | void> {
    try {

      let endpoint = ``;
      if (screen === "Transporter") {
        endpoint = `/master_data/partners/download-excel`;
      }
      if (screen === "Customer") {
        endpoint = `/master_data/customers/download-excel`;
      }
      if (screen === "Facility") {
        endpoint = `/master_data/facilities/download-excel`;
      }
      if (screen === "RateCard") {
        endpoint = `/master_data/rate-cards/download-excel`;
      }
      if (screen === "contractors") {
        endpoint = `/partner-contracts/download-excel`;
      }
      if (screen === "agreeement") {
        endpoint = `data_ingestion/facility-agreements/download-excel`;
      }
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
          let downloadedFileName = fileName;

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
  async exportFile(
    downloadXlsx = false,
    screen = "",
    fileName,
    params: Record<string, any> = {},
  ): Promise<any[] | void> {
    try {
      const cleanParams = (params: Record<string, any>) =>
        Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) =>
              value !== undefined &&
              value !== null &&
              value !== "" &&
              !(Array.isArray(value) && value.length === 0),
          ),
        );
      const filteredParams = cleanParams(params);
      let endpoint = ``;
      if (screen === "Transporter") {
        endpoint = `/master_data/partners/export`;
      }
      if (screen === "Customer") {
        endpoint = `/master_data/customers/export`;
      }
      if (screen === "Facility") {
        endpoint = `/master_data/facilities/export`;
      }
      if (screen === "RateCard") {
        endpoint = `/master_data/rate-cards/export`;
      }
      if (screen == "contract") {
        endpoint = `/partner-contracts/export`;
      }
      if (screen == "agreeement") {
        endpoint = `data_ingestion/facility-agreements/export`;
      }
      if (downloadXlsx) {
        // Request Excel file as Blob
        const response = await client.get(endpoint, {
          base: "apiBaseUrl",
          ...(Object.keys(filteredParams).length > 0 && {
            params: filteredParams,
          }),
          responseType: "blob",
        });

        if ("data" in response) {
          // Create a download link for the file
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const contentDisposition = response.headers?.["content-disposition"];
        
          let downloadedFileName = fileName;

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
  async getTilesList(page: number = 1, size: number = 10): Promise<any> {
    try {
      const response: any = await client.get(
        `/master_data/tiles?page=${page}&size=${size}`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async updateApprovalStatus(request: any, type: string): Promise<any> {
    try {
      let url;
      if (type === "transporters") {
        url = "master_data/partners/approval";
      } else if (type === "facilities") {
        url = "master_data/facilities/approval";
      } else if (type === "rate-cards") {
        url = "master_data/rate-cards/approval";
      } else if (type === "partner_contractor") {
        url = "partner-contracts/approval";
      } else if (type === "facility_agreement") {
        url = "data_ingestion/facility-agreements/approval";
      }
      const response: any = await client.put(url, request, {
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async statusChange(payload: any): Promise<any> {
      try {
        const response: any = await client.put(
          `/master_data/facilities/status-change-request`,
          payload,
          {
            base: "apiBaseUrl",
          },
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || "Failed",
        );
      }
    },
  async getStatusList(): Promise<any> {
    try {
      const response: any = await client.get(
        `/master_data/customers/customer_status`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getRegionList(): Promise<any> {
    try {
      const response: any = await client.get(
        `/master_data/customers/customer_region`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getFacilityStatusList(): Promise<any> {
    try {
      const response: any = await client.get(
        `/master_data/facilities/facility_statuses`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getTiersList(): Promise<any> {
    try {
      const response: any = await client.get(
        `/master_data/facilities/facility-tier-types`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getGeographyList(
    page: number = 1,
    size: number = 10,
    search: string = "",
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size,
      };
      if (search && search !== "") {
        params.pincode = search;
      }
      const response: any = await client.get("/master_data/geography/", {
        params,
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getCustomerDropDown(): Promise<any> {
    try {
      const response: any = await client.get(
        "/master_data/customers/customer_list_dropdown",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getCategoryDropDown(): Promise<any> {
    try {
      const response: any = await client.get(
        "/master_data/facilities/facility_category",
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async getCustomerList(
    page: number = 1,
    size: number = 10,
    search: string = "",
    status: string = "",
    region: string = "",
    filter_name: string = "",
    filter_gstin: string = "",
    filter_billing_address: string = "",
    filter_shipping_address: string = "",
    sort_by: string = "",
    sort_order: string = "",
    dateFilter = null,
    filter_vendor: string = "",
    filter_shipping_pincode: string = "",
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size,
      };
      if (search && search !== "") {
        params.search = search;
      }
      if (status && status !== "" && status != "all") {
        params.status = status;
      }
      if (region && region !== "" && region !== "all") {
        params.region = region;
      }
      if (filter_name) {
        params.filter_name = filter_name;
      }
      if (filter_vendor) {
        params.filter_vendor_code = filter_vendor;
      }
      if (filter_shipping_pincode) {
        params.filter_shipping_pincode = filter_shipping_pincode;
      }

      if (filter_gstin) {
        params.filter_gstin = filter_gstin;
      }

      if (filter_billing_address) {
        params.filter_billing_address = filter_billing_address;
      }

      if (filter_shipping_address) {
        params.filter_shipping_address = filter_shipping_address;
      }

      if (sort_by) {
        params.sort_by = sort_by;
      }

      if (sort_order) {
        params.sort_order = sort_order;
      }
      const formattedUploadAt = dateFilter
        ? `${dateFilter.getFullYear()}-${String(dateFilter.getMonth() + 1).padStart(2, "0")}-${String(dateFilter.getDate()).padStart(2, "0")}`
        : "";
      if (dateFilter) {
        params.filter_last_updated = formattedUploadAt;
      }
      const response: any = await client.get("/master_data/customers/", {
        params,
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async saveCustomer(request: SaveRequest): Promise<any> {
    try {
      const response: any = await client.post(
        "/master_data/customers",
        request,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },

  async updateCustomer(
    request: SaveRequest,
    id: string | number,
  ): Promise<any> {
    try {
      const response: any = await client.put(
        `/master_data/customers/${id}`,
        request,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update data",
      );
    }
  },
  async deleteCustomer(id: string | number): Promise<any> {
    try {
      const response: any = await client.delete(
        `/master_data/customers/delete/${id}/`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to delete data",
      );
    }
  },
  async getFacilityList(
    page: number = 1,
    size: number = 10,
    search: string = "",
    status: string = "",
    tiers: string = "",
    filter_name: string = "",
    filter_region: string = "",
    capacity: number = 0,
    fixed_cost: number = 0,
    sort_by: string = "",
    sort_order: string = "",
    filter_customer: string = "",
    filter_assigned_status?: string,
    filter_assigneeId?: number,
    filter_requestedId?: number,
    filter_reason?: string,
    filter_assignee_name?: string,
    filter_last_action?: string,
    filter_request_name?: string,
    filter_facility_code?: string,
  ): Promise<any> {
    try {
      const params: any = {
        page: page + 1,
        size: size,
      };
      if (status && status !== "all") {
        params.status_filter = status;
      }
      if (tiers && tiers !== "all") {
        params.tier = tiers;
      }
      if (search && search !== "") {
        params.search = search;
      }
      if (filter_name) {
        params.filter_name = filter_name;
      }
      if (filter_customer) {
        params.filter_customer_name = filter_customer;
      }
      if (filter_facility_code) {
        params.filter_facility_code = filter_facility_code;
      }

      if (filter_region) {
        params.filter_region = filter_region;
      }

      if (capacity > 0) {
        params.capacity = capacity;
      }

      if (fixed_cost > 0) {
        params.fixed_cost = fixed_cost;
      }

      if (sort_by) {
        params.sort_by = sort_by;
      }

      if (sort_order) {
        params.sort_order = sort_order;
      }
      if (filter_assigned_status && filter_assigned_status !== "all") {
        params.assigned_status = filter_assigned_status;
      }

      if (filter_assigneeId) {
        params.assigned_to = filter_assigneeId;
      }

      if (filter_requestedId) {
        params.requested_by = filter_requestedId;
      }

      if (filter_reason) {
        params.rejection_reason = filter_reason;
      }

      if (filter_assignee_name) {
        params.filter_assigned_to_name = filter_assignee_name;
      }
      if (filter_request_name) {
        params.filter_requested_by_name = filter_request_name;
      }

      if (filter_last_action) {
        params.filter_last_action = filter_last_action;
      }

      const response: any = await client.get("/master_data/facilities/", {
        params,
        base: "apiBaseUrl",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async saveFacility(request: FacilitySaveRequest): Promise<any> {
    try {
      const response: any = await client.post(
        "/master_data/facilities/",
        request,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async updateFacility(
    request: FacilitySaveRequest,
    id: string | number,
  ): Promise<any> {
    try {
      const response: any = await client.put(
        `/master_data/facilities/${id}`,
        request,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to update data",
      );
    }
  },
  async deleteFacility(id: string | number): Promise<any> {
    try {
      const response: any = await client.delete(
        `/master_data/facilities/${id}`,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to delete data",
      );
    }
  },
    async customerStatuschange(
    request: any,
  ): Promise<any> {
    try {
      const response: any = await client.put(
        `master_data/customers/customers/status`,
        request,
        { base: "apiBaseUrl" },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed",
      );
    }
  },
};
