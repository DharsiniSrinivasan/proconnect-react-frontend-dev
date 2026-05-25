import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  CustomerMasterTable,
  SortOrder,
} from "@/components/master-data/CustomerMasterTable";
import { MasterTableSkeleton } from "@/components/master-data/MasterTableSkeleton";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  MasterModal,
  FormField,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { toast } from "sonner";
import { CustomerRow, useCustomerStore } from "@/stores/masterStore";
import { masterData, uploadFileData } from "@/services/masterService";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";
import CustomerViewModal from "./CustomerView";
interface ImportError {
  row: number;
  error: string;
}

const CustomerMasterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    billingAddr: "",
    vendor_code: "",
    shippingAddr: "",
    shippingPincode: "",
    region: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const {
    data,
    setPageSize,
    pageSize,
    isLoading,
    total,
    fetchCustomer,
    status,
    region,
    fetchRegion,
    fetchStatus,
  } = useCustomerStore();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Import error modal states
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  // Filter states moved from CustomerMasterTable
  const [filter_name, setFilter_name] = useState("");
  const [filter_vendor, setFilter_vendor] = useState("");
  const [filter_gstin, setFilter_gstin] = useState("");
  const [filter_billing_address, setFilter_billing_address] = useState("");
  const [filter_shipping_address, setFilter_shipping_address] = useState("");
  const [filter_shipping_pincode, setFilter_shipping_pincode] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const navigate = useNavigate();
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const [isExporting, setIsExporting] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewCustomerDetails, setViewCustomerDetails] = useState<any>(null);
  useEffect(() => {
    fetchCustomer(
      currentPage,
      pageSize,
      searchQuery,
      statusFilter === "all" ? "" : statusFilter,
      regionFilter === "all" ? "" : regionFilter,
      filter_name,
      filter_gstin,
      filter_billing_address,
      filter_shipping_address,
      sortBy,
      sortOrder,
      dateFilter,
      filter_vendor,
      filter_shipping_pincode,
    );
  }, [
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    regionFilter,
    filter_name,
    filter_gstin,
    filter_billing_address,
    filter_shipping_address,
    sortBy,
    sortOrder,
    dateFilter,
    filter_vendor,
    filter_shipping_pincode,
  ]);

  useEffect(() => {
    fetchRegion();
    fetchStatus();
  }, []);

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      gstin: "",
      billingAddr: "",
      shippingAddr: "",
      shippingPincode: "",
      region: "",
      status: "",
      vendor_code: "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleEdit = (customer: CustomerRow) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      gstin: customer.gstin,
      billingAddr: customer.billing_address,
      shippingAddr: customer.shipping_address,
      shippingPincode: customer.pin_code || "",
      region: customer.region,
      status: customer.status,
      vendor_code: customer.vendor_code,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    let success = false;
    const { deleteCustomer } = useCustomerStore.getState();
    success = await deleteCustomer(id);
    if (success) {
      return true;
    } else {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const GSTIN_REGEX =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Customer name must be at least 3 characters";
    }
    if (!formData.gstin.trim()) {
      newErrors.gstin = "GSTIN is required";
    } else if (!GSTIN_REGEX.test(formData.gstin.trim().toUpperCase())) {
      newErrors.gstin = "Invalid GSTIN format";
    }
    if (!formData.billingAddr.trim()) {
      newErrors.billingAddr = "Billing address is required";
    } else if (formData.billingAddr.trim().length < 10) {
      newErrors.billingAddr = "Billing address must be at least 10 characters";
    } else if (formData.billingAddr.trim().length > 500) {
      newErrors.billingAddr = "Billing address must not exceed 500 characters";
    }
    if (!formData.shippingAddr.trim()) {
      newErrors.shippingAddr = "Shipping address is required";
    } else if (formData.shippingAddr.trim().length < 10) {
      newErrors.shippingAddr = "Shipping address must be at least 10 characters";
    } else if (formData.shippingAddr.trim().length > 500) {
      newErrors.shippingAddr = "Shipping address must not exceed 500 characters";
    }
    if (!formData.shippingPincode.trim()) {
      newErrors.shippingPincode = "Shipping pincode is required";
    } else if (!PINCODE_REGEX.test(formData.shippingPincode.trim())) {
      newErrors.shippingPincode = "Invalid pincode (must be 6 digits)";
    }
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.vendor_code)
      newErrors.vendor_code = "Customer code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const request = {
      name: formData.name,
      gstin: formData.gstin,
      billing_address: formData.billingAddr,
      shipping_address: formData.shippingAddr,
      status: formData.status,
      region: formData.region,
      pin_code: formData.shippingPincode,
      vendor_code: formData.vendor_code,
    };
    try {
      const { saveCustomer, updateCustomer } = useCustomerStore.getState();
      let success = false;

      if (editingCustomer) {
        success = await updateCustomer(request, editingCustomer.customer_id);
        if (success) toast.success("Customer updated successfully");
      } else {
        success = await saveCustomer(request);
        if (success) toast.success("Customer added successfully");
      }

      if (success) {
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "Customer",
        "Customer_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
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
  const exportCustomer = async () => {
    setIsExporting(true);
    try {
      await masterData.exportFile(true, "Customer", "customers.xlsx", {
        search: searchQuery || "",
        status: statusFilter != "all" ? statusFilter : "",
        region: regionFilter != "all" ? regionFilter : "",
        filter_vendor_code: filter_vendor || "",
        filter_name: filter_name || "",
        filter_gstin: filter_gstin || "",
        filter_shipping_pincode: filter_shipping_pincode || "",
        filter_last_updated: formatDate(dateFilter) || "",
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

  const importCustomer = async (selectedFile?: File | null) => {
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
        "Customer",
      );

      if (!response) {
        return;
      }

      const status = response?.status_code;

      if (status === 200 || status === 201) {
        fetchCustomer(
          currentPage,
          pageSize,
          searchQuery ?? "",
          statusFilter === "all" ? "" : (statusFilter ?? ""),
          regionFilter === "all" ? "" : (regionFilter ?? ""),
          filter_name ?? "",
          filter_gstin ?? "",
          filter_billing_address ?? "",
          filter_shipping_address ?? "",
          sortBy ?? "",
          sortOrder ?? "",
          dateFilter ?? "",
        );


        const errors = response?.data?.errors ?? [];
        const successCount = response?.data?.created ?? 0;

        if (Array.isArray(errors) && errors.length > 0) {
          toast.warning(`Import completed with ${successCount} successful and ${errors.length} errors`);

          setImportErrors(errors);
          setImportSuccessCount(successCount);
          setImportTotalRows(successCount);
          setImportErrorModalOpen(true);
        } else {
          toast.success(response?.message||"Customer data imported successfully!");
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRegionFilterChange = (value: string) => {
    setRegionFilter(value);
  };

  const handleSortChange = (
    newSortBy: string | null,
    newSortOrder: SortOrder,
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const onView = (details: any) => {
    setViewCustomerDetails(details);
    setViewModalOpen(true);
  };
  const normalizedStatusFilter = statusFilter === "all" ? "" : statusFilter;
  const normalizedRegionFilter = regionFilter === "all" ? "" : regionFilter;
  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "add":
        setModalOpen(true);
        break;
    }
  }, []);
  const handleModalClose = () => {
    setModalOpen(false);
    searchParams.delete("buttontype");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true },
    );
  };
  const resetForm = () => {
    setFormData({
      name: "",
      gstin: "",
      billingAddr: "",
      vendor_code: "",
      shippingAddr: "",
      shippingPincode: "",
      region: "",
      status: "",
    });
    setErrors({});
  };

  return (
    <AppShell pageTitle="Customer" >
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <MasterTopBarControls
          showAssignee={false}
          description="Manage customer profiles, addresses, and configurations"
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setCurrentPage(0);
            setSearchQuery(value);
          }}
          setUploading={setIsUploading}
          isUploading={isUploading}
          searchPlaceholder={"Search"}
          statusFilter={{
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value);
              setCurrentPage(0);
            },
            options: [
              { value: "all", label: "All Status" },
              ...status?.map((r) => ({ value: r, label: r })),
            ],
            placeholder: "Status",
          }}
          secondaryFilter={{
            value: regionFilter,
            onChange: (val: any) => {
              setRegionFilter(val);
              setCurrentPage(0);
            },
            options: [
              { value: "all", label: "All Region" },
              ...region?.map((r) => ({ value: r, label: r })),
            ],
            placeholder: "Region",
            multiSelect: false,
          }}
          downloadTemplate={
            hasPermission("add-customer")
              ? true
              : filter_vendor || filter_name || filter_gstin || filter_billing_address || filter_shipping_address
                || dateFilter || regionFilter != "all" || statusFilter != "all" ?
                false :
                data.length === 0 || data.every(item => item?.status === "Inactive")
                  ? true
                  : false
          }
          showImport={
            hasPermission("add-customer")
              ? true
              : filter_vendor || filter_name || filter_gstin || filter_billing_address || filter_shipping_address
                || dateFilter || regionFilter != "all" || statusFilter != "all" ?
                false :
                data.length === 0 || data.every(item => item?.status === "Inactive")
                  ? true
                  : false}
          onAddNew={handleAddNew}
          addLabel={
            hasPermission("add-customer")
              ? "Add Customer"
              : filter_vendor || filter_name || filter_gstin || filter_billing_address || filter_shipping_address
                || dateFilter || regionFilter != "all" || statusFilter != "all" ?
                "" :
                data.length === 0 || data.every(item => item?.status === "Inactive")
                  ? "Add Customer"
                  : ""
          }
          isDownloading={isDownloading}
          handleDownload={() => {
            downloadTemplate();
          }}
          handleExport={exportCustomer}
          handleImport={importCustomer}
          acceptedFileTypes=".csv,.xlsx,.xlsb"
          isExporting={isExporting}
        />
      </header>

      {!data ? (
        <MasterTableSkeleton title="Customer Master" columns={8} />
      ) : (
        <CustomerMasterTable
          isLoading={isLoading}
          onPageSizeChange={setPageSize}
          pageSize={pageSize}
          page={currentPage}
          onPageChange={setCurrentPage}
          totalRecords={total}
          customers={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={onView}
          statusFilter={normalizedStatusFilter}
          regionFilter={normalizedRegionFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onRegionFilterChange={handleRegionFilterChange}
          filter_name={filter_name}
          filter_vendor={filter_vendor}
          filter_gstin={filter_gstin}
          filter_billing_address={filter_billing_address}
          filter_shipping_address={filter_shipping_address}
          filter_shipping_pincode={filter_shipping_pincode}
          dateFilter={dateFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFilterNameChange={setFilter_name}
          onFilterVendorChange={setFilter_vendor}
          onFilterGstinChange={setFilter_gstin}
          onFilterBillingAddressChange={setFilter_billing_address}
          onFilterShippingAddressChange={setFilter_shipping_address}
          onFilterPincodeChange={setFilter_shipping_pincode}
          onDateFilterChange={setDateFilter}
          onSortChange={handleSortChange}
        />
      )}

      <MasterModal
        open={modalOpen}
        onClose={handleModalClose}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        onSave={handleSave}
        saving={saving}
        buttontitle={editingCustomer ? "Update" : "Save"}
        onReset={resetForm}
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Customer Name" required error={errors.name}>
            <NeonInput
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;

                // allow only letters and spaces
                const filteredValue = value.replace(/[^A-Za-z\s]/g, "");

                setFormData({ ...formData, name: filteredValue });
              }}
              placeholder="Enter customer name"
              error={!!errors.name}
            />
          </FormField>
          <FormField label="Customer Code" required error={errors.vendor_code}>
            <NeonInput
              value={formData.vendor_code}
              onChange={(e) =>
                setFormData({ ...formData, vendor_code: e.target.value })
              }
              placeholder="Enter customer code"
              error={!!errors.code}
            />
          </FormField>

          <FormField label="GSTIN" required error={errors.gstin}>
            <NeonInput
              value={formData.gstin}
              onChange={(e) =>
                setFormData({ ...formData, gstin: e.target.value })
              }
              placeholder="e.g., 27AABCR1234M1Z5"
              error={!!errors.gstin}
            />
          </FormField>
          <FormField
            label="Shipping Pincode"
            required
            error={errors.shippingPincode}
          >
            <NeonInput
              value={formData.shippingPincode}
              onChange={(e) =>
                setFormData({ ...formData, shippingPincode: e.target.value })
              }
              placeholder="Enter shipping pincode"
              error={!!errors.shippingPincode}
            />
          </FormField>
          <FormField
            label="Billing Address"
            required
            error={errors.billingAddr}
          >
            <Textarea
              value={formData.billingAddr}
              onChange={(e) =>
                setFormData({ ...formData, billingAddr: e.target.value })
              }
              placeholder="Enter billing address"
              className="resize-none"
            />
          </FormField>
          <FormField
            label="Shipping Address"
            required
            error={errors.shippingAddr}
          >
            <Textarea
              value={formData.shippingAddr}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddr: e.target.value })
              }
              placeholder="Enter shipping address"
              className="resize-none"
            />
          </FormField>

          <FormField label="Region" required error={errors.region}>
            <Select
              value={formData.region}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, region: value }));

                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.region;
                  return newErrors;
                });
              }}
            >
              <SelectTrigger
                className={`w-full rounded-md  ${errors.region ? "border-destructive" : ""
                  }`}
              >
                <SelectValue
                  placeholder="Select Region"
                  className="text-muted-foreground font-normal"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {region?.map((regionValue: string) => (
                    <SelectItem key={regionValue} value={regionValue}>
                      {regionValue}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Status" required error={errors.status}>
            <Select
              value={formData.status}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, status: value }));

                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.status;
                  return newErrors;
                });
              }}
            >
              <SelectTrigger
                className={`w-full rounded-md  ${errors.status ? "border-destructive" : ""
                  }`}
              >
                <SelectValue
                  placeholder="Select Status"
                  className="text-muted-foreground font-normal"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {status?.map((status: string) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </MasterModal>

      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Customer_master_template"
      />
      <CustomerViewModal
        open={viewModalOpen}
        customer={viewCustomerDetails}
        onClose={() => setViewModalOpen(false)}
        approval={false}
      />
    </AppShell>
  );
};

export default CustomerMasterPage;
