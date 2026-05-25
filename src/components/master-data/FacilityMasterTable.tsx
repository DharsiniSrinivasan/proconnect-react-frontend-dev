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
import {  TierChip } from "./MasterStatusChip";
import type { FacilityItem } from "@/mocks/masterData.mock";
import { ConfirmationDialog } from "../confirmationDialog";
import { useCustomerStore, useFacilityStore } from "@/stores/masterStore";
import { SortableTableHead } from "../sortable-table-head";
import StatusSwitch from "../StatusSwitch";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { ComboBox } from "../search-select/combo-box";
import { useAuditStore } from "@/stores/auditStore";

interface FacilityMasterTableProps {
  facilities: FacilityItem[];
  onEdit: (facility: FacilityItem) => void;
  onView: (facility: any) => void;
  onDelete: (id: string) => Promise<boolean>;
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
  filter_facility_code: string;
  filter_customer: string;
  fixed_cost: string;
  sortBy: string | null;
  sortOrder: SortOrder;
  onFilterNameChange: (value: string) => void;
  onFilterCustomerChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onFixedCostChange: (value: string) => void;
  onFilterCodeChange: (value: string) => void;
  onSortChange: (sortBy: string | null, sortOrder: SortOrder) => void;
  isLoading: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export const FacilityMasterTable = ({
  facilities,
  onEdit,
  onDelete,
  onView,
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
  filter_facility_code,
  sortBy,
  sortOrder,
  onFilterNameChange,
  onFilterCodeChange,
  onSortChange,
}: FacilityMasterTableProps) => {
  const { region } = useCustomerStore();
   const { statusUpdate } = useFacilityStore()
  const { status, tiers } = useFacilityStore();
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
        facility_ids: [pendingStatus?.id],
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
  return (
    <NeonCard
      title="Facility Master"
      className="h-full"
      count={String(totalRecords)}
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <SortableTableHead
                searchValue={filter_facility_code}
                label="Code"
                sortKey="facility_code"
                onSearch={onFilterCodeChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
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
              <TableHead className="text-muted-foreground text-1xl font-medium text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 8 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : facilities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              facilities.map((facility) => (
                <TableRow
                  key={facility.id}
                  className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <TableCell className="font-medium text-foreground">
                    {facility.facility_code}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {facility.name}
                  </TableCell>
                  {/* <TableCell className="font-medium text-foreground">{facility.customer_name}</TableCell> */}
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
                  <TableCell className="flex items-center gap-2">
                    <StatusSwitch
                      checked={facility.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(Number(facility.id), checked)
                      }
                    />

                    {facility.assigned_status === "Pending" && (
                       <div ref={tooltipRef}>
                      <TooltipProvider>
                        <Tooltip open={openTooltipId === Number(facility.id)}>
                          <TooltipTrigger asChild>
                            <Info
                              className="w-4 h-4 text-muted-foreground cursor-pointer"
                              onClick={() =>
                                setOpenTooltipId(
                                  openTooltipId === Number(facility.id) ? null : Number(facility.id)
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
                        onClick={() => onEdit(facility)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => onView(facility)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <ConfirmationDialog
                        title={"Remove Facility"}
                        description={
                          "Are you sure you want to remove this facility?"
                        }
                        confirmText={"Remove"}
                        onConfirm={() => onDelete(facility.id.toString())}
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
