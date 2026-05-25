import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ChevronsRight,
  ChevronsLeft,
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
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "../confirmationDialog";
import { ModeChip } from "./MasterStatusChip";
import { SortableTableHead } from "../sortable-table-head";
import { useEffect, useRef, useState } from "react";
import { useAuditStore } from "@/stores/auditStore";
import StatusSwitch from "../StatusSwitch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { ComboBox } from "../search-select/combo-box";
import { rateCardStore } from "@/stores/rateCardStore";

interface RateCardsTableProps {
  rateCards: any;
  onEdit?: (rateCard: any) => void;
  onView?: (rateCard: any) => void;
  onDelete?: (id: string) => Promise<boolean>;
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
  filterMode: string;
  onFilterModeChange: (value: string) => void;
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

  // Sort props
  sortBy: string | null;
  sortOrder: string;
  onSort: (sortKey: string | null, sortOrder: string) => void;

  // Options for select filters
  statusOptions: Array<{ label: string; value: string }>;
  modeOptions: Array<{ label: string; value: string }>;
  isLoading: boolean;
}

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export const RateCardsTable = ({
  rateCards,
  onEdit,
  onDelete,
  onView,
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
  filterMode,
  onFilterModeChange,
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
  sortBy,
  sortOrder,
  onSort,
  statusOptions,
  modeOptions,
}: RateCardsTableProps) => {
  const formatCurrency = (val: number) => {
    return val > 0 ? `₹${val.toFixed(2)}` : "-";
  };

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const { statusChangeRateCard } = rateCardStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{
    rate_id: number;
    checked: boolean;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { assigneeData, getAssigneeList } = useAuditStore();
  const [assigneeError, setAssigneeError] = useState("");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  useEffect(() => {
    setPageInput(page + 1);
  }, [page]);
  useEffect(() => {
    getAssigneeList();
  }
    , []);
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

  const handleStatusChange = (id: number, checked: boolean) => {
    setPendingStatus({
      rate_id: id,
      checked,
    });
    setDialogOpen(true);
  };

  const submitStatusChange = async () => {
    try {
      const payload = {
        rate_card_ids: [pendingStatus?.rate_id],
        assigned_to: Number(selectedUser),
        approval_type: pendingStatus?.checked
          ? "Activation"
          : "Deactivation",
      };
      await statusChangeRateCard(payload);

      // Success handling
      setDialogOpen(false);
      setSelectedUser(null);
      setPendingStatus(null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };

  let userOptionsValue =
    assigneeData?.map((user: any) => ({
      id: user.id,
      label: user.name,
      value: String(user.name),
    })) || [];
  return (
    <NeonCard
      title="Rate Card Master"
      className="h-full"
      count={String(totalRecords)}
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
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
              {/* <SortableTableHead
                searchValue={filterCustomer}
                label="Customer name"
                sortKey="customer_name"
                onSearch={onFilterCustomerChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}

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
                label="Mode"
                sortKey="mode"
                selectable={true}
                options={modeOptions}
                selectedValue={filterMode}
                onSelect={onFilterModeChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              {/* <SortableTableHead
                searchValue={filterFrtRate}
                label="Frt rate"
                sortKey="frt_rate"
                onSearch={onFilterFrtRateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}
              {/* <SortableTableHead
                searchValue={filterErate}
                label="E rate"
                sortKey="e_rate"
                onSearch={onFilterErateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}
              {/* <SortableTableHead
                searchValue={filterOdaRate}
                label="ODA Taxes"
                sortKey="oda_rate"
                onSearch={onFilterOdaRateChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}
              {/* <SortableTableHead
                searchValue={filterOdaService}
                label="ODA service"
                sortKey="oda_service_charge"
                onSearch={onFilterOdaServiceChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}
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
              {/* <SortableTableHead
                searchValue={filterMinimum}
                label="Minimum"
                sortKey="minimum"
                onSearch={onFilterMinimumChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              /> */}
              <SortableTableHead
                searchValue={filter_tat_days}
                label="TAT"
                sortKey="tat_days"
                onSearch={onFilterTatDays}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
              <SortableTableHead
                label="Status"
                sortKey="status"
                selectable={true}
                options={statusOptions}
                selectedValue={filterStatus}
                onSelect={onFilterStatusChange}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
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
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rateCards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              rateCards.map((rc) => (
                <TableRow
                  key={rc.id}
                  className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                >
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
                  {/* <TableCell className="font-medium text-foreground max-w-[200px] truncate" title={rc.courierName}>
                    {rc.partner?.customer?.name}({rc.partner?.customer?.vendor_code})
                  </TableCell> */}
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
                  <TableCell>
                    <ModeChip
                      key={rc.transport_mode}
                      mode={rc.transport_mode}
                    />
                  </TableCell>
                  {/* <TableCell className="font-mono text-sm text-muted-foreground">
                    {formatCurrency(rc.rate)}
                  </TableCell> */}
                  {/* <TableCell className="font-mono text-sm text-muted-foreground">
                    {formatCurrency(rc.e_rate)}
                  </TableCell> */}
                  {/* <TableCell className="font-mono text-sm">
                    {rc.oda_service_charge > 0 ? (
                      <span className="text-amber-400">₹{rc.oda_rate.toFixed(0)}</span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell> */}
                  {/* <TableCell className="font-mono text-sm">
                    {rc.oda_service_charge > 0 ? (
                      <span className="text-amber-400">₹{rc.oda_service_charge.toFixed(0)}</span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell> */}
                  <TableCell className="font-mono font-semibold text-emerald-400">
                    {formatCurrency(
                      (Number(rc.rate) || 0) + (Number(rc.e_rate) || 0),
                    )}
                  </TableCell>
                  {/* <TableCell className="font-mono text-sm text-muted-foreground">
                    ₹{rc.minimum_rate}
                  </TableCell> */}
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {rc.tat_days}
                  </TableCell>
                  {/* <TableCell> */}

                  <TableCell className="flex items-center gap-2">
                    <StatusSwitch
                      checked={rc.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(Number(rc.rate_id), checked)
                      }
                    />
                    {rc.assigned_status === "Pending" && (
                      <div ref={tooltipRef}>
                        <TooltipProvider>
                          <Tooltip open={openTooltipId === Number(rc.rate_id)}>
                            <TooltipTrigger asChild>
                              <Info
                                className="w-4 h-4 text-muted-foreground cursor-pointer"
                                onClick={() =>
                                  setOpenTooltipId(
                                    openTooltipId === Number(rc.rate_id) ? null : Number(rc.rate_id)
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
                  {/* </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => onEdit(rc)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => onView(rc)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <ConfirmationDialog
                        title={"Remove Rate card"}
                        description={
                          "Are you sure you want to remove this rate card?"
                        }
                        confirmText={"Remove"}
                        onConfirm={() => onDelete(rc.rate_id)}
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

