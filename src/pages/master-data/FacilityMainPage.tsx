import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Building, Handshake } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaseMasterPage from "./LeaseMasterPage";
import FacilityMasterPage from "./FacilityMasterPage";

const FacilityMainPage = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/master-data/tab/${value}`);
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      // default tab
      setActiveTab("facility");
    }
  }, [tab, navigate]);
  return (
    <AppShell
      pageTitle={
        activeTab === "facility" ? "Facility Master" : "Agreement Master"
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card border border-border mb-6">
          <TabsTrigger
            value="facility"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building className="w-4 h-4" />
            Facility
          </TabsTrigger>
          <TabsTrigger
            value="agreement"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Handshake className="h-4 w-4" />
            Agreement
          </TabsTrigger>
        </TabsList>
        <TabsContent value="facility" className="mt-0">
          <FacilityMasterPage />
        </TabsContent>
        <TabsContent value="agreement" className="mt-0">
          <LeaseMasterPage />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
};

export default FacilityMainPage;
