import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onCheckedChange,
  className = "",
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Set the indeterminate state on the underlying input
      const input = ref.current.querySelector("input") as HTMLInputElement;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={className}
    />
  );
};
