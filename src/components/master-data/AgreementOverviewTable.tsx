import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  XCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { StatusChip } from "./MasterStatusChip";
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { format, parseISO } from "date-fns";
import { createPortal } from "react-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface LeaseItem {
  id?: string;
  lease_agreement_number?: string;
  start_date?: string;
  end_date?: string;
  rent_amount?: number;
  status?: string;
  assigned_status?: string;
  rejection_reason?: string;
  last_action_at?: string;
  created_date?: string;
  last_updated?: string;
  category?: string;
  agreement_number?: string;
}

interface LeaseMasterTableProps {
  leases: any[];
  onEdit: (lease: LeaseItem) => void;
  onDelete: (id: string) => Promise<boolean>;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalRecords: number;
  onPageSizeChange: (size: number) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSortChange: (sortBy: string | null, sortOrder: SortOrder) => void;
  isLoading: boolean;
  readOnly?: boolean;
  onApprove?: (ids: (string | number)[]) => void;
  onReject?: (ids: (string | number)[], reason: string) => void;
  statuses?: string[];
  filter_assignee_name: string;
  filter_request_name: string;
  onAssigneeNameFilter: (value: string) => void;
  onRequestNameFilter: (value: string) => void;
  facilityAgreementCategory: any[];
  filter_agreement_no: string;
  onFilterAgreementNo: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  filter_start_date: any;
  onValidStartDateFilter: (value: Date | null) => void;
  filter_end_date: any;
  onValidEndDateFilter: (value: Date | null) => void;
  filter_rent_amount: string;
  onFilterRentAmount: (value: string) => void;
  onFilterReasonChange: (value: string) => void;
  filter_reason: string;
  filter_last_action: any;
  onLastActionFilter: (value: any) => void;
}

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface RejectDialogState {
  isOpen: boolean;
  leaseIds: (string | number)[];
  leaseNumbers: string[];
  isMultiple: boolean;
}

// Reject Reason Dialog Component
const RejectReasonDialog = ({
  isOpen,
  leaseNumbers,
  isMultiple,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  leaseNumbers: string[];
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
              Reject Lease{isMultiple ? "s" : ""}
            </h2>
            {leaseNumbers?.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMultiple
                  ? `${leaseNumbers.length} agreement${leaseNumbers.length !== 1 ? "s" : ""} will be rejected`
                  : `Agreement ${leaseNumbers[0]} will be rejected`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                You are about to reject the agreements
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
interface ActionLoadingState {
  isApproving: boolean;
  isRejecting: boolean;
}

export const AgreementOverviewTable = ({
  leases,
  page,
  totalRecords,
  isLoading,
  onPageSizeChange,
  pageSize,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  readOnly = false,
  onApprove,
  onReject,
  statuses = ["Pending", "Approved", "Rejected"],
  filter_assignee_name,
  filter_request_name,
  onAssigneeNameFilter,
  onRequestNameFilter,
  facilityAgreementCategory,
  filter_agreement_no,
  onFilterAgreementNo,
  categoryFilter,
  onCategoryFilterChange,
  filter_start_date,
  onValidStartDateFilter,
  filter_end_date,
  onValidEndDateFilter,
  filter_rent_amount,
  onFilterRentAmount,
  filter_last_action,
  onLastActionFilter,
  filter_reason,
  onFilterReasonChange,
}: LeaseMasterTableProps) => {
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    isOpen: false,
    leaseIds: [],
    leaseNumbers: [],
    isMultiple: false,
  });
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    isApproving: false,
    isRejecting: false,
  });
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Filter pending leases
  const pendingLeases = leases.filter(
    (l) => l.assigned_status?.toLowerCase() === "pending" && !readOnly,
  );

  // Check if all pending leases on current page are selected
  const allPendingSelected =
    pendingLeases.length > 0 &&
    pendingLeases.every((l) => selectedIds.has(l.id));
  const somePendingSelected = pendingLeases.some((l) => selectedIds.has(l.id));

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
      pendingLeases.forEach((l) => newSelected.add(l.id));
    } else {
      pendingLeases.forEach((l) => newSelected.delete(l.id));
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
    const numbers = leases
      .filter((l) => ids.includes(l.id))
      .map((l) => l.agreement_number);

    setRejectDialog({
      isOpen: true,
      leaseIds: ids,
      leaseNumbers: numbers,
      isMultiple: ids.length > 1,
    });
  };

  // Handle single reject - opens dialog
  const handleSingleRejectClick = (leaseId: string) => {
    const lease = leases.find((l) => l.id === leaseId);
    if (lease) {
      setRejectDialog({
        isOpen: true,
        leaseIds: [leaseId],
        leaseNumbers: [lease.agreement_number],
        isMultiple: false,
      });
    }
  };

  // Confirm rejection with reason
  const handleRejectConfirm = async (reason: string) => {
    setActionLoading((prev) => ({ ...prev, isRejecting: true }));
    try {
      onReject(rejectDialog.leaseIds, reason);
      setSelectedIds(new Set());
    } finally {
      setActionLoading((prev) => ({ ...prev, isRejecting: false }));
      setRejectDialog({
        isOpen: false,
        leaseIds: [],
        leaseNumbers: [],
        isMultiple: false,
      });
    }
  };

