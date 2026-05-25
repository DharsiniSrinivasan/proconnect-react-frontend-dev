import React, { useState, useEffect } from "react";
import { X, Hourglass, List } from "lucide-react";
import { useTilesStore } from "@/stores/masterStore";
import { toast } from "sonner";
import { getStorage } from "@/utils/storage";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { MasterOverviewItem } from "@/types/master-data";
import { useContractStore } from "@/stores/contractStore";
import ContractorOverviewTable from "./ContractorOverviewTable";

interface ApprovalModalProps {
  tile: MasterOverviewItem;
  onClose: () => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  isRead?: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
export const ContractorModal: React.FC<ApprovalModalProps> = ({
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
  const [filterPartnername, setFilterPartnername] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filter_contractNo, setFilter_contractNo] = useState("");
  const [filterFrom, setFilterFrom] = useState<Date | null>(null);
  const [filterTo, setFilterTo] = useState<Date | null>(null);
  const [filter_reason, setFilter_reason] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");

  const {
    contractData,
    pageSize,
    total,
    isLoading,
    fetchContracts,
  } = useContractStore();

  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);

  useEffect(() => {
    if (readOnly) {
      setActiveTab("request");
    } else {
      setActiveTab("awaits");
    }
  }, [readOnly]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);

  const formatDate = (date: any) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchContracts(
      currentPage,
      pageSize,
      searchQuery,
      filterPartnername,
      filterCustomerName,
      filter_contractNo,
      formatDate(filterFrom),
      formatDate(filterTo),
      "",
      sortBy,
      sortOrder,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      filter_assignee,
      filter_last_action,
      filter_request,
    );
  }, [
    fetchContracts,
    currentPage,
    pageSize,
    searchQuery,
    filterPartnername,
    filterCustomerName,
    filter_contractNo,
    filterFrom,
    filterTo,
    sortBy,
    sortOrder,
    statusFilter,
    readOnly,
    filter_reason,
    filter_last_action,
    filter_assignee,
    filter_request,
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "awaits") {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleReasonFilterChange = (value: string) => {
    setFilter_reason(value);
  };

  const handleApprove = async (ids: (string | number)[]) => {
    const request = {
      contract_ids: (ids || []).map(Number),
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchContracts(
        currentPage,
        pageSize,
        searchQuery,
        filterPartnername,
        filterCustomerName,
        filter_contractNo,
        formatDate(filterFrom),
        formatDate(filterTo),
        "",
        sortBy,
        sortOrder,
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
      contract_ids: (ids || []).map(Number),
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchContracts(
        currentPage,
        pageSize,
        searchQuery,
        filterPartnername,
        filterCustomerName,
        filter_contractNo,
        formatDate(filterFrom),
        formatDate(filterTo),
        "",
        sortBy,
        sortOrder,
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

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePageSizeChange = (size: number) => {
    fetchContracts(
      currentPage,
      size,
      searchQuery,
      filterPartnername,
      filterCustomerName,
      filter_contractNo,
      formatDate(filterFrom),
      formatDate(filterTo),
      "",
      sortBy,
      sortOrder,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      filter_assignee,
      filter_last_action,
      filter_request,
    );
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
          <ContractorOverviewTable
            contractors={contractData}
            page={currentPage}
            pageSize={pageSize}
            totalRecords={total}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            showDelete={false}
            readOnly={readOnly}
            filter_partner_name={filterPartnername}
            filter_customer={filterCustomerName}
            filter_contract_no={filter_contractNo}
            filter_valid_from={filterFrom}
            filter_valid_to={filterTo}
            filter_reason={filter_reason}
            statusFilter={statusFilter}
            onCustomerFilter={setFilterCustomerName}
            onValidFromFilter={setFilterFrom}
            onValidToFilter={setFilterTo}
            onPartnerFilter={setFilterPartnername}
            onContractFilter={setFilter_contractNo}
            onReasonFilter={handleReasonFilterChange}
            onStatusFilter={handleStatusFilterChange}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            statuses={statuses}
            onApprove={handleApprove}
            onReject={handleReject}
            filter_last_action={filter_last_action}
            onLastActionFilter={setFilter_last_action}
            filter_request_name={filter_request}
            filter_assignee_name={filter_assignee}
            onAssigneeNameFilter={setAssignee_name}
            onRequestNameFilter={setRequest_name}
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
