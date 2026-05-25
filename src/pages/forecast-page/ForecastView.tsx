import { AppShell } from "@/components/layout/AppShell";
import { ForecastCentreEmbed } from "@/components/dashboard/forecast/ForecastCentreEmbed";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ForecastView = () => {
  const navigate = useNavigate();
  const id = useParams();

  return (
    <AppShell
      pageTitle="Forecast Insights"
      pageSubtitle="Trends & Predictive Insights"
    >
      <Button variant="ghost" onClick={() => navigate("/forecast-list")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to List
      </Button>
      {/* <div className="relative flex-1 min-w-[200px] max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                      
                        
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div> */}

      <div className="p-6 space-y-6">
        <header>
          <p className="text-sm text-muted-foreground">
            Demand, cost, TAT, and capacity projections
          </p>
        </header>

        <ForecastCentreEmbed id={id?.uploadId} />
      </div>
    </AppShell>
  );
};
export default ForecastView;
