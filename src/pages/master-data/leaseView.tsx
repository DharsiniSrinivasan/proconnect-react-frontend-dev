import {
  MasterModal,
  FieldGrid,
  FieldItem,
  SectionDivider,
} from "@/components/master-data/MasterModal";

interface LeaseViewModalProps {
  open: boolean;
  lease: any;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  approval?: boolean;
}

const LeaseViewModal = ({
  open,
  lease,
  onClose,
  onApprove,
  onReject,
  approval = false,
}: LeaseViewModalProps) => {
  if (!lease) return null;
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <MasterModal
      open={open}
      onClose={onClose}
      title="Agreement Details"
      save={false}
      approval={approval}
      onApprove={onApprove}
      onReject={onReject}
      maxWidth="max-w-2xl"
    >
      {/* Basic Info */}
      <FieldGrid>
        <FieldItem label="Facility Name" value={lease.facility_name} />
        <FieldItem label="Agreement No" value={lease.agreement_number} mono />
        <FieldItem label="Category" value={lease.category} />
        <FieldItem label="Status" value={lease.status} />
        <FieldItem label="Assigned" value={lease.assigned_to_name} />
      </FieldGrid>

      <SectionDivider label="Lease Period" />

      {/* Dates */}
      <FieldGrid>
        <FieldItem label="Start Date" value={formatDate(lease.start_date)} />
        <FieldItem label="End Date" value={formatDate(lease.end_date)} />

        <FieldItem label="Lease Value (₹)" value={lease.rent_amount} mono />
      </FieldGrid>

      {/* Financial */}
    </MasterModal>
  );
};

export default LeaseViewModal;
