import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Hash, Clock, Check, Package, FileText } from "lucide-react";
import { RawMarker } from "./InteractiveMap";

interface MarkerDetailCardProps {
  marker: RawMarker | null;
  onClose: () => void;
}

const MarkerDetailCard: React.FC<MarkerDetailCardProps> = ({
  marker,
  onClose,
}) => {
  if (!marker) return null;

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
        <div className="p-3 space-y-2">
          {/* Location Name */}
          {/* Location Name */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Facility</p>
              <p className="text-xs font-semibold text-foreground">
                {marker.plant_name}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">City</p>
              <p
                className="text-xs font-semibold text-foreground"
                title={marker.locationName}
              >
                {marker.locationName}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Address</p>
              <p
                className="text-xs font-semibold text-foreground"
                title={marker.address}
              >
                {marker.address?.length > 12
                  ? marker.address.slice(0, 12) + "..."
                  : marker.address}
              </p>
            </div>
          </div>

          {/* Pincode */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <Hash className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Pincode</p>
              <p className="text-xs font-semibold text-foreground">
                {marker.pincode}
              </p>
            </div>
          </div>

          {/* Billed Quantity */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">
                Billed Quantity
              </p>
              <p className="text-xs font-semibold text-foreground">
                {marker.billedQuantity}
              </p>
            </div>
          </div>

          {/* Total Invoice */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Total Invoice</p>
              <p className="text-xs font-semibold text-foreground">
                {marker.totalInvoice}
              </p>
            </div>
          </div>

          {/* On Time */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">On Time</p>
              <p className="text-xs font-semibold text-foreground">
                {marker.onTime} ({marker.onTimePercent}%)
              </p>
            </div>
          </div>

          {/* Delayed */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-md bg-red-100">
              <Clock className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Delayed</p>
              <p className="text-xs font-semibold text-foreground">
                {marker.delay} ({marker.delayPercent}%)
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarkerDetailCard;
