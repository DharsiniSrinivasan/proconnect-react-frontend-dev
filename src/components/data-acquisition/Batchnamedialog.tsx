import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { ComboBoxOption, ComboBox } from "../search-select/combo-box";
import { UserPlus } from "lucide-react";
import { useCustomerStore } from "@/stores/masterStore";
import { toast } from "sonner";
import { usePermission } from "@/utils/userPermission";
import { getStorage } from "@/utils/storage";
import { cn } from "@/lib/utils";
import { dataSet } from "@/services/dataSetServices";

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

interface BatchNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    batchName: string,
    customerId: string | number | "",
    budget: string,
  ) => void;
  customers: Customer[];
  regions?: string[];
  statuses?: string[];
  onCustomerCreated?: (customer: Customer) => void;
}

type DialogStep = "batch" | "add-customer";

interface CustomerFormData {
  name: string;
  vendor_code: string;
  gstin: string;
  shippingPincode: string;
  billingAddr: string;
  shippingAddr: string;
  region: string;
  status: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialCustomerFormData: CustomerFormData = {
  name: "",
  vendor_code: "",
  gstin: "",
  shippingPincode: "",
  billingAddr: "",
  shippingAddr: "",
  region: "",
  status: "",
};

export const BatchNameDialog = ({
  open,
  onOpenChange,
  onSubmit,
  customers,
}: BatchNameDialogProps) => {
  // Batch form state
  const [batchName, setBatchName] = useState("");
  const [budget, setBudget] = useState("");
  const [batchError, setBatchError] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | number | ""
  >("");
  // Customer form state
  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>(
    initialCustomerFormData,
  );
  const [customerErrors, setCustomerErrors] = useState<FormErrors>({});
  const { status, region, fetchRegion, fetchStatus } = useCustomerStore();
  // UI state
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [dialogStep, setDialogStep] = useState<DialogStep>("batch");
  const { customerDropDown } = useCustomerStore();
  const customerOptions: ComboBoxOption<Customer>[] = customers?.map((c) => ({
    id: String(c.id),
    value: c.name,
    data: c,
  }));
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const resetBatchForm = () => {
    setBatchName("");
    setSelectedCustomerId("");
    setBudget("");
  };

  const resetCustomerForm = () => {
    setCustomerFormData(initialCustomerFormData);
    setCustomerErrors({});
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetBatchForm();
      resetCustomerForm();
      setDialogStep("batch");
    }
    onOpenChange(open);
  };

