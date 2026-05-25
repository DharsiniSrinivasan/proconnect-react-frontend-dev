import client from "@/interceptor/client";

export interface ContextChip {
  label: string;
  value: string;
}

export interface ChatContext {
  dataset_id?: number;
  customer_id?: number;
  dashboard_type?: any;
}

export interface ChatMessagePayload {
  dataset_id: number;
  messages: { role: string | "assistant"; content: string }[];
  dashboard_type?: any;
  customer_id?: number;
}

export const chatService = {
  async sendMessage(
    message: string,
    context: ChatContext = {},
  ): Promise<{ reply: string; session_id?: string }> {
    const payload: ChatMessagePayload = {
      dataset_id: context.dataset_id,
      messages: [{ role: "user", content: message }],
      dashboard_type: context.dashboard_type,
      customer_id: context?.customer_id,
    };

    try {
      const response: any = await client.post(
        "decision_assistant/chat",
        payload,
        {
          base: "aiBaseUrl",
        },
      );
      // assuming API returns { reply: string, session_id: string }
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to send message",
      );
    }
  },
  async getChatList(id: any): Promise<any> {
    try {
      const response: any = await client.get(
        `decision_assistant/history/${id}`,
        {
          base: "aiBaseUrl",
        },
      );
      return response?.data?.data?.messages;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async clearChat(id: any): Promise<any> {
    try {
      const response: any = await client.get(
        `decision_assistant/clear_chat_history/${id}`,
        {
          base: "aiBaseUrl",
        },
      );

      return response?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch");
    }
  },
  async preCommute(request: any): Promise<any> {
    try {
      const response: any = await client.post(
        "recommendation/precompute",
        request,
        {
          base: "aiBaseUrl",
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed");
    }
  },
  //
};
