import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
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
import { ModeChip, StatusChip } from "./MasterStatusChip";
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import StatusSwitch from "../StatusSwitch";
import { ComboBox } from "../search-select/combo-box";
import { useAuditStore } from "@/stores/auditStore";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { usePartnerStore } from "@/stores/partnerStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
export type MasterStatus = "Active" | "Inactive" | "Pending" | "Suspended";
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
export interface PartnerRow {
  id: string;
  name: string;
  customer_name: string;
  code: string;
  otif_percent: string | number;
  status: MasterStatus;
  contact_email?: string;
  assigned_to_name?: string;
  assigned_status?: string;
  rejection_reason?: string;
  transport_mode: string[];
}
interface PartnerMasterTableProps {
  partners: PartnerRow[];
  page: number;
  pageSize: number;
  totalRecords: number;
  // Filter states
  statusFilter: string;
  AssigneestatusFilter: string;
  searchQuery: string;
  filter_assignee_name: string;
  modeFilter: string[];
  filter_name: string;
  filter_customer: string;
  filter_code: string;
  filter_email: string;
  filter_otif: string;
  // Filter handlers
  onStatusFilter: (value: string) => void;
  onAssigneeStatusFilter: (value: string) => void;
  onModeFilter: (values: string[]) => void;
  onNameFilter: (value: string) => void;
  onCodeFilter: (value: string) => void;
  onEmailFilter: (value: string) => void;
  onOTFFilter: (value: string) => void;
  onCustomerFilter: (value: string) => void;
  onAssigneeNameFilter: (value: string) => void;
  onReasonFilter: (value: string) => void;
  filter_reason: string;
  // Sort states
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
  // Pagination handlers
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  // Action handlers
  onEdit: (partner: PartnerRow) => void | Promise<void>;
  onDelete: (id: string) => Promise<boolean>;
  // Data for dropdowns
  modes: string[];
  statuses: string[];
  isLoading: boolean;
}
export const PartnerMasterTable = ({
  partners,
  onEdit,
  onDelete,
  onPageChange,
  totalRecords,
  page,
  onPageSizeChange,
  pageSize,
  statusFilter,
  AssigneestatusFilter,
  modeFilter,
  onModeFilter,
  onStatusFilter,
  onAssigneeStatusFilter,
  filter_name,
  filter_customer,
  filter_code,
  filter_email,
  filter_otif,
  filter_assignee_name,
  onAssigneeNameFilter,
  onReasonFilter,
  filter_reason,
  onNameFilter,
  onCodeFilter,
  onEmailFilter,
  onCustomerFilter,
  onOTFFilter,
  sortBy,
  sortOrder,
  onSort,
  modes,
  statuses,
  isLoading,
}: PartnerMasterTableProps) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  // Calculate pagination values
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const { assigneeData, getAssigneeList } = useAuditStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [inactiveReason, setInactiveReason] = useState("");
  const [assigneeError, setAssigneeError] = useState("");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const { statusUpdate } = usePartnerStore()
  const [pendingStatus, setPendingStatus] = useState<{
    id: number;
    checked: boolean;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const onView = (details: any) => {
    navigate(
      `/master-data/page/transporters/details/${details.id}/${details.name}`,
    );
  };
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

  useEffect(() => {
    getAssigneeList();
  }
    , []);
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
        partner_ids: [pendingStatus?.id],
        assigned_to: Number(selectedUser),
        approval_type: pendingStatus?.checked
          ? "Activation"
          : "Deactivation",
      };

      await statusUpdate(payload);

      // Success handling
      setDialogOpen(false);
      setSelectedUser(null);
      setPendingStatus(null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };
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
  return (
    <NeonCard
      title="Transporter Master"
      className="h-full"
      count={String(totalRecords)}
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
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
                label="Name"
                sortKey="name"
                onSearch={onNameFilter}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

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
              <SortableTableHead
                label="Status"
                sortKey="status"
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
              <TableHead className="text-muted-foreground text-1xl font-medium text-center">
                Actions
              </TableHead>
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
            ) : partners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              partners?.map((partner, index) => (
                <TableRow
                  key={index}
                  className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <TableCell className="font-medium text-foreground">
                    <Badge variant="outline" className="font-mono text-xs">
                      {partner.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {partner.name}
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

                  <TableCell className="flex items-center gap-2">
                    <StatusSwitch
                      checked={partner.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(Number(partner.id), checked)
                      }
                    />
                    {partner.assigned_status === "Pending" && (
                      <div ref={tooltipRef}>
                        <TooltipProvider>
                          <Tooltip open={openTooltipId === Number(partner.id)}>
                            <TooltipTrigger asChild>
                              <Info
                                className="w-4 h-4 text-muted-foreground cursor-pointer"
                                onClick={() =>
                                  setOpenTooltipId(
                                    openTooltipId === Number(partner.id) ? null : Number(partner.id)
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
                        onClick={() => onEdit(partner)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => onView(partner)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <ConfirmationDialog
                        title="Remove Transporter"
                        description="Are you sure you want to remove this transporter?"
                        confirmText="Remove"
                        onConfirm={() => onDelete(partner.id)}
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
