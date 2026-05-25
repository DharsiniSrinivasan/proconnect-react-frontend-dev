import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/data-acquisition/UploadZone";
import { DownloadReport, uploadFileData } from "@/services/dataSetServices";
import { toast } from "sonner";
import { useAirflowStore } from "@/stores/dataSetStore";
import { getStorage } from "@/utils/storage";
import { BatchNameDialog } from "@/components/data-acquisition/Batchnamedialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCustomerStore } from "@/stores/masterStore";

const templateRules = [
  "One sheet per file",
  "One row per transaction",
  "Max 300 MB, .XLSX/.XLSB/.CSV only",
];

const NewUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const storage = getStorage();
  const { triggerAirflow } = useAirflowStore();
  const { dropdownList, customerDropDown } = useCustomerStore();
  const handleStartUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const maxSizeInBytes = 300 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File size exceeds 300 MB. Please select a smaller file.");
      return;
    }

    setShowBatchDialog(true);
  };
  useEffect(() => {
    customerDropDown();
  }, []);

  const activeList = dropdownList.filter((item) => item.status === "Active");
  const handleBatchSubmit = async (
    batchName: string,
    customerId: number,
    budget: string,
  ) => {
    setIsUploading(true);

    try {
      const response = await uploadFileData.NewuploadFile(
        selectedFile,
        batchName,
        customerId,
        Number(budget),
      );
      if (response.status == 200 || response.status == 201) {
        const id = response?.data?.data?.id ?? 0;
        storage.setItem("lastViewedDataset", id.toString());
        navigate(`/data/datasets/uploads/${id}?new=false`);
        triggerAirflow(id, String(customerId));
        setIsUploading(false);
        setShowBatchDialog(false);
        toast.success("File uploaded successfully");
      } else {
        setIsUploading(false);
        setShowBatchDialog(false);
        setErrorMessage(
          response?.error || "File upload failed. Please try again.",
        );
        setShowErrorDialog(true);
      }
    } catch (err) {
      setIsUploading(false);
      setShowBatchDialog(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await DownloadReport.getDownload(true);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AppShell pageTitle="New Data Upload">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-bold text-foreground">
            New Data Upload
          </h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template & Rules Card */}
        <NeonCard title="Template & Rules">
          <div className="space-y-6">
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={handleDownload}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Template
                </>
              )}
            </Button>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Upload Guidelines
              </h4>
              <ul className="space-y-2">
                {templateRules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-secondary">Tip:</strong> Ensure all
                mandatory fields are populated before upload. Missing fields
                will be flagged during validation.
              </p>
            </div>
          </div>
        </NeonCard>

        {/* Upload Zone Card */}
        <div className="space-y-4">
          <UploadZone
            onFileSelect={setSelectedFile}
            onFileRemove={() => setSelectedFile(null)}
            selectedFile={selectedFile}
          />

          <Button
            onClick={handleStartUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Start Upload
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Batch Name Dialog */}
      <BatchNameDialog
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        onSubmit={handleBatchSubmit}
        customers={activeList ?? []}
      />

      {/* Upload Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-sm border border-border bg-background shadow-sm">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Upload Failed
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed pl-11">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="default"
              onClick={() => setShowErrorDialog(false)}
              className="w-full text-sm"
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default NewUploadPage;
