import { useState, useRef, useEffect } from "react";
import ContractorTable from "@/components/master-data/ContractorTable";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  FormField,
  MasterModal,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { ComboBox, ComboBoxOption } from "@/components/search-select/combo-box";
import { rateCardStore } from "@/stores/rateCardStore";
import { useAuditStore } from "@/stores/auditStore";
import ContractView from "./ContractView";
import { useContractStore } from "@/stores/contractStore";
import { masterData, uploadFileData } from "@/services/masterService";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Contact, List } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { NeonCard } from "@/components/ui/neon-card";
import ContractorOverviewTable from "@/components/master-data/ContractorOverviewTable";
import { getStorage } from "@/utils/storage";
import { useTilesStore } from "@/stores/masterStore";
import { contractService } from "@/services/contractService";
interface ContractorRow {
  id: any;
  partner_id?: number;
  contract_no: string;
  valid_from: string;
  valid_to: string;
  assigned_to: number;
}

export interface ContractorFormValues {
  contract_no: string;
  valid_from: string;
  valid_to: string;
  partner_id: string;
  assign_to: number;
}

interface ImportError {
  row: number;
  error: string;
}
export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;
const assignedStatus = ["Pending", "Approved", "Rejected"];
const ContractorMasterPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { saveContract, getContractById, updateContract } = useContractStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { assigneeData, getAssigneeList } = useAuditStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewContract, setViewContract] = useState<any>(null);
  const [filterPartnername, setFilterPartnername] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filter_contractNo, setFilter_contractNo] = useState("");
  const [filterFrom, setFilterFrom] = useState<Date | null>(null);
  const [filterTo, setFilterTo] = useState<Date | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [startDatePopover, setStartDatePopover] = useState(false);
  const [endDatePopover, setEndDatePopover] = useState(false);
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");
  const [editingContractor, setEditingContractor] =
    useState<ContractorRow | null>(null);
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  const { getMasterPartner, partnerts } = rateCardStore();
  const {
    contractData,
    pageSize,
    total,
    isLoading,
    setPageSize,
    fetchContracts,
  } = useContractStore();
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const formikRef = useRef<FormikProps<ContractorFormValues>>(null);

  const validationSchema = Yup.object({
    partner_id: Yup.string().required("Transporter is required"),
    assign_to: editingContractor
      ? Yup.string().nullable()
      : Yup.string().required("Assignee is required"),
    contract_no: Yup.string().required("Contractor No is required"),
    valid_from: Yup.date()
      .nullable()
      .required("Valid From is required")
      .typeError("Valid From must be a valid date"),
    valid_to: Yup.date()
      .nullable()
      .required("Valid To is required")
      .typeError("Valid To must be a valid date"),
  });

  const initialValues = {
    partner_id: editingContractor?.partner_id || "",
    contract_no: editingContractor?.contract_no || "",
    assign_to: editingContractor?.assigned_to || null,
    valid_from: editingContractor?.valid_from || null,
    valid_to: editingContractor?.valid_to || null,
  };

  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "view":
        setActiveTab("contractors");
        break;
      case "add":
        setModalOpen(true);
        setActiveTab("contractors");
        break;
      case "await":
        setActiveTab("await");
        break;
      case "request":
        setActiveTab("request");
        break;

      default:
        setActiveTab("contractors")
    }
  }, []);

  const handleAddNew = () => {
    setEditingContractor(null);
    setModalOpen(true);
  };
  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleEdit = async (row: ContractorRow) => {
    setModalOpen(true);
    const res = await getContractById(row.id);
    if (res) {
      setEditingContractor({
        id: res.id,
        partner_id: res.partner_id,
        contract_no: res.contract_no,
        valid_from: res.valid_from,
        valid_to: res.valid_to,
        assigned_to: res.assigned_to ? Number(res.assigned_to) : null,
      });
    }
  };
  const formatDate = (date: any) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    getMasterPartner();
    getAssigneeList();
    setPageSize(10);
  }, []);
  useEffect(() => {
    if (activeTab) {
      if (activeTab !== "contractors") {
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
          activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
          activeTab === "request" ? null : userId,
          activeTab === "request" ? userId : null,
          filter_reason,
          filter_assignee,
          filter_last_action,
          filter_request,
        );
      } else {
        fetchContracts(
          currentPage,
          pageSize,
          searchQuery,
          filterPartnername,
          filterCustomerName,
          filter_contractNo,
          formatDate(filterFrom),
          formatDate(filterTo),
          statusFilter === "all" ? "" : statusFilter,
          sortBy,
          sortOrder,
        );
      }
    }
  }, [
    fetchContracts,
    currentPage,
    pageSize,
    searchQuery,
    filterPartnername,
    filterCustomerName,
    filter_contractNo,
    filterFrom,
    statusFilter,
    filterTo,
    sortBy,
    sortOrder,
    activeTab,
    filter_assignee,
    filter_reason,
    filter_request,
    filter_last_action,
    filter_AssigneestatusFilter,
  ]);

  const handleSave = async (
    values: ContractorFormValues,
    { resetForm }: any,
  ) => {
    try {

      const payload: any = {
        partner_id: Number(values?.partner_id),
        contract_no: values?.contract_no,
        valid_from: values?.valid_from
          ? new Date(values.valid_from).toLocaleDateString("en-CA")
          : null,
        valid_to: values?.valid_to
          ? new Date(values.valid_to).toLocaleDateString("en-CA")
          : null,
        ...(!editingContractor && values?.assign_to ? { assigned_to: values.assign_to } : {}),
      };
      if (editingContractor) {
        await updateContract(editingContractor.id, payload).then((res) => {
          if (res) {
            resetForm();
            setModalOpen(false);
          }
        });
      } else {
        const payload = {
          partner_id: Number(values?.partner_id),
          contract_no: values?.contract_no,
          valid_from: values?.valid_from
            ? new Date(values.valid_from).toLocaleDateString("en-CA")
            : null,
          valid_to: values?.valid_to
            ? new Date(values.valid_to).toLocaleDateString("en-CA")
            : null,
          assigned_to: values?.assign_to,
        };

        const res = await saveContract(payload);

        if (res) {
          resetForm();
          setModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  const userOptionsValue: any = assigneeData?.map((user: any) => ({
    id: user.id,
    label: user.name,
    value: String(user.name),
    data: user,
  }));
  const partnerOptionsValue: ComboBoxOption[] = partnerts.map((item) => ({
    id: item.id, // required by ComboBox
    value: item.name, // required by ComboBox
    data: item, // optional, keeps full object if needed
  }));
  const handleView = (row: any) => {
    setViewContract(row);
    setViewModalOpen(true);
  };
  const handleApprove = async (ids: (string | number)[]) => {
    const contract_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      contract_ids,
      assigned_status: "Approved",
      rejection_reason: "",
    };

    let success = false;
    success = await updateStatus(request, "partner_contractor");

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
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_assignee,
        filter_last_action,
        filter_request,
      );
    }
  };

  const handleReject = async (ids: (string | number)[], reason: string) => {
    const contract_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      contract_ids,
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, "partner_contractor");

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
        activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_assignee,
        filter_last_action,
        filter_request,
      );
    }
  };

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "contractors",
        "Transporters_Contract_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilterPartnername("");
    setStatusFilter("all");
    setFilterCustomerName("");
    setFilter_contractNo("");
    setFilterFrom(null);
    setFilterTo(null);
    setFilter_reason("");
    setFilter_last_action(null);
    setRequest_name("");
    setAssignee_name("");
    setSortOrder(null);
    setSortBy(null);
    setSearchQuery("");
    setCurrentPage(0);
    setPageSize(10);
  };
  const handleDateSelect = (
    date: Date | undefined,
    dateType: "valid_from" | "valid_to",
    setFieldValue: any,
    save,
  ) => {
    if (date && !isNaN(date.getTime())) {
      setFieldValue(dateType, date); // set Date object

      if (dateType === "valid_from") setStartDatePopover(false);
      else setEndDatePopover(false);
    } else {
      setFieldValue(dateType, null); // clear invalid date
    }
  };
  const handleClearDate = (
    dateType: "valid_from" | "valid_to",
    setFieldValue: any,
  ) => {
    setFieldValue(dateType, "");
  };

  const resetForm = () => {
    formikRef.current?.resetForm();
  };

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
        "contract",
        Number(assignTo), // pass assignee id
      );
      if (!response) {
        return;
      }

      if (response) {
        fetchContracts(
          currentPage,
          pageSize,
          searchQuery,
          filterPartnername,
          filterCustomerName,
          filter_contractNo,
          formatDate(filterFrom),
          formatDate(filterTo),
          sortBy,
          sortOrder,
        );
        const errors = response?.data?.errors ?? [];
        const successCount = response?.created ?? 0;
        if (Array.isArray(errors) && errors.length > 0) {
          toast.warning(`Import completed with ${successCount} successful and ${errors.length} errors`);

          setImportErrors(errors);
          setImportSuccessCount(successCount);
          setImportTotalRows(successCount);
          setImportErrorModalOpen(true);
        } else {
          toast.success(response?.message||"Tranporter contracts imported successfully!");
        }
      }
    } catch (err) {
      console.error("Import error:", err);
     // toast.error("Import failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      await masterData.exportFile(true, "contract", "Partner Contracts.xlsx", {
        search: searchQuery || "",
        filter_partner_name: filterPartnername || "",
        filter_customer_name: filterCustomerName || "",
        filter_contract_no: filter_contractNo || "",
        filter_valid_from: formatDate(filterFrom),
        filter_valid_to: formatDate(filterTo),
        sort_by: sortBy || "",
        sort_order: sortOrder || "",
        filter_status: statusFilter === "all" ? "" : statusFilter,
      });

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  const normalizedStatusFilter = statusFilter === "all" ? "" : statusFilter;
 
   const handleDelete = async (id: string) => {
    const response: any = await contractService.deleteContract(id);

    if (response?.status_code === 200 || response?.status_code === 201) {

        toast.success(response?.message || "Deleted successfully");
      
       fetchContracts(
          currentPage,
          pageSize,
          searchQuery,
          filterPartnername,
          filterCustomerName,
          filter_contractNo,
          formatDate(filterFrom),
          formatDate(filterTo),
          statusFilter === "all" ? "" : statusFilter,
          sortBy,
          sortOrder,
        );
      return true;
    } else {
     fetchContracts(
          currentPage,
          pageSize,
          searchQuery,
          filterPartnername,
          filterCustomerName,
          filter_contractNo,
          formatDate(filterFrom),
          formatDate(filterTo),
          statusFilter === "all" ? "" : statusFilter,
          sortBy,
          sortOrder,
        );
      return false;
    }

  };
  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
      <TabsList className="bg-card border border-border mb-4 sm:mb-6 flex-wrap sm:flex-nowrap w-full sm:w-auto">
  <TabsTrigger
    value="contractors"
    className="gap-2 flex-1 sm:flex-none justify-center text-xs sm:text-sm
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <Contact className="h-4 w-4" />
    <span >All contractors</span>
 
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
    className="gap-2 flex-1 sm:flex-none justify-center text-xs sm:text-sm
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    <List className="h-4 w-4" />
   <span className="hidden sm:inline">Requested approvals</span>
    <span className="sm:hidden">Request</span>
  </TabsTrigger>
