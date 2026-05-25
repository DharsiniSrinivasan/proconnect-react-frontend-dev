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
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { createPortal } from "react-dom";
import { StatusChip } from "./MasterStatusChip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface ContractorRow {
  id: string;
  contract_no: string;
  valid_from: string;
  valid_to: string;
  partner_name: string;
  customer_name: string;
  assigned_status?: string;
  assigned_to_name?: string;
  requested_by_name?: string;
  rejection_reason?: string;
  last_action_at?: string;
}

interface ContractorTableProps {
  contractors: ContractorRow[];
  page: number;
  pageSize: number;
  totalRecords: number;
  showDelete: boolean;
  readOnly: boolean;

  // Filter states
  filter_contract_no: string;
  filter_valid_from: any;
  filter_valid_to: any;
  filter_partner_name: string;
  filter_customer: string;
  statusFilter?: string;
  filter_reason?: string;
  filter_last_action?: any;
  filter_assignee_name: string;
  filter_request_name: string;
  onAssigneeNameFilter: (value: string) => void;
  onRequestNameFilter: (value: string) => void;
  // Filter handlers
  onContractFilter: (value: string) => void;
  onPartnerFilter: (value: string) => void;
  onCustomerFilter: (value: string) => void;
  onValidFromFilter: (date: Date | null) => void;
  onValidToFilter: (date: Date | null) => void;
  onStatusFilter?: (value: string) => void;
  onReasonFilter?: (value: string) => void;
  onLastActionFilter?: (value: any) => void;

  // Sort states
  sortBy: string | null;
  sortOrder: "A_TO_Z" | "Z_TO_A" | null;
  onSort: (sortBy: string | null, sortOrder: any) => void;

  // Pagination handlers
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  // Action handlers
  onApprove?: (ids: (string | number)[]) => void;
  onReject?: (ids: (string | number)[], reason: string) => void;

  isLoading: boolean;
  statuses?: string[];
}

interface RejectDialogState {
  isOpen: boolean;
  contractorIds: (string | number)[];
  contractorNames: string[];
  isMultiple: boolean;
}

interface ActionLoadingState {
  isApproving: boolean;
  isRejecting: boolean;
}

