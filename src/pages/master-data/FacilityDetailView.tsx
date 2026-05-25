import {
  MasterModal,
  FieldGrid,
  FieldItem,
  SectionDivider,
} from "@/components/master-data/MasterModal";

interface FacilityViewModalProps {
  open: boolean;
  facility: any;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
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

const FacilityViewModal = ({
  open,
  facility,
  onClose,
  onApprove,
  onReject,
  approval = false,
}: FacilityViewModalProps) => {
  if (!facility) return null;

  const dimensions = facility?.storage_capacity_config;
  const volume =
    dimensions?.width && dimensions?.height && dimensions?.depth
      ? dimensions.width * dimensions.height * dimensions.depth
      : null;
  const storageCountLabel =
    facility.category_storage_type === "Boxes"
      ? "Boxes Count"
      : facility.category_storage_type === "Pallet"
        ? "Pallet Count"
        : null;

  return (
    <MasterModal
      open={open}
      onClose={onClose}
      title="Facility Details"
      save={false}
      approval={approval}
      onApprove={onApprove}
      onReject={onReject}
      maxWidth="max-w-2xl"
    >
      <FieldGrid>
        <FieldItem label="Facility Name" value={facility.name} />
        <FieldItem label="Customer Name" value={facility.customer_name} />
        <FieldItem label="Assignee" value={facility.assigned_to_name} />
        <FieldItem label="Code" value={facility.facility_code} mono />
        <FieldItem label="Location" value={facility.address?.locationName} />
        <FieldItem label="Warehouse Type" value={facility.category} />
        <FieldItem
          label="Storage Category"
          value={facility.category_storage_type}
        />
        {storageCountLabel && (
          <FieldItem
            label={storageCountLabel}
            value={facility.boxes_pallet_count}
            mono
          />
        )}
      </FieldGrid>
      <SectionDivider label="Dimensions & Capacity" />
      <FieldGrid>
        {dimensions ? (
          <>
            <FieldItem label="Width" value={dimensions.width} mono />
            <FieldItem label="Height" value={dimensions.height} mono />
            <FieldItem label="Depth" value={dimensions.depth} mono />
            <FieldItem label="Total Volume" value={volume} mono />
          </>
        ) : (
          <FieldItem label="Dimensions (W × H × D)" value="-" fullWidth />
        )}
      </FieldGrid>
      <SectionDivider label="Operations" />
      <FieldGrid>
        <FieldItem label="Tier" value={facility.tier_type} />
        <FieldItem label="Assignee" value={facility.assigned_to_name} />
        <FieldItem label="Zone" value={facility.zone} />
        <FieldItem label="Status" value={facility.status} />
        <FieldItem
          label="Service Radius (km)"
          value={facility.service_radius}
          mono
        />
        <FieldItem label="Fixed Cost" value={facility.fixed_costs} mono />
        {/* <FieldItem
          label="Utilization %"
          value={
            facility.util_percentage != null
              ? `${facility.util_percentage}%`
              : "-"
          }
          mono
        /> */}
        <FieldItem label="Pincode" value={facility.address?.pincode} mono />
        <FieldItem
          label="Last Updated"
          value={formatDate(facility.last_updated)}
          
        />
      </FieldGrid>
    </MasterModal>
  );
};

export default FacilityViewModal;
