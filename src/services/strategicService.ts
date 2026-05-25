import client from "@/interceptor/client";

export const strategic = {
  async getStrategic(id: string | number): Promise<any> {
    try {
      const response: any = await client.get(
        `/dataset_dashboard/dataset_strategic_dashboard/${id}`,
        {
          base: "apiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch data");
    }
  },
  async exportStrategic(id: string | number): Promise<void> {
    const response: any = await client.get(
      `/dataset_dashboard/dataset_strategic_dashboard/export/${id}`,
      {
        base: "apiBaseUrl",
        responseType: "blob",
      },
    );

    const disposition = response.headers?.["content-disposition"];
    let fileName = `strategic_dataset_dashboard_${id}.xlsx`;

    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
