import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { getStorage } from "@/utils/storage";
import React, { useState, useEffect } from "react";
import {
  X,
  Hourglass,
  List
} from "lucide-react";
import type { MasterOverviewItem } from "@/mocks/masterData.mock";
import { PartnerOverviewTable } from "./PartnerOverviewTable";
import { usePartnerStore } from "@/stores/partnerStore";
import { useTilesStore } from "@/stores/masterStore";
interface ApprovalModalProps {
  tile: MasterOverviewItem;
  onClose: () => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  isRead?: boolean;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
const TransporterModal: React.FC<ApprovalModalProps> = ({
  tile,
  onClose,
  isRead = false,
}) => {
  const statuses = ["Pending", "Approved", "Rejected"];
  const [activeTab, setActiveTab] = useState("");
  const [readOnly, setReadOnly] = useState(isRead);
  const searchQuery = "";
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState<string[]>([]);
  const [filter_name, setFilter_name] = useState("");
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_customer, setCustomer_name] = useState("");
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");
  const [filter_code, setFilter_code] = useState("");
  const [otif_percent, setOtifPercent] = useState("");
  const [filter_email, setFilter_email] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [filter_last_action, setFilter_last_action] = useState(null);
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  useEffect(() => {
    getmodes();
    getStatus();
  }, []);
  useEffect(() => {
    if (readOnly) {
      setActiveTab("request");
    } else {
      setActiveTab("awaits");
    }
  }, [readOnly]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);

  const {
    partners,
    total,
    fetchPartners,
    pageSize,
    isLoading,
    getmodes,
    modes,
    getStatus,
  } = usePartnerStore();

  useEffect(() => {
    fetchPartners(
      currentPage,
      pageSize,
      statusFilter === "all" ? "" : statusFilter,
      searchQuery,
      modeFilter,
      filter_name,
      filter_email,
      Number(otif_percent),
      filter_code,
      sortBy,
      sortOrder,
      filter_customer,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      "",
      filter_last_action,
    );
  }, [
    currentPage,
    statusFilter,
    searchQuery,
    modeFilter,
    filter_name,
    filter_code,
    filter_email,
    sortBy,
    sortOrder,
    otif_percent,
    filter_customer,
    readOnly,
    filter_reason,
    filter_last_action,
  ]);
 
  // Page size change handler
  const handlePageSizeChange = (size: number) => {
    //setPageSize(size);
    fetchPartners(
      currentPage,
      size,
      statusFilter === "all" ? "" : statusFilter,
      searchQuery,
      modeFilter,
      filter_name,
      filter_email,
      Number(otif_percent),
      filter_code,
      sortBy,
      sortOrder,
      filter_customer,
      readOnly ? "" : "Pending",
      readOnly ? null : userId,
      readOnly ? userId : null,
      filter_reason,
      "",
      filter_last_action,
    );
  };

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

  // Status filter handler
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Mode filter handler
  const handleModeFilterChange = (value: string[]) => {
    setModeFilter(value);
  };

  // Name filter handler
  const handleNameFilterChange = (value: string) => {
    setFilter_name(value);
  };
  const handleReasonFilterChange = (value: string) => {
    setFilter_reason(value);
  };

  const handleCustomerFilterChange = (value: string) => {
    setCustomer_name(value);
  };

  const handleCodeFilterChange = (value: string) => {
    setFilter_code(value);
  };

  // Email filter handler
  const handleEmailFilterChange = (value: string) => {
    setFilter_email(value);
  };

  const handleAssigneeFilterChange = (value: string) => {
    setAssignee_name(value);
  };

  const handleRequestFilterChange = (value: string) => {
    setRequest_name(value);
  };

  const handleApprove = async (ids: (string | number)[]) => {
    const request = {
      partner_ids: (ids || []).map(Number),
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchPartners(
        currentPage,
        pageSize,
        statusFilter === "all" ? "" : statusFilter,
        searchQuery,
        modeFilter,
        filter_name,
        filter_email,
        Number(otif_percent),
        filter_code,
        sortBy,
        sortOrder,
        filter_customer,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        "",
        filter_last_action,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const request = {
      partner_ids: (ids || []).map(Number),
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, tile?.id);
    if (success) {
      fetchPartners(
        currentPage,
        pageSize,
        statusFilter === "all" ? "" : statusFilter,
        searchQuery,
        modeFilter,
        filter_name,
        filter_email,
        Number(otif_percent),
        filter_code,
        sortBy,
        sortOrder,
        filter_customer,
        readOnly ? "" : "Pending",
        readOnly ? null : userId,
        readOnly ? userId : null,
        filter_reason,
        filter_last_action,
      );
    }
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
          <PartnerOverviewTable
            readOnly={readOnly}
            partners={partners}
            totalpartners={total}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            // Filter props
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            modeFilter={modeFilter}
            filter_name={filter_name}
            filter_reason={filter_reason}
            filter_customer={filter_customer}
            filter_request_name={filter_request}
            filter_assignee_name={filter_assignee}
            filter_code={filter_code}
            filter_email={filter_email}
            onStatusFilter={handleStatusFilterChange}
            onModeFilter={handleModeFilterChange}
            onNameFilter={handleNameFilterChange}
            onReasonFilter={handleReasonFilterChange}
            onCustomerFilter={handleCustomerFilterChange}
            onCodeFilter={handleCodeFilterChange}
            onEmailFilter={handleEmailFilterChange}
            onAssigneeNameFilter={handleAssigneeFilterChange}
            onRequestNameFilter={handleRequestFilterChange}
            // Sort props
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            // Data for dropdowns
            modes={modes}
            statuses={statuses}
            filter_otif={otif_percent}
            onOTFFilter={setOtifPercent}
            // Updated handlers that now accept array of IDs
            onApprove={handleApprove}
            onReject={handleReject}
            filter_last_action={filter_last_action}
            onLastActionFilter={setFilter_last_action}
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
export default TransporterModal;
