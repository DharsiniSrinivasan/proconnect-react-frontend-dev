import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
interface MarkerDetailCardProps {
  onClose: () => void;
}
const MarkerDetailCardSkeleton: React.FC<MarkerDetailCardProps> = ({
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        className="max-w-[300px] w-full bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-auto max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center gap-2 justify-between px-3 py-1 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location Details
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-4">
          {/* Plant Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-32" />
            </div>
          </div>

          {/* City Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-12" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-28" />
            </div>
          </div>

          {/* Address Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-24" />
            </div>
          </div>

          {/* Pincode Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-20" />
            </div>
          </div>

          {/* Billed Quantity Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
            </div>
          </div>

          {/* Total Invoice Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-12" />
            </div>
          </div>

          {/* On Time Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-28" />
            </div>
          </div>

          {/* Delayed Item */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse">
              <div className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 animate-pulse rounded w-32" />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarkerDetailCardSkeleton;
