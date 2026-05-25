import React, { useState, useEffect } from "react";
import { X, Hourglass, List } from "lucide-react";
import { useTilesStore } from "@/stores/masterStore";
import { toast } from "sonner";
import { getStorage } from "@/utils/storage";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { MasterOverviewItem } from "@/types/master-data";
import { usePartnerStore } from "@/stores/partnerStore";
import { rateCardStore } from "@/stores/rateCardStore";
import { RateCardOverviewTable } from "./RateCardOverviewTable";

interface RateCardApprovalRecord {
  id: number;
  code: string;
  partnerId: string;
  fromCity: string;
  toCity: string;
  transportMode: string[];
  rate: number;
  eRate: number;
  odaRate: number;
  minimumRate: number;
  effectiveStartDate: string;
  effectiveEndDate: string;
  tatDays: number;
  status: "pending" | "approved" | "rejected";
  createdDate: string;
}

interface ApprovalModalProps {
  tile: MasterOverviewItem;
  onClose: () => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  isRead?: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

export const RateCardModel: React.FC<ApprovalModalProps> = ({
  tile,
  onClose,
  isRead = false,
}) => {
  const statuses = ["Pending", "Approved", "Rejected"];
  const [activeTab, setActiveTab] = useState("");
  const [readOnly, setReadOnly] = useState(isRead);
  const searchQuery = "";
  const [statusFilter, setStatusFilter] = useState("all");
  const modeFilter = [];
  const [filterCode, setFilterCode] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterFrtRate, setFilterFrtRate] = useState("");
  const [filterErate, setFilterErate] = useState("");
  const [filterOdaRate, setFilterOdaRate] = useState("");
  const [filterOdaService, setFilterOdaService] = useState("");
  const [filterTotalRate, setFilterTotalRate] = useState("");
  const [filterMinimum, setFilterMinimum] = useState("");
  const [filter_tat_days, setFilterTatDays] = useState("");
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const { updateStatus } = useTilesStore();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");

