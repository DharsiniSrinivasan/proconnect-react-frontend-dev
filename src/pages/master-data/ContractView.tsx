import {
  MasterModal,
  FieldGrid,
  FieldItem,
} from "@/components/master-data/MasterModal";

interface ContractViewModalProps {
  open: boolean;
  contract: any;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  approval: boolean;
}

const ContractViewModal = ({
  open,
  contract,
  onClose,
  onApprove,
  onReject,
  approval,
}: ContractViewModalProps) => {
  if (!contract) return null;

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
      title="Contractor Details"
      save={false}
      approval={false}
      onApprove={onApprove}
      onReject={onReject}
      maxWidth="max-w-2xl"
    >
      <FieldGrid>
        <FieldItem label="Transporter" value={contract.partner_name} />
        <FieldItem label="Contractor No" value={contract.contract_no} mono />
        <FieldItem label="Assignee" value={contract.assigned_to_name} />
        <FieldItem label="Customer" value={contract.customer_name} />
        <FieldItem label="Valid From" value={formatDate(contract.valid_from)} />
        <FieldItem label="Valid To" value={formatDate(contract.valid_to)} />
      </FieldGrid>
    </MasterModal>
  );
};

export default ContractViewModal;