</TabsList>

        {activeTab !== "await" && activeTab !== "request" && (
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <MasterTopBarControls
              isUploading={isUploading}
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setCurrentPage(0)
                setSearchQuery(value);
              }}
              isExporting={isExporting}
              onAddNew={handleAddNew}
              addLabel="Add Contractor"
              isDownloading={isDownloading}
              downloadTemplate={true}
              handleImport={importData}
              handleExport={exportData}
              statusFilterShow={false}
              handleDownload={downloadTemplate}
            />
          </header>
        )}

        <TabsContent value="contractors" className="mt-0">
          <ContractorTable
            contractors={contractData}
            page={currentPage}
            pageSize={pageSize}
            totalRecords={total}
            statusFilter={normalizedStatusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onEdit={handleEdit}
            onView={handleView}
            showDelete={true}
            onDelete={handleDelete}
            filter_partner_name={filterPartnername}
            filter_customer={filterCustomerName}
            onCustomerFilter={setFilterCustomerName}
            onValidFromFilter={setFilterFrom}
            onValidToFilter={setFilterTo}
            filter_valid_from={filterFrom}
            filter_valid_to={filterTo}
            onPartnerFilter={setFilterPartnername}
            isLoading={isLoading}
            filter_contract_no={filter_contractNo}
            onContractFilter={setFilter_contractNo}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value={"await"} className="mt-0">
          <NeonCard
            title="Awaiting approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <ContractorOverviewTable
              contractors={contractData}
              page={currentPage}
              pageSize={pageSize}
              totalRecords={total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              showDelete={false}
              readOnly={false}
              filter_partner_name={filterPartnername}
              filter_customer={filterCustomerName}
              filter_contract_no={filter_contractNo}
              filter_valid_from={filterFrom}
              filter_valid_to={filterTo}
              filter_reason={filter_reason}
              statusFilter={filter_AssigneestatusFilter}
              onCustomerFilter={setFilterCustomerName}
              onValidFromFilter={setFilterFrom}
              onValidToFilter={setFilterTo}
              onPartnerFilter={setFilterPartnername}
              onContractFilter={setFilter_contractNo}
              onReasonFilter={setFilter_reason}
              onStatusFilter={setFilter_assigneeStatus}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              statuses={assignedStatus}
              onApprove={handleApprove}
              onReject={handleReject}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee}
              onAssigneeNameFilter={setAssignee_name}
              onRequestNameFilter={setRequest_name}
            />
          </NeonCard>
        </TabsContent>
        <TabsContent value={"request"} className="mt-0">
          <NeonCard
            title="Requested approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <ContractorOverviewTable
              contractors={contractData}
              page={currentPage}
              pageSize={pageSize}
              totalRecords={total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              showDelete={false}
              readOnly={true}
              filter_partner_name={filterPartnername}
              filter_customer={filterCustomerName}
              filter_contract_no={filter_contractNo}
              filter_valid_from={filterFrom}
              filter_valid_to={filterTo}
              filter_reason={filter_reason}
              statusFilter={filter_AssigneestatusFilter}
              onCustomerFilter={setFilterCustomerName}
              onValidFromFilter={setFilterFrom}
              onValidToFilter={setFilterTo}
              onPartnerFilter={setFilterPartnername}
              onContractFilter={setFilter_contractNo}
              onReasonFilter={setFilter_reason}
              onStatusFilter={setFilter_assigneeStatus}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              statuses={assignedStatus}
              onApprove={handleApprove}
              onReject={handleReject}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee}
              onAssigneeNameFilter={setAssignee_name}
              onRequestNameFilter={setRequest_name}
            />
          </NeonCard>
        </TabsContent>
      </Tabs>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldTouched,
          isSubmitting,
          setFieldValue,
        }) => (
          <MasterModal
            open={modalOpen}
            saving={isSubmitting}
            onReset={resetForm}
            title={editingContractor ? "Edit Contractor" : "Add Contractor"}
            buttontitle={editingContractor ? "Update" : "Request"}
            onClose={() => {
              resetForm()
              setModalOpen(false);
              searchParams.delete("buttontype");
              navigate(
                {
                  pathname: location.pathname,
                  search: searchParams.toString(),
                },
                { replace: true },
              );
            }}
            onSave={() =>
              document
                .getElementById("contract-form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                )
            }
            maxWidth="max-w-3xl"
          >
            <Form
              id="contract-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                label="Transporter"
                required
                error={touched.partner_id && errors.partner_id}
              >
                <ComboBox
                  options={partnerOptionsValue}
                  selectedValue={values.partner_id}
                  placeholder="Select Transporter"
                  renderOption={(option: any) => (
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{option.data?.name}</span>
                      <span className="text-xs text-gray-500">
                        {option.data?.customer_name}
                      </span>
                    </div>
                  )}
                  onValueChange={(partnerId) => {
                    setFieldValue("partner_id", partnerId);
                  }}
                  onBlur={() => setFieldTouched("partner_id", true)}
                />
              </FormField>
              <FormField
                label="Contractor No"
                required
                error={touched.contract_no && errors.contract_no}
              >
                <NeonInput
                  name="contract_no"
                  value={values.contract_no}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched("contract_no", true)}
                  placeholder="Enter contract number"
                />
              </FormField>

              {!editingContractor && (
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
                        <span className="font-medium">{option.data?.name}</span>
                      </div>
                    )}
                    onValueChange={(userId) => {
                      setFieldValue("assign_to", userId);
                    }}
                    onBlur={() => setFieldTouched("assign_to", true)}
                  />
                </FormField>
              )}

              <FormField label="Valid From" required error={touched.valid_from && errors.valid_from}>
                <Popover
                  open={startDatePopover}
                  onOpenChange={setStartDatePopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal",
                        !values.valid_from && "text-muted-foreground",
                        touched.valid_from &&
                        errors.valid_from &&
                        "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.valid_from
                        ? format(new Date(values.valid_from), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        values.valid_from
                          ? new Date(values.valid_from)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateSelect(
                          date,
                          "valid_from",
                          setFieldValue,
                          setFieldTouched,
                        )
                      }
                      initialFocus
                    />

                    {values.valid_from && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleClearDate("valid_from", setFieldValue)
                          }
                          className="w-full h-8 text-xs"
                        >
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </FormField>

              <FormField label="Valid To" required error={touched.valid_to && errors.valid_to}>
                <Popover open={endDatePopover} onOpenChange={setEndDatePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal",
                        !values.valid_to && "text-muted-foreground",
                        touched.valid_to &&
                        errors.valid_to &&
                        "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.valid_to
                        ? format(new Date(values.valid_to), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        values.valid_to ? new Date(values.valid_to) : undefined
                      }
                      onSelect={(date) =>
                        handleDateSelect(
                          date,
                          "valid_to",
                          setFieldValue,
                          setFieldTouched,
                        )
                      }
                      initialFocus
                    />

                    {values.valid_to && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleClearDate("valid_to", setFieldValue)
                          }
                          className="w-full h-8 text-xs"
                        >
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </FormField>
            </Form>
          </MasterModal>
        )}
      </Formik>

      <ContractView
        open={viewModalOpen}
        contract={viewContract}
        onClose={() => setViewModalOpen(false)}
        approval={true}
      />
      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Transporters_Contract_master_template"
      />
    </>
  );
};

export default ContractorMasterPage;
