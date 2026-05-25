import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Handshake,
  CreditCard,
  Eye,
  Plus,
  ClipboardCheck,
  Hourglass,
  HardHat,
  Building2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MasterOverviewItem } from "@/mocks/masterData.mock";

interface MasterHomeTilesProps {
  tiles: MasterOverviewItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Package,
  Handshake,
  CreditCard,
  HardHat,
  Building2,
  FileText,
};
export const MasterHomeTiles = ({ tiles }: MasterHomeTilesProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles?.map((tile) => {
          const IconComponent = iconMap[tile.icon] || Package;
          const id = tile.id?.toLowerCase();
          const isCustomerTile = id === "customers";

          const showAddButton =
            !isCustomerTile || (isCustomerTile && tile.count === 0);
          return (
            <div
              key={tile.id}
              className="glass-card rounded-xl p-6 border border-border/30 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {tile.count.toLocaleString()}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {tile.label}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {tile.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 hover:text-primary-foreground border-primary/30 hover:border-primary hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                  onClick={() => navigate(`${tile.path}?buttontype=view`)}
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                {showAddButton && (
                  <Button
                    size="sm"
                    className="flex-1 gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                    onClick={() => navigate(`${tile.path}?buttontype=add`)}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                )}
              </div>

              {tile?.id?.toLowerCase() !== "customers" && (
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 border-amber-400/40 text-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
                    onClick={() => navigate(`${tile.path}?buttontype=await`)}
                  >
                    <Hourglass className="w-4 h-4" />
                    Awaiting your approval
                    {tile?.await_for_approval_count > 0 &&
                      ` (${tile.await_for_approval_count})`}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-100 hover:text-green-600 mt-2"
                    onClick={() => navigate(`${tile.path}?buttontype=request`)}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    Requested approval {tile?.requested_count > 0 &&
                      ` (${tile.requested_count})`}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export const MasterHomeTilesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="glass-card rounded-xl p-6 border border-border/30"
      >
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-16 h-8" />
        </div>
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
);

//modal pop up code
// const [approvalModal, setApprovalModal] = useState<{ isOpen: boolean, tile: MasterOverviewItem | null, isRead?: boolean }>({ isOpen: false, tile: null, isRead: false });

// const openApprovalModal = (tile: MasterOverviewItem) => {
//   const type = tile.id.toLowerCase();
//   setApprovalModal({ isOpen: true, tile, isRead: false });
// };

// const openRequestMasterModal = (tile: MasterOverviewItem) => {
//   const type = tile.id.toLowerCase();
//   setApprovalModal({ isOpen: true, tile, isRead: true });
// };

// const closeApprovalModal = () => setApprovalModal({ isOpen: false, tile: null, isRead: false });
{
  /* 
    {approvalModal.isOpen && approvalModal.tile &&
      approvalModal.tile.id.toLowerCase() === "transporters" && (
        <TransporterModal
          tile={approvalModal.tile}
          onClose={closeApprovalModal}
          isRead={approvalModal.isRead}
        />
      )
    } */
}
{
  /* {approvalModal.isOpen && approvalModal.tile &&
      approvalModal.tile?.id?.toLowerCase() === "facilities" && (
        <FacilityModal
          tile={approvalModal.tile}
          onClose={closeApprovalModal}
          isRead={approvalModal.isRead}
        />
      )
    } */
}
{
  /* {approvalModal.isOpen && approvalModal.tile &&
      approvalModal.tile?.id?.toLowerCase() === "rate-cards" && (
        <RateCardModel
          tile={approvalModal.tile}
          onClose={closeApprovalModal}
          isRead={approvalModal.isRead}
        />
      )
    } */
}
{
  /* {approvalModal.isOpen && approvalModal.tile &&
      approvalModal.tile?.id?.toLowerCase() === "partner_contractor" && (
        <ContractorModal
          tile={approvalModal.tile}
          onClose={closeApprovalModal}
          isRead={approvalModal.isRead}
        />
      )
    } */
}
{
  /* {approvalModal.isOpen && approvalModal.tile &&
      approvalModal.tile?.id?.toLowerCase() === "facility_agreement" && (
        <AgreementModal
          tile={approvalModal.tile}
          onClose={closeApprovalModal}
          isRead={approvalModal.isRead}
        />
      )
    } */
}
