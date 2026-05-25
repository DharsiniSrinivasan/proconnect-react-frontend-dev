import {
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import { useCustomerStore } from "@/stores/masterStore";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { ComboBox } from "../search-select/combo-box";
import { useAuditStore } from "@/stores/auditStore";
import { useContractStore } from "@/stores/contractStore";
import StatusSwitch from "../StatusSwitch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
export interface ContractorRow {
  id: string;
  contract_no: string;
  valid_from: string;
  valid_to: string;
}

interface ContractorTableProps {
  contractors: any[];
  statusFilter: string;
  page: number;
  pageSize: number;
  totalRecords: number;
  showDelete: boolean;
  filter_contract_no: string;
  filter_valid_from: any;
  filter_valid_to: any;
  filter_partner_name: string;
  filter_customer: string;
  onStatusFilterChange: (value: string) => void;
  onContractFilter: (value: string) => void;
  onPartnerFilter: (value: string) => void;
  onCustomerFilter: (value: string) => void;
  onValidFromFilter: (date: Date | null) => void;
  onValidToFilter: (date: Date | null) => void;
  sortBy: string | null;
  sortOrder: "A_TO_Z" | "Z_TO_A" | null;
  onSort: (sortBy: string | null, sortOrder: any) => void;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onEdit: (row: ContractorRow) => void;
  onView: (row: ContractorRow) => void;
  onDelete?: (id: string) => Promise<boolean>;

  isLoading: boolean;
}

export const ContractorTable = ({
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
  onStatusFilterChange,
  statusFilter,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  onPartnerFilter,
  isLoading,
  filter_partner_name,
  showDelete,
}: ContractorTableProps) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const { status, fetchStatus } = useCustomerStore();
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    id: number;
    checked: boolean;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { assigneeData, getAssigneeList } = useAuditStore();
  const { statusUpdateContract } = useContractStore();
  const [assigneeError, setAssigneeError] = useState("");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  useEffect(() => {
    setPageInput(page + 1);
  }, [page]);
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
  useEffect(() => {
    getAssigneeList();
    fetchStatus();
  }
    , []);
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

  let userOptionsValue =
    assigneeData?.map((user: any) => ({
      id: user.id,
      label: user.name,
      value: String(user.name),
    })) || [];

  const submitStatusChange = async () => {
    try {
      const payload = {
        contract_ids: [pendingStatus?.id],
        assigned_to: Number(selectedUser),
        approval_type: pendingStatus?.checked
          ? "Activation"
          : "Deactivation",
      };

      await statusUpdateContract(payload);

      // Success handling
      setDialogOpen(false);
      setSelectedUser(null);
      setPendingStatus(null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const handleStatusChange = (id: number, checked: boolean) => {
    setPendingStatus({
      id,
      checked,
    });
    setDialogOpen(true);
  };
  return (
    <NeonCard
      title="Contractor Master"
      className="h-full"
      count={String(totalRecords)}
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
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
                sortKey="filter_customer_name"
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

              <SortableTableHead
                label="Status"
                sortKey="status"
                selectable={true}
                options={status.map((user) => ({ label: user, value: user }))}
                selectedValue={statusFilter}
                onSelect={onStatusFilterChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <TableHead className="text-center pr-0">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : contractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              contractors.map((row) => (
                <TableRow key={row.id} className="hover:bg-primary/5">
                  <TableCell>
                    <Badge variant="outline">{row.contract_no}</Badge>
                  </TableCell>
                  <TableCell>{row.partner_name}</TableCell>
                  <TableCell>{row.customer_name}</TableCell>

                  <TableCell>{row.valid_from}</TableCell>

                  <TableCell>{row.valid_to}</TableCell>


                  <TableCell className="flex items-center gap-2">
                    <StatusSwitch
                      checked={row.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(Number(row.id), checked)
                      }
                    />

                    {row.assigned_status === "Pending" && (
                      <div ref={tooltipRef}>
                        <TooltipProvider>
                          <Tooltip open={openTooltipId === Number(row.id)}>
                            <TooltipTrigger asChild>
                              <Info
                                className="w-4 h-4 text-muted-foreground cursor-pointer"
                                onClick={() =>
                                  setOpenTooltipId(
                                    openTooltipId === Number(row.id) ? null : Number(row.id)
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

                  <TableCell className="text-right ">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => onEdit(row)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => onView(row)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {showDelete && (
                        <ConfirmationDialog
                          title="Remove Contractor"
                          description="Are you sure you want to remove this contractor?"
                          confirmText="Remove"
                          onConfirm={() => onDelete(row.id)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </ConfirmationDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Pagination */}

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

export default ContractorTable;
