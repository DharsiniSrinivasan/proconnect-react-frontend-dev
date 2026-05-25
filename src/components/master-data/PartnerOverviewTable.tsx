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
import { StatusChip, ModeChip } from "./MasterStatusChip";
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { createPortal } from "react-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type MasterStatus = "Active" | "Inactive" | "Pending" | "Suspended";
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export interface PartnerRow {
  id: string;
  name: string;
  customer_name: string;
  code: string;
  otif_percent: string | number;
  status: string;
  requested_by_name: string;
  assigned_status: string;
  assigned_to_name: string;
  contact_email?: string;
  rejection_reason?: string;
  transport_mode: string[];
  last_action_at: string;
}

interface PartnerMasterTableProps {
  partners: PartnerRow[];
  page: number;
  pageSize: number;
  totalpartners: number;

  // Filter states
  statusFilter: string;
  searchQuery: string;
  modeFilter: string[];
  filter_name: string;
  filter_customer: string;
  filter_code: string;
  filter_email: string;
  filter_reason: string;
  filter_otif: string;
  readOnly: boolean;
  filter_request_name: string;
  filter_assignee_name: string;
  filter_last_action: any;

  // Filter handlers
  onStatusFilter: (value: string) => void;
  onModeFilter: (values: string[]) => void;
  onNameFilter: (value: string) => void;
  onCodeFilter: (value: string) => void;
  onEmailFilter: (value: string) => void;
  onOTFFilter: (value: string) => void;
  onCustomerFilter: (value: string) => void;
  onReject: (ids: (string | number)[], reason: string) => void;
  onApprove: (ids: (string | number)[]) => void;
  onRequestNameFilter: (value: string) => void;
  onLastActionFilter: (value: any) => void;
  onAssigneeNameFilter: (value: string) => void;
  onReasonFilter: (value: string) => void;

  // Sort states
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;

  // Pagination handlers
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  // Data for dropdowns
  modes: string[];
  statuses: string[];
  isLoading: boolean;
}

interface RejectDialogState {
  isOpen: boolean;
  partnerIds: (string | number)[];
  partnerNames: string[];
  isMultiple: boolean;
}

interface ActionLoadingState {
  isApproving: boolean;
  isRejecting: boolean;
}

