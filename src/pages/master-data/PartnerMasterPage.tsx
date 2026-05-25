import { useState, useEffect, useRef } from "react";
import { PartnerMasterTable } from "@/components/master-data/PartnerMasterTable";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  FormField,
  MasterModal,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { PartnerRow } from "@/mocks/masterData.mock";
import { toast } from "sonner";
import { usePartnerStore } from "@/stores/partnerStore";
import { NeonMultiSelect } from "@/components/multiSelect";
import * as Yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import { masterData, uploadFileData } from "@/services/masterService";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ComboBox, ComboBoxOption } from "@/components/search-select/combo-box";
import { useCustomerStore, useTilesStore } from "@/stores/masterStore";
import { useAuditStore } from "@/stores/auditStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  Clock, List, Truck } from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import { PartnerOverviewTable } from "@/components/master-data/PartnerOverviewTable";
import { getStorage } from "@/utils/storage";
import { NeonCard } from "@/components/ui/neon-card";


export type TransportMode = "Air" | "Road" | "Sea";
export const MODES: TransportMode[] = ["Air", "Road", "Sea"];

export type PartnerFormData = {
  name: string;
  mode: TransportMode[];
  contact_email: string;
  status: any;
};
interface ImportError {
  row: number;
  error: string;
}
export interface PartnerFormValues {
  name: string;
  transport_mode: string[];
  status: any;
  contact_email: string;
  code: string;
  assign_to: string | any;
  otif_percent: string | number;
  customer_id: string | number | "";
}

