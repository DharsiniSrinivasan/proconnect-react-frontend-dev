import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import config from "../config/axiosConfig";
import { toast } from "sonner";
import { logout } from "@/utils/authUtils";
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
function getStorage(): Storage {
  return JSON.parse(localStorage.getItem("keepMeSignedIn") || "false") === true
    ? localStorage
    : sessionStorage;
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create();

// Request Interceptor: Inject Authorization header
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (accessToken) {
      request.headers = request.headers || new AxiosHeaders();
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error: any) =>
    Promise.reject(
      error instanceof Error ? error : new Error("Request interceptor error"),
    ),
);

// Response Interceptor: Handle token refresh
axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const message = error?.response?.data?.message?.toLowerCase();

    // Handle blob error FIRST
    if (error?.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const parsed = JSON.parse(text);
        toast.error(parsed?.message || "Download failed");
      } catch {
        toast.error("Failed to download error file");
      }

      return Promise.reject(error); // (prevents duplicate toast)
    }

    if (
      message !== "invalid authentication token" &&
      message !== "invalid token"
    ) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred"
      );
    }

    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error?.response?.data?.message !== "Invalid credentials"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refresh_token") ||
          sessionStorage.getItem("refresh_token");
        if (!refreshToken) {
          logout("Session expired. Please login again.");
          return Promise.reject(error);
        }
        const storage = getStorage();
        const refreshResponse: any = await axios.post<RefreshTokenResponse>(
          `${config.apiBaseUrl}auth/refresh-token`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        storage.setItem("access_token", refreshResponse?.data?.access_token);
        storage.setItem("refresh_token", refreshResponse?.data?.refresh_token);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${refreshResponse?.data?.access_token}`,
        };

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error("Failed to refresh access token"),
        );
      }
    }

    return Promise.reject(error);
  },
);

// Main client function
export async function client(
  url: string,
  {
    body,
    method = "GET",
    contentType = "application/json",
    base = "apiBaseUrl",
    ...customConfig
  }: {
    body?: any;
    method?: string;
    contentType?: string;
    base?: keyof typeof config;
    [key: string]: any;
  } = {},
): Promise<
  AxiosResponse | { status?: number; message?: string; error?: string }
> {
  if (typeof url !== "string") {
    return Promise.reject(new TypeError("Invalid URL: must be a string"));
  }

  const baseURL = config[base];
  if (!baseURL) {
    return Promise.reject(
      new Error(`Base URL for key "${base}" is not defined`),
    );
  }

  const fullURL = url.startsWith("http")
    ? url
    : `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    ...customConfig.headers,
  };

  if (body instanceof FormData) {
    delete headers["Content-Type"]; // Let the browser set it
  }

  const axiosConfig: AxiosRequestConfig = {
    url: fullURL,
    method,
    headers,
    data: method === "GET" ? undefined : body,
    ...customConfig,
  };

  try {
    const response = await axiosInstance(axiosConfig);
    return response;
  } catch (err: any) {
    return {
      status: err?.response?.status,
      message: err?.message,
      error: err?.response?.data?.message || err?.response?.data?.error,
    };
  }
}

// Shortcuts for HTTP methods
client.get = function (
  url: string,
  {
    base = "apiBaseUrl",
    ...customConfig
  }: { base?: keyof typeof config;[key: string]: any } = {},
) {
  return client(url, { ...customConfig, method: "GET", base });
};

client.post = function (
  url: string,
  body: any,
  {
    base = "apiBaseUrl",
    ...customConfig
  }: { base?: keyof typeof config;[key: string]: any } = {},
) {
  return client(url, { ...customConfig, method: "POST", body, base });
};

client.put = function (
  url: string,
  body: any,
  {
    base = "apiBaseUrl",
    ...customConfig
  }: { base?: keyof typeof config;[key: string]: any } = {},
) {
  return client(url, { ...customConfig, method: "PUT", body, base });
};

client.delete = function (
  url: string,
  {
    base = "apiBaseUrl",
    ...customConfig
  }: { base?: keyof typeof config;[key: string]: any } = {},
) {
  return client(url, { ...customConfig, method: "DELETE", base });
};

export default client;
