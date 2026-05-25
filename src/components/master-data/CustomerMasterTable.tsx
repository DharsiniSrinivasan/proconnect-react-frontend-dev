import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
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
import { CustomerRow, useCustomerStore } from "@/stores/masterStore";
import { ConfirmationDialog } from "../confirmationDialog";
import { SortableTableHead } from "../sortable-table-head";
import { Badge } from "../ui/badge";
import { useAuditStore } from "@/stores/auditStore";
import { AssigneeConfirmationDialog } from "../AssigneeConfirmationDialog";
import { ComboBox } from "../search-select/combo-box";
import StatusSwitch from "../StatusSwitch";

interface CustomerMasterTableProps {
  customers: CustomerRow[];
  onEdit: (customer: CustomerRow) => void;
  onView: (customer: CustomerRow) => void;
  onDelete: (id: string) => Promise<boolean>;
  page: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  statusFilter: string;
  regionFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRegionFilterChange: (value: string) => void;
  filter_vendor: string;
  filter_name: string;
  filter_gstin: string;
  filter_billing_address: string;
  filter_shipping_address: string;
  filter_shipping_pincode: string;
  dateFilter: any;
  sortBy: string | null;
  sortOrder: SortOrder;
  onFilterVendorChange: (value: string) => void;
  onFilterNameChange: (value: string) => void;
  onFilterGstinChange: (value: string) => void;
  onFilterBillingAddressChange: (value: string) => void;
  onFilterShippingAddressChange: (value: string) => void;
  onFilterPincodeChange: (value: string) => void;
  onDateFilterChange: (value: any) => void;
  isLoading: boolean;
  onSortChange: (sortBy: string | null, sortOrder: SortOrder) => void;
}

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
export const CustomerMasterTable = ({
  customers,
  onEdit,
  onDelete,
  onView,
  isLoading,
  totalRecords,
  pageSize,
  onPageSizeChange,
  page,
  onPageChange,
  statusFilter,
  regionFilter,
  onStatusFilterChange,
  onRegionFilterChange,
  filter_name,
  filter_vendor,
  filter_gstin,
  filter_shipping_pincode,
  dateFilter,
  sortBy,
  sortOrder,
  onFilterVendorChange,
  onFilterNameChange,
  onFilterGstinChange,
  onFilterPincodeChange,
  onDateFilterChange,
  onSortChange,
}: CustomerMasterTableProps) => {
  const { status, region } = useCustomerStore();
  const [pageInput, setPageInput] = useState<number | "">(page + 1);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const {customerStatusUpdate} = useCustomerStore();
   const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<{
      customer_id: number;
      checked: boolean;
    } | null>(null);
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

    const submitStatusChange = async () => {
    try {
      const payload = {
        customer_ids: [pendingStatus?.customer_id],
      };
      await customerStatusUpdate(payload);

      // Success handling
      setDialogOpen(false);
      setPendingStatus(null);

    } catch (error) {
      console.error("API Error:", error);
    }
  };
   

  const handleStatusChange = (id: number, checked: boolean) => {
    setPendingStatus({
      customer_id: id,
      checked,
    });
    setDialogOpen(true);
  };
  return (
    <NeonCard title="Customer Master" className="h-full">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <SortableTableHead
                searchValue={filter_vendor}
                label="Customer code"
                sortKey="vendor_code"
                onSearch={onFilterVendorChange}
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
                searchValue={filter_gstin}
                label="GSTIN"
                sortKey="gstin"
                onSearch={onFilterGstinChange}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />

              <SortableTableHead
                searchValue={filter_shipping_pincode}
                label="Shipping pincode"
                sortKey="pincode"
                onSearch={onFilterPincodeChange}
                searchable={true}
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
                label="Last updated"
                sortKey="last updated"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
                datepicker
                dateValue={dateFilter}
                onDateSelect={onDateFilterChange}
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
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.customer_id}
                  className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <TableCell className="font-medium text-foreground">
                    <Badge variant="outline" className="font-mono text-xs">
                      {customer.vendor_code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {customer.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {customer.gstin}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {customer.pin_code}
                  </TableCell>
                  
                  <TableCell className="text-muted-foreground">
                    {customer.region}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {
                      customer.last_updated
                        ? new Date(customer.last_updated).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : "--"
                    }
                  </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <StatusSwitch
                        checked={customer.status === "Active"}
                        onCheckedChange={(checked) =>
                          handleStatusChange(Number(customer.customer_id), checked)
                        }
                      />

                     
                    </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => onEdit(customer)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => onView(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <ConfirmationDialog
                        title={"Remove Customer"}
                        description={
                          "Are you sure you want to remove this customer?"
                        }
                        confirmText={"Remove"}
                        onConfirm={() => onDelete(customer.customer_id)}
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
  confirmText="Proceed"
  description="Are you sure you want to change the status?"
  cancelText="Cancel"
  onConfirm={async () => {
    await submitStatusChange();
    return true;
  }}
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
