import { rateCardStore } from "@/stores/rateCardStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NeonCard } from "../ui/neon-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SortableTableHead } from "../sortable-table-head";
import { Badge } from "../ui/badge";
import { ModeChip } from "./MasterStatusChip";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MapPin } from "lucide-react";
import { usePartnerStore } from "@/stores/partnerStore";
import { Button } from "@/components/ui/button";

const formatCurrency = (val: number) => {
  return val > 0 ? `₹${val.toFixed(2)}` : "-";
};

export type SortOrder = "asc" | "desc" | null;
const TransporterRelatedRateCard = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { rateCards, fetchCards, isLoading, pageSize, total, setPageSize } =
    rateCardStore();
  const statusFilter = "all";
  const { name } = useParams();
  const totalRecords = total;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = totalRecords === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRecords);
  const [filterTat, setFilterTat] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [filterCode, setFilterCode] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const { modes, getmodes } = usePartnerStore();
  const [filterTo, setFilterTo] = useState("");
  const [filterFrtRate, setFilterFrtRate] = useState("");
  const [filterErate, setFilterErate] = useState("");
  const [filterOdaRate, setFilterOdaRate] = useState("");
  const [filterOdaService, setFilterOdaService] = useState("");
  const [filterTotalRate, setFilterTotalRate] = useState("");
  const [filterMinimum, setFilterMinimum] = useState("");
  const searchValue = "";

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
      Number(filterFrtRate),
      Number(filterErate),
      Number(filterOdaRate),
      Number(filterTotalRate),
      Number(filterMinimum),
      Number(filterOdaService),
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
    filterFrtRate,
    filterErate,
    filterOdaRate,
    filterTotalRate,
    filterMinimum,
    filterOdaService,
    sortBy,
    sortOrder,
    filterTat,
  ]);

  useEffect(() => {
    getmodes();
  }, [getmodes]);
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
    <NeonCard className="h-full">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <SortableTableHead
                label="Code"
                sortKey="code"
                searchValue={filterCode}
                onSearch={(value) => setFilterCode(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="From"
                sortKey="from"
                searchValue={filterFrom}
                onSearch={(value) => setFilterFrom(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="To"
                sortKey="to"
                searchValue={filterTo}
                onSearch={(value) => setFilterTo(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Mode"
                sortKey="mode"
                selectedValue={modeFilter}
                options={modes?.map((mode) => ({
                  label: mode,
                  value: mode,
                }))}
                onSelect={setModeFilter}
                selectable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Frt Rate"
                sortKey="frt_rate"
                searchValue={filterFrtRate}
                onSearch={(value) => setFilterFrtRate(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="E Rate"
                sortKey="e_rate"
                searchValue={filterErate}
                onSearch={(value) => setFilterErate(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                searchValue={filterOdaRate}
                label="ODA"
                sortKey="oda_rate"
                onSearch={(value) => setFilterOdaRate(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                searchValue={filterOdaService}
                label="ODA Taxes"
                sortKey="oda_service_charge"
                onSearch={(value) => setFilterOdaService(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Total Rate"
                sortKey="total_rate"
                searchValue={filterTotalRate}
                onSearch={(value) => setFilterTotalRate(value)}
                searchable={true}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTableHead
                searchValue={filterMinimum}
                label="Minimum"
                sortKey="minimum"
                onSearch={(value) => setFilterMinimum(value)}
                searchable={true}
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
                  {Array.from({ length: 11 }).map((_, colIndex) => (
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
              rateCards?.map((rc) => (
                <TableRow
                  key={rc.id}
                  className="border-border/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {rc?.partner?.code}
                    </Badge>
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
                  <TableCell>
                    <ModeChip
                      key={rc.transport_mode}
                      mode={rc.transport_mode}
                    />
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
                    {formatCurrency(rc.minimum_rate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rc.tat_days}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
export default TransporterRelatedRateCard;
