"use client";

import * as React from "react";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  showIcon?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  id = "date-picker",
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  buttonClassName = "",
  showIcon = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value,
  );

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false);
    onChange?.(date);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={`font-normal ${buttonClassName || "w-48"} flex items-center`}
          >
            {/* Group icon + text */}
            <div className="flex items-center gap-2">
              {showIcon && <CalendarIcon className="h-4 w-4 text-gray-500" />}
              <span className={selectedDate ? "" : "text-muted-foreground"}>
                {selectedDate ? selectedDate.toLocaleDateString() : placeholder}
              </span>
            </div>

            {/* Chevron stays on the far right */}
            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