interface Customer {
  id: number;
  name: string;
  gstin: string;
  billing_address: string;
  shipping_address: string;
  status: string;
  region: string;
  pin_code: string;
  created_date: string;
  last_updated: string;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
const assignedStatus = ["Pending", "Approved", "Rejected"];
const PartnerMasterPage = () => {
  // Filter and search states (moved from child)
  const [filter_request, setRequest_name] = useState("");
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState<string[]>([]);
  const [filter_name, setFilter_name] = useState("");
  const [filter_customer, setCustomer_name] = useState("");
  const [filter_code, setFilter_code] = useState("");
  const [otif_percent, setOtifPercent] = useState("");
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const [filter_assignee_name, setFilter_assigneeName] = useState("");
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_email, setFilter_email] = useState("");
  const [searchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const value = searchParams.get("value");
  // Sort states (moved from child)
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [filter_last_action, setFilter_last_action] = useState(null);
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  // Upload/Download states
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const { dropdownList, customerDropDown } = useCustomerStore();
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  // Store hooks
  const {
    partners,
    setPageSize,
    fetchPartnerById,
    total,
    fetchPartners,
    updatePartner,
    deletePartner,
    pageSize,
    isLoading,
    getmodes,
    modes,
    getStatus,
    statuses,
    createPartner,
  } = usePartnerStore();
  const { assigneeData, getAssigneeList } = useAuditStore();
  // Form initial values
  const initialValues: PartnerFormValues = {
    name: editingPartner?.name ?? "",
    transport_mode: editingPartner?.transport_mode ?? [],
    status: editingPartner?.status ?? "",
    contact_email: editingPartner?.contact_email ?? "",
    code: editingPartner?.code ?? "",
    otif_percent: editingPartner?.otif_percent ?? "",
    customer_id: editingPartner?.customer_id ?? "",
    assign_to: editingPartner?.assigned_to
      ? String(editingPartner.assigned_to)
      : "",
  };
  const formikRef = useRef<FormikProps<PartnerFormValues>>(null);
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(4, "Transporter name must be at least 4 characters")
      .required("Transporter name is required"),
    transport_mode: Yup.array()
      .min(1, "Select at least one mode")
      .required("Mode is required"),
    contact_email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email")
      .required("Email is required"),
    code: Yup.string()
      .min(4, "Code must be at least 4 characters")
      .required("Code is required"),
    otif_percent: Yup.number()
      .typeError("OTIF must be a number")
      .min(0, "OTIF cannot be negative")
      .max(100, "OTIF cannot be more than 100")
      .required("OTIF is required"),
    customer_id: Yup.string().required("Customer is required"),
    assign_to: Yup.string().when([], {
      is: () => !editingPartner,
      then: (schema) => schema.required("Assignee is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  useEffect(() => {
    getmodes();
    getStatus();
    setPageSize(10);
  }, []);
  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "view":
        setActiveTab("transporters");
        break;
      case "add":
        setModalOpen(true);
        setActiveTab("transporters");
        break;
      case "await":
        setActiveTab("await");
        break;
      case "request":
        setActiveTab("request");
        break;

      default:
        setActiveTab("transporters")
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      if (activeTab !== "transporters") {
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
          activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
          activeTab === "request" ? null : userId,
          activeTab === "request" ? userId : null,
          filter_reason,
          filter_assignee_name,
          filter_last_action,
          filter_request,
        );
      } else {
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
          filter_AssigneestatusFilter,
          null,
          null,
          filter_reason,
          filter_assignee_name,
          filter_last_action,
        );
      }
    }
  }, [
    currentPage,
    pageSize,
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
    activeTab,
    filter_assignee_name,
    filter_reason,
    filter_request,
    filter_AssigneestatusFilter,
  ]);

  let userOptionsValue =
    assigneeData?.map((user: any) => ({
      id: user.id,
      label: user.name,
      value: String(user.name),
    })) || [];

  // If editing and assigned_to is missing, prepend it
  if (
    editingPartner?.assigned_to &&
    !userOptionsValue.find(
      (u) => u.value === String(editingPartner.assigned_to),
    )
  ) {
    userOptionsValue = [
      {
        id: editingPartner.assigned_to,
        label: editingPartner.assigned_to_name,
        value: String(editingPartner.assigned_to),
      },
      ...userOptionsValue,
    ];
  }
  const importData = async (selectedFile: File, assignTo: string) => {
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
        "Transporter",
        Number(assignTo), // pass assignee id
      );
      if (!response) {
        return;
      }

      if (response) {
        fetchPartners(
          currentPage,
          pageSize,
          statusFilter === "all" ? "" : statusFilter,
          searchQuery,
          modeFilter,
          filter_name,
          filter_email,
          Number(otif_percent),
          sortBy,
          sortOrder,
          filter_customer,
        );

        const errors = response?.errors ?? [];
        const successCount = response?.created ?? 0;

        if (Array.isArray(errors) && errors.length > 0) {
          toast.warning(`Import completed with ${successCount} successful and ${errors.length} errors`);

          setImportErrors(errors);
          setImportSuccessCount(successCount);
          setImportTotalRows(successCount);
          setImportErrorModalOpen(true);
        } else {
          toast.success(response?.message||"Transporter data imported successfully!");
        }
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Import failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // Add new handler
  const handleAddNew = () => {
    setEditingPartner(null);
    formikRef.current?.resetForm();
    setModalOpen(true);
  };

  // Edit handler
  const handleEdit = async (partner: PartnerRow | any) => {
    try {
      const response = await fetchPartnerById(partner.id);

      setEditingPartner(response);
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch transporter details");
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const response: any = await deletePartner(id);


    if (response?.status_code === 200) {
      toast.success(response?.message||"Transporter deleted successfully");
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
        filter_AssigneestatusFilter,
        null,
        null,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
      );
      return true;
    } else {
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
        filter_AssigneestatusFilter,
        null,
        null,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
      );
      return false;
    }

  };

  // Save handler
  const handleSave = async (values: PartnerFormValues, { resetForm }: any) => {
    try {
      let response: any;
      const payload = {
        customer_id: values.customer_id,
        name: values.name,
        code: values.code,
        transport_mode: values.transport_mode,
        contact_email: values.contact_email,
        status: values.status || "Inactive",
        otif_percent: values.otif_percent,
        ...(editingPartner ? {} : { assigned_to: values.assign_to }),
      };
      if (editingPartner?.id) {
        response = await updatePartner(editingPartner.id, payload);
      } else {
        response = await createPartner(payload);
      }
      if (
        response?.data?.status === "success" ||
        response?.status === "success"
      ) {
        toast.success(response?.data?.message || response?.message);
        resetForm();
        setModalOpen(false);
      }
    } catch (error: any) { }
  };

  // Download template handler
  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "Transporter",
        "Transporter_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  // Export data handler
  // const exportData = async () => {
  //   try {
  //     await masterData.exportFile(true, 'Transporter', 'transporters.xlsx', {
  //       search: searchQuery || "",
  //       status: statusFilter === "all" ? "" : statusFilter,
  //       mode: modeFilter,
  //     });
  //     toast.success("File downloaded successfully");
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     toast.error("Failed to export data");
  //   }
  // };

  const exportData = async () => {
    try {
      setIsExporting(true);
      await masterData.exportFile(true, "Transporter", "transporters.xlsx", {
        search: searchQuery || "",
        status: statusFilter === "all" ? "" : statusFilter,
        customer_name: filter_customer || "",
        mode: modeFilter?.length ? modeFilter : [],
        otif_percent: otif_percent || "",
        code: filter_code || "",
        filter_name: filter_name || "",
        filter_email: filter_email || "",
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
  // Sort handler
  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    // setCurrentPage(0); // Reset to first page when sorting
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
    // setCurrentPage(0); // Reset to first page when filtering
  };
  const handleCustomerFilterChange = (value: string) => {
    setCustomer_name(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };
  const handleCodeFilterChange = (value: string) => {
    setFilter_code(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };

  // Email filter handler
  const handleEmailFilterChange = (value: string) => {
    setFilter_email(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };
  const handleAssigneeStatusFilterChange = (value: string) => {
    setFilter_assigneeStatus(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };
  const handleAssigneeFilterChange = (value: string) => {
    setFilter_assigneeName(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };
  const handleReasonFilterChange = (value: string) => {
    setFilter_reason(value);
    // setCurrentPage(0); // Reset to first page when filtering
  };

  // Page size change handler
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    // setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleModalClose = () => {
    setModalOpen(false);
    searchParams.delete("buttontype");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true },
    );
  };
  const resetFormValue = (resetForm: any) => {
    resetForm({
      values: {
        name: "",
        transport_mode: [],
        status: "",
        contact_email: "",
        code: "",
        otif_percent: "",
        customer_id: "",
      },
    });
  };
  useEffect(() => {
    customerDropDown();
    getAssigneeList();
  }, []);

  const activeList = dropdownList.filter((item) => item.status === "Active");
  const customerOptions: ComboBoxOption<Customer>[] = activeList.map((c) => ({
    id: c.id,
    value: c.name,
    data: c,
  }));

  const handleApprove = async (ids: (string | number)[]) => {
    const partner_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      partner_ids,
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, "transporters");
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
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const partner_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      partner_ids,
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, "transporters");
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
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request,
      );
    }
  };

  const handleRequestFilterChange = (value: string) => {
    setRequest_name(value);
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setStatusFilter("all");
    setModeFilter([]);
    setFilter_name("");
    setCustomer_name("");
    setFilter_code("");
    setOtifPercent("");
    setFilter_assigneeStatus("");
    setFilter_assigneeName("");
    setFilter_reason("");
    setFilter_email("");
    setRequest_name("");
    setFilter_last_action(null);
    setSortBy(null);
    setSortOrder(null);
    setCurrentPage(0);
    setPageSize(10);
  };

  const statusConfig: any = {
  pending: {
    label: "Pending",
    variant: "outline",
  },
  accepted: {
    label: "Accepted",
    variant: "secondary",
  },
  closed: {
    label: "Closed",
    variant: "default",
  },
};
//   const statusHistory = partners.map((item: any) => {
//   const workflowStatus =
//     item.assigned_status === "Pending"
//       ? "pending"
//       : item.assigned_status === "Approved"
//       ? "accepted"
//       : item.assigned_status === "Rejected"
//       ? "closed"
//       : "pending";

//   const isActivation = item.approval_type === "Activation";

//   return {
//     id: item.id,
//     partnerName: item.name,
//     partnerCode: item.code,

//     //  FIXED STATUS
//     status: workflowStatus,

//     //  TRANSITION
//     previousStatus: isActivation ? "Inactive" : "Active",
//     newStatus: isActivation ? "Active" : "Inactive",

//     //  DATES
//     requestRaisedAt: item.requested_at,
//     requestAcceptedAt:
//       item.assigned_status === "Approved" ? item.last_action_at : null,
//     requestClosedAt:
//       item.assigned_status === "Rejected" ? item.last_action_at : null,

//     //  USERS
//     assignedTo: item.assigned_to_name,
//     changedBy: item.last_action_by_name || item.requested_by_name,
//   };
// });
// const formatDate = (date: string) => {
//   if (!date) return "-";

//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true, // important (12-hour format)
//   });
// };
  return (
    // <AppShell pageTitle="Transporters" lastUpdated="5 minutes ago">

    <>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card border border-border mb-4 sm:mb-6 flex-wrap sm:flex-nowrap w-full sm:w-auto">

          <TabsTrigger
            value="transporters"
            className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">All transporters</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>

          <TabsTrigger
            value="await"
            className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Awaiting approvals</span>
            <span className="sm:hidden">Await</span>
          </TabsTrigger>

          <TabsTrigger
            value="request"
            className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Requested approvals</span>
            <span className="sm:hidden">Request</span>
          </TabsTrigger>
             {/* <TabsTrigger
            value="statusHistory"
            className="gap-2 flex-1 sm:flex-none justify-center items-center
      text-xs sm:text-sm px-2 sm:px-4 py-2
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Change History</span>
            <span className="sm:hidden">Request</span>
          </TabsTrigger> */}

        </TabsList>
        {activeTab !== "await" && activeTab !== "request" && activeTab !== "statusHistory"   && (
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <MasterTopBarControls
              setUploading={setIsUploading}
              isUploading={isUploading}
              description="Manage logistics transporter configurations and performance"
              searchQuery={searchQuery}
              searchPlaceholder="Search"
              isExporting={isExporting}
              onSearchChange={(val) => {
                setCurrentPage(0)
                setSearchQuery(val)
              }}
              statusFilter={{
                value: statusFilter,
                onChange: (value) => {
                  setCurrentPage(0)
                  setStatusFilter(value)
                },
                options: [
                  { value: "all", label: "All Status" },
                  ...statuses.map((r) => ({ value: r, label: r })),
                ],
                placeholder: "Status",
              }}
              secondaryFilter={{
                value: modeFilter,
                onChange: (val: any) => {
                  setCurrentPage(0)
                  setModeFilter(val)
                },
                options: [...modes.map((r) => ({ value: r, label: r }))],
                placeholder: "Mode",
                multiSelect: true,
              }}
              onAddNew={handleAddNew}
              addLabel="Add Transporter"
              isDownloading={isDownloading}
              handleDownload={downloadTemplate}
              handleExport={exportData}
              handleImport={importData}
            />
          </header>
        )}
        <TabsContent value="transporters" className="mt-0">
          <PartnerMasterTable
            partners={partners}
            totalRecords={total}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            // Filter props
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            modeFilter={modeFilter}
            filter_name={filter_name}
            filter_customer={filter_customer}
            filter_code={filter_code}
            filter_email={filter_email}
            onStatusFilter={handleStatusFilterChange}
            onModeFilter={handleModeFilterChange}
            onNameFilter={handleNameFilterChange}
            onCustomerFilter={handleCustomerFilterChange}
            onCodeFilter={handleCodeFilterChange}
            onEmailFilter={handleEmailFilterChange}
            // Sort props
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            // Data for dropdowns
            modes={modes}
            statuses={statuses}
            filter_otif={otif_percent}
            onOTFFilter={setOtifPercent}
            AssigneestatusFilter={filter_AssigneestatusFilter}
            filter_assignee_name={filter_assignee_name}
            onAssigneeStatusFilter={handleAssigneeStatusFilterChange}
            onAssigneeNameFilter={handleAssigneeFilterChange}
            onReasonFilter={handleReasonFilterChange}
            filter_reason={filter_reason}
          />
        </TabsContent>
        <TabsContent value={"await"} className="mt-0">
          <NeonCard
            title="Awaiting approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <PartnerOverviewTable
              readOnly={false}
              partners={partners}
              totalpartners={total}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              // Filter props
              searchQuery={searchQuery}
              statusFilter={filter_AssigneestatusFilter}
              modeFilter={modeFilter}
              filter_name={filter_name}
              filter_reason={filter_reason}
              filter_customer={filter_customer}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee_name}
              filter_code={filter_code}
              filter_email={filter_email}
              onStatusFilter={setFilter_assigneeStatus}
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
              statuses={assignedStatus}
              filter_otif={otif_percent}
              onOTFFilter={setOtifPercent}
              // Updated handlers that now accept array of IDs
              onApprove={handleApprove}
              onReject={handleReject}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
            />
          </NeonCard>
        </TabsContent>
        <TabsContent value={"request"} className="mt-0">
          <NeonCard
            title="Requested approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <PartnerOverviewTable
              readOnly={true}
              partners={partners}
              totalpartners={total}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              // Filter props
              searchQuery={searchQuery}
              statusFilter={filter_AssigneestatusFilter}
              modeFilter={modeFilter}
              filter_name={filter_name}
              filter_reason={filter_reason}
              filter_customer={filter_customer}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee_name}
              filter_code={filter_code}
              filter_email={filter_email}
              onStatusFilter={setFilter_assigneeStatus}
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
              statuses={assignedStatus}
              filter_otif={otif_percent}
              onOTFFilter={setOtifPercent}
              // Updated handlers that now accept array of IDs
              onApprove={handleApprove}
              onReject={handleReject}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
            />
          </NeonCard>
        </TabsContent>
         {/* <TabsContent value={"statusHistory"} className="mt-0">
    <Card className="p-6 shadow-sm border-slate-200">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Status Change History</h2>
                <p className="text-slate-600 text-sm mt-1">Complete audit trail of all status changes and requests</p>
              </div>

              {statusHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-500 text-lg">No status changes recorded yet</p>
                  <p className="text-slate-400 text-sm mt-1">Status changes will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusHistory.map((entry) => (
                    <button
                      key={entry.id}
                     onClick={() => setSelectedHistoryEntry(entry)}
                      className="w-full text-left p-5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">{entry.partnerName}</h3>
                            <Badge variant="outline" className="text-xs">Code: {entry.partnerCode}</Badge>
                         <Badge
  variant={statusConfig[entry.status]?.variant}
  className="text-xs"
>
  {statusConfig[entry.status]?.label}
</Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="bg-slate-100 text-slate-700">{entry.previousStatus}</Badge>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">{entry.newStatus}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-xs text-slate-500">Request Raised</p>
                               <p className="font-medium text-slate-900">
  {formatDate(entry.requestRaisedAt)}
</p>
                              </div>
                            </div>

                            {entry.requestAcceptedAt && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Request Accepted</p>
                                  <p className="font-medium text-slate-900">{formatDate(entry.requestAcceptedAt)}</p>
                                </div>
                              </div>
                            )}

                            {entry.requestClosedAt && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <div>
                                  <p className="text-xs text-slate-500">Request Closed</p>
                                  <p className="font-medium text-slate-900">{formatDate(entry.requestClosedAt)}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Assigned to: </span>
                              <span className="font-medium text-slate-900">{entry.assignedTo}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Changed by: </span>
                              <span className="font-medium text-slate-900">{entry.changedBy}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  {selectedHistoryEntry && (
                    
  <div
   className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setSelectedHistoryEntry(null); //  close on outside click
      }
    }}
  >
     <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">

      
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Request Details</h2>
         
        </div>
        <button
          onClick={() => setSelectedHistoryEntry(null)}
          className="text-slate-500 hover:text-slate-700 text-2xl"
        >
          ×
        </button>
      </div>

      
      <div className="p-6 space-y-6">

       
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Transporter Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Transporter Name</p>
              <p className="font-medium text-slate-900">
                {selectedHistoryEntry?.partnerName}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Transporter Code</p>
              <p className="font-medium text-slate-900">
                {selectedHistoryEntry?.partnerCode}
              </p>
            </div>
          </div>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Status Change
          </h3>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Badge className="bg-slate-200 text-slate-700">
              {selectedHistoryEntry?.previousStatus}
            </Badge>
            <ArrowRight className="w-5 h-5 text-slate-400" />
            <Badge className="bg-blue-200 text-blue-700">
              {selectedHistoryEntry?.newStatus}
            </Badge>
          </div>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Request Timeline
          </h3>

          <div className="space-y-4">

           
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="w-0.5 h-12 bg-slate-200 my-2"></div>
              </div>
              <div className="pb-8">
                <p className="font-semibold text-slate-900">Request Raised</p>
                <p className="text-sm text-slate-600 mt-1">
                  {formatDate(selectedHistoryEntry?.requestRaisedAt)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  By: {selectedHistoryEntry?.changedBy}
                </p>
              </div>
            </div>

            
            {selectedHistoryEntry?.requestAcceptedAt ? (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-0.5 h-12 bg-slate-200 my-2"></div>
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-slate-900">Request Accepted</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatDate(selectedHistoryEntry?.requestAcceptedAt)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Assigned to: {selectedHistoryEntry?.assignedTo}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Pending Acceptance</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Awaiting approval from {selectedHistoryEntry?.assignedTo}
                  </p>
                </div>
              </div>
            )}

          
            {selectedHistoryEntry?.requestClosedAt && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Request Closed</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatDate(selectedHistoryEntry?.requestClosedAt)}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Request Details
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Status</p>
              <Badge>
                {selectedHistoryEntry?.status === "pending"
                  ? "Pending Approval"
                  : selectedHistoryEntry?.status === "accepted"
                  ? "Accepted"
                  : "Closed"}
              </Badge>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Notes</p>
              <p className="text-sm text-slate-900">
                {selectedHistoryEntry?.notes || "-"}
              </p>
            </div>
          </div>
        </div>

      </div>

    
      <div className="p-6 border-t border-slate-200 flex justify-end">
        <button
          onClick={() => setSelectedHistoryEntry(null)}
          className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>

    </Card>
  </div>
)}
                </div>
              )}
            </Card>
         </TabsContent> */}
      </Tabs>

      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({
          values,
          isSubmitting,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          setFieldTouched,
          resetForm,
        }) => (
          <MasterModal
            saving={isSubmitting}
            open={modalOpen}
            maxWidth="max-w-4xl"
            onReset={() => {
              resetFormValue(resetForm);
            }}
            onClose={() => {
              handleModalClose();
              resetForm();
            }}
            title={editingPartner ? "Edit Transporter" : "Add New Transporter"}
            onSave={() =>
              document
                .getElementById("partner-form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                )
            }
            buttontitle={editingPartner ? "Update" : "Request"}
          >
            <Form
              id="partner-form"
              autoComplete="off"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <FormField
                  label="Transporter Name"
                  required
                  error={touched.name && errors.name}
                >
                  <NeonInput
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={() => setFieldTouched("name", true)}
                    placeholder="Enter transporter name"
                    error={!!(touched.name && errors.name)}
                  />
                  {/* {touched.name && errors.name && (
                    <span className="text-xs text-destructive">
                      {errors.name}
                    </span>
                  )} */}
                </FormField>
              </div>
              <div className="space-y-1">
                <FormField
                  label="OTIF"
                  required
                  error={touched.otif_percent && errors.otif_percent}
                >
                  <NeonInput
                    name="otif_percent"
                    value={values.otif_percent}
                    onChange={handleChange}
                    onBlur={() => setFieldTouched("otif_percent", true)}
                    placeholder="Enter OTIF"
                    error={!!(touched.otif_percent && errors.otif_percent)}
                  />
                </FormField>
              </div>

              <div className="space-y-1">
                <FormField
                  label="Transporter Code"
                  required
                  error={errors.code && touched.code}
                >
                  <NeonInput
                    name="code"
                    value={values.code}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder="Enter Code"
                    error={!!(touched.code && errors.code)}
                    onBlur={() => setFieldTouched("code", true)}
                  />
                  {touched.code && errors.code && (
                    <span className="text-xs text-destructive">
                      {errors.code}
                    </span>
                  )}
                </FormField>
              </div>
              <div className="space-y-1">
                <FormField
                  label="Customer Name"
                  required
                  error={touched.customer_id && errors.customer_id}
                >
                  <ComboBox
                    options={customerOptions}
                    selectedValue={values.customer_id}
                    onValueChange={(value) => {
                      setFieldValue("customer_id", value);
                      setFieldTouched("customer_id", true, false);
                    }}
                    placeholder="Select a customer..."
                  />
                </FormField>
              </div>

              {!editingPartner && (
                <FormField
                  label="Assignee"
                  required
                  error={touched.assign_to && errors.assign_to}
                >
                  <ComboBox
                    options={userOptionsValue}
                    selectedValue={values.assign_to}
                    placeholder="Select Assignee"
                    renderOption={(option: any) => (
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{option.label}</span>
                      </div>
                    )}
                    onValueChange={(userId) => {
                      setFieldValue("assign_to", userId);
                      setFieldTouched("assign_to", true, false);
                    }}
                  />
                </FormField>
              )}
              <div className={"grid grid-cols-1 gap-4"}>
                <div className="space-y-1">
                  <FormField
                    label="Mode"
                    required
                    error={errors.transport_mode && touched.transport_mode}
                  >
                    <NeonMultiSelect
                      options={modes}
                      value={values.transport_mode}
                      placeholder="Select one or more"
                      onChange={(selected) => {
                        setFieldValue("transport_mode", selected);
                        setFieldTouched("transport_mode", true, false);
                      }}
                      error={
                        !!(touched.transport_mode && errors.transport_mode)
                      }
                    />
                    {touched.transport_mode && errors.transport_mode && (
                      <span className="text-xs text-destructive">
                        {errors.transport_mode}
                      </span>
                    )}
                  </FormField>
                </div>
              </div>

              <div className="space-y-1">
                <FormField
                  label="Contact Email"
                  required
                  error={errors.contact_email && touched.contact_email}
                >
                  <NeonInput
                    type="email"
                    name="contact_email"
                    value={values.contact_email}
                    onChange={handleChange}
                    placeholder="transporter@gmail.com"
                    onBlur={() => setFieldTouched("contact_email", true)}
                    error={!!(touched.contact_email && errors.contact_email)}
                  />
                  {touched.contact_email && errors.contact_email && (
                    <span className="text-xs text-destructive">
                      {errors.contact_email}
                    </span>
                  )}
                </FormField>
              </div>
            </Form>
          </MasterModal>
        )}
      </Formik>
      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Transporter_master_template"
      />
    </>
    // </AppShell>
  );
};

export default PartnerMasterPage;