  const validateCustomerForm = (): boolean => {
    const errors: FormErrors = {};

    const GSTIN_REGEX =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
    if (!customerFormData.name.trim()) errors.name = "Name is required";
    if (!customerFormData.gstin.trim()) {
      errors.gstin = "GSTIN is required";
    } else if (!GSTIN_REGEX.test(customerFormData.gstin.trim().toUpperCase())) {
      errors.gstin = "Invalid GSTIN format";
    }
    if (!customerFormData.billingAddr.trim())
      errors.billingAddr = "Billing address is required";
    if (!customerFormData.shippingAddr.trim())
      errors.shippingAddr = "Shipping address is required";
    if (!customerFormData.shippingPincode.trim()) {
      errors.shippingPincode = "Shipping pincode is required";
    } else if (!PINCODE_REGEX.test(customerFormData.shippingPincode.trim())) {
      errors.shippingPincode = "Invalid pincode (must be 6 digits)";
    }
    if (!customerFormData.region) errors.region = "Region is required";
    if (!customerFormData.status) errors.status = "Status is required";
    if (!customerFormData.vendor_code)
      errors.vendor_code = "Customer code is required";
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    fetchRegion();
    fetchStatus();
  }, []);

  const handleAddCustomer = async () => {
    if (!validateCustomerForm()) return;

    const request = {
      name: customerFormData.name,
      gstin: customerFormData.gstin,
      billing_address: customerFormData.billingAddr,
      shipping_address: customerFormData.shippingAddr,
      status: customerFormData.status,
      region: customerFormData.region,
      pin_code: customerFormData.shippingPincode,
      vendor_code: customerFormData.vendor_code,
    };
    try {
      setCustomerLoading(true);
      const { saveCustomer } = useCustomerStore.getState();
      let success = false;

      success = await saveCustomer(request);
      if (success) {
        toast.success("Customer added successfully");
        customerDropDown();
      }

      if (success) {
        resetCustomerForm();
        setDialogStep("batch");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleSubmitBatch = async () => {
    if (!batchName.trim() || !budget.trim() || !selectedCustomerId) return;
    try {
      setLoading(true);
      await onSubmit(batchName.trim(), selectedCustomerId, budget.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddCustomer = () => {
    setDialogStep("add-customer");
    resetCustomerForm();
  };

  const handleBackToBatch = () => {
    setDialogStep("batch");
    resetCustomerForm();
  };

  useEffect(() => {
    if (open) {
      resetBatchForm();
      resetCustomerForm();
      setDialogStep("batch");
    }
  }, [open]);

  const isBatchValid = batchName.trim().length > 0 && budget.length > 0 && selectedCustomerId;
  const validateBatchName = async (name: string) => {
    try {
      const result = await dataSet.getBatchNameExists(name);
      if (result?.error) {
        setBatchError(result?.error);
      } else {
        setBatchError("");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(

        dialogStep == "batch" ? "sm:max-w-[500px]" : "max-h-[90vh] max-w-4xl overflow-y-auto"
      )}>
        {dialogStep === "batch" ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Batch</DialogTitle>
              <DialogDescription>
                Give your batch a name to organize and track your uploads.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="batchName">Batch Name</Label>
                <Input
                  id="batchName"
                  placeholder="Enter batch name..."
                  value={batchName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBatchName(value);

                    if (value.trim()) {
                      validateBatchName(value);
                    } else {
                      setBatchError("");
                    }
                  }}
                  className="border-primary/30 focus:border-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isBatchValid) handleSubmitBatch();
                  }}
                />
                {batchError && (
                  <p className="text-sm text-destructive">{batchError}</p>
                )}

              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget/Qty</Label>
                <Input
                  id="budget"
                  placeholder="Enter budget/qty..."
                  value={budget}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[1-9]\d*(\.\d*)?$/.test(value)) {
                      setBudget(value);
                    }
                  }}
                  className="border-primary/30 focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isBatchValid) handleSubmitBatch();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Customer</Label>
                {customers.length === 0 ? (
                  <div className="flex items-center justify-between rounded-md border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      No customers found.
                    </p>
                    {hasPermission("add-customer") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenAddCustomer}
                        className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add Customer
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ComboBox
                      options={customerOptions}
                      selectedValue={selectedCustomerId}
                      onValueChange={setSelectedCustomerId}
                      placeholder="Select a customer..."
                    />
                    {hasPermission("add-customer") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenAddCustomer}
                        className="gap-1.5 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add New Customer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  handleOpenChange(false);
                }}
                className="border-muted-foreground/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitBatch}
                disabled={!isBatchValid || loading || !!batchError}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                {loading && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Fill in the customer details to create a new customer.
              </DialogDescription>
            </DialogHeader>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={customerFormData.name}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      name: e.target.value,
                    })
                  }
                  className={customerErrors.name ? "border-red-500" : ""}
                />
                {customerErrors.name && (
                  <p className="text-xs text-red-500">
                    {customerErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor_code">
                  Customer Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendor_code"
                  placeholder="Enter customer code"
                  value={customerFormData.vendor_code}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      vendor_code: e.target.value,
                    })
                  }
                  className={
                    customerErrors.vendor_code ? "border-red-500" : ""
                  }
                />
                {customerErrors.vendor_code && (
                  <p className="text-xs text-red-500">
                    {customerErrors.vendor_code}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">
                  GSTIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gstin"
                  placeholder="e.g., 27AABCR1234M1Z5"
                  value={customerFormData.gstin}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      gstin: e.target.value,
                    })
                  }
                  className={customerErrors.gstin ? "border-red-500" : ""}
                />
                {customerErrors.gstin && (
                  <p className="text-xs text-red-500">
                    {customerErrors.gstin}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingPincode">
                  Shipping Pincode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingPincode"
                  placeholder="Enter shipping pincode"
                  value={customerFormData.shippingPincode}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      shippingPincode: e.target.value,
                    })
                  }
                  className={
                    customerErrors.shippingPincode ? "border-red-500" : ""
                  }
                />
                {customerErrors.shippingPincode && (
                  <p className="text-xs text-red-500">
                    {customerErrors.shippingPincode}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="billingAddr">
                  Billing Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="billingAddr"
                  placeholder="Enter billing address"
                  value={customerFormData.billingAddr}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      billingAddr: e.target.value,
                    })
                  }
                  className={`resize-none ${customerErrors.billingAddr ? "border-red-500" : ""}`}
                />
                {customerErrors.billingAddr && (
                  <p className="text-xs text-red-500">
                    {customerErrors.billingAddr}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shippingAddr">
                  Shipping Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="shippingAddr"
                  placeholder="Enter shipping address"
                  value={customerFormData.shippingAddr}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      shippingAddr: e.target.value,
                    })
                  }
                  className={`resize-none ${customerErrors.shippingAddr ? "border-red-500" : ""}`}
                />
                {customerErrors.shippingAddr && (
                  <p className="text-xs text-red-500">
                    {customerErrors.shippingAddr}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={customerFormData.region}
                  onValueChange={(value) =>
                    setCustomerFormData({
                      ...customerFormData,
                      region: value,
                    })
                  }
                >
                  <SelectTrigger
                    className={
                      customerErrors.region ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {region?.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {customerErrors.region && (
                  <p className="text-xs text-red-500">
                    {customerErrors.region}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={customerFormData.status}
                  onValueChange={(value) =>
                    setCustomerFormData({
                      ...customerFormData,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger
                    className={
                      customerErrors.status ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {status?.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {customerErrors.status && (
                  <p className="text-xs text-red-500">
                    {customerErrors.status}
                  </p>
                )}
              </div>
            </div>


            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleBackToBatch}
                disabled={customerLoading}
                className="border-muted-foreground/30"
              >
                Back
              </Button>
              <Button
                onClick={handleAddCustomer}
                disabled={customerLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                {customerLoading && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {customerLoading ? "Creating..." : "Create Customer"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
