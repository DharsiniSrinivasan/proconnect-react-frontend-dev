import * as React from "react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboBoxOption<T = any> {
  id: string | number;
  value: string; // displayed in UI and used for search
  data?: T; // optional full object
}

interface ComboBoxProps<T = any> {
  options: ComboBoxOption<T>[];
  selectedValue: string | number | ""; // allow empty string for clearing
  onValueChange: (id: string | number | "") => void;
  placeholder?: string;
  width?: string;
  renderOption?: (
    option: ComboBoxOption<T>,
    selected: boolean,
  ) => React.ReactNode;
  renderSelected?: (option?: ComboBoxOption<T>) => React.ReactNode;
  onBlur?: () => void; // optional blur callback (for Formik)
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select...",
  width = "200px",
  renderOption,
  renderSelected,
  onBlur,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Find selected option from options
  const selectedOption = options.find((o) => o.id === selectedValue);

  // Filter options based on search input
  const filteredOptions = search
    ? options.filter((o) =>
        o.value.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between hover:bg-transparent py-4 hover:text-inherit",
            !selectedOption && "text-muted-foreground",
          )}
          onBlur={onBlur}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* <Search className="h-4 w-4 shrink-0 opacity-50" /> */}
            <span className="flex-1 text-left truncate">
              {renderSelected
                ? renderSelected(selectedOption)
                : selectedOption?.value || placeholder}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup className="max-h-64 overflow-y-auto">
            <CommandItem
              key="__clear"
              onSelect={() => {
                onValueChange("");
                setOpen(false);
                setSearch("");
              }}
            >
              <Check className="mr-2 h-4 w-4 opacity-0" />
              Clear Selection
            </CommandItem>

            {filteredOptions?.map((option) => (
              <CommandItem
                key={option.id}
                value={`${option.value}__${option.id}`}
                onSelect={() => {
                  onValueChange(option.id);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {renderOption
                  ? renderOption(option, selectedValue === option.id)
                  : option.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