// Reject Reason Dialog Component
const RejectReasonDialog = ({
  isOpen,
  contractorNames,
  isMultiple,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  contractorNames: string[];
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
              Reject Contractor{isMultiple ? "s" : ""}
            </h2>
            {contractorNames.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMultiple
                  ? `${contractorNames.length} contractor${contractorNames.length !== 1 ? "s" : ""} will be rejected`
                  : `Contractor ${contractorNames[0]} will be rejected`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                You are about to reject the contracts
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
            disabled={isLoading}
            placeholder="Please provide the reason for rejection..."
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

const ContractorOverviewTable = ({
  contractors,
  page,
  pageSize,
  totalRecords,
  filter_contract_no,
  filter_valid_from,
  filter_valid_to,
  onContractFilter,
  onValidFromFilter,
  onValidToFilter,
  onCustomerFilter,
  filter_customer,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  onPartnerFilter,
  isLoading,
  filter_partner_name,
  readOnly = false,
  statusFilter = "",
  filter_reason = "",
  filter_last_action,
  onStatusFilter,
  onReasonFilter,
  onLastActionFilter,
  onApprove,
  onReject,
  statuses = ["Pending", "Approved", "Rejected"],
  filter_assignee_name,
  filter_request_name,
  onAssigneeNameFilter,
  onRequestNameFilter,
}: ContractorTableProps) => {
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    isApproving: false,
    isRejecting: false,
  });
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    isOpen: false,
    contractorIds: [],
    contractorNames: [],
    isMultiple: false,
  });

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Filter pending contractors
  const pendingContractors = contractors.filter(
    (c) => c.assigned_status?.toLowerCase() === "pending" && !readOnly,
  );

  // Check if all pending contractors on current page are selected
  const allPendingSelected =
    pendingContractors.length > 0 &&
    pendingContractors.every((c) => selectedIds.has(c.id));
  const somePendingSelected = pendingContractors.some((c) =>
    selectedIds.has(c.id),
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

  // Reset selection on page/pageSize change
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
      pendingContractors.forEach((c) => newSelected.add(c.id));
    } else {
      pendingContractors.forEach((c) => newSelected.delete(c.id));
    }
    setSelectedIds(newSelected);
  };

  // Handle approve all selected
  const handleApproveAll = async () => {
    setActionLoading((prev) => ({ ...prev, isApproving: true }));
    try {
      if (selectedIds.size > 0 && onApprove) {
        onApprove(Array.from(selectedIds));
      } else {
        onApprove?.(["all"]);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, isApproving: false }));
      setSelectedIds(new Set());
    }
  };

  // Handle reject all selected - opens dialog
  const handleRejectAllClick = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : ["all"];
    const names = contractors
      .filter((c) => ids.includes(c.id))
      .map((c) => c.contract_no);

    setRejectDialog({
      isOpen: true,
      contractorIds: ids,
      contractorNames: names,
      isMultiple: ids.length > 1,
    });
  };

  // Handle single reject - opens dialog
  const handleSingleRejectClick = (contractorId: string) => {
    const contractor = contractors.find((c) => c.id === contractorId);
    if (contractor) {
      setRejectDialog({
        isOpen: true,
        contractorIds: [contractorId],
        contractorNames: [contractor.contract_no],
        isMultiple: false,
      });
    }
  };

  // Confirm rejection with reason
  const handleRejectConfirm = async (reason: string) => {
    setActionLoading((prev) => ({ ...prev, isRejecting: true }));
    try {
      if (onReject) {
        onReject(rejectDialog.contractorIds, reason);
      }
      setSelectedIds(new Set());
    } finally {
      setActionLoading((prev) => ({ ...prev, isRejecting: false }));
      setRejectDialog({
        isOpen: false,
        contractorIds: [],
        contractorNames: [],
        isMultiple: false,
      });
    }
  };

  const hasData = readOnly
    ? contractors.length > 0
    : pendingContractors.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Reject Reason Dialog */}
      <RejectReasonDialog
        isOpen={rejectDialog.isOpen}
        contractorNames={rejectDialog.contractorNames}
        isMultiple={rejectDialog.isMultiple}
        isLoading={actionLoading.isRejecting}
        onConfirm={handleRejectConfirm}
        onCancel={() =>
          setRejectDialog({
            isOpen: false,
            contractorIds: [],
            contractorNames: [],
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
            {onApprove && (
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
            )}

            {onReject && (
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
            )}
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

      {!isLoading && selectedIds.size === 0 && !readOnly && pendingContractors.length > 0 && (
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
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {/* Checkbox header */}
              {pendingContractors.length > 0 && (
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
                label="Contractor No"
                sortKey="contract_no"
                searchValue={filter_contract_no}
                onSearch={onContractFilter}
                searchable
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              {readOnly ? (
                <SortableTableHead
                  searchValue={filter_assignee_name}
                  label="Assignee name"
                  sortKey="assigned_to_name"
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
                label="Transporter"
                sortKey="partner_name"
                searchValue={filter_partner_name}
                onSearch={onPartnerFilter}
                searchable
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              <SortableTableHead
                label="Customer"
                sortKey="customer_name"
                searchValue={filter_customer}
                onSearch={onCustomerFilter}
                searchable
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              <SortableTableHead
                label="Valid From"
                sortKey="valid_from"
                dateValue={filter_valid_from}
                onDateSelect={onValidFromFilter}
                datepicker
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              <SortableTableHead
                label="Valid To"
                sortKey="valid_to"
                dateValue={filter_valid_to}
                onDateSelect={onValidToFilter}
                datepicker
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              {readOnly && onReasonFilter && (
                <SortableTableHead
                  searchValue={filter_reason || ""}
                  label="Rejection Reason"
                  sortKey="rejection_reason"
                  onSearch={onReasonFilter}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              )}

              {onStatusFilter ? (
                readOnly ? (
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
                  <TableHead className="text-muted-foreground text-sm font-medium text-left">
                    Status
                  </TableHead>
                )
              ) : (
                <TableHead className="text-right">Actions</TableHead>
              )}

              {readOnly && onLastActionFilter && (
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
                <TableHead className="text-muted-foreground text-sm font-medium text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {pendingContractors.length > 0 && (
                    <TableCell>
                      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                  {Array.from({ length: readOnly ? 8 : 7 }).map(
                    (_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (!readOnly && pendingContractors.length === 0) || contractors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    readOnly
                      ? 10
                      : pendingContractors.length > 0
                        ? 10
                        : 9
                  }
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (

              contractors.map((row) => (
                <TableRow
                  key={row.id}
                  className={`transition-all duration-200 ${selectedIds.has(row.id)
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-primary/5"
                    }`}
                >
                  {/* Checkbox cell */}
                  {row.assigned_status?.toLowerCase() === "pending" &&
                    !readOnly && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(row.id, checked as boolean)
                          }
                          disabled={actionLoading.isApproving || actionLoading.isRejecting}
                          className="ml-2"
                        />
                      </TableCell>
                    )}
                  {pendingContractors.length > 0 &&
                    row.assigned_status?.toLowerCase() !== "pending" && (
                      <TableCell className="w-12" />
                    )}

                  <TableCell>
                    <Badge variant="outline">{row.contract_no}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {readOnly
                      ? row.assigned_to_name
                      : row.requested_by_name || "--"}
                  </TableCell>
                  <TableCell>{row.partner_name}</TableCell>
                  <TableCell>{row.customer_name}</TableCell>
                  <TableCell>{row.valid_from}</TableCell>
                  <TableCell>{row.valid_to}</TableCell>

                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {row.rejection_reason ? (
                        row.rejection_reason.length > 15 ? (
                          <>
                            {/* Desktop Tooltip */}
                            <div className="hidden sm:block">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      {row.rejection_reason.slice(0, 15) + "..."}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <pre className="whitespace-pre-wrap break-words text-sm">
                                      {row.rejection_reason}
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
                                    {row.rejection_reason.slice(0, 15) + "..."}
                                  </span>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 max-h-60 overflow-auto">
                                  <pre className="whitespace-pre-wrap break-words text-sm">
                                    {row.rejection_reason}
                                  </pre>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </>
                        ) : (
                          <span>{row.rejection_reason}</span>
                        )
                      ) : (
                        "--"
                      )}
                    </TableCell>
                  )}

                  <TableCell>
                    <StatusChip status={row.assigned_status} />
                  </TableCell>

                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {row.last_action_at
                        ? new Date(row.last_action_at).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : "--"}
                    </TableCell>
                  )}

                  <TableCell className="text-right sticky right-0 bg-card">
                    <div className="flex items-center justify-end gap-2">
                      {!readOnly &&
                        row?.assigned_status?.toLowerCase() === "pending" &&
                        onApprove &&
                        onReject ? (
                        <>
                          <ConfirmationDialog
                            title="Alert!"
                            description="Are you sure you want to approve ?"
                            confirmText="Yes"
                            onConfirm={async () => {
                              onApprove([row.id]);
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
                            onClick={() => handleSingleRejectClick(row.id)}
                            className="p-2 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                            disabled={actionLoading.isApproving || actionLoading.isRejecting}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination */}
      {hasData && totalRecords > 10 && (
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

export default ContractorOverviewTable;