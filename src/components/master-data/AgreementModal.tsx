import React, { useState, useEffect } from "react";
import { X, Hourglass, List } from "lucide-react";
import { useTilesStore } from "@/stores/masterStore";
import { toast } from "sonner";
import { getStorage } from "@/utils/storage";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { MasterOverviewItem } from "@/types/master-data";
import { useFacilityAgreementStore } from "@/stores/leaseStore";
import { AgreementOverviewTable } from "./AgreementOverviewTable";

interface ApprovalModalProps {
  tile: MasterOverviewItem;
  onClose: () => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  isRead?: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
export const AgreementModal: React.FC<ApprovalModalProps> = ({
  tile,
  onClose,
  isRead = false,
}) => {
  const statuses = ["Pending", "Approved", "Rejected"];
  const [activeTab, setActiveTab] = useState("");
  const [readOnly, setReadOnly] = useState(isRead);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const searchQuery = "";
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filterAgreementNo, setFilterAgreementNo] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState<Date | null>(null);
  const [filterTo, setFilterTo] = useState<Date | null>(null);
  const [filterRentAmount, setFilterRentAmount] = useState<any>("");
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    fetchAgreements,
    leaseData,
    pageSize,
    setPageSize,
    total,
    isLoading,
    getAgreementCategory,
    facilityAgreementCategory,
  } = useFacilityAgreementStore();

  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);

  const formatDate = (date: any) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    getAgreementCategory();
  }, []);
  useEffect(() => {
    fetchAgreements(
      currentPage,
      pageSize,
      searchQuery,
      filterAgreementNo,
      filterCategory,
      formatDate(filterFrom),
      formatDate(filterTo),
      sortBy,
      sortOrder,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      filter_last_action,
      filter_assignee,
      filter_request,
    );
  }, [
    fetchAgreements,
    currentPage,
    pageSize,
    searchQuery,
    filterAgreementNo,
    filterCategory,
    filterFrom,
    filterTo,
    sortBy,
    sortOrder,
    readOnly,
    userId,
    filter_reason,
    filter_last_action,
    filter_request,
    filter_assignee,
  ]);

  useEffect(() => {
    if (readOnly) {
      setActiveTab("request");
    } else {
      setActiveTab("awaits");
    }
  }, [readOnly]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "awaits") {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  };

  // const handleStatusFilterChange = (value: string) => {
  //   setStatusFilter(value);
  // };

  const handleApprove = async (ids: (string | number)[]) => {
    const request = {
      agreement_ids: (ids || []).map(Number),
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchAgreements(
        currentPage,
        pageSize,
        searchQuery,
        filterAgreementNo,
        filterCategory,
        formatDate(filterFrom),
        formatDate(filterTo),
        sortBy,
        sortOrder,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        filter_reason,
        filter_last_action,
        filter_assignee,
        filter_request,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const request = {
      agreement_ids: (ids || []).map(Number),
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchAgreements(
        currentPage,
        pageSize,
        searchQuery,
        filterAgreementNo,
        filterCategory,
        formatDate(filterFrom),
        formatDate(filterTo),
        sortBy,
        sortOrder,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        filter_reason,
        filter_last_action,
        filter_assignee,
        filter_request,
      );
    }
  };

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePageSizeChange = (size: number) => {
    //setPageSize(size);
    fetchAgreements(
      currentPage,
      size,
      searchQuery,
      filterAgreementNo,
      filterCategory,
      formatDate(filterFrom),
      formatDate(filterTo),
      sortBy,
      sortOrder,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      filter_last_action,
      filter_assignee,
      filter_request,
    );
  };
  const warehouseTypes = facilityAgreementCategory?.map((item) => ({
    label: item,
    value: item,
  }));
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
          <div>
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
          <AgreementOverviewTable
            leases={leaseData}
            page={currentPage}
            pageSize={pageSize}
            totalRecords={total}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            readOnly={false}
            statusFilter={
              filter_AssigneestatusFilter === "all"
                ? ""
                : filter_AssigneestatusFilter
            }
            onStatusFilterChange={setFilter_assigneeStatus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSort}
            isLoading={isLoading}
            onEdit={() => {}}
            onDelete={async () => false}
            statuses={statuses}
            onApprove={handleApprove}
            onReject={handleReject}
            filter_request_name={filter_request}
            filter_assignee_name={filter_assignee}
            onAssigneeNameFilter={setAssignee_name}
            onRequestNameFilter={setRequest_name}
            facilityAgreementCategory={warehouseTypes}
            filter_agreement_no={filterAgreementNo}
            onFilterAgreementNo={setFilterAgreementNo}
            categoryFilter={filterCategory}
            onCategoryFilterChange={setFilterCategory}
            filter_start_date={filterFrom}
            onValidStartDateFilter={setFilterFrom}
            filter_end_date={filterTo}
            onValidEndDateFilter={setFilterTo}
            filter_rent_amount={filterRentAmount}
            onFilterRentAmount={setFilterRentAmount}
            filter_last_action={filter_last_action}
            onLastActionFilter={setFilter_last_action}
            onFilterReasonChange={setFilter_reason}
            filter_reason={filter_reason}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50">
          {/* Footer can be used for additional actions if needed */}
        </div>
      </div>
    </div>
  );
};
