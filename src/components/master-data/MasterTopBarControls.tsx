import { Search, Plus, Upload, Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { NeonMultiSelect } from "../multiSelect";
import { useEffect, useRef, useState } from "react";
import { ConfirmationDialog } from "../confirmationDialog";
import { ComboBox } from "../search-select/combo-box";
import { useAuditStore } from "@/stores/auditStore";

interface FilterOption {
  value: string;
  label: string;
}

interface MasterTopBarControlsProps {
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  };
  isUploading: boolean;
  setUploading?: (boolean) => void;
  secondaryFilter?: {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    options: FilterOption[] | string[];
    placeholder: string;
    multiSelect?: boolean;
  };
  onAddNew: () => void;
  handleDownload?: () => void;
  handleImport?: (file: File, assignTo: string) => void;
  handleExport?: () => void;
  addLabel?: string;
  description?: string;
  showImport?: boolean;
  showAssignee?: boolean;
  isDownloading?: boolean;
  acceptedFileTypes?: string;
  downloadTemplate?: boolean;
  statusFilterShow?: boolean;
  isExporting?: boolean;
}

export const MasterTopBarControls = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  secondaryFilter,
  onAddNew,
  addLabel = "Add New",
  description,
  setUploading,
  isExporting = false,
  isUploading,
  handleDownload,
  searchPlaceholder,
  showImport = true,
  showAssignee = true,
  isDownloading = false,
  handleImport,
  handleExport,
  downloadTemplate = true,
  statusFilterShow = true,
  acceptedFileTypes = ".csv,.xlsx,.xls,.xlsb",
}: MasterTopBarControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [assignTo, setAssignTo] = useState<string>("");
  const [assignToError, setAssignToError] = useState<string>("");

  const { assigneeData, getAssigneeList } = useAuditStore();
  const prevIsUploadingRef = useRef(isUploading);

  const onImportClick = () => {
    setShowImportModal(true);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (acceptedFileTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast.error("Invalid file type. Please upload a valid file.");
      }
    }
  };
  const handleImportConfirm = () => {
    if (!selectedFile) {
      return;
    }

    if (isUploading) {
      return;
    }

    if (showAssignee && !assignTo) {
      setAssignToError("Please select an assignee");
      return;
    }

    setAssignToError("");

    handleImport?.(selectedFile, assignTo);
  };
  useEffect(() => {
    getAssigneeList();
  }, []);

  useEffect(() => {
    if (prevIsUploadingRef.current && !isUploading) {
      setShowImportModal(false);
      setSelectedFile(null);
      setAssignTo("");
      setAssignToError("");
    }
    prevIsUploadingRef.current = isUploading;
  }, [isUploading]);

  const handleModalClose = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setAssignTo("");
    setAssignToError("");
    setUploading?.(false);
  };

  const userOptionsValue: any = assigneeData?.map((user: any) => ({
    id: user.id,
    label: user.name,
    value: String(user.name),
    data: user,
  }));

  const isMultiSelect = secondaryFilter?.multiSelect === true;

  const normalizeOptions = (
    options: FilterOption[] | string[] | undefined,
  ): FilterOption[] => {
    if (!options || !Array.isArray(options) || options.length === 0) return [];

    if (typeof options[0] === "string") {
      return (options as string[]).map((opt) => ({
        value: opt || "",
        label: opt || "",
      }));
    }

    return (options as FilterOption[]).filter(
      (opt) => opt && opt.value && opt.label,
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={onFileChange}
          className="hidden"
        />

        {/* Search */}
        <div className="w-full lg:flex-1 min-w-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder || "Search..."}
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-card/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Status Filter */}
        {statusFilterShow && (
          <Select
            value={statusFilter?.value || ""}
            onValueChange={statusFilter?.onChange}
          >
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-card/50 border-border/50">
              <SelectValue
                placeholder={statusFilter?.placeholder || "Status"}
              />
            </SelectTrigger>
            <SelectContent>
              {statusFilter?.options?.map((opt) => (
                <SelectItem
                  key={opt?.value || Math.random()}
                  value={opt?.value || ""}
                >
                  {opt?.label || ""}
                </SelectItem>
              )) || null}
            </SelectContent>
          </Select>
        )}

        {/* Secondary Filter (Single or Multi Select) */}
        {secondaryFilter && secondaryFilter.options && (
          <div className="w-full sm:w-[140px]">
            {isMultiSelect ? (
              <NeonMultiSelect
                options={
                  typeof secondaryFilter.options[0] === "string"
                    ? (secondaryFilter.options as string[])
                    : (secondaryFilter.options as FilterOption[])
                        .filter((opt) => opt && opt.value)
                        .map((opt) => opt.value)
                }
                value={(secondaryFilter.value as string[]) || []}
                placeholder={secondaryFilter.placeholder || "Select"}
                onChange={(selected) => {
                  secondaryFilter?.onChange?.(selected);
                }}
              />
            ) : (
              <Select
                value={(secondaryFilter.value as string) || ""}
                onValueChange={(val) => secondaryFilter?.onChange?.(val)}
              >
                <SelectTrigger className="w-full h-9 bg-card/50 border-border/50">
                  <SelectValue
                    placeholder={secondaryFilter.placeholder || "Select"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {normalizeOptions(secondaryFilter.options).map((opt) => (
                    <SelectItem
                      key={opt?.value || Math.random()}
                      value={opt?.value || ""}
                    >
                      {opt?.label || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-auto">
          
            <>
             {
              showImport&&(
                 <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-border/50 hover:text-primary-foreground"
                onClick={onImportClick}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>

              )
             }
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-border/50 hover:text-primary-foreground"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </>
                )}
              </Button>
            </>
          

          {downloadTemplate && (
            <Button
              variant="outline"
              className="border-border/50 hover:text-primary-foreground h-9"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </>
              )}
            </Button>
          )}

          {addLabel !== "" && (
            <Button
              size="sm"
              className="h-9 gap-2 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              onClick={onAddNew}
            >
              <Plus className="w-4 h-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg mx-4 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                Import File
              </h3>
              <button
                onClick={handleModalClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drop Zone */}
            <button
              className={`w-full border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : selectedFile
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  {selectedFile ? (
                    <div className="flex w-full items-start gap-3 justify-center">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-medium text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <ConfirmationDialog
                        title="Remove File"
                        description="Are you sure you want to remove ?"
                        confirmText="Yes"
                        onConfirm={async () => {
                          setSelectedFile(null);
                          return true;
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="relative z-20 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-destructive/40 bg-destructive/10 text-destructive transition-all hover:bg-destructive/20 hover:neon-glow"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </ConfirmationDialog>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-foreground">
                        Drop your file here, or{" "}
                        <span className="text-primary">browse</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports .XLSB/.XLSX/.CSV files
                      </p>
                    </>
                  )}
                </div>
              </div>
            </button>
            {selectedFile && showAssignee && (
              <div className="mt-4">
                <ComboBox
                  options={userOptionsValue}
                  selectedValue={assignTo}
                  placeholder="Select Assign To"
                  renderOption={(option: any) => (
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{option.data?.name}</span>
                    </div>
                  )}
                  onValueChange={(userId: any) => {
                    setAssignTo(userId);
                    setAssignToError("");
                  }}
                />

                {/* Validation Error Message */}
                {assignToError && (
                  <p className="text-sm text-destructive mt-1">
                    {assignToError}
                  </p>
                )}
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleImportConfirm}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