const hasData = readOnly
  ? leases.length > 0
  : pendingLeases.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Reject Reason Dialog */}
      <RejectReasonDialog
        isOpen={rejectDialog.isOpen}
        leaseNumbers={rejectDialog.leaseNumbers}
        isMultiple={rejectDialog.isMultiple}
        onConfirm={handleRejectConfirm}
        onCancel={() =>
          setRejectDialog({
            isOpen: false,
            leaseIds: [],
            leaseNumbers: [],
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
                description="Are you sure you want to approve?"
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
            >
              Clear
            </Button>
          </div>
        </div>
      )}
      {!isLoading && selectedIds.size === 0 && !readOnly && pendingLeases.length > 0 && (
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
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {/* Checkbox header */}
              {pendingLeases.length > 0 && (
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
                searchValue={filter_agreement_no}
                onSearch={onFilterAgreementNo}
                searchable={true}
                label="Agreement Number"
                sortKey="agreement_number"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
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
                label="Category"
                sortKey="category"
                selectable={true}
                options={facilityAgreementCategory}
                selectedValue={categoryFilter}
                onSelect={onCategoryFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              <SortableTableHead
                label="Start Date"
                sortKey="start_date"
                dateValue={filter_start_date}
                onDateSelect={onValidStartDateFilter}
                datepicker
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              <SortableTableHead
                label="End Date"
                sortKey="end_date"
                dateValue={filter_end_date}
                onDateSelect={onValidEndDateFilter}
                datepicker
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
              <SortableTableHead
                searchValue={filter_rent_amount}
                onSearch={onFilterRentAmount}
                searchable={true}
                label="Rent Amount"
                sortKey="rent_amount"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />

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
                  options={statuses?.map((status) => ({
                    label: status,
                    value: status,
                  }))}
                  selectedValue={statusFilter}
                  onSelect={onStatusFilterChange}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSortChange}
                  selectPlaceholder="All Status"
                />
              ) : (
                <TableHead className="text-muted-foreground text-sm font-medium text-left">
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
                <TableHead className="text-muted-foreground text-sm font-medium text-center">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {pendingLeases.length > 0 && (
                    <TableCell>
                      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                  {Array.from({
                    length: readOnly ? 9 : 8,
                  }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (!readOnly && pendingLeases.length === 0) || leases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 10 : 9}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              leases?.map((lease) => {

                return (
                  <TableRow
                    key={lease.id}
                    className={`transition-all duration-200 ${selectedIds.has(lease.id)
                        ? "bg-primary/10 hover:bg-primary/15"
                        : "hover:bg-primary/5"
                      }`}
                  >
                    {/* Checkbox cell */}
                    {lease.assigned_status?.toLowerCase() === "pending" &&
                      !readOnly && (
                        <TableCell className="w-12">
                          <Checkbox
                            checked={selectedIds.has(lease.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(lease.id, checked as boolean)
                            }
                            disabled={actionLoading.isApproving || actionLoading.isRejecting}
                            className="ml-2"
                          />
                        </TableCell>
                      )}
                    {pendingLeases.length > 0 &&
                      lease.assigned_status?.toLowerCase() !== "pending" &&
                      !readOnly && <TableCell className="w-12" />}

                    <TableCell className="font-medium text-foreground">
                      {lease.agreement_number}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {readOnly
                        ? lease.assigned_to_name
                        : lease.requested_by_name || "--"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {lease.category}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {format(parseISO(lease.start_date), "MMM dd, yyyy")}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {format(parseISO(lease.end_date), "MMM dd, yyyy")}
                    </TableCell>

                    <TableCell className="font-mono text-muted-foreground">
                      ₹{lease.rent_amount.toLocaleString()}
                    </TableCell>



                    {readOnly && (
                      <TableCell className="font-medium text-foreground">
                        {lease.rejection_reason ? (
                          lease.rejection_reason.length > 15 ? (
                            <>
                              {/* Desktop Tooltip */}
                              <div className="hidden sm:block">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-pointer">
                                        {lease.rejection_reason.slice(0, 15) + "..."}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <pre className="whitespace-pre-wrap break-words text-sm">
                                        {lease.rejection_reason}
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
                                      {lease.rejection_reason.slice(0, 15) + "..."}
                                    </span>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-72 max-h-60 overflow-auto">
                                    <pre className="whitespace-pre-wrap break-words text-sm">
                                      {lease.rejection_reason}
                                    </pre>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </>
                          ) : (
                            <span>{lease.rejection_reason}</span>
                          )
                        ) : (
                          "--"
                        )}
                      </TableCell>
                    )}

                    <TableCell>
                      <StatusChip status={lease.assigned_status || "Active"} />
                    </TableCell>

                    {readOnly && (
                      <TableCell className="font-medium text-foreground">
                        {lease.last_action_at
                          ? new Date(lease.last_action_at).toLocaleString(
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

                    <TableCell className="text-right sticky right-0 bg-card">
                      <div className="flex items-center justify-end gap-2">
                        {!readOnly &&
                          lease?.assigned_status?.toLowerCase() === "pending" &&
                          onApprove &&
                          onReject ? (
                          <>
                            <ConfirmationDialog
                              title="Alert!"
                              description="Are you sure you want to approve ?"
                              confirmText="Yes"
                              onConfirm={async () => {
                                onApprove([lease.id]);
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
                              onClick={() => handleSingleRejectClick(lease.id)}
                              className="p-2 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-all"
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
                );
              })
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {hasData && totalRecords > 10 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border/30">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
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

          {/* Range info */}
          <p className="text-xs text-muted-foreground">
            {start}–{end} of {totalRecords}
          </p>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            {/* First page */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === 0 || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(0)}
            >
              <ChevronsLeft />
            </Button>

            {/* Previous */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
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
              className="h-7 w-7"
              disabled={page + 1 >= totalPages || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight />
            </Button>

            {/* Last page */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page + 1 >= totalPages || actionLoading.isApproving || actionLoading.isRejecting}
              onClick={() => onPageChange(totalPages - 1)}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
