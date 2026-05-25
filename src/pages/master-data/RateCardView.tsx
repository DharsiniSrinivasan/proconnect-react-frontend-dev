import {
  MasterModal,
  FieldGrid,
  FieldItem,
  SectionDivider,
} from "@/components/master-data/MasterModal";

interface RateCardViewModalProps {
  open: boolean;
  rateCard: any;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  approval?: boolean;
}

const RateCardViewModal = ({
  open,
  rateCard,
  onClose,
  onApprove,
  onReject,
  approval = false,
}: RateCardViewModalProps) => {
  if (!rateCard) return null;

  return (
    <MasterModal
      open={open}
      onClose={onClose}
      title="Rate Card Details"
      save={false}
      approval={approval}
      onApprove={onApprove}
      onReject={onReject}
      maxWidth="max-w-2xl"
    >
      <FieldGrid>
        <FieldItem
          label="Transporter Code"
          value={rateCard?.partner?.code}
          mono
        />
        <FieldItem label="Transporter Name" value={rateCard?.partner?.name} />
        <FieldItem label="Assignee" value={rateCard?.assigned_to_name} />
        <FieldItem label="Contractor No" value={rateCard?.partner?.partner_contracts[0]?.contract_no} mono />
        <FieldItem label="From (Origin)" value={rateCard.from_city} />
        <FieldItem label="To (Destination)" value={rateCard.to_city} />
        <FieldItem label="Status" value={rateCard.status} />
        <FieldItem label="Transport Mode" value={rateCard.transport_mode} />
        <FieldItem label="Customer Code" value={rateCard?.partner?.customer?.vendor_code} />
        <FieldItem label="Customer" value={rateCard?.partner?.customer?.name} />
      </FieldGrid>
      <SectionDivider label="Rate Details" />
      <FieldGrid>
        <FieldItem label="Freight Rate (₹/kg)" value={rateCard.rate} mono />
        <FieldItem label="Minimum Charge" value={rateCard.minimum_rate} mono />
        <FieldItem label="E Rate (₹/kg)" value={rateCard.e_rate} mono />
        <FieldItem label="ODA Tax (₹)" value={rateCard.oda_rate} mono />
        <FieldItem
          label="Total Rate (₹)"
          value={(rateCard?.rate ?? 0) + (rateCard?.e_rate ?? 0)}
          mono
        />
        <FieldItem
          label="ODA Service Charge (₹)"
          value={rateCard.oda_service_charge}
          mono
        />
      </FieldGrid>
      <SectionDivider />
      <FieldGrid>
        <FieldItem label="TAT (Days)" value={rateCard.tat_days} />
        <FieldItem
          label="Last Updated By"
          value={rateCard.last_action_by_name}
        />
      </FieldGrid>
    </MasterModal>
  );
};

export default RateCardViewModal;
