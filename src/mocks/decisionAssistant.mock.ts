export interface DecisionContextChip {
  label: string;
  value: string;
}

export interface DecisionMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface DecisionAssistantMock {
  messages: DecisionMessage[];
  suggestedQuestions: string[];
  contexts: DecisionContextChip[];
}

export const decisionAssistantMock: DecisionAssistantMock = {
  messages: [
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Hello! I'm your D2R Decision Assistant. I can help you analyze network performance, identify optimization opportunities, and provide data-driven recommendations. What would you like to explore?",
      timestamp: new Date(Date.now() - 60000),
    },
  ],
  suggestedQuestions: [
    "What are today's top SLA risks?",
    "Show me underutilized facilities",
    "Which lanes need capacity?",
    "Summarize cost trends",
    "Top partner performance issues",
  ],
  contexts: [
    { label: "Dataset", value: "Q4 2025 – Live Operations" },
    { label: "View", value: "All Regions" },
  ],
};
