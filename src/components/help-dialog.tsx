import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ExternalLink, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useHelpStore } from "@/stores/helpStore";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveHelpRequest } = useHelpStore();

  const handleSubmit = async () => {
    if (message.trim()) {
      setIsSubmitting(true);
      try {
        const request = {
          subject: "Help & Support Request",
          message: message.trim(),
        };
        const success = await saveHelpRequest(request);
        if (success) {
          toast.success("Support request submitted successfully!");
          setMessage("");
          setShowForm(false);
          onOpenChange(false);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please enter a message");
    }
  };

  const handleCancel = () => {
    setMessage("");
    setShowForm(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setMessage("");
      setShowForm(false);
    }
    onOpenChange(isOpen);
  };

  const handleBack = () => {
    setShowForm(false);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-border/50 w-[95vw] sm:w-full max-w-md max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            {showForm && (
              <button
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors lg:hidden"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl text-foreground">
                Help & Support
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Get assistance with the D2R Analytics Platform
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2 sm:pt-4">
          {!showForm ? (
            <>
              {/* Contact Support Button */}
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 active:bg-muted/60 transition-colors text-left duration-200"
              >
                <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex-shrink-0">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    Contact Support
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    support@d2r.com
                  </p>
                </div>
              </button>

              {/* Documentation Link */}
              <a
                href="https://docs.d2r.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 active:bg-muted/60 transition-colors text-left duration-200"
              >
                <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20 flex-shrink-0">
                  <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    Documentation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    View guides & tutorials
                  </p>
                </div>
              </a>
            </>
          ) : (
            <div className="space-y-4 py-2 sm:py-0">
              <div>
                <label
                  htmlFor="help-message"
                  className="text-sm font-semibold text-foreground mb-2 block"
                >
                  Describe your issue
                </label>
                <Textarea
                  id="help-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="min-h-[120px] sm:min-h-[140px] bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground resize-none text-sm sm:text-base"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className="flex gap-2 sm:gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial bg-transparent border border-border/50 text-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted/70 text-sm sm:text-base h-9 sm:h-10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial text-primary-foreground bg-primary hover:bg-primary/90border-0 active:bg-primary/80 text-sm sm:text-base h-9 sm:h-10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 sm:mr-2 animate-spin" />
                      <span className="hidden xs:inline">Submitting...</span>
                      <span className="inline xs:hidden">Submit</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 sm:pt-4 border-t border-muted">
            <p className="text-xs text-muted-foreground text-center">
              D2R Analytics Platform v2.0.0
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};