import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Truck } from "lucide-react";
import { DeliveryLocationTable } from "@/components/master-data/DeliveryLocationTable";
import { ModeChip } from "@/components/master-data/MasterStatusChip";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OdaTable from "@/components/master-data/OdaTable";
import { useEffect, useState } from "react";
import TransporterRelatedRateCard from "@/components/master-data/TransporterRelatedRateCard.";
import { usePartnerStore } from "@/stores/partnerStore";
import TransporterAgainstContract from "./TransporterAgainstContract";

const PartnersRateDetails = () => {
  const navigate = useNavigate();
  const { fetchPartnerById } = usePartnerStore();
  const [editingPartner, setEditingPartner] = useState<any | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchPartnerById(id).then((res) => {
        setEditingPartner(res);
      });
    }
  }, [id, fetchPartnerById]);
  const transporterInfo = editingPartner || "";

  return (
    <AppShell pageTitle="Transporter Details" lastUpdated="5 minutes ago">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      {/* Transporter Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="h-5 w-5 text-primary" />
            Transporter Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Name */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-semibold text-foreground">
                {transporterInfo?.name || "-"}
              </p>
            </div>

            {/* Code */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Code</p>
              <p className="text-foreground">{transporterInfo?.code || "-"}</p>
            </div>

            {/* Contact Email */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Contact Email
              </p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />

                <span className="text-foreground line-clamp-2 break-all">
                  {transporterInfo?.contact_email || "-"}
                </span>
              </div>
            </div>

            {/* Customer Type */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Customer Type
              </p>
              <p className="text-foreground">
                {transporterInfo?.customer_type || "-"}
              </p>
            </div>

            {/* OTIF Percent */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">OTIF %</p>
              <p className="text-foreground">
                {(transporterInfo?.otif_percent ?? "-") +
                  (transporterInfo?.otif_percent != null ? "%" : "")}
              </p>
            </div>

            {/* Transport Modes */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Transport Modes
              </p>
              <div className="flex flex-wrap gap-2">
                {transporterInfo?.transport_mode?.map((mode: any) => (
                  <ModeChip key={mode} mode={mode} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Card Tabs */}
      <Tabs defaultValue="contract" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
          <TabsTrigger value="contract">Contractor</TabsTrigger>
          <TabsTrigger value="direct">Direct</TabsTrigger>
          <TabsTrigger value="oda">ODA</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="contract">
          <TransporterAgainstContract />
        </TabsContent>
        <TabsContent value="direct">
          <DeliveryLocationTable />

          {/* <GroupedDeliveryTable/> */}
        </TabsContent>

        <TabsContent value="oda">
          <OdaTable />
        </TabsContent>

        <TabsContent value="all">
          <TransporterRelatedRateCard />
          {/* <RateCardsTable /> */}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
};

export default PartnersRateDetails;
