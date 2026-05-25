import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SortableTableHead } from "../sortable-table-head";
import { getStorage } from "@/utils/storage";
import { TableCell, TableRow } from "../ui/table";



interface Props {
  value: string | null;
  onChange: (val: string, dataset?: any) => void;
  batch_name: string;
  setBatch_name: (val: string) => void;
  filter_name: string;
  setFilter_name: (val: string) => void;
  filter_customer: string;
  setFilter_customer: (val: string) => void;
  filter_uploadBy: string;
  setUploadBy: (val: string) => void;
  filter_dqs: string;
  setDqs: (val: string) => void;
  data: any[];
  isLoading: boolean;
  total: number;
  pageSize: number;
  setPageSize: (val: number) => void;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  sortBy: string | null;
  sortOrder: SortOrder;
  onSort: (sortBy: string | null, sortOrder: SortOrder) => void;
}
export type SortOrder = "asc" | "desc" | null;
export function DatasetTableComboBox({
  value,
  onChange,
  batch_name,
  setBatch_name,
  filter_name,
  setFilter_name,
  filter_customer,
  setFilter_customer,
  filter_uploadBy,
  setUploadBy,
  data,
  isLoading,
  total,
  pageSize,
  setPageSize,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  setCurrentPage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
    const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const [pageInput, setPageInput] = useState<number | "">(currentPage);
  const onPageSizeChange = (size: number) => {
    setPageSize(size);
  };
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };



  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" &&
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== currentPage
      ) {
        onPageChange(pageInput);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput, currentPage, totalPages]);

  useEffect(() => {
    if (!data?.length || value) return;

    const readyItem = data.find(
      (item) => item?.status?.toUpperCase() === "READY",
    );

    if (readyItem) {
      onChange(String(readyItem.id), readyItem);
    }
  }, [data, value]);
  // Ensure customer_id is set on initial value
 useEffect(() => {
  if (!data?.length) return;

  const found = data.find(d => d.id.toString() === value);

  if (found) {
    setSelectedItem(found);
  } else {
    setSelectedItem(null);
  }
}, [value, data]);
useEffect(() => {
  if (!data?.length) {
    setSelectedItem(null);
  }
}, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="max-w-[950px] w-full justify-between hover:bg-transparent hover:text-foreground"
        >
          {selectedItem ? selectedItem.batch_name : "Select batch"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] max-w-[950px] p-0"
        align="start"
      >
        {/* SINGLE scroll container */}
        <div className="max-h-[420px] overflow-auto">
          {/*Sticky Search */}
          <div className="sticky top-0 z-30 bg-background border-b px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={batch_name}
                onChange={(e) => setBatch_name(e.target.value)}
                placeholder="Search Batch Name..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded bg-background outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            {/* Header sticks below search */}
            <thead className="sticky top-[52px] bg-background z-20 border-b">
              <tr className="text-xs text-muted-foreground uppercase">
                <SortableTableHead
                  label="Batch name"
                  sortKey="batch_name"
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                  onSearch={setBatch_name}
                  searchValue={batch_name}
                />
                <SortableTableHead
                  searchValue={filter_customer}
                  label="Customer"
                  sortKey="customer_name"
                  onSearch={setFilter_customer}
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                  className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
                />
                <SortableTableHead
                  label="File name"
                  sortKey="name"
                  searchable={true}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                  onSearch={setFilter_name}
                  searchValue={filter_name}
                  className="hidden sm:table-cell"
                />



                <SortableTableHead
                  label="Uploaded by"
                  sortKey="uploaded_by"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                  searchable={true}
                  searchValue={filter_uploadBy}
                  onSearch={setUploadBy}
                  className="hidden sm:table-cell"
                />

              
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="border-border/30">
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-10"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((d) => {
                  const active = value === d.id.toString();

                  return (
                    <tr
                      key={d.id}
                      onClick={() => {
                        onChange(d.id.toString(), d); // send dataset
                        setSelectedItem(d);
                        setOpen(false);
                        const storage = getStorage();
                        storage.setItem("customer_id", d.customer_id);
                      }}
                      className={cn(
                        "cursor-pointer border-b hover:bg-primary/5",
                        active && "bg-primary/10",
                      )}
                    >
                      <td className="px-2 sm:px-5 py-2 sm:py-4">
                        <span className="text-sm font-medium text-foreground inline-block max-w-[17ch] overflow-hidden text-ellipsis whitespace-nowrap">
                          {d.batch_name || "--"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4">
                        <span className="text-sm font-medium text-foreground inline-block max-w-[9ch] overflow-hidden text-ellipsis whitespace-nowrap">
                          {d.customer_name || "--"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm font-medium text-foreground">
                          {d.name}
                        </span>
                      </td>

                      <td className="px-3 py-4 truncate hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {d.uploadedBy}
                        </span>
                      </td>

                     
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
       {total > 10 && (
        <div className="flex flex-col p-2 sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border/30 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            {start}–{end} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {/* Jump to page */}
           
            <span className="text-xs px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      </PopoverContent>
    </Popover>
  );
}
