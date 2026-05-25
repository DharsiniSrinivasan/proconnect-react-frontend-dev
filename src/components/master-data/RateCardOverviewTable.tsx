import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  ChevronsRight,
  ChevronsLeft,
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "../confirmationDialog";
import { StatusChip } from "./MasterStatusChip";
import { SortableTableHead } from "../sortable-table-head";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface RateCardsTableProps {
  rateCards: any;
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;

  // Filter props
  filterCode: string;
  onFilterCodeChange: (value: string) => void;
  filterName: string;
  onFilterNameChange: (value: string) => void;
  filterCustomer: string;
  onFilterCustomerChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterFrom: string;
  onFilterFromChange: (value: string) => void;
  filterTo: string;
  onFilterToChange: (value: string) => void;
  filterFrtRate: string;
  onFilterFrtRateChange: (value: string) => void;
  filterErate: string;
  onFilterErateChange: (value: string) => void;
  filterOdaRate: string;
  onFilterOdaRateChange: (value: string) => void;
  filterOdaService: string;
  onFilterOdaServiceChange: (value: string) => void;
  filterTotalRate: string;
  onFilterTotalRateChange: (value: string) => void;
  filterMinimum: string;
  onFilterMinimumChange: (value: string) => void;
  filter_tat_days: string;
  onFilterTatDays: (value: string) => void;
  filter_reason: string;
  onFilterReasonChange: (value: string) => void;
  filter_last_action: any;
  onLastActionFilter: (value: any) => void;

  // Sort props
  sortBy: string | null;
  sortOrder: string;
  onSort: (sortKey: string | null, sortOrder: string) => void;

  // Options for select filters
  statusOptions: Array<{ label: string; value: string }>;
  modeOptions: Array<{ label: string; value: string }>;
  isLoading: boolean;
  onReject: (ids: (string | number)[], reason: string) => void;
  onApprove: (ids: (string | number)[]) => void;
  readOnly: boolean;
  onRequestNameFilter: (value: string) => void;
  onAssigneeNameFilter: (value: string) => void;
  filter_request_name: string;
  filter_assignee_name: string;
}

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface RejectDialogState {
  isOpen: boolean;
  rateCardIds: (string | number)[];
  rateCardNames: string[];
  isMultiple: boolean;
}

