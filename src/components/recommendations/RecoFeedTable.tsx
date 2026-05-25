import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationSummary, RecoPriority } from "@/mocks/recommendations.mock";
import {  RecoCategory, RecoStatusChip } from "./RecoStatusChip";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableTableHead } from "../sortable-table-head";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";

interface RecoFeedTableProps {
  feed: RecommendationSummary[];
  isDashboard: any;
  sortBy: "impact" | "confidence" | "created";
  categoryData: any[];
  priorityData: any[];
  categoryFilter: string;
  priorityFilter: RecoPriority | "all";
}
type Filters = {
  id: string;
  title: string;
  scope: string | "all";
  impact: string | "all";
  confidencePct: any | "all";
  priority: RecoPriority | "all";
  status: string;
  category: RecoCategory | "all";
};

export const RecoFeedTable = ({
  feed,
  isDashboard,
  sortBy,
  categoryData,
  priorityData,
  categoryFilter,
  priorityFilter,
}: RecoFeedTableProps) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<string>(null);
  const [sortOrder, setSortOrder] = useState<"A_TO_Z" | "Z_TO_A">(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageInput, setPageInput] = useState<number | "">(1);

  const [filters, setFilters] = useState<Filters>({
    id: "",
    title: "",
    scope: "all",
    impact: "all",
    confidencePct: "all",
    priority: "all",
    status: "all",
    category: "all",
  });


  const impactDropdown = useMemo(() => {
    if (!feed?.length) return [];

    const uniqueImpact = Array.from(
      new Set(feed?.map((impact) => impact.impact).filter(Boolean)),
    );

    return uniqueImpact;
  }, [feed]);

  const confidenceDropdown = useMemo(() => {
    if (!feed?.length) return [];

    const uniqueIConfidence = Array.from(
      new Set(
        feed?.map((confidence) => confidence.confidencePct).filter(Boolean),
      ),
    );

    return uniqueIConfidence;
  }, [feed]);
  const statusDropdown = useMemo(() => {
    if (!feed?.length) return [];

    const uniqueIstatus = Array.from(
      new Set(feed?.map((status) => status.status).filter(Boolean)),
    );

    return uniqueIstatus;
  }, [feed]);

  const normalize = (value: string) =>
    value.trim().toUpperCase().replace(/\s+/g, "_");

  const categoryMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};

    categoryData.forEach((label: string) => {
      const key = label
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

      map[key] = label;
    });

    return map;
  }, [categoryData]);
  const filteredFeed = useMemo(() => {
    if (!feed?.length) return [];

    return feed.filter((reco) => {
      // ID search
      if (filters.id && !reco.id.toString().includes(filters.id)) return false;

      // Title search
      if (filters.title && !reco.title.toLowerCase().includes(filters.title.toLowerCase()))
        return false;

      // Category
      if (filters.category !== "all") {
        const recoCategoryKey = normalize(reco.category);

        if (recoCategoryKey !== filters.category) {
          return false;
        }
      }

      // Scope
      if (filters.scope !== "all" && reco.scope !== filters.scope) return false;

      // Impact
      if (filters.impact !== "all" && reco.impact !== filters.impact) return false;

      // Confidence
      if (filters.confidencePct !== "all" && reco.confidencePct !== filters.confidencePct)
        return false;

      // Priority
      if (
        filters.priority !== "all" &&
        normalize(reco.priority) !== normalize(filters.priority)
      ) {
        return false;
      }

      // Status
      if (filters.status !== "all" && reco.status !== filters.status) return false;

      return true;
    });
  }, [feed, filters]);

  const sortedFeed = useMemo(() => {
    if (!filteredFeed?.length) return [];

    return [...filteredFeed].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (sortKey === "createdAt") {
        return sortOrder === "A_TO_Z"
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();
      }

      if (!isNaN(valA) && !isNaN(valB)) {
        return sortOrder === "A_TO_Z" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
      }

      return sortOrder === "A_TO_Z"
        ? String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
        : String(valB).toLowerCase().localeCompare(String(valA).toLowerCase());
    });
  }, [filteredFeed, sortKey, sortOrder]);
  const totalRecords = sortedFeed.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedFeed = useMemo(() => {
    return sortedFeed.slice(startIndex, endIndex);
  }, [sortedFeed, startIndex, endIndex]);

  // for UI
  const start = totalRecords === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, totalRecords);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleSort = (key: string,newSortOrder:"A_TO_Z" | "Z_TO_A") => {
      setSortKey(key);
      setSortOrder(newSortOrder);
    
  };

  const categoryOptions = useMemo(() => {
    return Object.entries(categoryMap).map(([key, label]) => ({
      label,
      value: key,
    }));
  }, [categoryMap]);

  useEffect(() => {
    setFilters((prev) => {
      // Ensure categoryFilter is a valid RecoCategory or "all"
      const nextCategory = (categoryFilter && categoryFilter !== "all"
        ? categoryFilter
        : "all") as RecoCategory | "all";

      const nextPriority: RecoPriority | "all" =
        priorityFilter && priorityFilter !== "all"
          ? priorityFilter
          : "all";

      if (prev.category === nextCategory && prev.priority === nextPriority) {
        return prev;
      }

      return {
        ...prev,
        category: nextCategory,
        priority: nextPriority,
      };
    });
  }, [categoryFilter, priorityFilter]);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setPageInput(page + 1);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
    setPageInput(1);
  };
  useEffect(() => {
    setCurrentPage(0);
    setPageInput(1);
  }, [filters, sortKey, sortOrder]);

  useEffect(() => {
    if (typeof pageInput === "number") {
      const page = pageInput - 1;

      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    }
  }, [pageInput, totalPages]);


  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <SortableTableHead
              label="ID"
              sortKey="id"
              searchable
              searchValue={filters.id}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, id: value }))
              }
            />
            <SortableTableHead
              label="Title"
              sortKey="title"
              searchable
              searchValue={filters.title}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, title: value }))
              }
            />

            <SortableTableHead
              label="Category"
              sortKey="category"
              selectable
              options={categoryOptions}
              selectedValue={filters.category}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSelect={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  category: value as RecoCategory | "all", // TypeScript safe
                }))
              }
            />

            <SortableTableHead
              label="Impact"
              sortKey="impact"
              selectable
              options={impactDropdown?.map((impact) => ({
                label: impact === "all" ? "All" : impact,
                value: impact,
              }))}
              selectedValue={filters.impact}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSelect={(value) =>
                setFilters((prev) => ({ ...prev, impact: value }))
              }
            />

            <SortableTableHead
              label="Confidence"
              sortKey="confidence"
              selectable
              options={confidenceDropdown?.map((confidence: any) => ({
                label: confidence === "all" ? "All" : confidence,
                value: confidence,
              }))}
              selectedValue={filters.confidencePct}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSelect={(value) =>
                setFilters((prev) => ({ ...prev, confidencePct: value }))
              }
            />

            <SortableTableHead
              label="Priority"
              sortKey="priority"
              selectable
              options={priorityData
                .filter((p: any) => p.toLowerCase() !== "all")
                .map((p: any) => ({
                  label: p,
                  value: p.toUpperCase(),
                }))}
              selectedValue={filters.priority}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSelect={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: value as RecoPriority | "all",
                }))
              }
            />

            <SortableTableHead
              label="Status"
              sortKey="status"
              selectable
              options={statusDropdown?.map((status: any) => ({
                label: status === "all" ? "All" : status,
                value: status,
              }))}
              selectedValue={filters.status}
              currentSortBy={sortKey}
              currentSortOrder={sortOrder}
              onSort={handleSort}
              onSelect={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            />
            <TableHead className="text-muted-foreground font-medium">
              Created
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFeed.length ? (
            paginatedFeed.map((reco) => (
              <TableRow
                key={reco.id}
                className="border-border/30 cursor-pointer transition-all duration-200 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                onClick={() => navigate(`/recommendations/${reco.id}?isDashboard=${isDashboard}`)}
              >
                <TableCell className="font-mono text-sm text-primary">
                  {reco.id}
                </TableCell>

                <TableCell
                  title={reco.title}
                  className="font-medium text-foreground max-w-[200px] truncate"
                >
                  {reco.title}
                </TableCell>

                <TableCell>
                  <RecoStatusChip type="category" value={reco.category} />
                </TableCell>

                {/* <TableCell
                  title={reco.scope}
                  className="text-muted-foreground text-sm max-w-[150px] truncate"
                >
                  {reco.scope}
                </TableCell> */}

                <TableCell
                  title={reco.impact}
                  className="text-emerald-400 font-medium text-sm"
                >
                  {reco.impact?.length > 5
                    ? `${reco.impact.slice(0, 5)}…`
                    : reco.impact}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress
                      value={reco.confidencePct}
                      className="h-2 w-16 bg-muted"
                    />
                    <span className="text-xs text-muted-foreground">
                      {reco.confidencePct}%
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <RecoStatusChip type="priority" value={reco.priority} />
                </TableCell>

                <TableCell>
                  <RecoStatusChip type="status" value={reco.status} />
                </TableCell>

                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {formatDate(reco.createdAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground py-6"
              >
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalRecords > 10 && (
        <div className="flex items-center justify-between mt-4 pt-4 m-2 border-t border-border/30">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <select
              className="border rounded px-2 py-1 text-xs bg-background"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value)); // already resets page
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          {/* Range info */}
          <p className="text-xs text-muted-foreground">
            {start}–{end} of {totalRecords}
          </p>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            {/* First */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage === 0}
              onClick={() => onPageChange(0)}
            >
              <ChevronsLeft />
            </Button>

            {/* Previous */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Jump to page */}
           

            <span className="text-xs text-muted-foreground">
             {currentPage + 1} / {totalPages || 1}
            </span>

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight />
            </Button>

            {/* Last */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => onPageChange(totalPages - 1)}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const RecoFeedTableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    ))}
  </div>
);
