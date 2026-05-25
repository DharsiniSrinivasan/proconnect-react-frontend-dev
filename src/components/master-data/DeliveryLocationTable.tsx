import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModeChip } from "./MasterStatusChip";
import { SortableTableHead } from "../sortable-table-head";
import { rateCardStore } from "@/stores/rateCardStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NeonCard } from "../ui/neon-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MapPin } from "lucide-react";
import { usePartnerStore } from "@/stores/partnerStore";
export type SortOrder = "asc" | "desc" | null;
export const DeliveryLocationTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { rateCards, fetchCards, isLoading, pageSize, total, setPageSize } =
    rateCardStore();
  const statusFilter = "all";
  const [filterFrom, setFilterFrom] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [filterTo, setFilterTo] = useState("");
  const { name } = useParams();
  const { modes, getmodes } = usePartnerStore();
  const filterCode = "";
  const searchValue = "";
  const filter_frt_rate = 0;
  const filter_erate = 0;
  const filter_oda_rate = 0;
  const filter_total_rate = 0;
  const filter_minimum = 0;
  const filterOdaService = 0;
  const totalRecords = total;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = totalRecords === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRecords);
  const [filterTat, setFilterTat] = useState("");

  useEffect(() => {
    getmodes();
  }, [getmodes]);

  useEffect(() => {
    fetchCards(
      currentPage,
      pageSize,
      statusFilter,
      searchValue,
      modeFilter,
      filterCode,
      name,
      filterFrom,
      filterTo,
      filter_frt_rate,
      filter_erate,
      filter_oda_rate,
      filter_total_rate,
      filter_minimum,
      filterOdaService,
      sortBy,
      sortOrder,
      Number(filterTat),
    );
  }, [
    fetchCards,
    currentPage,
    pageSize,
    statusFilter,
    searchValue,
    modeFilter,
    filterCode,
    name,
    filterFrom,
    filterTo,
    filter_frt_rate,
    filter_erate,
    filter_oda_rate,
    filter_total_rate,
    filter_minimum,
    filterOdaService,
    sortBy,
    sortOrder,
    filterTat,
  ]);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <NeonCard>
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <SortableTableHead
                searchable
                label="From"
                sortKey="from"
                searchValue={filterFrom}
                onSearch={(value) => setFilterFrom(value)}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                searchable
                label="To"
                sortKey="to"
                currentSortBy={sortBy}
                searchValue={filterTo}
                onSearch={(value) => setFilterTo(value)}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Mode"
                sortKey="mode"
                selectable
                options={modes?.map((mode) => ({
                  label: mode,
                  value: mode,
                }))}
                selectedValue={modeFilter}
                onSelect={setModeFilter}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                searchable
                label="Tat"
                sortKey="tat_days"
                currentSortBy={sortBy}
                searchValue={filterTat}
                onSearch={(value) => setFilterTat(value)}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-border/30">
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rateCards.filter((item) => item.oda_service_charge === 0)
                .length === 0 ? (
              // No records found
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              rateCards
                .filter((item) => item.oda_service_charge === 0)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* <TableCell className="font-medium text-foreground">{item.code}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span>{item.from_city}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span>{item.to_city}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-muted-foreground">{item.pincode}</TableCell> */}
                    <TableCell>
                      <ModeChip mode={item.transport_mode} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.tat_days}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
         <ScrollBar orientation="horizontal" />
          </ScrollArea>
        {total > 10 && (
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
      disabled={currentPage === 0}
      onClick={() => onPageChange(0)}
    >
      <ChevronsLeft className="w-4 h-4" />
    </Button>

    {/* Prev */}
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={currentPage === 0}
      onClick={() => onPageChange(currentPage - 1)}
    >
      <ChevronLeft className="w-4 h-4" />
    </Button>

    {/* Page Info */}
    <span className="text-xs px-2 whitespace-nowrap">
      {currentPage + 1} / {totalPages}
    </span>

    {/* Next */}
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={currentPage + 1 >= totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      <ChevronRight className="w-4 h-4" />
    </Button>

    {/* Last */}
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={currentPage + 1 >= totalPages}
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
