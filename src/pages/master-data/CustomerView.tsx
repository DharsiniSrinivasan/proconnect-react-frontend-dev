import {
  MasterModal,
  FieldGrid,
  FieldItem,
} from "@/components/master-data/MasterModal";

interface CustomerViewModalProps {
  open: boolean;
  customer: any;
  onClose: () => void;
  approval?: boolean;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const CustomerViewModal = ({
  open,
  customer,
  onClose,
}: CustomerViewModalProps) => {
  if (!customer) return null;

  return (
    <MasterModal
      open={open}
      onClose={onClose}
      title="Customer Details"
      save={false}
      maxWidth="max-w-2xl"
    >
      <FieldGrid>
        <FieldItem label="Customer Code" value={customer?.vendor_code} mono />
        <FieldItem label="Name" value={customer?.name} />
        <FieldItem label="GSTIN" value={customer?.gstin} mono />
        <FieldItem label="Status" value={customer?.status} />
        <FieldItem label="Region" value={customer?.region} />
        <FieldItem label="Shipping Pincode" value={customer?.pin_code} mono />
        <FieldItem
          label="Billing Address"
          value={customer?.billing_address}
          fullWidth
        />
        <FieldItem
          label="Shipping Address"
          value={customer?.shipping_address}
          fullWidth
        />
        <FieldItem
          label="Last Updated"
          value={formatDate(customer.last_updated)}
          fullWidth
        />
      </FieldGrid>
    </MasterModal>
  );
};

export default CustomerViewModal;
