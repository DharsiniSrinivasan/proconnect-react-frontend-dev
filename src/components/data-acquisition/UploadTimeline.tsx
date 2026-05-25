import { Check, Circle, Loader2, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getStorage } from "@/utils/storage";
import { usePermission } from "@/utils/userPermission";
import { AnimatedTruck } from "./TruckIcon";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import React from "react";

interface UploadTimelineProps {
  status: string;
  progressStatus?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const steps = [
  { label: "Initiated", step: 1 },
  { label: "Queued", step: 2 },
  { label: "Processing", step: 3 },
  { label: "Analysing", step: 4 },
  { label: "Ready", step: 5 },
];

const STATUS_STEP_MAP: Record<string, number> = {
  INITIATE: 1,
  QUEUED: 2,
  QUEUE: 2,
  PROCESSING: 3,
  ANALYSING: 4,
  READY: 5,
  FAILED: 5,
};


const FAILED_STEP_MAP: Record<string, number> = {
  "Data Upload": 1,
  "In Queue": 2,
  "Data Validation": 3,
  "Data Categorization": 3,
  "Data Enrichment": 3,
  "Strategic Dashboard Generation": 3,
  "Operational Dashboard Generation": 3,
  "Financial Dashboard Generation": 3,
  "Facility Dashboard Generation": 3,
  "Forecast Analysis": 4,
  "Recommendation Engine": 4,
  "Data Quality Score Failed": 3,
};

export const UploadTimeline = ({
  status,
  progressStatus,
  onRetry,
  isRetrying = false,
}: UploadTimelineProps) => {
  const isFailed = status === "FAILED";
  const isReady = status === "READY";
  const storage = getStorage();
  const menus = storage.getItem("menus");
  const { hasPermission } = usePermission(JSON.parse(menus || "[]"));
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [truckLeft, setTruckLeft] = useState(0);
  const failedStep =
    isFailed && progressStatus
      ? (FAILED_STEP_MAP[progressStatus] ?? STATUS_STEP_MAP[status] ?? 5)
      : null;

  const currentStep =
    isFailed && failedStep ? failedStep : (STATUS_STEP_MAP[status] ?? 1);

  const getStepState = (stepNum: number) => {
    if (isFailed) {
      if (stepNum === failedStep) return "failed";
      if (stepNum < (failedStep ?? currentStep)) return "Ready";
      return "pending";
    }
    if (stepNum < currentStep) return "Ready";
    if (stepNum === currentStep) {
      if (status === "PROCESSING" || status === "ANALYSING")
        return "processing";
      if (isReady) return "Ready";
      if (status === "QUEUED") return "Ready";
      return "current";
    }
    return "pending";
  };

  const getStepLabel = (stepNum: number, defaultLabel: string) => {
    if (stepNum === 5 && isReady) return "Ready";
    if (stepNum === 5 && isFailed) return "Failed";
    if (stepNum === 4) return "Analytics";
    return defaultLabel;
  };

  const getStepSubLabel = (stepNum: number, state: string) => {
    if (state !== "processing") return null;
    if (
      stepNum === 3 &&
      progressStatus
    ) {
      return progressStatus;
    }
    if (
      stepNum === 4 &&
      progressStatus
    ) {
      return progressStatus;
    }
    return null;
  };

  const getCircleStyles = (stepNum: number, state: string) => {
    if (stepNum === 5 && isReady)
      return "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/30 shadow-lg";
    if (state === "failed")
      return "bg-destructive border-destructive text-white shadow-destructive/30 shadow-lg";
    if (state === "Ready")
      return "bg-chart-2 border-green-600 text-green-600 shadow-chart-2/20 shadow-md";
    if (state === "processing")
      return "border-primary bg-primary/10 text-primary";
    if (state === "current") return "bg-chart-2 border-chart-2 text-white";
    return "border-border/40 bg-muted/20 text-muted-foreground";
  };

  const getConnectorStyles = (index: number) => {
    return "bg-border/30";
  };

  // Truck position: percentage along the track (0% to 100%)


  const truckColor =
    currentStep >= 4
      ? "text-emerald-500"
      : currentStep >= 3
        ? "text-amber-500"
        : "text-primary";

  const showTruck = !isFailed && !isReady;

  // Truck percentage position — center of each equal-width column
  useEffect(() => {
    if (!containerRef.current || !stepRefs.current[currentStep - 1]) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const stepRect =
      stepRefs.current[currentStep - 1].getBoundingClientRect();

    const centerX =
      stepRect.left + stepRect.width / 2 - containerRect.left;

    setTruckLeft(centerX);
  }, [currentStep, steps]);

  return (
    <div className="glass-card rounded-xl p-6 space-y-5">
      {/* Retry button for data quality failure */}
      {isFailed && onRetry && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-destructive">
            {progressStatus !== "Data Quality Score Failed"
              ? `${progressStatus} failed`
              : progressStatus}
          </p>
          {hasPermission("manage-excel-templates") && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="gap-1.5 h-8 text-xs ml-auto shrink-0"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")}
              />
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
          )}
        </div>
      )}

