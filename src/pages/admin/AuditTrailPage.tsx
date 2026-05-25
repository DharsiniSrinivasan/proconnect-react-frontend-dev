import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuditAction } from "@/mocks/audit.mock";
import { useAuditStore } from "@/stores/auditStore";
import { SortableTableHead } from "@/components/sortable-table-head";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { JsonViewer } from "@/components/json-viewer/json-viewer";

type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

const AuditTrailPage = () => {
  const {
    audits,
    geListUSers,
    geListSubModules,
    subModulesData,
    usersData,
    geListModules,
    modulesData,
    geListActions,
    actionsData,
    fetchAudits,
    setPageSize,
    total,
    pageSize,
    isLoading,
  } = useAuditStore();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [subModuleFilter, setSubModuleFilter] = useState("all");
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [pageInput, setPageInput] = useState<number | "">(currentPage + 1);
  const totalRecords = total;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = totalRecords === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRecords);
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  useEffect(() => {
    fetchAudits(
      currentPage,
      pageSize,
      userFilter,
      actionFilter,
      moduleFilter,
      subModuleFilter,
      dateFilter,
      sortBy,
      sortOrder,
    );
  }, [
    currentPage,
    pageSize,
    userFilter,
    actionFilter,
    moduleFilter,
    subModuleFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);
  useEffect(() => {
    geListUSers();
    geListActions();
    geListModules();
    geListSubModules();
  }, []);

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case "Upload":
        return "bg-success/20 text-success border-success/30";
      case "Master Edit":
        return "bg-warning/20 text-warning border-warning/30";
      case "Recommendation Decision":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "AI Chat":
        return "bg-primary/20 text-primary border-primary/30";
      case "Login":
        return "bg-muted/40 text-muted-foreground border-muted/50";
      default:
        return "";
    }
  };

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(0);
  };
  const sanitizedModules = modulesData?.filter((mod): mod is string =>
    Boolean(mod?.trim()),
  );

  const sanitizedSubModules = subModulesData?.filter((mod): mod is string =>
    Boolean(mod?.trim()),
  );

  useEffect(() => {
    setPageInput(currentPage + 1);
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" && // Only trigger if it's a number
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== currentPage + 1
      ) {
        onPageChange(pageInput - 1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput]);
  return (
    <AppShell
      pageTitle="Audit Trail"
      pageSubtitle="Track all system activities and changes"
    >
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 items-start sm:items-center">
        <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal bg-background/50 border-border/50",
                !dateFilter && "text-muted-foreground",
              )}
            >
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              {dateFilter ? (
                format(dateFilter, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-card border-border"
            align="start"
          >
            <CalendarComponent
              mode="single"
              selected={dateFilter || undefined}
              onSelect={(date) => {
                setDateFilter(date || null);
                if (date) {
                  setIsDatePopoverOpen(false);
                }
              }}
              initialFocus
            />
            {dateFilter && (
              <div className="p-3 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateFilter(null);
                    setIsDatePopoverOpen(false);
                  }}
                  className="w-full"
                >
                  Clear Date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background/50 border-border/50">
            <SelectValue placeholder="User" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>

            {usersData?.map((user) => (
              <SelectItem key={user.id} value={user.name}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actionsData?.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background/50 border-border/50">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {sanitizedModules?.map((mod) => (
              <SelectItem key={mod} value={mod}>
                {mod}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subModuleFilter} onValueChange={setSubModuleFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background/50 border-border/50">
            <SelectValue placeholder="Sub Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sub Modules</SelectItem>
            {sanitizedSubModules?.map((mod) => (
              <SelectItem key={mod} value={mod}>
                {mod}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Strip */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiPill label="Total Events" value={summary?.total_logs || 0} />
        <KpiPill label="Uploads" value={summary?.uploads || 0} color="success" />
        <KpiPill label="Master Edits" value={summary?.masterEdits || 0} color="warning" />
        <KpiPill label="Reco Decisions" value={summary?.recoDecisions || 0} color="secondary" />
        <KpiPill label="AI Chats" value={summary?.aiChats || 0} color="primary" />
      </div> */}

      {/* Events Table */}
      <NeonCard className="p-0 overflow-hidden">
        {isLoading ? (
          <AuditTableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <SortableTableHead
                    label="Timestamp"
                    sortKey="timestamp"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    datepicker
                    dateValue={dateFilter}
                    onDateSelect={setDateFilter}
                  />
                  {/* <TableHead className="text-muted-foreground"> */}
                  {/* <TableHead className="text-muted-foreground">User</TableHead> */}
                  <SortableTableHead
                    label="User"
                    sortKey="user"
                    selectable
                    options={usersData?.map((user) => ({
                      label: user.name, // what is shown in UI
                      value: user.name, // what is stored / filtered
                    }))}
                    selectedValue={userFilter}
                    onSelect={setUserFilter}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />

                  {/* </TableHead> */}
                  {/* <TableHead className="text-muted-foreground"> */}
                  {/* <TableHead className="text-muted-foreground">Action</TableHead> */}
                  <SortableTableHead
                    label="Action"
                    sortKey="action"
                    selectable={true}
                    options={actionsData?.map((action) => ({
                      label: action,
                      value: action,
                    }))}
                    selectedValue={actionFilter}
                    onSelect={setActionFilter}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  {/* </TableHead> */}
                  {/* <TableHead className="text-muted-foreground"> */}
                  <SortableTableHead
                    label="Module"
                    sortKey="module"
                    selectable
                    options={sanitizedModules?.map((module) => ({
                      label: module,
                      value: module,
                    }))}
                    selectedValue={moduleFilter}
                    onSelect={setModuleFilter}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  {/* <TableHead className="text-muted-foreground">Module</TableHead> */}
                  {/* </TableHead> */}
                  <SortableTableHead
                    label="Sub Module"
                    sortKey="sub_module"
                    selectable
                    options={sanitizedSubModules?.map((module) => ({
                      label: module,
                      value: module,
                    }))}
                    selectedValue={subModuleFilter}
                    onSelect={setSubModuleFilter}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <TableHead className="text-muted-foreground">
                    Request Details
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Response Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-10"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  audits?.map((event) => (
                    <TableRow
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="border-border/20 hover:bg-primary/5 cursor-pointer transition-all hover:shadow-[inset_0_0_20px_hsl(var(--primary)/0.05)]"
                    >
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {event.created_date
                          ? new Date(event.created_date).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                          : "--"}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {event.user}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getActionColor(event.action),
                          )}
                        >
                          {event.action || "--"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.module || "--"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.sub_module || "--"}
                      </TableCell>
                      <TableCell className="text-muted-foreground line-clamp-3 max-w-xs truncate font-mono text-xs">
                        {event.request_details || "--"}
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs truncate">
                        {event.details || "--"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
          </div>
        )}
      </NeonCard>

      {/* Event Detail Panel */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent className="overflow-y-auto bg-card/95 backdrop-blur-xl border-l-2 border-primary/30" style={{ width: "500px", maxWidth: "none" }}>
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-foreground">Event Details</SheetTitle>
            </div>
          </SheetHeader>

          {selectedEvent && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <DetailRow
                  label="Timestamp"
                  value={
                    selectedEvent?.created_date
                      ? new Date(selectedEvent.created_date).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                      : "--"
                  }
                />
                <DetailRow label="User" value={selectedEvent?.user || "--"} />
                {/* <DetailRow label="User ID" value={selectedEvent?.userId} mono /> */}
                <DetailRow
                  label="Action"
                  value={selectedEvent?.action || "--"}
                />
                <DetailRow
                  label="Module"
                  value={selectedEvent?.module || "--"}
                />
                <DetailRow
                  label="Sub Module"
                  value={selectedEvent?.sub_module || "--"}
                />
                {selectedEvent?.request_details && (
                  <DetailRow label="Request Details">
                    <JsonViewer
                      data={
                        typeof selectedEvent.request_details === "string"
                          ? JSON.parse(selectedEvent.request_details)
                          : selectedEvent.request_details
                      }
                      initialExpanded={true}
                    />
                  </DetailRow>
                )}
              </div>

              {selectedEvent.details && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Response Details
                  </label>
                  <p className="text-sm text-foreground leading-relaxed  rounded-lg bg-muted/20 border border-border/30">
                    {/* {selectedEvent.details || "--"} */}
                    <JsonViewer
                      data={
                        typeof selectedEvent.details === "string"
                          ? JSON.parse(selectedEvent.details)
                          : selectedEvent.details
                      }
                      initialExpanded={true}
                    />
                  </p>
                </div>
              )}

        
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
};

interface KpiPillProps {
  label: string;
  value: number;
  color?: "primary" | "secondary" | "success" | "warning";
}

const KpiPill = ({ label, value, color }: KpiPillProps) => {
  const colorClasses = {
    primary: "border-primary/30 shadow-primary/10",
    secondary: "border-secondary/30 shadow-secondary/10",
    success: "border-success/30 shadow-success/10",
    warning: "border-warning/30 shadow-warning/10",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-4 rounded-xl bg-card/50 border backdrop-blur-sm",
        color ? colorClasses[color] : "border-border/30",
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold text-foreground">
        {value?.toLocaleString()}
      </span>
    </div>
  );
};

interface DetailRowProps {
  label?: string;
  value?: string;
  mono?: boolean;
}

const DetailRow = ({ label, value, mono, children }: DetailRowProps & { children?: React.ReactNode }) => (
  <div className="py-2 border-b border-border/20">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </span>

      {!children && (
        <span
          className={cn(
            "text-sm text-foreground",
            mono && "font-mono text-xs text-primary",
          )}
        >
          {value}
        </span>
      )}
    </div>

    {children && (
      <div className="mt-2 text-sm">
        {children}
      </div>
    )}
  </div>
);

const AuditTableSkeleton = () => (
  <div className="p-4 space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-10 w-36 bg-muted/30 rounded" />
        <div className="h-10 w-28 bg-muted/30 rounded" />
        <div className="h-10 w-32 bg-muted/30 rounded" />
        <div className="h-10 w-28 bg-muted/30 rounded" />
        <div className="h-10 w-24 bg-muted/30 rounded" />
        <div className="h-10 w-28 bg-muted/30 rounded" />
        <div className="h-10 flex-1 bg-muted/30 rounded" />
      </div>
    ))}
  </div>
);

export default AuditTrailPage;