// Reject Reason Dialog Component
const RejectReasonDialog = ({
  isOpen,
  partnerNames,
  isMultiple,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  partnerNames: string[];
  isMultiple: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
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
              Reject Transporter{isMultiple ? "s" : ""}
            </h2>
            {partnerNames.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMultiple
                  ? `${partnerNames.length} transporter${partnerNames.length !== 1 ? "s" : ""} will be rejected`
                  : `${partnerNames[0]} will be rejected`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                You are about to reject the transporters
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
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-error/50 focus:border-error resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reject
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const PartnerOverviewTable = ({
  partners,
  onPageChange,
  totalpartners,
  page,
  onPageSizeChange,
  pageSize,
  statusFilter,
  modeFilter,
  onModeFilter,
  onStatusFilter,
  filter_name,
  filter_request_name,
  filter_assignee_name,
  filter_customer,
  filter_code,
  filter_email,
  filter_otif,
  filter_reason,
  filter_last_action,
  onNameFilter,
  onCodeFilter,
  onEmailFilter,
  onCustomerFilter,
  onLastActionFilter,
  onRequestNameFilter,
  onAssigneeNameFilter,
  onReasonFilter,
  onOTFFilter,
  sortBy,
  sortOrder,
  onSort,
  modes,
  statuses,
  isLoading,
  onApprove,
  onReject,
  readOnly,
}: PartnerMasterTableProps) => {
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    isApproving: false,
    isRejecting: false,
  });
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    isOpen: false,
    partnerIds: [],
    partnerNames: [],
    isMultiple: false,
  });

  // Calculate pagination values
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalpartners);
  const totalPages = Math.ceil(totalpartners / pageSize);

  const pendingPartners = partners.filter(
    (p) => p.assigned_status?.toLowerCase() === "pending" && !readOnly,
  );
  // Check if all pending partners on current page are selected
  const allPendingSelected =
    pendingPartners.length > 0 &&
    pendingPartners.every((p) => selectedIds.has(p.id));
  const somePendingSelected = pendingPartners.some((p) =>
    selectedIds.has(p.id),
  );

  useEffect(() => {
    setPageInput(page + 1);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" &&
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== page + 1
      ) {
        onPageChange(pageInput - 1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput]);
  //reset on page change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, pageSize]);
  
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
      pendingPartners.forEach((p) => newSelected.add(p.id));
    } else {
      pendingPartners.forEach((p) => newSelected.delete(p.id));
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
    const names = partners?.filter((p) => ids.includes(p.id))?.map((p) => p.name);

    setRejectDialog({
      isOpen: true,
      partnerIds: ids,
      partnerNames: names,
      isMultiple: ids.length > 1,
    });
  };

  // Handle single reject - opens dialog
  const handleSingleRejectClick = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (partner) {
      setRejectDialog({
        isOpen: true,
        partnerIds: [partnerId],
        partnerNames: [partner.name],
        isMultiple: false,
      });
    }
  };

  // Confirm rejection with reason
  const handleRejectConfirm = async (reason: string) => {
    setActionLoading((prev) => ({ ...prev, isRejecting: true }));
    try {
      onReject(rejectDialog.partnerIds, reason);
      setSelectedIds(new Set());
    } finally {
      setActionLoading((prev) => ({ ...prev, isRejecting: false }));
      setRejectDialog({
        isOpen: false,
        partnerIds: [],
        partnerNames: [],
        isMultiple: false,
      });
    }
  };

  const hasData = readOnly
    ? partners.length > 0
    : pendingPartners.length > 0;
    
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full"></div>
      {/* Reject Reason Dialog */}
      <RejectReasonDialog
        isOpen={rejectDialog.isOpen}
        partnerNames={rejectDialog.partnerNames}
        isMultiple={rejectDialog.isMultiple}
        isLoading={actionLoading.isRejecting}
        onConfirm={handleRejectConfirm}
        onCancel={() =>
          setRejectDialog({
            isOpen: false,
            partnerIds: [],
            partnerNames: [],
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
                await handleApproveAll();
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
              disabled={actionLoading.isApproving || actionLoading.isRejecting}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
      {!isLoading && selectedIds.size === 0 && !readOnly && pendingPartners.length > 0 && (
        <div className="flex justify-end mb-3">
          <div className="flex items-center gap-2">
            <ConfirmationDialog
              title="Alert!"
              description="Are you sure you want to approve ?"
              confirmText="Yes"
              onConfirm={async () => {
                await handleApproveAll();
                return true;
              }}
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
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
              {pendingPartners.length > 0 && (
                <TableHead className="w-12">
                  <IndeterminateCheckbox
                    checked={allPendingSelected}
                    indeterminate={somePendingSelected && !allPendingSelected}
                    onCheckedChange={handleSelectAllChange}
                    className="ml-2"
                 //   disabled={actionLoading.isApproving || actionLoading.isRejecting}
                  />
                </TableHead>
              )}
              <SortableTableHead
                searchValue={filter_code}
                label="Code"
                sortKey="code"
                onSearch={onCodeFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filter_name}
                label="Transporter Name"
                sortKey="name"
                onSearch={onNameFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filter_customer}
                label="Customer name"
                sortKey="customer_name"
                onSearch={onCustomerFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              {readOnly ? (
                <SortableTableHead
                  searchValue={filter_assignee_name}
                  label="Assignee name"
                  sortKey="assignee_name"
                  onSearch={onAssigneeNameFilter}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
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
                  onSort={onSort}
                />
              )}
              <SortableTableHead
                searchValue={filter_email}
                label="Contact email"
                sortKey="contact email"
                onSearch={onEmailFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filter_otif}
                label="OTIF"
                sortKey="otif_percent"
                onSearch={onOTFFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                label="Mode"
                sortKey="mode"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                multiselectable
                multiselectOptions={modes?.map((mode) => ({
                  label: mode,
                  value: mode,
                }))}
                selectedValues={modeFilter}
                onMultiSelect={onModeFilter}
                multiselectPlaceholder="Select mode"
              />
              {readOnly && (
                <SortableTableHead
                  searchValue={filter_reason}
                  label="Reject Reason"
                  sortKey="rejection_reason"
                  onSearch={onReasonFilter}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              )}
              {readOnly ? (
                <SortableTableHead
                  label="Status"
                  sortKey="assigned_status"
                  selectable={true}
                  options={statuses?.map((status) => ({
                    label: status,
                    value: status,
                  }))}
                  selectedValue={statusFilter}
                  onSelect={onStatusFilter}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                  selectPlaceholder="All Status"
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
                  onSort={onSort}
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
                  {pendingPartners.length > 0 && (
                    <TableCell>
                      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                  {Array.from({ length: !readOnly ? 9 : 10 }).map(
                    (_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (!readOnly && pendingPartners.length === 0) || partners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    readOnly
                      ? 10
                      : pendingPartners.length > 0
                        ? 10
                        : 9
                  }
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              partners?.map((partner) => (
                <TableRow
                  key={partner.id}
                  className={`border-border/30 transition-all duration-200 ${selectedIds.has(partner.id)
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-primary/5"
                    }`}
                >
                  {/* Checkbox cell */}
                  {partner.assigned_status?.toLowerCase() === "pending" &&
                    !readOnly && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedIds.has(partner.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(partner.id, checked as boolean)
                          }
                          disabled={actionLoading.isApproving || actionLoading.isRejecting}
                          className="ml-2"
                        />
                      </TableCell>
                    )}
                  {pendingPartners.length > 0 &&
                    partner.assigned_status?.toLowerCase() !== "pending" && (
                      <TableCell className="w-12" />
                    )}

                  <TableCell className="font-medium text-foreground">
                    <Badge variant="outline" className="font-mono text-xs">
                      {partner.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {partner.name}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {partner.customer_name}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {readOnly
                      ? partner.assigned_to_name
                      : partner.requested_by_name || "--"}
                  </TableCell>
                  <TableCell>{partner.contact_email}</TableCell>
                  <TableCell>{partner.otif_percent || 0}%</TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex gap-1 flex-wrap items-center">
                      {partner.transport_mode.map((mode: any) => (
                        <ModeChip key={mode} mode={mode} />
                      ))}
                    </div>
                  </TableCell>
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {partner.rejection_reason ? (
                        partner.rejection_reason.length > 15 ? (
                          <>
                            {/* Desktop Tooltip */}
                            <div className="hidden sm:block">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      {partner.rejection_reason.slice(0, 15) + "..."}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <pre className="whitespace-pre-wrap break-words text-sm">
                                      {partner.rejection_reason}
                                    </pre>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>

                            {/* Mobile Popover */}
                            <div className="block sm:hidden">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <span className="cursor-pointer">
                                    {partner.rejection_reason.slice(0, 15) + "..."}
                                  </span>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 max-h-60 overflow-auto">
                                  <pre className="whitespace-pre-wrap break-words text-sm">
                                    {partner.rejection_reason}
                                  </pre>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </>
                        ) : (
                          <span>{partner.rejection_reason}</span>
                        )
                      ) : (
                        "--"
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusChip status={partner.assigned_status} />
                  </TableCell>
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {partner.last_action_at
                        ? new Date(partner.last_action_at).toLocaleString(
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
                        {!readOnly &&
                          partner?.assigned_status?.toLowerCase() ===
                          "pending" && (
                            <>
                              <ConfirmationDialog
                                title="Alert!"
                                description="Are you sure you want to approve ?"
                                confirmText="Yes"
                                onConfirm={async () => {
                                  onApprove([partner.id]);
                                  return true;
                                }}
                              >
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded-lg border border-success/30 text-success hover:bg-success/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Approve"
                                  disabled={actionLoading.isApproving || actionLoading.isRejecting}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </ConfirmationDialog>

                              <button
                                onClick={() =>
                                  handleSingleRejectClick(partner.id)
                                }
                                className="p-2 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject"
                                disabled={actionLoading.isApproving || actionLoading.isRejecting}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        {/* Status badge */}
                        {(partner?.assigned_status?.toLowerCase() ===
                          "approved" ||
                          partner?.assigned_status?.toLowerCase() ===
                          "rejected" ||
                          (partner?.assigned_status?.toLowerCase() ===
                            "pending" &&
                            readOnly)) && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${partner?.assigned_status?.toLowerCase() === "approved" ? "border bg-success/10 text-success border-success/30" : ""}
      ${partner?.assigned_status?.toLowerCase() === "rejected" ? "border bg-error/10 text-error border-error/30" : ""}
      ${partner?.assigned_status?.toLowerCase() === "pending" && readOnly ? "border bg-amber-10 text-amber-400 border-amber-400/30" : ""}
    `}
                            >
                              {partner?.assigned_status?.toLowerCase() ===
                                "approved" && <Check className="w-3 h-3" />}
                              {partner?.assigned_status?.toLowerCase() ===
                                "rejected" && <XCircle className="w-3 h-3" />}
                              {partner.assigned_status}
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

      {hasData && totalpartners > 10 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 m-2 border-t border-border/30">

          {/* Rows per page */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background w-20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {start}–{end} of {totalpartners}
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

            {/* Page Info */}
            <span className="text-xs px-2 whitespace-nowrap">
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