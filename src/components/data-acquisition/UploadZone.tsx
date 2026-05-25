import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, Check, X, AlertCircle } from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "../confirmationDialog";

interface FileValidation {
  fileType: "valid" | "invalid" | "pending";
  fileSize: "valid" | "invalid" | "pending";
  headerMatch: "valid" | "invalid" | "pending";
}

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onFileRemove: () => void;
}

export const UploadZone = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
}: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [validation, setValidation] = useState<FileValidation>({
    fileType: "pending",
    fileSize: "pending",
    headerMatch: "pending",
  });

  const validateFile = useCallback((file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.ms-excel",
    ];
    const maxSize = 300 * 1024 * 1024; // 300 MB

    const isValidType =
      validTypes.includes(file.type) ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsb");
    const isValidSize = file.size <= maxSize;

    setValidation({
      fileType: isValidType ? "valid" : "invalid",
      fileSize: isValidSize ? "valid" : "invalid",
      headerMatch: isValidType && isValidSize ? "valid" : "pending",
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateFile(file);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateFile(file);
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  const handleRemove = () => {
    setValidation({
      fileType: "pending",
      fileSize: "pending",
      headerMatch: "pending",
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onFileRemove();
  };

  const ValidationChip = ({
    status,
    label,
  }: {
    status: "valid" | "invalid" | "pending";
    label: string;
  }) => {
    const config = {
      valid: {
        icon: Check,
        className: "bg-chart-2/20 text-chart-2 border-chart-2/40",
      },
      invalid: {
        icon: X,
        className: "bg-destructive/20 text-destructive border-destructive/40",
      },
      pending: {
        icon: AlertCircle,
        className:
          "bg-muted/40 text-muted-foreground border-muted-foreground/40",
      },
    };
    const { icon: Icon, className } = config[status];

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
          className,
        )}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <NeonCard title="Upload File">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border/50 hover:border-primary/50 hover:bg-primary/5",
          selectedFile && "border-chart-2/50 bg-chart-2/5",
        )}
      >
        <input
          type="file"
          accept=".xlsx,.csv,.xlsb"
          ref={inputRef}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {selectedFile ? (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full items-start gap-3">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 neon-glow">
                <FileSpreadsheet className="text-primary" size={28} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-semibold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <ConfirmationDialog
                title="Remove File"
                description="Are you sure you want to remove ?"
                confirmText="Yes"
                onConfirm={async () => {
                  handleRemove();
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

            <div className="flex flex-wrap justify-center gap-2">
              <ValidationChip status={validation.fileType} label="File Type" />
              <ValidationChip status={validation.fileSize} label="File Size" />
              <ValidationChip
                status={validation.headerMatch}
                label="Header Match"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Drop your file here, or{" "}
                <span className="text-primary">browse</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports .XLSB/.XLSX/.CSV files up to 300 MB
              </p>
            </div>
          </div>
        )}
      </div>
    </NeonCard>
  );
};
