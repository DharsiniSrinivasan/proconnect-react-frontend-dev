import { ReactNode, useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { DecisionAssistant } from "@/components/ai/DecisionAssistant";
import { DecisionContextChip } from "@/mocks/decisionAssistant.mock";

interface DecisionAssistantContextValue {
  openDecisionAssistant: () => void;
}

const DecisionAssistantContext =
  createContext<DecisionAssistantContextValue | null>(null);

export const useDecisionAssistant = () => {
  const context = useContext(DecisionAssistantContext);
  if (!context) {
    throw new Error("useDecisionAssistant must be used within AppShell");
  }
  return context;
};

interface AppShellProps {
  children: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  lastUpdated?: string;
  contextChips?: DecisionContextChip[];
}

export const AppShell = ({
  children,
  pageTitle = "D2R Network",
  pageSubtitle,
  lastUpdated,
}: AppShellProps) => {
  const [isDecisionAssistantOpen, setIsDecisionAssistantOpen] = useState(false);

  const openDecisionAssistant = () => setIsDecisionAssistantOpen(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DecisionAssistantContext.Provider value={{ openDecisionAssistant }}>
      <div className="flex h-screen w-full bg-background animated-gradient">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <PageTopBar
            title={pageTitle}
            subtitle={pageSubtitle}
            lastUpdated={lastUpdated}
            onMenuToggle={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto space-y-6">{children}</div>
          </main>
        </div>

        {/* Decision Assistant Drawer */}
        <DecisionAssistant
          isOpen={isDecisionAssistantOpen}
          onClose={() => setIsDecisionAssistantOpen(false)}
        />
      </div>
    </DecisionAssistantContext.Provider>
  );
};