// Reject Reason Dialog Component
const RejectReasonDialog = ({
  isOpen,
  rateCardNames,
  isMultiple,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  rateCardNames: string[];
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
              Reject Rate Card{isMultiple ? "s" : ""}
            </h2>
            {rateCardNames.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMultiple
                  ? `${rateCardNames.length} rate card${rateCardNames.length !== 1 ? "s" : ""} will be rejected`
                  : `${rateCardNames[0]} will be rejected`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                You are about to reject the rate cards
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
export const RateCardOverviewTable = ({
  rateCards,
  onPageChange,
  totalRecords,
  isLoading,
  page,
  pageSize,
  onPageSizeChange,
  filterCode,
  onFilterCodeChange,
  filterName,
  onFilterNameChange,
  filterCustomer,
  onFilterCustomerChange,
  filterStatus,
  onFilterStatusChange,
  filterFrom,
  onFilterFromChange,
  filterTo,
  onFilterToChange,
  filterFrtRate,
  onFilterFrtRateChange,
  filterErate,
  onFilterErateChange,
  filterOdaRate,
  onFilterOdaRateChange,
  filterOdaService,
  onFilterOdaServiceChange,
  filterTotalRate,
  onFilterTotalRateChange,
  filterMinimum,
  onFilterMinimumChange,
  filter_tat_days,
  onFilterTatDays,
  filter_reason,
  onFilterReasonChange,
  filter_last_action,
  onLastActionFilter,
  sortBy,
  sortOrder,
  onSort,
  statusOptions,
  modeOptions,
  onApprove,
  onReject,
  readOnly,
  filter_request_name,
  filter_assignee_name,
  onRequestNameFilter,
  onAssigneeNameFilter,
}: RateCardsTableProps) => {
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    isOpen: false,
    rateCardIds: [],
    rateCardNames: [],
    isMultiple: false,
  });

  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    isApproving: false,
    isRejecting: false,
  });
  const formatCurrency = (val: number) => {
    return val > 0 ? `₹${val.toFixed(2)}` : "-";
  };

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);

  const pendingRateCards = rateCards.filter(
    (rc: any) => rc.assigned_status?.toLowerCase() === "pending" && !readOnly,
  );

  // Check if all pending rate cards on current page are selected
  const allPendingSelected =
    pendingRateCards.length > 0 &&
    pendingRateCards.every((rc: any) => selectedIds.has(String(rc.rate_id)));
  const somePendingSelected = pendingRateCards.some((rc: any) =>
    selectedIds.has(String(rc.rate_id)),
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
      pendingRateCards.forEach((rc: any) =>
        newSelected.add(String(rc.rate_id)),
      );
    } else {
      pendingRateCards.forEach((rc: any) =>
        newSelected.delete(String(rc.rate_id)),
      );
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

  const handleRejectAllClick = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : ["all"];
    const names = rateCards
      .filter((rc: any) => ids.includes(String(rc.rate_id)))
      .map((rc: any) => `${rc.partner?.code} - ${rc.partner?.name}`);

    setRejectDialog({
      isOpen: true,
      rateCardIds: ids,
      rateCardNames: names,
      isMultiple: ids.length > 1,
    });
  };

  // Handle single reject - opens dialog
  const handleSingleRejectClick = (rateCardId: string | number) => {
    const rateCard = rateCards.find((rc: any) => rc.rate_id === rateCardId);
    if (rateCard) {
      setRejectDialog({
        isOpen: true,
        rateCardIds: [rateCardId],
        rateCardNames: [
          `${rateCard.partner?.code} - ${rateCard.partner?.name}`,
        ],
        isMultiple: false,
      });
    }
  };

  // Confirm rejection with reason
  const handleRejectConfirm = async (reason: string) => {
    setActionLoading((prev) => ({ ...prev, isRejecting: true }));
    try {
      onReject(rejectDialog.rateCardIds, reason);
      setSelectedIds(new Set());
    } finally {
      setActionLoading((prev) => ({ ...prev, isRejecting: false }));
      setRejectDialog({
        isOpen: false,
        rateCardIds: [],
        rateCardNames: [],
        isMultiple: false,
      });
    }
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, pageSize]);
  const hasData = readOnly
    ? rateCards.length > 0
    : pendingRateCards.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Reject Reason Dialog */}
      <RejectReasonDialog
        isOpen={rejectDialog.isOpen}
        rateCardNames={rejectDialog.rateCardNames}
        isMultiple={rejectDialog.isMultiple}
        onConfirm={handleRejectConfirm}
        onCancel={() =>
          setRejectDialog({
            isOpen: false,
            rateCardIds: [],
            rateCardNames: [],
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
      {!isLoading && selectedIds.size === 0 && !readOnly && pendingRateCards.length > 0 && (
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
              {pendingRateCards.length > 0 && (
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
                searchValue={filterCode}
                label="Transporter code"
                sortKey="code"
                onSearch={onFilterCodeChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterName}
                label="Transporter name"
                sortKey="name"
                onSearch={onFilterNameChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterCustomer}
                label="Customer name"
                sortKey="customer_name"
                onSearch={onFilterCustomerChange}
                searchable={true}
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
                searchValue={filterFrom}
                label="From"
                sortKey="from"
                onSearch={onFilterFromChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterTo}
                label="To"
                sortKey="to"
                onSearch={onFilterToChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              <SortableTableHead
                searchValue={filterFrtRate}
                label="Frt rate"
                sortKey="frt_rate"
                onSearch={onFilterFrtRateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterErate}
                label="E rate"
                sortKey="e_rate"
                onSearch={onFilterErateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterOdaRate}
                label="ODA Taxes"
                sortKey="oda_rate"
                onSearch={onFilterOdaRateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterOdaService}
                label="ODA service"
                sortKey="oda_service_charge"
                onSearch={onFilterOdaServiceChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterTotalRate}
                label="Total rate"
                sortKey="total_rate"
                onSearch={onFilterTotalRateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filterMinimum}
                label="Minimum"
                sortKey="minimum"
                onSearch={onFilterMinimumChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                searchValue={filter_tat_days}
                label="Tat"
                sortKey="tat_days"
                onSearch={onFilterTatDays}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
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
                  onSort={onSort}
                />
              )}
              {readOnly ? (
                <SortableTableHead
                  label="Status"
                  sortKey="assigned_status"
                  selectable={true}
                  options={statusOptions}
                  selectedValue={filterStatus}
                  onSelect={onFilterStatusChange}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
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
                <TableHead className="text-muted-foreground text-1xl font-medium text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {pendingRateCards.length > 0 && (
                    <TableCell>
                      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                  {Array.from({ length: !readOnly ? 15 : 17 }).map(
                    (_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (!readOnly && pendingRateCards.length === 0) || rateCards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    pendingRateCards.length > 0
                      ? readOnly
                        ? 17
                        : 16
                      : readOnly
                        ? 17
                        : 15
                  }
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              rateCards?.map((rc) => (
                <TableRow
                  key={rc.rate_id}
                  className={`border-border/30 transition-all duration-200 ${selectedIds.has(String(rc.rate_id))
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-primary/5"
                    }`}
                >
                  {/* Checkbox cell */}
                  {rc.assigned_status?.toLowerCase() === "pending" &&
                    !readOnly && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedIds.has(String(rc.rate_id))}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              String(rc.rate_id),
                              checked as boolean,
                            )
                          }
                          disabled={actionLoading.isApproving || actionLoading.isRejecting}
                          className="ml-2"
                        />
                      </TableCell>
                    )}
                  {pendingRateCards.length > 0 &&
                    rc.assigned_status?.toLowerCase() !== "pending" && (
                      <TableCell className="w-12" />
                    )}

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {rc?.partner?.code}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="font-medium text-foreground max-w-[200px] truncate"
                    title={rc.courierName}
                  >
                    {rc.partner?.name}
                  </TableCell>
                  <TableCell
                    className="font-medium text-foreground max-w-[200px] truncate"
                    title={rc.courierName}
                  >
                    {rc.partner?.customer?.name}(
                    {rc.partner?.customer?.vendor_code})
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {readOnly
                      ? rc.assigned_to_name
                      : rc.requested_by_name || "--"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="text-sm">{rc.from_city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      <span className="text-sm">{rc.to_city}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {formatCurrency(rc.rate)}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {formatCurrency(rc.e_rate)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rc.oda_service_charge > 0 ? (
                      <span className="text-amber-400">
                        ₹{rc.oda_rate.toFixed(0)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rc.oda_service_charge > 0 ? (
                      <span className="text-amber-400">
                        ₹{rc.oda_service_charge.toFixed(0)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-emerald-400">
                    {formatCurrency(
                      (Number(rc.rate) || 0) + (Number(rc.e_rate) || 0),
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    ₹{rc.minimum_rate}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {rc.tat_days}
                  </TableCell>
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {rc.rejection_reason ? (
                        rc.rejection_reason.length > 15 ? (
                          <>
                            {/* Desktop Tooltip */}
                            <div className="hidden sm:block">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      {rc.rejection_reason.slice(0, 15) + "..."}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <pre className="whitespace-pre-wrap break-words text-sm">
                                      {rc.rejection_reason}
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
                                    {rc.rejection_reason.slice(0, 15) + "..."}
                                  </span>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 max-h-60 overflow-auto">
                                  <pre className="whitespace-pre-wrap break-words text-sm">
                                    {rc.rejection_reason}
                                  </pre>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </>
                        ) : (
                          <span>{rc.rejection_reason}</span>
                        )
                      ) : (
                        "--"
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusChip status={rc?.assigned_status} />
                  </TableCell>
                  {readOnly && (
                    <TableCell className="font-medium text-foreground">
                      {rc.last_action_at
                        ? new Date(rc.last_action_at).toLocaleString("en-IN", {
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
                  {!readOnly && (
                    <TableCell align="left" className="sticky right-0 bg-card">
                      <div className="flex items-center justify-center gap-2">
                        {rc?.assigned_status?.toLowerCase() === "pending" && (
                          <>
                            <ConfirmationDialog
                              title="Alert!"
                              description="Are you sure you want to approve ?"
                              confirmText="Yes"
                              onConfirm={async () => {
                                onApprove([rc.rate_id]);
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
                                handleSingleRejectClick(rc.rate_id)
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
                        {(rc?.assigned_status?.toLowerCase() === "approved" ||
                          rc?.assigned_status?.toLowerCase() === "rejected" ||
                          (rc?.assigned_status?.toLowerCase() === "pending" &&
                            readOnly)) && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${rc?.assigned_status?.toLowerCase() === "approved" ? "border bg-success/10 text-success border-success/30" : ""}
      ${rc?.assigned_status?.toLowerCase() === "rejected" ? "border bg-error/10 text-error border-error/30" : ""}
      ${rc?.assigned_status?.toLowerCase() === "pending" && readOnly ? "border bg-amber-10 text-amber-400 border-amber-400/30" : ""}
    `}
                            >
                              {rc.assigned_status === "approved" && (
                                <Check className="w-3 h-3" />
                              )}
                              {rc.assigned_status === "rejected" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              {rc.assigned_status}
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
