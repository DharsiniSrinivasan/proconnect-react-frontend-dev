import { useEffect, useState } from "react";
import { SortableTableHead } from "@/components/sortable-table-head";
import { NeonCard } from "@/components/ui/neon-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePartnerStore } from "@/stores/partnerStore";
import { useParams } from "react-router-dom";

const TransporterAgainstContract = () => {
  const { id } = useParams();
  const { fetchPartnerContract } = usePartnerStore();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageInput, setPageInput] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [contract, setContract] = useState([]);
  const [filter_contract_no, setFilterContractNo] = useState("");
  const [filter_valid_from, setFilterValidFrom] = useState("");
  const [filter_valid_to, setFilterValidTo] = useState("");

  const isLoading = false;

  const totalRecords = contract?.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalRecords);

  const contractors = contract?.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  useEffect(() => {
    fetchPartnerContract(Number(id)).then((res) => {
      setContract(res);

    });
  }, []);


  const onSort = (key: string, order: string) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const onContractFilter = (value: string) => {
    setFilterContractNo(value);
  };

  const onValidFromFilter = (value: string) => {
    setFilterValidFrom(value);
  };

  const onValidToFilter = (value: string) => {
    setFilterValidTo(value);
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    setPageInput(newPage + 1);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
  };



  return (
    <NeonCard>
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
                label="Valid From"
                sortKey="valid_from"
                searchValue={filter_valid_from}
                onSearch={onValidFromFilter}
                searchable
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />

              <SortableTableHead
                label="Valid To"
                sortKey="valid_to"
                searchValue={filter_valid_to}
                onSearch={onValidToFilter}
                searchable
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : contractors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              contractors?.map((row, index) => (
                <TableRow key={index} className="hover:bg-primary/5">
                  <TableCell>
                    <Badge variant="outline">{row.contract_no}</Badge>
                  </TableCell>

                  <TableCell>{row.valid_from}</TableCell>

                  <TableCell>{row.valid_to}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {totalRecords > 10 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs">Rows per page:</span>
            <select
              className="border rounded px-2 py-1 text-xs"
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

          <p className="text-xs">
            {start}–{end} of {totalRecords}
          </p>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              disabled={page === 0}
              onClick={() => onPageChange(0)}
            >
              <ChevronsLeft />
            </Button>

            <Button
              size="icon"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft />
            </Button>

           

            <span className="text-xs">{page + 1} / {totalPages}</span>

            <Button
              size="icon"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight />
            </Button>

            <Button
              size="icon"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(totalPages - 1)}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </NeonCard>
  );
};

export default TransporterAgainstContract;
