import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

import {
  decisionAssistantMock,
  DecisionMessage,
} from "@/mocks/decisionAssistant.mock";
import { useChatStore } from "@/stores/aiChatStore";
import { chatService } from "@/services/aiChatService";
import { getStorage } from "@/utils/storage";
import { toast } from "sonner";
import { ConfirmationDialog } from "../confirmationDialog";
import { useLocation, useParams } from "react-router-dom";

interface DecisionAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionAssistant = ({
  isOpen,
  onClose,
}: DecisionAssistantProps) => {
  const { tab, customerType } = useParams();
  const location = useLocation();
  const { datasetType } = location.state || {};

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const storage = getStorage();
  const { getChatList, chatRecords } = useChatStore();
  const [messages, setMessages] = useState<DecisionMessage[]>([]);
  const MAX_HEIGHT = 160;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [inputValue]);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageContent = inputValue.trim();

    // Add user message locally
    const userMessage: DecisionMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get and validate dataset ID
      const datasetIdRaw = storage.getItem("datasetId");
      if (!datasetIdRaw) {
        throw new Error("Data not found");
      }

      let datasetId;
      try {
        datasetId = JSON.parse(datasetIdRaw);
      } catch {
        datasetId = datasetIdRaw;
      }

      const pathParts = location.pathname.split("/");
      const currentTab = tab || (pathParts[1]);

      let dashboard_type =
        customerType === "External" || datasetType === "External"
          ? ["strategic", "recommendation"]
          : [currentTab === "recommendations" || datasetType ? "recommendation" : currentTab]; // normalize

      const response: any = await chatService.sendMessage(messageContent, {
        dataset_id: datasetId,
        customer_id: Number(storage.getItem("customer_id")),
        dashboard_type,
      });
      // Add assistant reply from API
      const assistantMessage: DecisionMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response?.message?.content || "No response received.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update sessionId in store
      if (response?.session_id) {
        useChatStore.setState({ sessionId: response.session_id });
      }

      const datasetIdForList = storage.getItem("datasetId");
      if (datasetIdForList != null) {
        getChatList(datasetIdForList);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: DecisionMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: error?.message || "Failed to get response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const allowedPaths = [
      "/list/recommendations/",
      "/forecast",
      "/data/datasets/dashboard",
    ];

    const isAllowed = allowedPaths.some((path) =>
      location.pathname.startsWith(path),
    );

    if (!isAllowed) {
      return; // Skip effect on other pages
    }

    const datasetId = storage.getItem("datasetId");
    if (!datasetId || datasetId === "null" || datasetId === "undefined") {
      return;
    }
    getChatList(datasetId);

  }, [getChatList, location.pathname]);

  const handleClearChat = async () => {
    try {
      const datasetId = storage.getItem("datasetId");
      if (!datasetId) {
        console.warn("No data found for clearing chat");
        return;
      }

      const res = await chatService.clearChat(datasetId);
      if (res?.status === "success") {
        getChatList(datasetId);
        setMessages(decisionAssistantMock.messages);
        toast.success("Chat cleared successfully");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  useEffect(() => {
    if (!Array.isArray(chatRecords)) return;

    if (chatRecords.length === 0) {
      setMessages(decisionAssistantMock.messages);
      return;
    }

    const formattedMessages = chatRecords
      .filter((msg) => msg?.id && msg?.role && msg?.content !== undefined)
      .map((msg) => ({
        id: `msg-${msg.id}`,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
      }));

    setMessages(formattedMessages);
  }, [chatRecords]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage();
      }
    }
  };

const formatTime = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  });
};

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
      />

      {/* Drawer */}
      {/* <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full bg-background/60 w-[480px] flex flex-col transition-transform duration-300 ease-out",
          "bg-gradient-to-b from-card/95 to-background/98 backdrop-blur-xl",
          "border-l-2 border-primary/40 shadow-[-8px_0_40px_hsl(var(--primary)/0.15)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      > */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full flex flex-col transition-transform duration-300 ease-out bg-background/60",
          "bg-gradient-to-b from-card/95 to-background/98 backdrop-blur-xl border-l-2 border-primary/40 shadow-[-8px_0_40px_hsl(var(--primary)/0.15)]",
          // Responsive width
          "w-full sm:w-[480px] md:w-[480px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Decision Assistant
              </h2>
              <p className="text-xs text-muted-foreground">
                Grounded in D2R analytics
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <ConfirmationDialog
              title="Clear Chat History"
              description="Are you sure you want to clear this chat history?"
              confirmText="Yes"
              onConfirm={async () => {
                handleClearChat();
                return true;
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                title="Clear Chat"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </ConfirmationDialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 items-end",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/20 text-foreground shadow-lg shadow-primary/5"
                    : "bg-muted/60 border border-border/30 text-foreground",
                )}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="my-1">{children}</p>,
                    ul: ({ children }) => <ul className="my-2">{children}</ul>,
                    li: ({ children }) => <li className="my-1">{children}</li>,
                  }}
                >
                  {message.content || ""}
                </ReactMarkdown>

              </div>

              {/* Timestamp */}
              {message.timestamp && (
                <span className="text-[10px] text-muted-foreground self-end">
                  {formatTime(message.timestamp)}
                </span>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/20">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/30">
          <div className="flex gap-2 items-end">
            {/* <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your network data..."
              rows={1}
              className="flex-1 resize-none px-4 py-3 rounded-xl bg-muted/30 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            /> */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your network data..."
              rows={1}
              className="flex-1 resize-none px-4 py-3 rounded-xl 
             bg-muted/30 border border-border/40 text-sm 
             text-foreground placeholder:text-muted-foreground 
             focus:outline-none focus:border-primary/50 
             focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 w-11 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
