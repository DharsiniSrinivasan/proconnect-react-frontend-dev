import { ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface MasterModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  buttontitle?: string;
  children: ReactNode;
  onSave?: () => void;
  saving?: boolean;
  onReset?: () => void;
  maxWidth?: string;
  save?: boolean;
  approval?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export const MasterModal = ({
  approval,
  onApprove,
  onReject,
  open,
  onClose,
  maxWidth = "max-w-lg",
  title,
  buttontitle,
  children,
  onSave,
  saving,
  onReset,
  save = true,
}: MasterModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full rounded-xl bg-card border border-section-border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-hidden",
            maxWidth,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-section-border bg-modal-header rounded-t-xl">
            <h2 className="text-lg font-semibold text-modal-header-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-modal-header-foreground/70 hover:text-modal-header-foreground hover:bg-modal-header-foreground/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-section-border bg-field-bg rounded-b-xl">
            {approval && (
              <>
                <Button variant="destructive" onClick={onReject}>
                  Reject
                </Button>
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={onApprove}
                >
                  Approve
                </Button>
              </>
            )}

            {save && (
              <>
                <Button variant="outline" onClick={onReset}>
                  Reset
                </Button>
                <Button onClick={onSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? "Loading..." : buttontitle}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: any;
}

export const FormField = ({
  label,
  required,
  children,
  error,
}: FormFieldProps) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-field-value">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const NeonInput = React.forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
        error ? "border-destructive focus:ring-destructive" : "border-input",
        className,
      )}
      {...props}
    />
  ),
);

NeonInput.displayName = "NeonInput";

interface NeonSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const NeonSelect = ({
  className,
  children,
  error,
  ...props
}: NeonSelectProps) => (
  <select
    className={cn(
      "w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
      error ? "border-destructive focus:ring-destructive" : "border-input",
      className,
    )}
    {...props}
  >
    {children}
  </select>
);

/* Reusable field display components for view modals */
export const FieldGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
    {children}
  </div>
);

export const FieldItem = ({
  label,
  value,
  fullWidth = false,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
  mono?: boolean;
}) => (
  <div
    className={cn(
      "rounded-lg bg-field-bg px-4 py-3 border border-section-border/60",
      fullWidth && "sm:col-span-2",
    )}
  >
    <p className="text-sm font-medium   text-field-label mb-1">{label}</p>
    <p className={cn("text-sm font-medium text-field-value leading-relaxed")}>
      {value ?? "-"}
    </p>
  </div>
);

export const SectionDivider = ({ label }: { label?: string }) => (
  <div className="flex items-center gap-3 my-5 sm:col-span-2">
    <div className="flex-1 h-px bg-section-border" />
    {label && (
      <span className="text-xs font-semibold uppercase tracking-widest text-field-label">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-section-border" />
  </div>
);
