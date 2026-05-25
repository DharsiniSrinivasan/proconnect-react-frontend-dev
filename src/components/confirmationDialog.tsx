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
  content?: React.ReactNode;  //  extra content inside dialog
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "No",
  onConfirm,
  children,
  content, //  include this
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      {/* Trigger */}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/*Render custom content (ComboBox comes here) */}
        {content && <div className="mt-3">{content}</div>}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}>
              {cancelText}
            </Button>
          </DialogClose>

          <Button
            variant="default"
            className="bg-primary"
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