      {/* Desktop Timeline - Horizontal */}
      <div className="hidden md:block relative pt-14" ref={containerRef}>
        {/* ROAD (aligned with steps) */}
        {showTruck && (
          <div className="absolute top-7 left-0 right-0 ">


            <div className="relative w-full h-3 rounded-full bg-foreground/10 overflow-hidden">
              {/* Filled progress */}
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full overflow-hidden"
                animate={{ width: truckLeft + 20 }}
                transition={{ type: "tween", duration: 1.5, ease: "easeInOut" }}
              >
                {/* Base background */}
                <div className="w-full h-full bg-primary/30" />

                {/* Shimmer layer */}
                <motion.div
                  className="absolute top-0 left-[-50%] h-full w-[50%] 
            bg-gradient-to-r from-transparent via-primary/90 to-transparent"
                  animate={{ left: ["-50%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* Border */}
              <div className="absolute inset-0 rounded-full border border-foreground/10" />

              {/* Dashed overlay */}
              <div className="absolute inset-0 flex items-center px-2 gap-2 pointer-events-none">
                {Array.from({ length: steps.length * 2 }).map((_, i) => (
                  <div key={i} className="flex-1 h-[2px] bg-white/70 rounded-full" />
                ))}
              </div>
            </div>
          </div>)}
        {showTruck && (
          <motion.div
            className="absolute top-0 z-10 -translate-x-1/2"
            animate={{ left: truckLeft }}
            transition={{ type: "tween", duration: 1.5, ease: "easeInOut" }}
          >
            <AnimatedTruck colorClass={truckColor} />
          </motion.div>
        )}


        <div className="hidden md:flex items-center w-full">
          {steps?.map((step, index) => {
            const state = getStepState(step.step);
            const isLast = index === steps.length - 1;
            const subLabel = getStepSubLabel(step.step, state);

            return (
              <React.Fragment key={step.step}>

                {/* STEP */}
                <div
                  ref={(el) => (stepRefs.current[index] = el)}
                  className="flex flex-col items-center justify-center min-w-[80px]"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white",
                      getCircleStyles(step.step, state)
                    )}
                  >
                    {(state === "Ready" || state === "current") && (
                      <Check className={cn(
                        "w-7 h-7",
                        isReady && isLast ? "text-white" : "text-green-600",
                      )} />
                    )}
                    {state === "processing" && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {state === "failed" && <X className="w-7 h-7" />}
                    {state === "pending" && (
                      <Circle className="w-7 h-7 opacity-40" />
                    )}
                  </div>

                  <span className="mt-2 text-xs text-center">
                    {getStepLabel(step.step, step.label)}
                  </span>

                  {subLabel && (
                    <span className="mt-1 text-[10px] text-center leading-tight">
                      {subLabel}
                    </span>
                  )}
                </div>

                {/* CONNECTOR LINE */}
                {!isLast && (
                  <div className="flex-1 flex items-center px-2">
                    <div
                      className={cn(
                        "w-full h-0.5 rounded-full transition-all duration-500",
                        getConnectorStyles(index)
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
      {/* Mobile - Circular Progress with Details */}
      <div className="md:hidden flex flex-col items-center mt-0 p-0">
        {/* Steps List */}
        <div className="w-full space-y-2">
          {steps?.map((step) => {
            const state = getStepState(step.step);
            const isCurrentStep = step.step === currentStep;
            const subLabel = getStepSubLabel(step.step, state);

            return (
              <div
                key={step.step}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                  isCurrentStep
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/30 border border-transparent hover:bg-muted/50"
                )}
              >
                <div className="flex-shrink-0">
                  {state === "Ready" && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {state === "processing" && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {state === "failed" && (
                    <X className="w-5 h-5 text-destructive" />
                  )}
                  {state === "pending" && (
                    <Circle className="w-5 h-5 text-muted-foreground opacity-40" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isCurrentStep
                        ? "text-foreground"
                        : state === "Ready"
                          ? "text-foreground"
                          : state === "failed"
                            ? "text-destructive"
                            : "text-muted-foreground"
                    )}
                  >
                    {getStepLabel(step.step, step.label)}
                  </p>
                  {subLabel && (
                    <span className="text-[10px] text-foreground text-center leading-tight">
                      {subLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};