  // Sort states
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Token and user context
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);

  const {
    rateCards,
    total,
    setPageSize,
    fetchCards,
    pageSize,
    isLoading,
    getMasterPartner,
  } = rateCardStore();

  const { modes, getmodes, getStatus } = usePartnerStore();
  useEffect(() => {
    if (readOnly) {
      setActiveTab("request");
    } else {
      setActiveTab("awaits");
    }
  }, [readOnly]);

  useEffect(() => {
    getmodes();
  }, [getmodes]);

  useEffect(() => {
    getStatus();
  }, [getStatus]);

  useEffect(() => {
    getMasterPartner();
  }, [getMasterPartner]);

  // Set active tab based on readOnly status
  useEffect(() => {
    if (readOnly) {
      setActiveTab("request");
    } else {
      setActiveTab("awaits");
    }
  }, [readOnly]);

  useEffect(() => {
    fetchCards(
      currentPage,
      pageSize,
      statusFilter === "all" ? "" : statusFilter,
      searchQuery,
      modeFilter.length > 0 ? modeFilter : "all",
      filterCode,
      filterName,
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
      Number(filter_tat_days),
      filterCustomer,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      filter_assignee,
      filter_last_action,
      filter_request,
    );
  }, [
    currentPage,
    pageSize,
    fetchCards,
    statusFilter,
    searchQuery,
    modeFilter,
    filterName,
    filterCustomer,
    filterCode,
    filterFrom,
    filterTo,
    filterFrtRate,
    filter_tat_days,
    filterErate,
    filterOdaRate,
    filterTotalRate,
    filterMinimum,
    sortBy,
    sortOrder,
    filterOdaService,
    readOnly,
    filter_reason,
    filter_last_action,
    filter_assignee,
    filter_request,
  ]);

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "awaits") {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  };

  const handleApprove = async (ids: (string | number)[]) => {
    const request = {
      rate_card_ids: (ids || []).map(Number),
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchCards(
        currentPage,
        pageSize,
        statusFilter === "all" ? "" : statusFilter,
        searchQuery,
        modeFilter.length > 0 ? modeFilter : "all",
        filterCode,
        filterName,
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
        Number(filter_tat_days),
        filterCustomer,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        filter_reason,
        filter_assignee,
        filter_last_action,
        filter_request,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const request = {
      rate_card_ids: (ids || []).map(Number),
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchCards(
        currentPage,
        pageSize,
        statusFilter === "all" ? "" : statusFilter,
        searchQuery,
        modeFilter.length > 0 ? modeFilter : "all",
        filterCode,
        filterName,
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
        Number(filter_tat_days),
        filterCustomer,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        filter_reason,
        filter_assignee,
        filter_last_action,
        filter_request,
      );
    }
  };
  const handleAssigneeFilterChange = (value: string) => {
    setAssignee_name(value);
  };

  const handleRequestFilterChange = (value: string) => {
    setRequest_name(value);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ margin: "auto" }}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
    relative glass-card rounded-xl border border-primary/30
    shadow-[0_0_50px_rgba(139,92,246,0.3)]
    w-[95vw] max-w-[1400px]
    mx-4 max-h-[90vh] overflow-hidden
    animate-in fade-in zoom-in-95 duration-200
  "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-2 border-b border-border/30">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {readOnly ? "Requested" : "Pending"} {tile.label} Approvals
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {total} total records {!readOnly && "awaiting approval"}
            </p>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full pt-2"
            >
              <TabsList className="bg-card border border-border">
                <TabsTrigger
                  value="awaits"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Hourglass className="w-4 h-4" />
                  Awaits
                </TabsTrigger>
                <TabsTrigger
                  value="request"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <List className="h-4 w-4" />
                  Request
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-muted/50 rounded-lg transition-colors duration-200"
            title="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 h-[70vh] overflow-hidden">
          <RateCardOverviewTable
            filter_request_name={filter_request}
            filter_assignee_name={filter_assignee}
            onAssigneeNameFilter={handleAssigneeFilterChange}
            onRequestNameFilter={handleRequestFilterChange}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
            totalRecords={total}
            rateCards={rateCards}
            onPageChange={setCurrentPage}
            page={currentPage}
            isLoading={isLoading}
            // Filter props
            filterCode={filterCode}
            onFilterCodeChange={setFilterCode}
            filterName={filterName}
            onFilterNameChange={setFilterName}
            filterCustomer={filterCustomer}
            onFilterCustomerChange={setFilterCustomer}
            filterStatus={statusFilter}
            onFilterStatusChange={setStatusFilter}
            filterFrom={filterFrom}
            onFilterFromChange={setFilterFrom}
            filterTo={filterTo}
            onFilterToChange={setFilterTo}
            filterFrtRate={filterFrtRate}
            onFilterFrtRateChange={setFilterFrtRate}
            filterErate={filterErate}
            onFilterErateChange={setFilterErate}
            filterOdaRate={filterOdaRate}
            onFilterOdaRateChange={setFilterOdaRate}
            filterOdaService={filterOdaService}
            onFilterOdaServiceChange={setFilterOdaService}
            filterTotalRate={filterTotalRate}
            onFilterTotalRateChange={setFilterTotalRate}
            filterMinimum={filterMinimum}
            onFilterMinimumChange={setFilterMinimum}
            filter_tat_days={filter_tat_days}
            onFilterTatDays={setFilterTatDays}
            filter_reason={filter_reason}
            onFilterReasonChange={setFilter_reason}
            // Sort props
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onApprove={handleApprove}
            onReject={handleReject}
            readOnly={readOnly}
            // Options for select filters
            statusOptions={statuses?.map((s) => ({ label: s, value: s }))}
            modeOptions={modes?.map((m) => ({ label: m, value: m }))}
            filter_last_action={filter_last_action}
            onLastActionFilter={setFilter_last_action}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50"></div>
      </div>
    </div>
  );
};
