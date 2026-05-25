import { useState, useEffect, useRef } from "react";
import {
  FacilityMasterTable,
  SortOrder,
} from "@/components/master-data/FacilityMasterTable";
import { MasterTableSkeleton } from "@/components/master-data/MasterTableSkeleton";
import { MasterTopBarControls } from "@/components/master-data/MasterTopBarControls";
import {
  MasterModal,
  FormField,
  NeonInput,
} from "@/components/master-data/MasterModal";
import { toast } from "sonner";
import { FacilityItem } from "@/mocks/masterData.mock";
import { Building, Clock, List, Search } from "lucide-react";
import { masterData, uploadFileData } from "@/services/masterService";
import {
  useCustomerStore,
  useFacilityStore,
  useTilesStore,
} from "@/stores/masterStore";
import { Label } from "@/components/ui/label";
import { ImportErrorModal } from "@/components/master-data/Importerrormodal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ComboBox, ComboBoxOption } from "@/components/search-select/combo-box";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuditStore } from "@/stores/auditStore";
import FacilityViewModal from "./FacilityDetailView";
import { FacilityOverviewTable } from "@/components/master-data/FacilityOverviewTable";
import { getStorage } from "@/utils/storage";
import { NeonCard } from "@/components/ui/neon-card";
interface ImportError {
  row: number;
  error: string;
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

const FacilityMasterPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: {
      locationName: "",
      pincode: "",
      latitude: 0,
      longitude: 0,
    },
    region: "",
    tier: "",
    storage_capacity_config: {
      width: "",
      height: "",
      depth: "",
    },
    fixedCost: "",
    radius: "",
    status: "",
    customerId: 0,
    code: "",
    description: "",
    warehouseType: "",
    category_storage_type: "",
    boxes_pallet_count: 1,
    leaseAgreementNumber: "",
    assign_to: null as number | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const {
    data,
    pageSize,
    setPageSize,
    fetchFacility,
    isLoading,
    total,
    status,
    tiers,
    fetchTiers,
    fetchStatus,
    categoryDropDown,
    categoryList,
  } = useFacilityStore();
  const { fetchRegion } = useCustomerStore();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewFacilityDetails, setViewFacilityDetails] = useState<any>(null);
  // Import error modal states
  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState(0);
  const [importTotalRows, setImportTotalRows] = useState(0);
  // Filter states moved from FacilityMasterTable
  const [filter_name, setFilter_name] = useState("");
  const [filter_customer, setCustomer_name] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [capacity, setCapacity] = useState("");
  const [fixed_cost, setFixed_cost] = useState("");
  const [filter_facility_code, setFilter_facility_code] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [filter_AssigneestatusFilter, setFilter_assigneeStatus] = useState("");
  const [filter_assignee_name, setFilter_assigneeName] = useState("");
  const [filter_reason, setFilter_reason] = useState("");
  const [filter_last_action, setFilter_last_action] = useState(null);
  const [filter_request, setRequest_name] = useState("");
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const { updateStatus } = useTilesStore();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = Number(payload?.sub);
  const { dropdownList, customerDropDown } = useCustomerStore();
  const { assigneeData, getAssigneeList } = useAuditStore();
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    const buttonType = searchParams.get("buttontype");
    switch (buttonType) {
      case "view":
        setActiveTab("facility");
        break;
      case "add":
        setModalOpen(true);
        setActiveTab("facility");
        break;
      case "await":
        setActiveTab("await");
        break;
      case "request":
        setActiveTab("request");
        break;

      default:
        setActiveTab("facility")
    }
  }, []);
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setStatusFilter("all");
    setTierFilter("all");
    setRegionFilter("all");
    setFilter_name("");
    setCustomer_name("");
    setCapacity("");
    setFixed_cost("");
    setFilter_facility_code("");
    setSortBy(null);
    setSortOrder(null);
    setFilter_assigneeStatus("");
    setFilter_assigneeName("");
    setFilter_reason("");
    setFilter_last_action(null);
    setRequest_name("");
    setCurrentPage(0);
    setPageSize(10);
  };

  useEffect(() => {
    setPageSize(10);
    fetchStatus();
    fetchTiers();
    fetchRegion();
    getAssigneeList();
  }, []);

  useEffect(() => {
    const Capacity = Number(capacity);
    const Fixed_cost = Number(fixed_cost);
    if (activeTab) {
      if (activeTab !== "facility") {
        fetchFacility(
          currentPage,
          pageSize,
          searchQuery,
          statusFilter === "all" ? "" : statusFilter,
          tierFilter === "all" ? "" : tierFilter,
          filter_name,
          regionFilter === "all" ? "" : regionFilter,
          Capacity,
          Fixed_cost,
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
          filter_facility_code,
        );
      } else {
        fetchFacility(
          currentPage,
          pageSize,
          searchQuery,
          statusFilter === "all" ? "" : statusFilter,
          tierFilter === "all" ? "" : tierFilter,
          filter_name,
          regionFilter === "all" ? "" : regionFilter,
          Capacity,
          Fixed_cost,
          sortBy,
          sortOrder,
          filter_customer,
          "",
          null,
          null,
          "",
          "",
          "",
          "",
          filter_facility_code,
        );
      }
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    tierFilter,
    filter_name,
    regionFilter,
    capacity,
    fixed_cost,
    sortBy,
    sortOrder,
    filter_customer,
    activeTab,
    filter_reason,
    filter_assignee_name,
    filter_last_action,
    filter_request,
    filter_facility_code,
    filter_AssigneestatusFilter,
  ]);

  const handleAddNew = () => {
    setEditingFacility(null);
    setFormData({
      name: "",
      address: {
        locationName: "",
        pincode: "",
        latitude: 0,
        longitude: 0,
      },
      region: "",
      tier: "",
      storage_capacity_config: {
        width: "",
        height: "",
        depth: "",
      },
      fixedCost: "",
      radius: "",
      status: "",
      customerId: 0,
      code: "",
      description: "",
      warehouseType: "",
      category_storage_type: "",
      boxes_pallet_count: 1,
      leaseAgreementNumber: "",
      assign_to: null,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleEdit = async (facility: FacilityItem | any) => {
    setEditingFacility(facility);
    setFormData({
      name: facility?.name || "",
      address: {
        locationName: facility?.address?.locationName || "",
        pincode: facility?.address?.pincode || "",
        latitude: facility?.address?.latitude || 0,
        longitude: facility?.address?.longitude || 0,
      },
      region: facility?.zone || "",
      tier: facility?.tier_type || "",
      storage_capacity_config: {
        width: facility?.storage_capacity_config?.width || "",
        height: facility?.storage_capacity_config?.height || "",
        depth: facility?.storage_capacity_config?.depth || "",
      },
      fixedCost: facility?.fixed_costs || "",
      radius: facility?.service_radius || "",
      status: facility?.status || "",
      customerId: facility?.customer_id || 0,
      code: facility?.facility_code || "",
      description: facility?.description || "",
      warehouseType: facility?.category || "",
      category_storage_type: facility?.category_storage_type || "",
      boxes_pallet_count: facility?.boxes_pallet_count || 1,
      leaseAgreementNumber: facility?.lease_agreement_number || "",
      assign_to: null,
    });

    setErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    let success = false;
    const { deleteFacility } = useFacilityStore.getState();
    success = await deleteFacility(id);
    if (success) {
      return true;
    } else {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Customer Name validation
    if (!formData.customerId || formData.customerId === 0) {
      newErrors.customerId = "Customer name is required";
    }

    // Facility Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Facility name is required";
    } 
    else if (formData.name.trim().length < 4) {
      newErrors.name = "Facility name must be at least 4 characters";
    }
    //else if (formData.name.trim().length > 100) {
    //   newErrors.name = "Facility name cannot exceed 100 characters";
    // }

    if (!editingFacility && !formData.assign_to) {
      newErrors.assign_to = "Assignee is required";
    }

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }
     else if (formData.code.trim().length < 4) {
      newErrors.code = "Code must be at least 4 characters";
    }

    // Location validation
    if (!formData.address?.locationName?.trim()) {
      newErrors.address = "Location is required";
    } else if (
      formData.address.latitude === 0 ||
      formData.address.longitude === 0
    ) {
      newErrors.address = "Please select a valid location from the dropdown";
    }

    // Warehouse Type validation
    if (!formData.warehouseType) {
      newErrors.warehouseType = "Warehouse type is required";
    }

    // Category Storage Type validation
    if (!formData.category_storage_type) {
      newErrors.category_storage_type = "Storage category is required";
    }

    // Boxes/Pallet Count validation
    if (["Boxes", "Pallet"].includes(formData.category_storage_type)) {
      if (!formData.boxes_pallet_count || formData.boxes_pallet_count <= 0) {
        newErrors.boxes_pallet_count = `Number of ${formData.category_storage_type.toLowerCase()} is required and must be greater than 0`;
      }
    }

    //  UPDATED: Storage Capacity Config validation (2–3 digits only)
    const { width, height, depth } = formData.storage_capacity_config || {};

    const validateDimension = (value: any, field: string, label: string) => {
      if (!value || value.toString().trim() === "") {
        newErrors[field] = `${label} is required`;
        return;
      }

      // Only digits (no decimal)
      if (!/^[0-9]+$/.test(value)) {
        newErrors[field] = `${label} must be a valid number`;
        return;
      }

      const num = Number(value);

      if (num < 10) {
        newErrors[field] = `${label} must be at least 2 digits`;
        return;
      }

      if (num > 99999) {
        newErrors[field] = `${label} cannot exceed 99999`;
        return;
      }
    };

    validateDimension(width, "storageWidth", "Width");
    validateDimension(height, "storageHeight", "Height");
    validateDimension(depth, "storageDepth", "Depth");

    // Tier validation
    if (!formData.tier) {
      newErrors.tier = "Tier is required";
    }

    // Service Radius validation
    if (!formData.radius) {
      newErrors.radius = "Service radius is required";
    } else if (Number(formData.radius) <= 0) {
      newErrors.radius = "Service radius must be greater than 0";
    } else if (Number(formData.radius) > 5000) {
      newErrors.radius = "Service radius cannot exceed 5,000 km";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } 
    else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    //  else if (formData.description.trim().length > 1000) {
    //   newErrors.description = "Description cannot exceed 1,000 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const request = {
      name: formData.name,
      tier_type: formData.tier,
      facility_code: formData.code,
      category: formData.warehouseType,
      storage_capacity_config: formData?.storage_capacity_config,
      fixed_costs: Number(formData.fixedCost),
      service_radius: Number(formData.radius),
      zone: formData?.region,
      address: formData.address,
      customer_id: formData.customerId,
      description: formData.description,
      category_storage_type: formData.category_storage_type,
      boxes_pallet_count: formData.boxes_pallet_count,
      ...(editingFacility ? {} : { assigned_to: formData.assign_to }),
    };
    let success = false;

    try {
      const { saveFacility, updateFacility } = useFacilityStore.getState();
      if (editingFacility) {
        success = await updateFacility(request, editingFacility.id);
      } else {
        success = await saveFacility(request);
    
      }
      if (success) {
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };
  const getDominantDirection = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    const latDiff = lat1 - lat2;
    const lngDiff = lng1 - lng2;

    if (Math.abs(latDiff) > Math.abs(lngDiff)) {
      return latDiff > 0 ? "North" : "South";
    } else {
      return lngDiff > 0 ? "East" : "West";
    }
  };
  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    const geocoder = geocoderRef.current;
    if (!autocomplete || !geocoder) return;

    const place = autocomplete.getPlace();
    if (!place?.geometry?.location) return;

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status !== "OK" || !results?.length) return;

        const address = results[0];
        const components = address.address_components || [];

        const getComponent = (type: string) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const streetNumber = getComponent("street_number");
        const route = getComponent("route");
        const subLocality =
          getComponent("sublocality") || getComponent("sublocality_level_1");
        const locality = getComponent("locality");
        const district = getComponent("administrative_area_level_2");
        const state = getComponent("administrative_area_level_1");
        const pincode = getComponent("postal_code");

        const fullLocation = [
          streetNumber,
          route,
          subLocality,
          locality,
          district,
          state,
        ]
          .filter(Boolean)
          .join(", ");
        geocoder.geocode({ address: locality }, (cityResults, cityStatus) => {
          if (cityStatus !== "OK" || !cityResults?.length) return;

          const cityCenter = cityResults[0].geometry.location;
          const cityLat = cityCenter.lat();
          const cityLng = cityCenter.lng();

          const direction = getDominantDirection(
            latitude,
            longitude,
            cityLat,
            cityLng,
          );

          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              locationName: fullLocation,
              pincode,
              latitude,
              longitude,
            },
            region: direction,
          }));
        });
      },
    );
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
    if (!searchInputRef.current || !modalOpen) return;

    loadGoogleMapsScript(() => {
      if (!searchInputRef.current) return;

      geocoderRef.current = new google.maps.Geocoder();

      autocompleteRef.current = new google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          componentRestrictions: { country: "in" }, // 🇮🇳 India only
          types: ["address"], //  Cities only
          fields: [
            "geometry",
            "formatted_address",
            "address_components",
            "name",
          ],
        },
      );

      const listener = autocompleteRef.current.addListener(
        "place_changed",
        handlePlaceChanged,
      );

      // Fix dropdown behind modal
      setTimeout(() => {
        const pacContainer = document.querySelector(
          ".pac-container",
        ) as HTMLElement;
        if (pacContainer) pacContainer.style.zIndex = "5000";
      });

      return () => {
        listener?.remove();
      };
    });
  }, [modalOpen]);

  useEffect(() => {
    const el = document.querySelector(".pac-container");
    if (el) document.body.appendChild(el);
  }, []);

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await masterData.getDownload(
        true,
        "Facility",
        "Facility_master_template",
      );
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  const updateDimension = (
    key: "width" | "height" | "depth",
    value: string,
  ) => {
    // allow only numbers & decimals
    const numericValue = value.replace(/[^0-9.]/g, "");

    setFormData((prev) => ({
      ...prev,
      storage_capacity_config: {
        ...prev.storage_capacity_config,
        [key]: numericValue,
      },
    }));
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      await masterData.exportFile(true, "Facility", "facility.xlsx", {
        search: searchQuery || "",
        status_filter: statusFilter != "all" ? statusFilter : "",
        tier: tierFilter != "all" ? tierFilter : "",
        filter_name: filter_name || "",
        filter_customer_name: filter_customer || "",
        filter_region: regionFilter != "all" ? regionFilter : "",
        filter_facility_code: filter_facility_code || "",
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
        "Facility",
        Number(assignTo), // pass assignee id
      );

      if (!response) {
        return;
      }

      const status = response?.status_code;

      if (status === 200 || status === 201) {
        const Capacity = Number(capacity);
        const Fixed_cost = Number(fixed_cost);
        fetchFacility(
          currentPage,
          pageSize,
          searchQuery,
          statusFilter === "all" ? "" : statusFilter,
          tierFilter === "all" ? "" : tierFilter,
          filter_name,
          regionFilter === "all" ? "" : regionFilter,
          Capacity,
          Fixed_cost,
          sortBy,
          sortOrder,
          filter_customer,
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
          toast.success(response?.message||"Facility data imported successfully!");
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
  const calculateTotalUnits = () => {
    const { width, height, depth } = formData.storage_capacity_config;
    const { boxes_pallet_count } = formData;

    return (
      (parseFloat(width) || 0) *
      (parseFloat(height) || 0) *
      (parseFloat(depth) || 0) *
      (parseFloat(String(boxes_pallet_count)) || 1)
    ).toLocaleString();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleTierFilterChange = (value: string) => {
    setTierFilter(value);
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

  const handleModalClose = () => {
    setModalOpen(false);
    searchParams.delete("buttontype");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true },
    );
  };
  const viewFacility = (details: any) => {
    setViewFacilityDetails(details);
    setViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: {
        locationName: "",
        pincode: "",
        latitude: 0,
        longitude: 0,
      },
      region: "",
      tier: "",
      storage_capacity_config: {
        width: "",
        height: "",
        depth: "",
      },
      fixedCost: "",
      radius: "",
      status: "",
      customerId: 0,
      code: "",
      description: "",
      warehouseType: "",
      category_storage_type: "",
      boxes_pallet_count: 1,
      leaseAgreementNumber: "",
      assign_to: null,
    });
    setErrors({});
  };

  useEffect(() => {
    customerDropDown();
    categoryDropDown();
  }, []);

  const handleStorageCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_storage_type: value,
      boxes_pallet_count: 1,
      storage_capacity_config: {
        width: "",
        height: "",
        depth: "",
      },
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.category_storage_type;
      delete newErrors.boxes_pallet_count;
      return newErrors;
    });
  };

  const updateStorageCapacityDimension = (
    field: "width" | "height" | "depth",
    value: string,
  ) => {
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFormData((prev) => ({
        ...prev,
        storage_capacity_config: {
          ...prev.storage_capacity_config,
          [field]: value,
        },
      }));
    }
  };

  const warehouseTypes = categoryList?.map((item) => ({
    label: item,
    value: item,
  }));
  const activeList = dropdownList.filter((item) => item.status === "Active");
  const customerOptions: ComboBoxOption<Customer>[] = activeList.map((c) => ({
    id: c.id,
    value: c.name,
    data: c,
  }));
  const userOptionsValue: any = assigneeData?.map((user: any) => ({
    id: user.id,
    label: user.name,
    value: String(user.name),
    data: user,
  }));
  const handleApprove = async (ids: (string | number)[]) => {
    const facility_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      facility_ids,
      assigned_status: "Approved",
      rejection_reason: "",
    };
    let success = false;
    success = await updateStatus(request, "facilities");
    if (success) {
      const Capacity = Number(capacity);
      const Fixed_cost = Number(fixed_cost);
      fetchFacility(
        currentPage,
        pageSize,
        searchQuery,
        statusFilter === "all" ? "" : statusFilter,
        tierFilter === "all" ? "" : tierFilter,
        filter_name,
        regionFilter === "all" ? "" : regionFilter,
        Capacity,
        Fixed_cost,
        sortBy,
        sortOrder,
        filter_customer,
        activeTab === "request" ? "" : "Pending",
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
    const facility_ids = (() => {
      const arr = ids || [];
      if (arr[0] === "all") {
        return "all";
      } else {
        return arr.map(Number);
      }
    })();
    const request = {
      facility_ids,
      assigned_status: "Rejected",
      rejection_reason: reason || "",
    };
    let success = false;
    success = await updateStatus(request, "facilities");
    if (success) {
      const Capacity = Number(capacity);
      const Fixed_cost = Number(fixed_cost);
      fetchFacility(
        currentPage,
        pageSize,
        searchQuery,
        statusFilter === "all" ? "" : statusFilter,
        tierFilter === "all" ? "" : tierFilter,
        filter_name,
        regionFilter === "all" ? "" : regionFilter,
        Capacity,
        Fixed_cost,
        sortBy,
        sortOrder,
        filter_customer,
        activeTab === "request" ? "" : "Pending",
        activeTab === "request" ? null : userId,
        activeTab === "request" ? userId : null,
        filter_reason,
        filter_assignee_name,
        filter_last_action,
        filter_request,
      );
    }
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
            value="facility"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Building className="h-4 w-4" />
            <span>All facilities</span>

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
              searchPlaceholder={"Search"}
              statusFilter={{
                value: statusFilter,
                onChange: (value) => {
                  setCurrentPage(0)
                  setStatusFilter(value);
                },
                options: [
                  { value: "all", label: "All Status" },
                  ...status?.map((r) => ({ value: r, label: r })),
                ],
                placeholder: "Status",
              }}
              secondaryFilter={{
                value: tierFilter,
                onChange: (val: any) => {
                  setCurrentPage(0)
                  setTierFilter(val);
                },
                options: [
                  { value: "all", label: "All Tiers" },
                  ...tiers?.map((t) => ({ value: t, label: t })),
                ],
                placeholder: "Tier",
              }}
              description=""
              onAddNew={handleAddNew}
              addLabel="Add Facility"
              isDownloading={isDownloading}
              handleDownload={() => {
                downloadTemplate();
              }}
              handleExport={exportData}
              handleImport={importData}
              acceptedFileTypes=".csv,.xlsx,.xlsb"
              isExporting={isExporting}
            />
          </header>
        )}

        <TabsContent value="facility" className="mt-0">
          {!data ? (
            <MasterTableSkeleton title="Facility Master" columns={8} />
          ) : (
            <FacilityMasterTable
              onPageSizeChange={setPageSize}
              totalRecords={total}
              onView={viewFacility}
              pageSize={pageSize}
              facilities={data}
              page={currentPage}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              tierFilter={tierFilter === "all" ? "" : tierFilter}
              onTierFilterChange={handleTierFilterChange}
              statusFilter={statusFilter === "all" ? "" : statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              regionFilter={regionFilter}
              onRegionFilterChange={handleRegionFilterChange}
              filter_name={filter_name}
              filter_customer={filter_customer}
              fixed_cost={fixed_cost}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterNameChange={setFilter_name}
              onFilterCustomerChange={setCustomer_name}
              onCapacityChange={setCapacity}
              onFixedCostChange={setFixed_cost}
              onSortChange={handleSortChange}
              filter_facility_code={filter_facility_code}
              onFilterCodeChange={setFilter_facility_code}
            />
          )}
        </TabsContent>
        <TabsContent value={"await"} className="mt-0">
          <NeonCard
            title="Awaiting approvals"
            className="h-full"
            count={isLoading ? "0" : String(total)}
          >
            <FacilityOverviewTable
              onPageSizeChange={setPageSize}
              totalRecords={total}
              pageSize={pageSize}
              facilities={data}
              page={currentPage}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
              tierFilter={tierFilter === "all" ? "" : tierFilter}
              onTierFilterChange={handleTierFilterChange}
              statusFilter={
                filter_AssigneestatusFilter === "all"
                  ? ""
                  : filter_AssigneestatusFilter
              }
              onStatusFilterChange={setFilter_assigneeStatus}
              regionFilter={regionFilter}
              onRegionFilterChange={handleRegionFilterChange}
              filter_name={filter_name}
              filter_customer={filter_customer}
              filter_reason={filter_reason}
              fixed_cost={fixed_cost}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterNameChange={setFilter_name}
              onFilterCustomerChange={setCustomer_name}
              onFilterReasonChange={setFilter_reason}
              onCapacityChange={setCapacity}
              onFixedCostChange={setFixed_cost}
              onSortChange={handleSortChange}
              onApprove={handleApprove}
              onReject={handleReject}
              readOnly={false}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee_name}
              onAssigneeNameFilter={setFilter_assigneeName}
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
            <FacilityOverviewTable
              onPageSizeChange={setPageSize}
              totalRecords={total}
              pageSize={pageSize}
              facilities={data}
              page={currentPage}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
              tierFilter={tierFilter === "all" ? "" : tierFilter}
              onTierFilterChange={handleTierFilterChange}
              statusFilter={
                filter_AssigneestatusFilter === "all"
                  ? ""
                  : filter_AssigneestatusFilter
              }
              onStatusFilterChange={setFilter_assigneeStatus}
              regionFilter={regionFilter}
              onRegionFilterChange={handleRegionFilterChange}
              filter_name={filter_name}
              filter_customer={filter_customer}
              filter_reason={filter_reason}
              fixed_cost={fixed_cost}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterNameChange={setFilter_name}
              onFilterCustomerChange={setCustomer_name}
              onFilterReasonChange={setFilter_reason}
              onCapacityChange={setCapacity}
              onFixedCostChange={setFixed_cost}
              onSortChange={handleSortChange}
              onApprove={handleApprove}
              onReject={handleReject}
              readOnly={true}
              filter_last_action={filter_last_action}
              onLastActionFilter={setFilter_last_action}
              filter_request_name={filter_request}
              filter_assignee_name={filter_assignee_name}
              onAssigneeNameFilter={setFilter_assigneeName}
              onRequestNameFilter={setRequest_name}
            />
          </NeonCard>
        </TabsContent>
      </Tabs>

      <MasterModal
        open={modalOpen}
        onClose={handleModalClose}
        title={editingFacility ? "Edit Facility" : "Add New Facility"}
        onSave={handleSave}
        saving={saving}
        buttontitle={editingFacility ? "Update" : "Request"}
        onReset={resetForm}
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: Basic Information */}
          <FormField label="Customer Name" required error={errors.customerId}>
            <ComboBox
              options={customerOptions}
              selectedValue={formData.customerId}
              onValueChange={(id) =>
                setFormData((prev: any) => ({ ...prev, customerId: id }))
              }
              placeholder="Select a customer..."
            />
          </FormField>

          <FormField label="Facility Name" required error={errors.name}>
            <NeonInput
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter facility name"
              error={!!errors.name}
            />
          </FormField>

          <FormField label="Code" required error={errors.code}>
            <NeonInput
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Enter Code"
              error={!!errors.code}
            />
          </FormField>

          <FormField label="Location" required error={errors.address}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <NeonInput
                ref={searchInputRef}
                placeholder="Search city or location..."
                className="pl-9 h-10 w-full"
                value={formData.address?.locationName || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      locationName: e.target.value,
                    },
                  }))
                }
                error={!!errors.address}
              />
            </div>
          </FormField>

          {/* Section 2: Classification */}
          <FormField
            label="Warehouse Type"
            required
            error={errors.warehouseType}
          >
            <Select
              value={formData.warehouseType}
              onValueChange={handleWarehouseTypeChange}
            >
              <SelectTrigger
                className={`w-full rounded-md  ${errors.warehouseType ? "border-destructive" : ""
                  }`}
              >
                <SelectValue
                  placeholder="Select Warehouse Type"
                  className="font-normal text-muted-foreground"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {warehouseTypes?.map((warehouse) => (
                    <SelectItem key={warehouse.value} value={warehouse.value}>
                      {warehouse.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Storage Category"
            required
            error={errors.category_storage_type}
          >
            <Select
              value={formData.category_storage_type}
              onValueChange={handleStorageCategoryChange}
            >
              <SelectTrigger
                className={`w-full rounded-md  ${errors.category_storage_type ? "border-destructive" : ""
                  }`}
              >
                <SelectValue
                  placeholder="Select Storage Category"
                  className="font-normal text-muted-foreground"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Boxes">Boxes</SelectItem>
                  <SelectItem value="Pallet">Pallet</SelectItem>
                  <SelectItem value="Cubic Meters">Cubic Meters</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>

          {/* Capacity Configuration - Consolidated Dimensions */}
          {formData.category_storage_type && (
            <div className="md:col-span-2 space-y-4">
              {/* Boxes/Pallet Count Field */}
              {["Boxes", "Pallet"].includes(formData.category_storage_type) && (
                <FormField
                  label={`${formData.category_storage_type} Count`}
                  required
                  error={errors.boxes_pallet_count}
                >
                  <NeonInput
                    type="text"
                    placeholder={`Enter number of ${formData.category_storage_type.toLowerCase()}`}
                    value={formData.boxes_pallet_count || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData((prev) => ({
                          ...prev,
                          boxes_pallet_count: Number(value),
                        }));
                      }
                    }}
                    error={!!errors.boxes_pallet_count}
                  />
                </FormField>
              )}

              {/* Unified Dimensions Section */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  Dimensions (W × H × D){" "}
                  <span className="text-destructive">*</span>
                </Label>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col">
                    <div className="relative">
                      <NeonInput
                        placeholder="Width"
                        value={formData.storage_capacity_config?.width || ""}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, "");

                          if (value.length > 5) return;

                          updateStorageCapacityDimension("width", value);
                        }}
                        className="pr-8 w-full"
                        error={!!errors.storageWidth}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        W
                      </span>
                    </div>
                    <p className="text-xs text-destructive mt-1 min-h-[16px]">
                      {errors.storageWidth || ""}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative">
                      <NeonInput
                        placeholder="Height"
                        value={formData.storage_capacity_config?.height || ""}

                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, "");

                          if (value.length > 5) return;

                          updateStorageCapacityDimension("height", value);
                        }}
                        className="pr-8 w-full"
                        error={!!errors.storageHeight}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        H
                      </span>
                    </div>
                    <p className="text-xs text-destructive mt-1 min-h-[16px]">
                      {errors.storageHeight || ""}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="relative">
                      <NeonInput
                        placeholder="Depth"
                        value={formData.storage_capacity_config?.depth || ""}


                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, "");

                          if (value.length > 5) return;

                          updateStorageCapacityDimension("depth", value);
                        }}
                        className="pr-8 w-full"
                        error={!!errors.storageDepth}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        D
                      </span>
                    </div>
                    <p className="text-xs text-destructive mt-1 min-h-[16px]">
                      {errors.storageDepth || ""}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-end">
                  <p className="text-sm font-medium text-primary">
                    Total Volume: {calculateTotalUnits()}{" "}
                    {formData.category_storage_type === "Cubic Meters" ? (
                      <>m<sup>3</sup></>
                    ) : (
                      <>mm<sup>3</sup></>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormField label="Tier" required error={errors.tier}>
            <Select
              value={formData.tier}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, tier: value }));
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.tier;
                  return newErrors;
                });
              }}
            >
              <SelectTrigger
                className={`w-full rounded-md  ${errors.tier ? "border-destructive" : ""}`}
              >
                <SelectValue
                  placeholder="Select Tier"
                  className="text-muted-foreground font-normal"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {tiers?.map((tier: string) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormField>
          {!editingFacility && (
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
          {/* Section 3: Financial & Operational */}
          <FormField label="Service Radius (km)" required error={errors.radius}>
            <NeonInput
              type="text"
              placeholder="Enter radius"
              value={formData.radius}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setFormData({ ...formData, radius: value });
                }
              }}
              error={!!errors.radius}
            />
          </FormField>

          <FormField label="Description" required error={errors.description}>
            <Textarea
              value={formData.description}
              placeholder="Enter description"
              className="resize-none"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </FormField>
        </div>
      </MasterModal>

      <ImportErrorModal
        open={importErrorModalOpen}
        onClose={() => setImportErrorModalOpen(false)}
        errors={importErrors}
        successCount={importSuccessCount}
        totalRows={importTotalRows}
        fileType="Facility_master_template"
      />

      <FacilityViewModal
        facility={viewFacilityDetails}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        approval={false}
      />
    </div>
  );
};

export default FacilityMasterPage;
