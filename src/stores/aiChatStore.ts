import { chatService } from "@/services/aiChatService";
import { create } from "zustand";

// Types
export interface ContextChip {
  label: string;
  value: string;
}

export interface ChatContext {
  dataset_id?: number;
  context_chips?: ContextChip[];
  session_id?: string;
}
interface ChatRecord {
  id: number;
  role: "assistant" | "user";
  content: string;
  created_at: string;
}
interface ChatMessageApi {
  id: number;
  role: "assistant" | "user";
  content: string;
  created_at: string;
  metadata?: {
    intent?: string;
    current_topic?: string | null;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AIChatState {
  messages: ChatMessage[];
  chatRecords: any[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  getChatList: (id: any) => Promise<void>;
  sendMessage: (message: string, contextChips?: ContextChip[]) => Promise<void>;
  resetChat: () => void;
}

// Store
export const useChatStore = create<AIChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
  chatRecords: [],
  sendMessage: async (message: string, contextChips: ContextChip[] = []) => {
    const { messages, sessionId } = get();
    set({ isLoading: true, error: null });

    try {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      set({ messages: [...messages, userMessage] });

      // Prepare context
      const context: ChatContext = {
        context_chips: contextChips,
        session_id: sessionId || undefined,
      };

      // Send to API
      const response = await chatService.sendMessage(message, context);

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response.reply || "",
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        sessionId: response.session_id || state.sessionId,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error?.message || "Failed to send message",
        isLoading: false,
      });
    }
  },
  getChatList: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await chatService.getChatList(id);
      set({ chatRecords: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await chatService.getChatList(id);
      set({ chatRecords: data || [] });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch" });
    } finally {
      set({ isLoading: false });
    }
  },
  resetChat: () => {
    set({
      messages: [],
      chatRecords: [],
      isLoading: false,
      error: null,
      sessionId: null,
    });
  },
}));
