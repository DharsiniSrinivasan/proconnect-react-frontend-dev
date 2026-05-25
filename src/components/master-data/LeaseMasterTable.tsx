import { useEffect, useRef, useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Info,
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
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { format, parseISO } from "date-fns";
import StatusSwitch from "../StatusSwitch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useAuditStore } from "@/stores/auditStore";
import { useFacilityAgreementStore } from "@/stores/leaseStore";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { ComboBox } from "../search-select/combo-box";

interface LeaseItem {
  id?: string;
  lease_agreement_number?: string;
  start_date?: string;
  end_date?: string;
  rent_amount?: number;
  status?: string;
  created_date?: string;
  last_updated?: string;
}

interface LeaseMasterTableProps {
  leases: any[];
  onEdit: (lease: LeaseItem) => void;
  onView?: (lease: any) => void;
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
  facilityAgreementCategory: any[];
  status: any[];
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
}

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export const LeaseMasterTable = ({
  leases,
  onEdit,
  onDelete,
  page,
  onView,
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
  status,
}: LeaseMasterTableProps) => {
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const [pendingStatus, setPendingStatus] = useState<{
    id: number;
    checked: boolean;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [assigneeError, setAssigneeError] = useState("");
  const { assigneeData, getAssigneeList } = useAuditStore();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const { statusUpdate,fetchAgreements } = useFacilityAgreementStore()
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
  useEffect(() => {
    getAssigneeList();
  }, []);
    useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node)
    ) {
      setOpenTooltipId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  const handleStatusChange = (id: number, checked: boolean) => {
    setPendingStatus({
      id,
      checked,
    });
    setDialogOpen(true);
  };
  let userOptionsValue =
    assigneeData?.map((user: any) => ({
      id: user.id,
      label: user.name,
      value: String(user.name),
    })) || [];

  const submitStatusChange = async () => {
    try {
      const payload = {
        agreement_ids: [pendingStatus?.id],
        assigned_to: Number(selectedUser),
        approval_type: pendingStatus?.checked
          ? "Activation"
          : "Deactivation",
      };

     const response:any= await statusUpdate(payload);
      if(response.status_code===200||response.status_code===201){
       await fetchAgreements(page,pageSize)
      }

      // Success handling
      setDialogOpen(false);
      setSelectedUser(null);
      setPendingStatus(null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const getDaysUntilExpiry = (endDate: string) => {
    try {
      const end = parseISO(endDate);
      const today = new Date();
      const diff = Math.ceil(
        (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diff;
    } catch {
      return null;
    }
  };

  const getExpiryStatus = (endDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(endDate);
    if (daysUntilExpiry === null)
      return { color: "text-muted-foreground", label: "N/A" };
    if (daysUntilExpiry < 0)
      return { color: "text-destructive", label: "Expired" };
    if (daysUntilExpiry <= 30)
      return { color: "text-amber-500", label: `${daysUntilExpiry} days left` };
    return { color: "text-green-500", label: `${daysUntilExpiry} days left` };
  };

  return (
    <NeonCard
      title="Agreement Master"
      className="h-full"
      count={String(totalRecords)}
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
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
              <SortableTableHead
                label="Status"
                sortKey="status"
                selectable={true}
                options={status?.map((user) => ({ label: user, value: user }))}
                selectedValue={statusFilter}
                onSelect={onStatusFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />

              <TableHead className="text-center w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : leases?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                    className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                  >
                    <TableCell className="font-medium text-foreground">
                      {lease.agreement_number}
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

                    <TableCell className="flex items-center gap-2">
                      <StatusSwitch
                        checked={lease.status === "Active"}
                        onCheckedChange={(checked) =>
                          handleStatusChange(Number(lease.id), checked)
                        }
                      />

                      {lease.assigned_status === "Pending" && (
                        <div ref={tooltipRef}>
                        <TooltipProvider>
                          <Tooltip open={openTooltipId === Number(lease.id)}>
                            <TooltipTrigger asChild>
                              <Info
                                className="w-4 h-4 text-muted-foreground cursor-pointer"
                                onClick={() =>
                                  setOpenTooltipId(
                                    openTooltipId === Number(lease.id) ? null : Number(lease.id)
                                  )
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              Request has been raised and is awaiting approval.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => onEdit(lease)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => onView(lease)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <ConfirmationDialog
                          title={"Remove Lease"}
                          description={
                            "Are you sure you want to remove this lease agreement?"
                          }
                          confirmText={"Remove"}
                          onConfirm={() => onDelete(lease.id.toString())}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <AssigneeConfirmationDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          title="Change Status"
          description="Please select an assignee before proceeding."
          confirmText="Proceed"
          cancelText="Cancel"
          onConfirm={async () => {
            if (!selectedUser) {
              setAssigneeError("Please select an assignee");
              return false;
            }

            setAssigneeError(""); // clear error
            await submitStatusChange();
            return true;
          }}
          content={
            <div className="flex flex-col gap-1">
              <ComboBox
                options={userOptionsValue}
                selectedValue={selectedUser}
                placeholder="Select Assignee"
                renderOption={(option: any) => (
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{option.label}</span>
                  </div>
                )}
                onValueChange={(val: any) => {
                  setSelectedUser(val);
                  setAssigneeError("");
                }}
              />

              {assigneeError && (
                <span className="text-red-500 text-sm">
                  {assigneeError}
                </span>
              )}
            </div>
          }
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {totalRecords > 10 && (
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
              disabled={page === 0}
              onClick={() => onPageChange(0)}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
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
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Last */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(totalPages - 1)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </NeonCard>
  );
};
