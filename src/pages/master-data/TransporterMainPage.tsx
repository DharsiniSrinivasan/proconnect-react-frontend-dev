import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Contact, CreditCard, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartnerMasterPage from "./PartnerMasterPage";
import { useNavigate, useParams } from "react-router-dom";
import Contractor from "./ContractorMasterPage";
import RateCardsPage from "./RateCardsPage";

const TranporterMainPage = () => {
  const { tab } = useParams<{ tab: string }>(); // get :tab from route
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("transporters");
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      // default tab
      setActiveTab("transporters");
      navigate("/master-data/page/transporters", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/master-data/page/${value}`);
  };

  return (
    <AppShell
      pageTitle={
        activeTab === "transporters"
          ? "Transporter Master"
          : activeTab === "contractors"
            ? "Contractor Master"
            : "Rate Card Master"
      }
      lastUpdated="5 minutes ago"
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
      <TabsList  className="bg-card border border-border mb-4 sm:mb-6 flex-wrap sm:flex-nowrap w-full sm:w-auto">
  
  <TabsTrigger
    value="transporters"
    className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <Truck className="h-4 w-4" />
    <span >Transporters</span>
   
  </TabsTrigger>

  <TabsTrigger
    value="contractors"
    className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <Contact className="h-4 w-4" />
    <span>Contractors</span>
    
  </TabsTrigger>

  <TabsTrigger
    value="ratecards"
    className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <CreditCard className="h-4 w-4" />
    <span>Rate Cards</span>
    
  </TabsTrigger>

</TabsList>

        <TabsContent value="transporters" className="mt-0">
          <PartnerMasterPage />
        </TabsContent>

        <TabsContent value="contractors" className="mt-0">
          <Contractor />
        </TabsContent>

        <TabsContent value="ratecards" className="mt-0">
          <RateCardsPage />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
};

export default TranporterMainPage;
