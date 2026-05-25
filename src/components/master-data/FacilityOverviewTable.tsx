import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  XCircle,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StatusChip, TierChip } from "./MasterStatusChip";
import type { FacilityItem } from "@/mocks/masterData.mock";
import { ConfirmationDialog } from "../confirmationDialog";
import { useCustomerStore, useFacilityStore } from "@/stores/masterStore";
import { SortableTableHead } from "../sortable-table-head";
import { Checkbox } from "@/components/ui/checkbox";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { createPortal } from "react-dom";

interface FacilityMasterTableProps {
  facilities: FacilityItem[];
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalRecords: number;
  onPageSizeChange: (size: number) => void;
  tierFilter: string;
  onTierFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  filter_name: string;
  filter_customer: string;
  filter_assignee_name: string;
  filter_request_name: string;
  filter_reason: string;
  fixed_cost: string;
  filter_last_action: any;
  sortBy: string | null;
  sortOrder: SortOrder;
  onFilterNameChange: (value: string) => void;
  onFilterCustomerChange: (value: string) => void;
  onFilterReasonChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onFixedCostChange: (value: string) => void;
  onAssigneeNameFilter: (value: string) => void;
  onRequestNameFilter: (value: string) => void;
  onLastActionFilter: (value: any) => void;
  onSortChange: (sortBy: string | null, sortOrder: SortOrder) => void;
  onReject: (ids: (string | number)[], reason: string) => void;
  onApprove: (ids: (string | number)[]) => void;
  readOnly: boolean;
  isLoading: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface RejectDialogState {
  isOpen: boolean;
  facilityIds: (string | number)[];
  facilityNames: string[];
  isMultiple: boolean;
}
interface ActionLoadingState {
  isApproving: boolean;
  isRejecting: boolean;
}

// Reject Reason Dialog Component
const RejectReasonDialog = ({
  isOpen,
  facilityNames,
  isMultiple,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  facilityNames: string[];
  isMultiple: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    onConfirm(reason);
    setReason("");
    setError("");
  };

  const handleCancel = () => {
    setReason("");
    setError("");
    onCancel();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/10">
            <AlertCircle className="w-5 h-5 text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reject Facilit{isMultiple ? "ies" : "y"}
            </h2>
            {facilityNames.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMultiple
                  ? `${facilityNames.length} facilit${facilityNames.length !== 1 ? "ies" : "y"} will be rejected`
                  : `${facilityNames[0]} will be rejected`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                You are about to reject the facilities
              </p>
            )}
          </div>
        </div>

        {/* Reason Input */}
        <div className="px-6 py-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Rejection Reason
            <span className="text-error ml-1">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Please provide the reason for rejection..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-error/50 focus:border-error resize-none"
            rows={4}
          />
          {error && (
            <p className="mt-2 text-sm text-error flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-error" />
              {error}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {reason.length}/250 characters
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const FacilityOverviewTable = ({
  facilities,
  page,
  totalRecords,
  isLoading,
  onPageSizeChange,
  pageSize,
  onPageChange,
  onTierFilterChange,
  tierFilter,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  filter_name,
  filter_customer,
  filter_reason,
  fixed_cost,
  filter_last_action,
  sortBy,
  sortOrder,
  filter_assignee_name,
  filter_request_name,
  onAssigneeNameFilter,
  onRequestNameFilter,
  onFilterNameChange,
  onFilterCustomerChange,
  onFilterReasonChange,
  onFixedCostChange,
  onLastActionFilter,
  onSortChange,
  onApprove,
  onReject,
  readOnly,
}: FacilityMasterTableProps) => {
  const status = ["Pending", "Approved", "Rejected"];
  const { region } = useCustomerStore();
  const { tiers } = useFacilityStore();
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    isOpen: false,
    facilityIds: [],
    facilityNames: [],
    isMultiple: false,
  });
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    isApproving: false,
    isRejecting: false,
  });
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);

  const pendingFacilities = facilities.filter(
    (f) => f.assigned_status?.toLowerCase() === "pending" && !readOnly,
  );

  // Check if all pending facilities on current page are selected
  const allPendingSelected =
    pendingFacilities.length > 0 &&
    pendingFacilities.every((f) => selectedIds.has(String(f.id)));
  const somePendingSelected = pendingFacilities.some((f) =>
    selectedIds.has(String(f.id)),
  );

  useEffect(() => {
    setPageInput(page + 1);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" && // Only trigger if it's a number
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== page + 1
      ) {
        onPageChange(pageInput - 1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput]);

  // Handle individual checkbox
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  // Handle select all checkbox
  const handleSelectAllChange = (checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      pendingFacilities.forEach((f) => newSelected.add(String(f.id)));
    } else {
      pendingFacilities.forEach((f) => newSelected.delete(String(f.id)));
    }
    setSelectedIds(newSelected);
  };

  // Handle approve all selected
  const handleApproveAll = async () => {
    setActionLoading((prev) => ({ ...prev, isApproving: true }));
    try {
      if (selectedIds.size > 0) {
        onApprove(Array.from(selectedIds));
      } else {
        onApprove(["all"]);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, isApproving: false }));
      setSelectedIds(new Set());
    }
  };

  // Handle reject all selected - opens dialog
  const handleRejectAllClick = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : ["all"];
    const names = facilities
      .filter((f) => ids.includes(String(f.id)))
      .map((f) => f.name);

    setRejectDialog({
      isOpen: true,
      facilityIds: ids,
      facilityNames: names,
      isMultiple: ids.length > 1,
    });
  };

  // Handle single reject - opens dialog
  const handleSingleRejectClick = (facilityId: string | number) => {
    const facility = facilities.find((f) => f.id === facilityId);
    if (facility) {
      setRejectDialog({
        isOpen: true,
        facilityIds: [facilityId],
        facilityNames: [facility.name],
        isMultiple: false,
      });
    }
  };
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, pageSize]);
  const hasData = readOnly
    ? facilities.length > 0
    : pendingFacilities.length > 0;
  // Confirm rejection with reason

  const handleRejectConfirm = async (reason: string) => {
    setActionLoading((prev) => ({ ...prev, isRejecting: true }));
    try {
      onReject(rejectDialog.facilityIds, reason);
      setSelectedIds(new Set());
    } finally {
      setActionLoading((prev) => ({ ...prev, isRejecting: false }));
      setRejectDialog({
        isOpen: false,
        facilityIds: [],
        facilityNames: [],
        isMultiple: false,
      });
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* Reject Reason Dialog */}
      <RejectReasonDialog
        isOpen={rejectDialog.isOpen}
        facilityNames={rejectDialog.facilityNames}
        isMultiple={rejectDialog.isMultiple}
        onConfirm={handleRejectConfirm}
        onCancel={() =>
          setRejectDialog({
            isOpen: false,
            facilityIds: [],
            facilityNames: [],
            isMultiple: false,
          })
        }
      />

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 p-4 mb-3 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {selectedIds.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ConfirmationDialog
              title="Alert!"
              description="Are you sure you want to approve ?"
              confirmText="Yes"
              onConfirm={async () => {
                handleApproveAll();
                return true;
              }}
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-primary"
                onClick={(e) => e.stopPropagation()}
                disabled={actionLoading.isApproving}
              >
                {actionLoading.isApproving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <Check className="w-4 h-4" />
                Approve
              </Button>
            </ConfirmationDialog>

            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleRejectAllClick}
              disabled={actionLoading.isRejecting}
            >
              {actionLoading.isRejecting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <XCircle className="w-4 h-4" />
              Reject
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
      {!isLoading && selectedIds.size === 0 && !readOnly && pendingFacilities.length > 0 && (
        <div className="flex justify-end mb-3">
          <div className="flex items-center gap-2">
            <ConfirmationDialog
              title="Alert!"
              description="Are you sure you want to approve ?"
              confirmText="Yes"
              onConfirm={async () => {
                handleApproveAll();
                return true;
              }}
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-primary"
                onClick={(e) => e.stopPropagation()}
                disabled={actionLoading.isApproving}
              >
                {actionLoading.isApproving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <Check className="w-4 h-4" />
                Approve All
              </Button>
            </ConfirmationDialog>

            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleRejectAllClick}
              disabled={actionLoading.isRejecting}
            >
              {actionLoading.isRejecting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <XCircle className="w-4 h-4" />
              Reject All
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className="w-full flex-1">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {/* Checkbox header */}
              {pendingFacilities.length > 0 && (
                <TableHead className="w-12">
                  <IndeterminateCheckbox
                    checked={allPendingSelected}
                    indeterminate={somePendingSelected && !allPendingSelected}
                    onCheckedChange={handleSelectAllChange}
                    // disabled={actionLoading.isApproving || actionLoading.isRejecting}
                    className="ml-2"
                  />
                </TableHead>
              )}
              <SortableTableHead
                searchValue={filter_name}
                label="Name"
                sortKey="name"
                onSearch={onFilterNameChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              {/* <SortableTableHead
                searchValue={filter_customer}
                label="Customer name"
                sortKey="customer_name"
                onSearch={onFilterCustomerChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              /> */}
              {readOnly ? (
                <SortableTableHead
                  searchValue={filter_assignee_name}
                  label="Assignee name"
                  sortKey="assigned_to_name"
                  onSearch={onAssigneeNameFilter}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                />
              ) : (
                <SortableTableHead
                  searchValue={filter_request_name}
                  label="Requested name"
                  sortKey="requested_by_name"
                  onSearch={onRequestNameFilter}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                />
              )}
              <SortableTableHead
                label="Tier"
                sortKey="tier"
                selectable={true}
                options={tiers?.map((user) => ({ label: user, value: user }))}
                selectedValue={tierFilter}
                onSelect={onTierFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              <SortableTableHead
                label="Region"
                sortKey="region"
                selectable={true}
                options={region?.map((user) => ({ label: user, value: user }))}
                selectedValue={regionFilter}
                onSelect={onRegionFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              {/* <TableHead className="text-muted-foreground text-xs font-medium">Util %</TableHead> */}
              {/* <SortableTableHead
                searchValue={fixed_cost}
                label="Fixed cost"
                sortKey="fixed cost"
                onSearch={onFixedCostChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              /> */}
              {readOnly && (
                <SortableTableHead
                  searchValue={filter_reason}
                  label="Reject Reason"
                  sortKey="rejection_reason"
                  onSearch={onFilterReasonChange}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                />
              )}
              {readOnly ? (
                <SortableTableHead
                  label="Status"
                  sortKey="assigned_status"
                  selectable={true}
                  options={status?.map((user) => ({ label: user, value: user }))}
                  selectedValue={statusFilter}
                  onSelect={onStatusFilterChange}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                />
              ) : (
                <TableHead className="text-muted-foreground text-1xl font-medium text-left">
                  Status
                </TableHead>
              )}
              {readOnly && (
                <SortableTableHead
                  label="Last Action"
                  sortKey="last_action_at"
                  datepicker
                  dateValue={filter_last_action}
                  onDateSelect={onLastActionFilter}
                  className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                />
              )}
              {!readOnly && (
                <TableHead className="text-muted-foreground text-1xl font-medium text-center">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {pendingFacilities.length > 0 && (
                    <TableCell>
                      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                  {Array.from({ length: !readOnly ? 7 : 9 }).map(
                    (_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (!readOnly && pendingFacilities.length === 0) || facilities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    pendingFacilities.length > 0
                      ? readOnly
                        ? 10
                        : 8
                      : readOnly
                        ? 9
                        : 7
                  }
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              facilities.map((facility) => (
                <TableRow
                  key={facility.id}
                  className={`border-border/30 transition-all duration-200 ${selectedIds.has(String(facility.id))
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-primary/5"
                    }`}
                >
                  {/* Checkbox cell */}
                  {facility.assigned_status?.toLowerCase() === "pending" &&
                    !readOnly && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedIds.has(String(facility.id))}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              String(facility.id),
                              checked as boolean,
                            )
                          }
                          disabled={actionLoading.isApproving || actionLoading.isRejecting}
                          className="ml-2"
                        />
                      </TableCell>
                    )}
                  {pendingFacilities.length > 0 &&
                    facility.assigned_status?.toLowerCase() !== "pending" && (
                      <TableCell className="w-12" />
                    )}

                  <TableCell className="font-medium text-foreground">
                    <div className="flex flex-col">
                      <span>{facility.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Facility Code: {facility.facility_code}
                      </span>
                    </div>
                  </TableCell>
                  {/* <TableCell className="font-medium text-foreground">{facility.customer_name}</TableCell> */}

                  <TableCell className="font-medium text-foreground">
                    {readOnly
                      ? facility.assigned_to_name
                      : facility.requested_by_name || "--"}
                  </TableCell>
                  <TableCell>
                    <TierChip tier={facility.tier_type} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {facility.zone}
                  </TableCell>
                  {/* <TableCell className={cn("font-mono font-medium", getUtilColor(facility.util_percentage))}>
                    {facility.util_percentage != null ? facility.util_percentage : "NaN"}%
                  </TableCell> */}
                  {/* <TableCell className="font-mono text-muted-foreground">₹{facility.fixed_costs}</TableCell> */}
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {facility.rejection_reason || "--"}
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusChip status={facility.assigned_status} />
                  </TableCell>
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {facility.last_action_at
                        ? new Date(facility.last_action_at).toLocaleString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )
                        : "--"}
                    </TableCell>
                  )}
                  {!readOnly && (
                    <TableCell align="left" className="sticky right-0 bg-card">
                      <div className="flex items-center justify-center gap-2">
                        {facility?.assigned_status?.toLowerCase() ===
                          "pending" && (
                            <>
                              <ConfirmationDialog
                                title="Alert!"
                                description="Are you sure you want to approve ?"
                                confirmText="Yes"
                                onConfirm={async () => {
                                  onApprove([facility.id]);
                                  return true;
                                }}
                              >
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded-lg border border-success/30 text-success hover:bg-success/10 transition-all"
                                  title="Approve"
                                  disabled={actionLoading.isApproving || actionLoading.isRejecting}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </ConfirmationDialog>

                              <button
                                onClick={() =>
                                  handleSingleRejectClick(facility.id)
                                }
                               className="p-2 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-all"
                              title="Reject"
                              disabled={actionLoading.isApproving || actionLoading.isRejecting}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        {/* Status badge */}
                        {(facility?.assigned_status?.toLowerCase() ===
                          "approved" ||
                          facility?.assigned_status?.toLowerCase() ===
                          "rejected" ||
                          (facility?.assigned_status?.toLowerCase() ===
                            "pending" &&
                            readOnly)) && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${facility?.assigned_status?.toLowerCase() === "approved" ? "border bg-success/10 text-success border-success/30" : ""}
      ${facility?.assigned_status?.toLowerCase() === "rejected" ? "border bg-error/10 text-error border-error/30" : ""}
      ${facility?.assigned_status?.toLowerCase() === "pending" && readOnly ? "border bg-amber-10 text-amber-400 border-amber-400/30" : ""}
    `}
                            >
                              {facility.assigned_status === "approved" && (
                                <Check className="w-3 h-3" />
                              )}
                              {facility.assigned_status === "rejected" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              {facility.assigned_status}
                            </span>
                          )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {hasData && totalRecords > 10 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 m-2 border-t border-border/30">

          {/* Rows per page */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background w-20"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
                 disabled={actionLoading.isApproving || actionLoading.isRejecting}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          {/* Range */}
          <p className="text-xs text-muted-foreground text-center sm:text-left w-full sm:w-auto">
            {start}–{end} of {totalRecords}
          </p>

          {/* Nav */}
          <div className="flex items-center justify-between sm:justify-end gap-1 w-full sm:w-auto flex-wrap">

            {/* First */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0 || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(0)}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0 || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
             {page + 1} / {totalPages}
            </span>
            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page + 1 >= totalPages || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Last */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page + 1 >= totalPages || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(totalPages - 1)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
