import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NeonMultiSelectProps<T extends string> {
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function NeonMultiSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled,
  error,
}: NeonMultiSelectProps<T>) {
  const toggle = (item: T) => {
    onChange(
      value.includes(item) ? value.filter((v) => v !== item) : [...value, item],
    );
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);
  const isAllSelected = value.length === options.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="ghost"
          role="combobox"
          className={cn(
            "min-h-[38px] w-full rounded-lg",
            "border border-input bg-background/60",
            "hover:bg-background/70",
            "focus-visible:ring-2 focus-visible:ring-primary/50",
            "transition-all",
            "flex items-start gap-2 px-3 py-2",
            error && "border-destructive",
          )}
        >
          <div className="flex flex-1 gap-1 overflow-hidden whitespace-nowrap">
            {value.length ? (
              value?.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {v}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="mt-1 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "p-0 rounded-lg border-primary/30",
          "w-[--radix-popover-trigger-width]",
        )}
        align="start"
      >
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={isAllSelected ? clearAll : selectAll}
              className="flex items-center gap-2 cursor-pointer font-semibold bg-muted/50"
            >
              <Check
                className={cn(
                  "h-4 w-4 text-primary",
                  isAllSelected ? "opacity-100" : "opacity-0",
                )}
              />
              {isAllSelected ? "Deselect All" : "Select All"}
            </CommandItem>
            {options?.map((option) => (
              <CommandItem
                key={option}
                onSelect={() => toggle(option)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Check
                  className={cn(
                    "h-4 w-4 text-primary",
                    value.includes(option) ? "opacity-100" : "opacity-0",
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
