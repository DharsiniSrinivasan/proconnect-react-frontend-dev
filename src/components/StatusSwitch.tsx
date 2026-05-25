import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StatusSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const StatusSwitch = ({ checked, onCheckedChange, disabled }: StatusSwitchProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "data-[state=checked]:bg-primary mt-1 data-[state=unchecked]:bg-muted-foreground/25",
          "h-[18px] w-[40px] transition-colors duration-200"
        )}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={checked ? "active" : "inactive"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "text-[11px] font-semibold mt-1 uppercase tracking-widest rounded-full px-2.5 py-0.5",
            checked
              ? "text-primary bg-success-muted"
              : "text-muted-foreground bg-muted"
          )}
        >
          {checked ? "Active" : "Inactive"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default StatusSwitch;
