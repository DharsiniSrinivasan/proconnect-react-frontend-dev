import { useState, useEffect } from "react";
import {
  LeaseMasterTable,
  SortOrder,
} from "@/components/master-data/LeaseMasterTable";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  MasterModal,
  FormField,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Handshake, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboBox, ComboBoxOption } from "@/components/search-select/combo-box";
import { useFacilityStore, useTilesStore } from "@/stores/masterStore";
import { useFacilityAgreementStore } from "@/stores/leaseStore";
import { useAuditStore } from "@/stores/auditStore";
import { facilityAgreementService } from "@/services/leaseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { masterData, uploadFileData } from "@/services/masterService";
import { getStorage } from "@/utils/storage";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgreementOverviewTable } from "@/components/master-data/AgreementOverviewTable";
import { NeonCard } from "@/components/ui/neon-card";
import LeaseViewModal from "./leaseView";

interface LeaseItem {
  id: number;
  lease_agreement_number: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  facility_id: number;
  status?: string;
  created_date?: string;
  last_updated?: string;
  warehouseType?: string;
}

interface ImportError {
  row: number;
  error: string;
}
const statuses = ["Pending", "Approved", "Rejected"];
const LeaseMasterPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<LeaseItem | null>(null);
  const { assigneeData, getAssigneeList } = useAuditStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState<any>(null);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchParams] = useSearchParams();
  const [startDatePopover, setStartDatePopover] = useState(false);
  const [endDatePopover, setEndDatePopover] = useState(false);
  const {
    fetchAgreements,
    updateAgreement,
    getAgreementById,
    saveLease,
    getListAllFacilities,
    facilityMaster,
    leaseData,
    getAgreementCategory,
    facilityAgreementCategory,
    pageSize,
    setPageSize,
    total,
    isLoading,
    getFacilityCategory,
  } = useFacilityAgreementStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filter_request, setRequest_name] = useState("");
  const [filterAgreementNo, setFilterAgreementNo] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState<Date | null>(null);
  const [filterTo, setFilterTo] = useState<Date | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [filterRentAmount, setFilterRentAmount] = useState<any>("");
  const [filter_assignee, setAssignee_name] = useState("");
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  const [formData, setFormData] = useState({
    lease_agreement_number: "",
    facility: "",
    start_date: null,
    end_date: null,
    rent_amount: "",
    warehouseType: null,
    assign_to: null as number | null,
  });
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, fetchStatus } = useFacilityStore();
  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "view":
        setActiveTab("agreement");
        break;
      case "add":
        setModalOpen(true);
        setActiveTab("agreement");
        break;
      case "await":
        setActiveTab("await");
        break;
      case "request":
        setActiveTab("request");
        break;
      default:
        setActiveTab("agreement");
    }
  }, []);

  useEffect(() => {
    getAgreementCategory()
    getListAllFacilities();
    getAssigneeList();
    setPageSize(10);
  }, []);
  useEffect(() => {
    fetchStatus();
  }, []);
  const formatDate = (date: any) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (activeTab) {
      if (activeTab !== "agreement") {
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
          activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
          activeTab === "request" ? null : userId,
          activeTab === "request" ? userId : null,
          filter_reason,
          filter_last_action,
          filter_assignee,
          filter_request,
          filterRentAmount,
        );
      } else {
        fetchAgreements(
          currentPage,
          pageSize,
          searchQuery,
          filterAgreementNo,
          filterCategory != "all" ? filterCategory : "",
          formatDate(filterFrom),
          formatDate(filterTo),
          sortBy,
          sortOrder,
          "",
          null,
          null,
          "",
          "",
          "",
          "",
          filterRentAmount,
          statusFilter,
        );
      }
    }
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
    activeTab,
    filter_reason,
    filter_last_action,
    filter_assignee,
    filter_request,
    filterRentAmount,
    statusFilter,
    filter_AssigneestatusFilter,
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setStatusFilter("all");
    setFilterCategory("all");
    setFilterAgreementNo("");
    setFilterFrom(null);
    setFilterTo(null);
    setSortBy("");
    setSortOrder(null);
    setFilter_reason("");
    setFilter_last_action("");
    setRequest_name("");
    setFilterRentAmount("");
    setFilter_assigneeStatus("");
    setCurrentPage(0);
    setPageSize(10);
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lease_agreement_number.trim()) {
      newErrors.lease_agreement_number = "Agreement Number is required";
    } else if (formData.lease_agreement_number.length < 4) {
      newErrors.lease_agreement_number = "Agreement Number must be at least 4 characters";
    }
    // else if (!/^LA-\d{3,}$/.test(formData.lease_agreement_number.trim())) {
    //   newErrors.lease_agreement_number =
    //     "Agreement Number must follow pattern LA-XXX";
    // }

    if (!formData.facility) {
      newErrors.facility = "Facility is required";
    }

    if (!editingLease && !formData.assign_to) {
      newErrors.assign_to = "Assignee is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    // Warehouse Type validation
    if (!formData.warehouseType) {
      newErrors.warehouseType = "Category type is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    const rentAmount = formData.rent_amount?.toString().trim();

    if (!rentAmount) {
      newErrors.rent_amount = "Rent amount is required";
    } else if (rentAmount.length < 3) {
      newErrors.rent_amount = "Rent amount must be at least 3 digits";
    } else if (isNaN(Number(rentAmount)) || Number(rentAmount) <= 0) {
      newErrors.rent_amount = "Rent amount must be greater than 0";
    }
    // else if (Number(formData.rent_amount) > 999999999) {
    //   newErrors.rent_amount = "Rent amount cannot exceed ₹999,999,999";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setEditingLease(null);
    setFormData({
      lease_agreement_number: "",
      facility: "",
      start_date: null,
      end_date: null,
      rent_amount: "",
      warehouseType: "",
      assign_to: null as number | null,
    });
    setErrors({});
    setModalOpen(true);
  };
  const handleWarehouseTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      warehouseType: value,
    }));

    setErrors((prev) => {
      const { warehouseType, ...rest } = prev;
      return rest;
    });
  };
  const viewLeaseCard = async (details: any) => {
    try {
      const res: any = await getAgreementById(details?.id);
      if (res) {
        setViewDetails(res);
        setViewModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching lease details:", error);
    }
  };
  const handleEdit = async (lease: any) => {
    setModalOpen(true);
    const res: any = await getAgreementById(lease.id);
    if (res) {
      setFacilityValue(res.facility_id)
      setFormData({
        lease_agreement_number: res.agreement_number || "",
        facility: res.facility_id || 0,
        start_date: res.start_date || "",
        end_date: res.end_date || "",
        rent_amount: res.rent_amount || "",
        warehouseType: res.category || "",
        assign_to: null,
      });
    }
    setEditingLease(lease);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await facilityAgreementService.deleteAgreement(Number(id));
      toast.success(res?.message);
      fetchAgreements(currentPage, pageSize);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editingLease) {
        const newLease: any = {
          facility_id: formData.facility,
          agreement_number: formData.lease_agreement_number,
          category: formData.warehouseType,
          start_date: format(formData.start_date, "yyyy-MM-dd"),
          end_date: format(formData.end_date, "yyyy-MM-dd"),
          rent_amount: Number(formData.rent_amount),
          //  assigned_to: formData.assign_to,
          status: editingLease?.status,
        };
        const res = await updateAgreement(editingLease?.id, newLease);
        if (res) {
          setModalOpen(false);
          setCategoryOptions([])
          setFormData({
            lease_agreement_number: "",
            facility: "",
            start_date: new Date(),
            end_date: new Date(),
            rent_amount: "",
            warehouseType: "",
            assign_to: null as number | null,
          });
          fetchAgreements(
            currentPage,
            pageSize,
            searchQuery,
            filterAgreementNo,
            filterCategory != "all" ? filterCategory : "",
            formatDate(filterFrom),
            formatDate(filterTo),
            sortBy,
            sortOrder,
            "",
            null,
            null,
            "",
            "",
            "",
            "",
            filterRentAmount,
            statusFilter,
          );
        }
      } else {
        const newLease: any = {
          facility_id: formData.facility,
          agreement_number: formData.lease_agreement_number,
          category: formData.warehouseType,
          start_date: format(formData.start_date, "yyyy-MM-dd"),
          end_date: format(formData.end_date, "yyyy-MM-dd"),
          rent_amount: Number(formData.rent_amount),
          assigned_to: formData.assign_to,
        };
        const res = await saveLease(newLease);
        if (res) {
          setModalOpen(false);
          setFormData({
            lease_agreement_number: "",
            facility: "",
            start_date: new Date(),
            end_date: new Date(),
            rent_amount: "",
            warehouseType: "",
            assign_to: null as number | null,
          });
          fetchAgreements(
            currentPage,
            pageSize,
            searchQuery,
            filterAgreementNo,
            filterCategory != "all" ? filterCategory : "",
            formatDate(filterFrom),
            formatDate(filterTo),
            sortBy,
            sortOrder,
            "",
            null,
            null,
            "",
            "",
            "",
            "",
            filterRentAmount,
            statusFilter,
          );
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save lease");
    } finally {
      setSaving(false);
    }
  };
  const getCostLabel = () => {
    switch (formData.warehouseType) {
      case "Lease":
        return "Lease Value (₹)";
      case "Rent":
        return "Rent Amount (₹)";
      case "OwnFacility":
        return "Facility Value (₹)";
      case "Out source":
        return "Annual Returns (₹)";
      case "Own warehouse":
        return "Facility Value (₹)";
      case "Rented / Leased":
        return "Rent Amount (₹)";
      case "Shared warehouse":
        return "Rent Amount (₹)";
      case "Outsourced WH":
        return "Annual Returns (₹)";
      default:
        return "Amount (₹)";
    }
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingLease(null);
    setCategoryOptions([])
    setErrors({});
    searchParams.delete("buttontype");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true },
    );
  };

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "agreeement",
        "Agreeement_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      lease_agreement_number: "",
      facility: "",
      start_date: new Date(),
      end_date: new Date(),
      rent_amount: "",
      warehouseType: "",
      assign_to: null as number | null,
    });
    setErrors({});
    setCategoryOptions([])
  };

  const handleDateSelect = (
    date: Date | undefined,
    dateType: "start_date" | "end_date",
  ) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [dateType]: date,
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[dateType];
        return newErrors;
      });

      if (dateType === "start_date") {
        setStartDatePopover(false);
      } else {
        setEndDatePopover(false);
      }
    }
  };
  const importData = async (selectedFile?: File | null, assignTo?: string) => {
    if (!selectedFile) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload a CSV or Excel file.");
      return;
    }

    setIsUploading(true);

    try {


      const response = await uploadFileData.uploadFile(
        selectedFile,
        "agreeement",
        Number(assignTo),
      );

      if (!response) {
        return;
      }

      const status = response?.status_code;

      if (status === 200 || status === 201) {
        fetchAgreements(currentPage, pageSize, searchQuery);
        const errors = response?.data?.errors ?? [];
        const successCount = response?.data?.created ?? 0;

        if (Array.isArray(errors) && errors.length > 0) {
          toast.warning(`Import completed with ${successCount} successful and ${errors.length} errors`);

          setImportErrors(errors);
          setImportSuccessCount(successCount);
          setImportTotalRows(successCount);
          setImportErrorModalOpen(true);
        } else {
          toast.success("Agreement data imported successfully!");
        }
      } else {
        toast.error("Import failed. Unexpected server response.");
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Import failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const exportData = async () => {
    setIsExporting(true);
    try {
      await masterData.exportFile(true, "agreeement", "Agreeement.xlsx", {
        search: searchQuery || "",
        status: statusFilter != "all" ? statusFilter : "",
        filter_agreement_number: filterAgreementNo || "",
        category: filterCategory != "all" ? filterCategory : "",
        start_date: filterFrom || "",
        end_date: filterTo || "",
        filter_rent_amount: filterRentAmount || "",
        sort_by: sortBy || "",
        sort_order: sortOrder || "",
      });
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  const handleClearDate = (dateType: "start_date" | "end_date") => {
    setFormData((prev) => ({
      ...prev,
      [dateType]: new Date(),
    }));
  };

  const handleSortChange = (
    newSortBy: string | null,
    newSortOrder: SortOrder,
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const warehouseTypes = facilityAgreementCategory.map((item) => ({
    label: item,
    value: item,
  }));
  const facilityOptionsValue: ComboBoxOption[] = facilityMaster.map(
    (item: any) => ({
      id: item.id, // required by ComboBox
      value: item.name, // required by ComboBox
      data: item, // optional, keeps full object if needed
    }),
  );
  const userOptionsValue: any = assigneeData?.map((user: any) => ({
    id: user.id,
    label: user.name,
    value: String(user.name),
    data: user,
  }));

  const handleApprove = async (ids: (string | number)[]) => {
    const agreement_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      agreement_ids,
      assigned_status: "Approved",
      rejection_reason: "",
    };

    let success = false;
    success = await updateStatus(request, "facility_agreement");

    if (success) {
      fetchAgreements(
        currentPage,
        pageSize,
        searchQuery,
        filterAgreementNo,
        filterCategory != "all" ? filterCategory : "",
        formatDate(filterFrom),
        formatDate(filterTo),
        sortBy,
        sortOrder,
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_last_action,
        filter_assignee,
        filter_request,
        filterRentAmount,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const agreement_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      agreement_ids,
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, "facility_agreement");

    if (success) {
      fetchAgreements(
        currentPage,
        pageSize,
        searchQuery,
        filterAgreementNo,
        filterCategory != "all" ? filterCategory : "",
        formatDate(filterFrom),
        formatDate(filterTo),
        sortBy,
        sortOrder,
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_last_action,
        filter_assignee,
        filter_request,
        filterRentAmount,
      );
    }
  };

  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  const setFacilityValue = async (id: any) => {
    setFormData((prev: any) => ({ ...prev, facility: id }));
    const res = await getFacilityCategory(id);
    const options = res?.map((item) => ({
      label: item,
      value: item,
    }));
    setCategoryOptions(options)
    // Clear errors for facility field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.facility;
      return newErrors;
    });
  }
  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card border border-border mb-3">
          <TabsTrigger
            value="agreement"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Handshake className="h-4 w-4" />
            <span>All agreements</span>
          </TabsTrigger>
          <TabsTrigger
            value="await"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Awaiting approvals</span>
            <span className="sm:hidden">Await</span>
          </TabsTrigger>
          <TabsTrigger
            value="request"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Requested approvals</span>
            <span className="sm:hidden">Request</span>
          </TabsTrigger>
        </TabsList>
        {activeTab !== "await" && activeTab !== "request" && (
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <MasterTopBarControls
              setUploading={setIsUploading}
              isUploading={isUploading}
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setCurrentPage(0)
                setSearchQuery(value);
              }}
              searchPlaceholder="Search"
              statusFilter={{
                value: statusFilter,
                onChange: (value) => {
                  setStatusFilter(value);
                  setCurrentPage(0);
                },
                options: [
                  { value: "all", label: "All Status" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inacitve" },
                ],
                placeholder: "Status",
              }}
              description=""
              onAddNew={handleAddNew}
              addLabel="Add Agreement"
              isDownloading={isDownloading}
              handleDownload={() => {
                downloadTemplate();
              }}
              handleExport={exportData}
              isExporting={isExporting}
              handleImport={importData}
              acceptedFileTypes=".csv,.xlsx,.xlsb"
            />
          </header>
        )}
        <TabsContent value="agreement" className="mt-0">
          <LeaseMasterTable
            onPageSizeChange={setPageSize}
            totalRecords={total}
            pageSize={pageSize}
            leases={leaseData}
            page={currentPage}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            statusFilter={statusFilter === "all" ? "" : statusFilter}
            onStatusFilterChange={(value) => setStatusFilter(value)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
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
            status={status}
            onView={viewLeaseCard}
          />
        </TabsContent>
        <TabsContent value={"await"} className="mt-0">
          <NeonCard
            title="Awaiting approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
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
              onEdit={() => { }}
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
          </NeonCard>
        </TabsContent>
        <TabsContent value={"request"} className="mt-0">
          <NeonCard
            title="Requested approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <AgreementOverviewTable
              leases={leaseData}
              page={currentPage}
              pageSize={pageSize}
              totalRecords={total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              readOnly={true}
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
              onEdit={() => { }}
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
          </NeonCard>
        </TabsContent>
      </Tabs>

      <MasterModal
        open={modalOpen}
        onClose={handleModalClose}
        title={editingLease ? "Edit Agreement" : "Add New Agreement"}
        onSave={handleSave}
        saving={saving}
        buttontitle={editingLease ? "Update" : "Request"}
        onReset={resetForm}
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement Number */}
          <FormField
            label="Agreement Number"
            required
            error={errors.lease_agreement_number}
          >
            <NeonInput
              value={formData.lease_agreement_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lease_agreement_number: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g., LA-001"
              error={!!errors.lease_agreement_number}
            />
          </FormField>

          {/* Facility */}
          <FormField label="Facility" required error={errors.facility}>
            <ComboBox
              options={facilityOptionsValue} // use mapped options
              selectedValue={formData.facility} // only the id is stored
              placeholder="Select a facility..."
              onValueChange={(id: number) => {
                // Update the form with selected facility id
                setFacilityValue(id)
              }}
              renderOption={(option) => (
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">{option.value}</span>
                  <span className="text-xs text-gray-500">
                    {option.data.facility_code}
                  </span>
                </div>
              )}
            />
          </FormField>
          {!editingLease && (
            <FormField label="Assignee" required error={errors.assign_to}>
              <ComboBox
                options={userOptionsValue}
                selectedValue={formData.assign_to}
                placeholder="Select Assignee"
                renderOption={(option: any) => (
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{option.data?.name}</span>
                  </div>
                )}
                onValueChange={(userId: number) => {
                  setFormData((prev) => ({
                    ...prev,
                    assign_to: userId,
                  }));
                }}
              />
            </FormField>
          )}

          {/* Start Date */}
          <FormField label="Start Date" required error={errors.start_date}>
            <Popover open={startDatePopover} onOpenChange={setStartDatePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground",
                    errors.start_date && "border-destructive",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date
                    ? format(formData.start_date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => handleDateSelect(date, "start_date")}

                />
                {formData.start_date && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClearDate("start_date")}
                      className="w-full h-8 text-xs"
                    >
                      Clear Date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </FormField>

          {/* End Date */}
          <FormField label="End Date" required error={errors.end_date}>
            <Popover open={endDatePopover} onOpenChange={setEndDatePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground",
                    errors.end_date && "border-destructive",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date
                    ? format(formData.end_date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date) => handleDateSelect(date, "end_date")}
                  initialFocus
                />
                {formData.end_date && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClearDate("end_date")}
                      className="w-full h-8 text-xs"
                    >
                      Clear Date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </FormField>
          {
            formData.facility && (
              <FormField label="Category" required error={errors.warehouseType}>
                <Select
                  value={formData.warehouseType}
                  onValueChange={handleWarehouseTypeChange}
                >
                  <SelectTrigger
                    className={`w-full rounded-md  ${errors.warehouseType ? "border-destructive" : ""
                      }`}
                  >
                    <SelectValue
                      placeholder="Select Category Type"
                      className="font-normal text-muted-foreground"
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {categoryOptions?.map((warehouse) => (
                        <SelectItem key={warehouse.value} value={warehouse.value}>
                          {warehouse.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormField>
            )
          }
          {/* Rent Amount */}
          {formData.warehouseType && (
            <FormField
              label={getCostLabel()}
              required
              error={errors.rent_amount}
            >
              <NeonInput
                type="text"
                value={formData.rent_amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, rent_amount: value });
                  }
                }}
                placeholder="Enter amount"
                error={!!errors.rent_amount}
              />
            </FormField>
          )}
        </div>
      </MasterModal>
      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Facility_agreement_master_template"
      />
      <LeaseViewModal
        open={viewModalOpen}
        lease={viewDetails}
        onClose={() => setViewModalOpen(false)}
        approval={false}
      />
    </div>
  );
};
export default LeaseMasterPage;


