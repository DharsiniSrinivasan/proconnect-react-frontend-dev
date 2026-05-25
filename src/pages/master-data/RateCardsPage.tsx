import { useState, useEffect, useRef } from "react";
import { RateCardsTable } from "@/components/master-data/RateCardsTable";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  MasterModal,
  FormField,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { toast } from "sonner";
import { rateCardStore } from "@/stores/rateCardStore";
import { usePartnerStore } from "@/stores/partnerStore";
import { Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import {
  Clock,
  CreditCard,
  List,
  Search,
} from "lucide-react";
import { masterData, uploadFileData } from "@/services/masterService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { ComboBox, ComboBoxOption } from "@/components/search-select/combo-box";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditStore } from "@/stores/auditStore";
import RateCardViewModal from "./RateCardView";
import { getStorage } from "@/utils/storage";
import { useTilesStore } from "@/stores/masterStore";
import { NeonCard } from "@/components/ui/neon-card";
import { RateCardOverviewTable } from "@/components/master-data/RateCardOverviewTable";

export interface RateFormValues {
  partner_id: number | null;
  contract_no: number | null;
  from_city: string;
  to_city: string;
  transport_mode: string[] | any;
  rate: number;
  e_rate: number;
  oda_rate: number;
  oda_service_charge: number;
  minimum_rate: number;
  effective_start_date: string;
  effective_end_date: string;
  tat_days: number;
  assign_to: number;
}
interface ImportError {
  row: number;
  error: string;
}
const assignedStatus = ["Pending", "Approved", "Rejected"];
const RateCardsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transportModeOptions, setTransportModeOptions] = useState<string[]>(
    [],
  );
  const [modeFilter, setModeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [editingRateCard, setEditingRateCard] = useState<any | null>(null);
  const formikRef = useRef<FormikProps<RateFormValues>>(null);
  const fromInputRef = useRef<HTMLInputElement | null>(null);
  const toInputRef = useRef<HTMLInputElement | null>(null);
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );
  const [pulse, setPulse] = useState(false);
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  // Table column filter states (moved from RateCardsTable)
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
  // Sort states (moved from RateCardsTable)
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [formData, setFormData] = useState({
    courierCode: "",
    courierName: "",
    from_city: "",
    to_city: "",
    mode: "",
    freightRate: 5.0,
    eRate: 0,
    odaCharge: 0,
    odaTax: 0,
    totalRate: 5.0,
    minimumCharge: 80,
    assign_to: null,
  });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const {
    rateCards,
    total,
    createRateCard,
    updateCards,
    deleteRateCard,
    setPageSize,
    fetchCards,
    pageSize,
    isLoading,
    getMasterPartner,
    partnerts,
    fetchCardById,
    getContract,
  } = rateCardStore();
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const { modes, getmodes, statuses, getStatus, fetchPartnerById } =
    usePartnerStore();
  const [contractoptions, setContractOptions] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRateDetails, setViewRateDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(null);
  const [searchParams] = useSearchParams();
  const initialValues: RateFormValues = {
    partner_id: editingRateCard?.partner_id ?? null,
    contract_no: editingRateCard?.contract_no ?? null,
    from_city: editingRateCard?.from_city ?? "",
    to_city: editingRateCard?.to_city ?? "",
    transport_mode: editingRateCard?.transport_mode ?? "",
    rate: editingRateCard?.rate ?? "",
    e_rate: editingRateCard?.e_rate ?? "",
    oda_rate: editingRateCard?.oda_rate ?? "",
    oda_service_charge: editingRateCard?.oda_service_charge ?? "",
    minimum_rate: editingRateCard?.minimum_rate ?? "",
    effective_start_date: editingRateCard?.effective_start_date ?? "",
    effective_end_date: editingRateCard?.effective_end_date ?? "",
    tat_days: editingRateCard?.tat_days ?? "",
    assign_to: editingRateCard?.assigned_to ?? "",
  };
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filter_request, setRequest_name] = useState("");
  const [filter_assignee, setAssignee_name] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  const { assigneeData, getAssigneeList } = useAuditStore();
  
  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "view":
        setActiveTab("rateCards");
        break;
      case "add":
        setModalOpen(true);
        setActiveTab("rateCards");
        break;
      case "await":
        setActiveTab("await");
        break;
      case "request":
        setActiveTab("request");
        break;

      default:
        setActiveTab("rateCards")
    }
  }, []);
  useEffect(() => {
    getmodes();
  }, [getmodes]);

  useEffect(() => {
    getStatus();
  }, [getStatus]);

  useEffect(() => {
    setPageSize(10);
  }, []);

  useEffect(() => {
    getMasterPartner();
  }, [getMasterPartner]);

  useEffect(() => {
    getAssigneeList();
  }, []);

  useEffect(() => {
    if (activeTab) {
      if (activeTab !== "rateCards") {
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
          activeTab === "request" ? filter_AssigneestatusFilter : "Pending",
          activeTab === "request" ? null : userId,
          activeTab === "request" ? userId : null,
          filter_reason,
          filter_assignee,
          filter_last_action,
          filter_request,
        );
      } else {
        fetchCards(
          currentPage,
          pageSize,
          statusFilter,
          searchQuery,
          modeFilter,
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
        );
      }
    }
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
    filter_assignee,
    filter_reason,
    filter_request,
    activeTab,
    filter_last_action,
    filter_AssigneestatusFilter,
  ]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalRate: prev.freightRate + prev.eRate,
    }));
  }, [formData.freightRate, formData.eRate]);

  const handleSort = (newSortBy: string | null, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  const userOptionsValue: any = assigneeData?.map((user: any) => ({
    id: user.id,
    label: user.name,
    value: String(user.name),
    data: user,
  }));
  const rateValidationSchema = Yup.object().shape({
    partner_id: Yup.string().required("Transporter is required"),
    contract_no: Yup.string().required("Contractor number is required"),
    from_city: Yup.string().required("From city is required"),
    to_city: Yup.string().required("To city is required"),
    transport_mode: Yup.string().required("Mode is required"),
    rate: Yup.number()
      .typeError("Freight rate must be a number")
      .min(0, "Freight rate cannot be negative")
      .required("Freight rate is required"),
    e_rate: Yup.number()
      .typeError("E. Rate must be a number")
      .min(0, "E. Rate cannot be negative")
      .nullable(),
    oda_service_charge: Yup.number()
      .typeError("ODA charge must be a number")
      .min(0, "ODA charge cannot be negative")
      .nullable(),
    oda_rate: Yup.number()
      .typeError("ODA tax must be a number")
      .min(0, "ODA tax cannot be negative")
      .nullable(),
    minimum_rate: Yup.number()
      .typeError("Minimum charge must be a number")
      .min(1, "Minimum charge must be greater than 0")
      .required("Minimum charge is required"),
    tat_days: Yup.number()
  .typeError("TAT must be a number")
  .moreThan(0, "TAT must be greater than 0") // blocks 0 and negatives
  .test(
    "max-decimals",
    "TAT can have at most 1 decimal place",
    (value) =>
      value == null || /^\d+(\.\d{1})?$/.test(value.toString())
  )
  .required("TAT is required"),
    assign_to: editingRateCard
      ? Yup.string().nullable()
      : Yup.string().required("Assignee is required"),
  });

  const handleAddNew = () => {
    setEditingRateCard(null);
    formikRef.current?.resetForm();
    setModalOpen(true);
  };

  const handleEdit = async (rateCard: any) => {
    const response = await fetchCardById(rateCard?.rate_id);
    setEditingRateCard(response);
    const res = await fetchPartnerById(Number(response.partner_id));
    const contractRes = await getContract(
      Number(rateCard?.partner_id),
    );
    const optionValue: ComboBoxOption[] =
      contractRes.map((item) => ({
        id: item.id,
        value: item.contract_no,
        data: item,
      }));
    setContractOptions(optionValue || []);
    const contract = optionValue?.find(
      (item) => item.id === Number(rateCard?.partner?.partner_contracts[0]?.id)
    );
    if (contract) {
      formikRef.current?.setFieldValue("contract_no", contract.id);
    }
    if (res?.transport_mode) {
      const modes = Array.isArray(res.transport_mode)
        ? res.transport_mode.map(String)
        : [String(res.transport_mode)];

      setTransportModeOptions(modes);
    } else {
      setTransportModeOptions([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    const response: any = await deleteRateCard(id);
    if (response) {
      toast.success(response?.message);
      return true;
    } else {
      return false;
    }
  };

  const handleSave = async (values: RateFormValues, { resetForm }: any) => {
    const contract = contractoptions?.find(
      (item) => item.id === Number(values.contract_no)
    );
    const payload = {
      partner_id: Number(values.partner_id),
      contract_no: contract?.data?.contract_no,
      from_city: values.from_city,
      to_city: values.to_city,
      transport_mode: values.transport_mode,
      rate: Number(values.rate),
      e_rate: Number(values.e_rate),
      oda_rate: Number(values.oda_rate),
      oda_service_charge: Number(values.oda_service_charge) || 0,
      minimum_rate: values.minimum_rate,
      tat_days: Number(values.tat_days),
      ...(!editingRateCard && values?.assign_to ? { assigned_to: values.assign_to } : {}),
    };

    try {
      let response;

      if (Number(editingRateCard?.rate_id)) {
        response = await updateCards(editingRateCard.rate_id, payload);
        if (response?.status === "success") {
          toast.success(response?.message || "Rate card updated successfully");
          resetForm();
          setTransportModeOptions(null);
          setModalOpen(false);
        }
      } else {
        response = await createRateCard(payload);
        if (response?.status === "success") {
          toast.success(response?.message || "Rate card added successfully");
          resetForm();
          setTransportModeOptions(null);
          setModalOpen(false);
        }
      }
    } catch (error: any) {
      
    }
  };


  const viewRateCard = (details: any) => {
    setViewRateDetails(details);
    setViewModalOpen(true);
  };
  useEffect(() => {
    if (pulse) {
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  const handlePlaceChanged = (
    field: "from_city" | "to_city",
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const autocomplete =
      field === "from_city"
        ? fromAutocompleteRef.current
        : toAutocompleteRef.current;

    const geocoder = geocoderRef.current;
    if (!autocomplete || !geocoder) return;

    const place = autocomplete.getPlace();
    if (!place?.geometry) return;

    const components = place.address_components || [];

    const country = components.find((c) =>
      c.types.includes("country"),
    )?.short_name;

    if (country !== "IN") {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      setFieldValue(field, "");
      return;
    }

    const city =
      components.find((c) => c.types.includes("locality"))?.long_name ||
      components.find((c) => c.types.includes("administrative_area_level_2"))
        ?.long_name ||
      components.find((c) => c.types.includes("administrative_area_level_1"))
        ?.long_name ||
      "";

    if (!city) return;

    setFormData((prev) => ({ ...prev, [field]: city }));
    setFieldValue(field, city);
  };

  const loadGoogleMapsScript = (callback: () => void) => {
    if ((window as any).google?.maps?.places) {
      callback();
      return;
    }

    const existingScript = document.querySelector("#google-maps-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", callback);
    }
  };

  useEffect(() => {
    if (!modalOpen) return;

    loadGoogleMapsScript(() => {
      if (!fromInputRef.current || !toInputRef.current) return;

      geocoderRef.current = new google.maps.Geocoder();

      fromAutocompleteRef.current = null;
      toAutocompleteRef.current = null;

      fromAutocompleteRef.current = new google.maps.places.Autocomplete(
        fromInputRef.current,
        {
          componentRestrictions: { country: "in" },
          types: ["(cities)"],
          fields: ["geometry", "address_components"],
        },
      );

      toAutocompleteRef.current = new google.maps.places.Autocomplete(
        toInputRef.current,
        {
          componentRestrictions: { country: "in" },
          types: ["(cities)"],
          fields: ["geometry", "address_components"],
        },
      );

      fromAutocompleteRef.current.addListener("place_changed", () =>
        handlePlaceChanged("from_city", formikRef.current!.setFieldValue),
      );

      toAutocompleteRef.current.addListener("place_changed", () =>
        handlePlaceChanged("to_city", formikRef.current!.setFieldValue),
      );
    });
  }, [modalOpen]);

  const fixPacContainerZIndex = () => {
    setTimeout(() => {
      const pac = document.querySelector(".pac-container") as HTMLElement;
      if (pac) {
        pac.style.zIndex = "9999";
        document.body.appendChild(pac);
      }
    }, 150);
  };

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "RateCard",
        "Rate_card_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      await masterData.exportFile(true, "RateCard", "rate_card.xlsx", {
        search: searchQuery || "",
        status: statusFilter === "all" ? "" : statusFilter,
        mode: modeFilter !== "all" ? modeFilter : "",
        filter_code: filterCode || "",
        filter_name: filterName || "",
        filter_customer_name: filterCustomer || "",
        filter_from: filterFrom || "",
        filter_to: filterTo || "",
        filter_tat_days: filter_tat_days || "",
        filter_frt_rate: filterFrtRate || "",
        filter_erate: filterErate || "",
        filter_oda_rate: filterOdaRate || "",
        filter_oda_service_charge: filterOdaService || "",
        filter_total_rate: filterTotalRate || "",
        filter_minimum: filterMinimum || "",
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
        "RateCard",
        Number(assignTo),
      );

      if (!response) {
        return;
      }

      const status = response?.status_code;

      if (status === 200 || status === 201) {
        fetchCards(
          currentPage,
          pageSize,
          statusFilter,
          searchQuery,
          modeFilter,
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
          toast.success(response?.message||"Rate Card imported successfully!");
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setStatusFilter("all");
    setTransportModeOptions([]);
    setModeFilter("all");
    setFilterCode("");
    setFilterName("");
    setFilterCustomer("");
    setFilterFrom("");
    setFilterTo("");
    setFilterFrtRate("");
    setFilterErate("");
    setFilterOdaRate("");
    setFilterOdaService("");
    setFilterTotalRate("");
    setFilterMinimum("");
    setFilterTatDays("");
    setSortBy(null);
    setSortOrder(null);
    setCurrentPage(0);
    setPageSize(10);
  };

  const partnerOptionsValue: ComboBoxOption[] = partnerts.map((item) => ({
    id: item.id, // required by ComboBox
    value: item.name, // required by ComboBox
    data: item, // optional, keeps full object if needed
  }));

  const handleModalClose = () => {
    setModalOpen(false);
    setContractOptions([]);
    searchParams.delete("buttontype");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true },
    );
  };

  const handleApprove = async (ids: (string | number)[]) => {
    const rate_card_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      rate_card_ids,
      assigned_status: "Approved",
      rejection_reason: "",
    };

    let success = false;
    success = await updateStatus(request, "rate-cards");

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
    const rate_card_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      rate_card_ids,
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, "rate-cards");

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
  const resetFormFields = () => {
    if (!formikRef.current) return;
    formikRef.current.resetForm({
      values: {
        partner_id: null,
        contract_no: null,
        from_city: "",
        to_city: "",
        transport_mode: [],
        rate: 0,
        e_rate: 0,
        oda_rate: 0,
        oda_service_charge: 0,
        minimum_rate: 0,
        effective_start_date: "",
        effective_end_date: "",
        tat_days: 0,
        assign_to: 0,
      },
    });

    setTransportModeOptions([]);
  };
  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-card border border-border mb-4 sm:mb-6 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <TabsTrigger
            value="rateCards"
            className="gap-2 flex-1 sm:flex-none justify-center text-xs sm:text-sm
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="h-4 w-4" />
            <span>All ratecards</span>
          </TabsTrigger>

          <TabsTrigger
            value="await"
            className="gap-2 flex-1 sm:flex-none justify-center text-xs sm:text-sm
      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
              setUploading={setIsUploading}
              isUploading={isUploading}
              searchQuery={searchQuery}
              isExporting={isExporting}
              searchPlaceholder="Search"
              onSearchChange={(val) => {
                setCurrentPage(0)
                setSearchQuery(val)
              }}
              statusFilter={{
                value: statusFilter,
                onChange: (val) => {
                  setCurrentPage(0)
                  setStatusFilter(val)
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
                options: [
                  { value: "all", label: "All Modes" },
                  ...modes.map((r) => ({ value: r, label: r })),
                ],
                placeholder: "Mode",
                multiSelect: false,
              }}
              onAddNew={handleAddNew}
              addLabel="Add Rate Card"
              isDownloading={isDownloading}
              handleDownload={downloadTemplate}
              handleExport={exportData}
              handleImport={importData}
              acceptedFileTypes=".csv,.xlsx,.xlsb"
            />
          </header>
        )}
        <TabsContent value="rateCards" className="mt-0">
          <RateCardsTable
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
            totalRecords={total}
            rateCards={rateCards}
            onEdit={handleEdit}
            onPageChange={setCurrentPage}
            page={currentPage}
            onDelete={handleDelete}
            isLoading={isLoading}
            onView={viewRateCard}
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
            filterMode={modeFilter}
            onFilterModeChange={setModeFilter}
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
            // Sort props
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            // Options for select filters
            statusOptions={statuses.map((s) => ({ label: s, value: s }))}
            modeOptions={modes.map((m) => ({ label: m, value: m }))}
          />

          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={initialValues}
            validationSchema={rateValidationSchema}
            onSubmit={handleSave}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }) => {
              const totalRate =
                (parseFloat(values.rate?.toString() || "0") || 0) +
                (parseFloat(values.e_rate?.toString() || "0") || 0);

              return (
                <>
                  <MasterModal
                    open={modalOpen}
                    saving={isSubmitting}
                    onClose={() => {
                      handleModalClose();
                      setEditingRateCard(null);
                      setPulse(false);
                      setTransportModeOptions([]);
                    }}
                    onReset={resetFormFields}
                    title={
                      editingRateCard ? "Edit Rate Card" : "Add New Rate Card"
                    }
                    onSave={() => formikRef.current?.submitForm()}
                    buttontitle={editingRateCard ? "Update" : "Request"}
                    maxWidth="max-w-4xl"
                  >
                    <Form
                      id="rateCard-form"
                      autoComplete="off"
                      onSubmit={handleSubmit}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Courier */}
                        <FormField
                          label="Transporter"
                          required
                          error={touched.partner_id && errors.partner_id}
                        >
                          <ComboBox
                            options={partnerOptionsValue}
                            selectedValue={values.partner_id}
                            placeholder="Select Transporter"
                            onValueChange={async (partnerId) => {
                              setFieldValue("partner_id", partnerId);

                              if (partnerId) {
                                const contractRes = await getContract(
                                  Number(partnerId),
                                );
                                const optionValue: ComboBoxOption[] =
                                  contractRes.map((item) => ({
                                    id: item.id,
                                    value: item.contract_no,
                                    data: item,
                                  }));
                               
                                setContractOptions(optionValue || []);
                                const res = await fetchPartnerById(
                                  Number(partnerId),
                                );

                                if (res?.transport_mode) {
                                  const modes = Array.isArray(
                                    res.transport_mode,
                                  )
                                    ? res.transport_mode.map(String)
                                    : [String(res.transport_mode)];

                                  setTransportModeOptions(modes);
                                  setFieldValue("transport_mode", "");
                                } else {
                                  setTransportModeOptions([]);
                                  setFieldValue("transport_mode", "");
                                }
                              } else {
                                setTransportModeOptions([]);
                                setFieldValue("transport_mode", "");
                              }
                            }}
                            onBlur={() => setFieldTouched("partner_id", true)}
                          />
                        </FormField>
                        <FormField
                          label="Contractor Number"
                          required
                          error={touched.contract_no && errors.contract_no}
                        >
                          <ComboBox
                            options={contractoptions}
                            selectedValue={values.contract_no}
                            placeholder="Select Contractor Number"
                            onValueChange={async (item) => {
                             
                              setFieldValue("contract_no", item);
                            }}
                            onBlur={() => setFieldTouched("contract_no", true)}
                          />
                        </FormField>
                        {/* </div> */}
                        {/* From & To */}
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <FormField
                          label="From (Origin)"
                          required
                          error={touched.from_city && errors.from_city}
                        >
                          <div className="relative flex-1 mt-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <NeonInput
                              onFocus={fixPacContainerZIndex}
                              ref={fromInputRef}
                              placeholder="Search From City"
                              className="pl-9 h-10 w-full"
                              value={values.from_city}
                              onChange={(e) => {
                                setFieldValue("from_city", e.target.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  from_city: e.target.value,
                                }));
                              }}
                              onBlur={() => setFieldTouched("from_city", true)}
                              error={!!(touched.from_city && errors.from_city)}
                            />
                          </div>
                        </FormField>

                        <FormField
                          label="To (Destination)"
                          required
                          error={touched.to_city && errors.to_city}
                        >
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <NeonInput
                              onFocus={fixPacContainerZIndex}
                              ref={toInputRef}
                              placeholder="Search To City"
                              className="pl-9 h-10 w-full"
                              value={values.to_city}
                              onChange={(e) => {
                                setFieldValue("to_city", e.target.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  to_city: e.target.value,
                                }));
                              }}
                              onBlur={() => setFieldTouched("to_city", true)}
                              error={!!(touched.to_city && errors.to_city)}
                            />
                          </div>
                        </FormField>
                        {/* </div> */}

                        {/* Mode */}
                        {/* <div className="flex items-end gap-4">
                          <div className="flex-1"> */}
                        <FormField
                          label="Mode"
                          required
                          error={
                            touched.transport_mode && errors.transport_mode
                              ? Array.isArray(errors.transport_mode)
                                ? errors.transport_mode.join(", ")
                                : errors.transport_mode
                              : undefined
                          }
                        >
                          <Select
                            value={values.transport_mode}
                            onValueChange={(val) =>
                              setFieldValue("transport_mode", val)
                            }
                          >
                            <SelectTrigger
                              className={`w-full rounded-md  ${touched.transport_mode && errors.transport_mode
                                ? "border-destructive"
                                : ""
                                }`}
                            >
                              <SelectValue
                                placeholder="Select Mode"
                                className="text-muted-foreground font-normal"
                              />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {transportModeOptions?.map((mode: string) => (
                                  <SelectItem
                                    key={mode}
                                    value={mode.toString()}
                                  >
                                    {mode}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormField>
                        {/* </div>

                        </div> */}

                        {/* Rates */}
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <FormField
                          label="Freight Rate (₹/kg)"
                          required
                          error={touched.rate && errors.rate}
                        >
                          <NeonInput
                            type="text"
                            value={values.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFieldValue("rate", value);
                              }
                            }}
                            onBlur={() => {
                              setFieldTouched("rate", true);
                              if (
                                typeof values.rate === "string" &&
                                values.rate !== ""
                              ) {
                                setFieldValue("rate", parseFloat(values.rate));
                              }
                            }}
                            className="bg-muted/30"
                            error={!!(touched.rate && errors.rate)}
                          />
                        </FormField>

                        <FormField label="E. Rate (₹/kg)">
                          <NeonInput
                            type="text"
                            value={values.e_rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFieldValue("e_rate", value);
                              }
                            }}
                            onBlur={() => {
                              setFieldTouched("e_rate", true);
                              if (
                                typeof values.e_rate === "string" &&
                                values.e_rate !== ""
                              ) {
                                setFieldValue(
                                  "e_rate",
                                  parseFloat(values.e_rate),
                                );
                              }
                            }}
                            className="bg-muted/30"
                            error={!!(touched.e_rate && errors.e_rate)}
                          />
                        </FormField>
                        {/* </div> */}

                        {/* ODA */}
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <FormField label="ODA Service Charge (₹)">
                          <NeonInput
                            type="text"
                            value={values.oda_service_charge}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFieldValue("oda_service_charge", value);
                              }
                            }}
                            onBlur={() => {
                              setFieldTouched("oda_service_charge", true);
                              if (
                                typeof values.oda_service_charge === "string" &&
                                values.oda_service_charge !== ""
                              ) {
                                setFieldValue(
                                  "oda_service_charge",
                                  parseFloat(values.oda_service_charge),
                                );
                              }
                            }}
                            className="bg-muted/30"
                            error={
                              !!(
                                touched.oda_service_charge &&
                                errors.oda_service_charge
                              )
                            }
                          />
                        </FormField>

                        <FormField label="ODA Tax (₹)">
                          <NeonInput
                            type="text"
                            value={values.oda_rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFieldValue("oda_rate", value);
                              }
                            }}
                            onBlur={() => {
                              setFieldTouched("oda_rate", true);
                              if (
                                typeof values.oda_rate === "string" &&
                                values.oda_rate !== ""
                              ) {
                                setFieldValue(
                                  "oda_rate",
                                  parseFloat(values.oda_rate),
                                );
                              }
                            }}
                            className="bg-muted/30"
                            error={!!(touched.oda_rate && errors.oda_rate)}
                          />
                        </FormField>
                        {/* </div> */}

                        {/* Total & Minimum */}
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        <FormField label="Total Rate (₹/kg)">
                          <NeonInput
                            type="number"
                            value={
                              values.e_rate || values.rate
                                ? +totalRate.toFixed(2)
                                : ""
                            }
                            disabled
                            className="bg-muted/30"
                          />
                        </FormField>

                        <FormField
                          label="Minimum Charge (₹)"
                          required
                          error={touched.minimum_rate && errors.minimum_rate}
                        >
                          <NeonInput
                            type="text"
                            value={values.minimum_rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFieldValue("minimum_rate", value);
                              }
                            }}
                            onBlur={() => {
                              setFieldTouched("minimum_rate", true);
                              if (
                                typeof values.minimum_rate === "string" &&
                                values.minimum_rate !== ""
                              ) {
                                setFieldValue(
                                  "minimum_rate",
                                  parseFloat(values.minimum_rate),
                                );
                              }
                            }}
                            className="bg-muted/30"
                            error={
                              !!(touched.minimum_rate && errors.minimum_rate)
                            }
                          />
                        </FormField>
                        {/* </div> */}

                        {/* <div className="grid grid-cols-1 gap-4"> */}
                        <FormField
                          label="TAT (days)"
                          required
                          error={touched.tat_days && errors.tat_days}
                        >
                          <NeonInput
                            type="text"
                            min="1"
                            value={values.tat_days}
                            onChange={(e) => {
                              setFieldValue("tat_days", e.target.value);
                            }}
                            onBlur={() => setFieldTouched("tat_days", true)}
                            className="bg-muted/30"
                            error={!!(touched.tat_days && errors.tat_days)}
                          />
                        </FormField>
                        {!editingRateCard && (
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
                                  <span className="font-medium">
                                    {option.data?.name}
                                  </span>
                                </div>
                              )}
                              onValueChange={(userId: number) => {
                                setFieldValue("assign_to", userId);
                              }}
                              onBlur={() => setFieldTouched("assign_to", true)}
                            />
                          </FormField>
                        )}
                        {/* </div> */}
                      </div>
                    </Form>
                  </MasterModal>
                </>
              );
            }}
          </Formik>
        </TabsContent>

        <TabsContent value={"await"} className="mt-0">
          <NeonCard
            title="Awaiting approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <RateCardOverviewTable
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee}
              onAssigneeNameFilter={setAssignee_name}
              onRequestNameFilter={setRequest_name}
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
              filterStatus={filter_AssigneestatusFilter}
              onFilterStatusChange={setFilter_assigneeStatus}
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
              readOnly={false}
              // Options for select filters
              statusOptions={assignedStatus.map((s) => ({
                label: s,
                value: s,
              }))}
              modeOptions={modes.map((m) => ({ label: m, value: m }))}
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
            <RateCardOverviewTable
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee}
              onAssigneeNameFilter={setAssignee_name}
              onRequestNameFilter={setRequest_name}
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
              filterStatus={filter_AssigneestatusFilter}
              onFilterStatusChange={setFilter_assigneeStatus}
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
              readOnly={true}
              // Options for select filters
              statusOptions={assignedStatus.map((s) => ({
                label: s,
                value: s,
              }))}
              modeOptions={modes.map((m) => ({ label: m, value: m }))}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
            />
          </NeonCard>
        </TabsContent>
      </Tabs>
      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Ratecard_master_template"
      />
      <RateCardViewModal
        open={viewModalOpen}
        rateCard={viewRateDetails}
        onClose={() => setViewModalOpen(false)}
        approval={false}
      />
    </div>
  );
};

export default RateCardsPage;
