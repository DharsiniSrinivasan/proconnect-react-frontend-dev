import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";

interface ConfirmationDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<boolean>;
  children?: React.ReactNode; // trigger
  content?: React.ReactNode;  // extra content inside dialog
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const AssigneeConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  children,
  content,
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  // Internal state (fallback)
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Decide controlled vs uncontrolled
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const success = await onConfirm();
      if (success) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger (optional) */}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Optional custom content */}
        {content && <div className="mt-3">{content}</div>}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="hover:text-primary-foreground"
            >
              {cancelText}
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};