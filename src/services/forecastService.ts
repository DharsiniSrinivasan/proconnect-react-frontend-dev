import client from "@/interceptor/client";
export const forecast = {
  async getforecastDetails(id: any): Promise<any> {
    try {
      const response: any = await client.get(
        `forecast/forecast_dashboard/${id}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response?.data?.data?.payload;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch ");
    }
  },
  async exportForecast(id: string | number): Promise<void> {
    const response: any = await client.get(
      `/forecast/forecast_dashboard/${id}/export`,
      {
        base: "apiBaseUrl",
        responseType: "blob",
      },
    );

    const disposition = response.headers?.["content-disposition"];
    let fileName = `forecast_dashboard_${id}.xlsx`;

    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

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
    link.download = downloadedFileName;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
