"use client";

import React, { useState, useRef } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Calendar as CalendarIcon,
  Check,
} from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type SortOrder = "A_TO_Z" | "Z_TO_A" | null;

interface SortableTableHeadProps {
  label: string;
  sortKey: string;
  currentSortBy: string | null;
  currentSortOrder: string;
  onSort: (sortKey: string | null, sortOrder: string) => void;
  selectPlaceholder?: string;

  // text search
  searchable?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;

  // single select filter
  selectable?: boolean;
  options?: { label: string; value: string }[];
  selectedValue?: string;
  onSelect?: (value: string) => void;

  // multiselect filter
  multiselectable?: boolean;
  multiselectOptions?: { label: string; value: string }[];
  selectedValues?: string[];
  onMultiSelect?: (values: string[]) => void;
  multiselectPlaceholder?: string;

  // date picker filter
  datepicker?: boolean;
  dateValue?: Date | null;
  onDateSelect?: (date: Date | null) => void;
  datePlaceholder?: string;

  // date range picker filter
  dateRangePicker?: boolean;
  dateRangeValue?: { from: Date | null; to: Date | null };
  onDateRangeSelect?: (range: { from: Date | null; to: Date | null }) => void;
  dateRangePlaceholder?: string;

  className?: string;
}

export function SortableTableHead({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  searchable = false,
  searchValue = "",
  onSearch,
  selectable = false,
  options = [],
  selectedValue = "",
  onSelect,
  multiselectable = false,
  multiselectOptions = [],
  selectedValues = [],
  onMultiSelect,
  multiselectPlaceholder,
  datepicker = false,
  dateValue = null,
  onDateSelect,
  datePlaceholder,
  dateRangePicker = false,
  dateRangeValue = { from: null, to: null },
  onDateRangeSelect,
  dateRangePlaceholder,
  className,
  selectPlaceholder,
}: SortableTableHeadProps) {
  const ALL_VALUE = "all";
  const selectPlaceholderText = selectPlaceholder ?? `All ${label}`;
  const multiselectPlaceholderText =
    multiselectPlaceholder ?? `Select ${label}`;
  const datePlaceholderText = datePlaceholder ?? "Pick a date";
  const dateRangePlaceholderText = dateRangePlaceholder ?? "Pick date range";

  const isActive = currentSortBy === sortKey;
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isDateRangePopoverOpen, setIsDateRangePopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSortAsc = () => {
    onSort(sortKey, "A_TO_Z");
    setIsOpen(false);
  };

  const handleSortDesc = () => {
    onSort(sortKey, "Z_TO_A");
    setIsOpen(false);
  };

  const handleClearSort = () => {
    onSort(null, null);
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const handleClearSearch = () => {
    onSearch?.("");
  };

  const handleSelectChange = (value: string) => {
    onSelect?.(value);
    setIsOpen(false);
  };

  const handleClearSelect = () => {
    onSelect?.(ALL_VALUE);
  };

  const handleMultiSelectToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onMultiSelect?.(newValues);
  };

  const handleClearMultiSelect = () => {
    onMultiSelect?.([]);
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect?.(date || null);
    setIsDatePopoverOpen(false);
  };

  const handleClearDate = () => {
    onDateSelect?.(null);
  };

  const handleDateRangeSelect = (range: {
    from: Date | undefined;
    to?: Date | undefined;
  }) => {
    const newRange = {
      from: range.from || null,
      to: range.to || null,
    };
    onDateRangeSelect?.(newRange);
  };

  const handleClearDateRange = () => {
    const emptyRange = { from: null, to: null };
    onDateRangeSelect?.(emptyRange);
    setIsDateRangePopoverOpen(false);
  };

  const hasFilter = Boolean(
    searchValue ||
    (selectedValue && selectedValue !== ALL_VALUE) ||
    (selectedValues && selectedValues.length > 0) ||
    dateValue ||
    dateRangeValue?.from ||
    dateRangeValue?.to,
  );

  return (
    <TableHead
      className={cn(
        "text-muted-foreground select-none",
        isActive && "text-foreground",
        className,
      )}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors w-full text-left"
          >
            <span className="text-xm">{label}</span>

            {hasFilter && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}

            <span className="w-4 h-4 flex items-center justify-center">
              {isActive ? (
                currentSortOrder === "Z_TO_A" ? (
                  <ArrowDown  className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5" />
                )
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
              )}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          {/* 🔍 Search */}
          {searchable && (
            <>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder={`Search ${label}...`}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="h-8 pl-8 pr-8 text-sm truncate"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Single Select filter */}
          {selectable && (
            <>
              <div className="p-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedValue || ALL_VALUE}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="h-8 text-sm flex-1">
                      <SelectValue placeholder={selectPlaceholderText} />
                    </SelectTrigger>

                    <SelectContent align="start">
                      <SelectItem value={ALL_VALUE}>
                        {selectPlaceholderText}
                      </SelectItem>

                      {options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedValue && selectedValue !== ALL_VALUE && (
                    <button
                      type="button"
                      onClick={handleClearSelect}
                      className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Multiselect filter */}
          {multiselectable && (
            <>
              <div className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {multiselectPlaceholderText}
                    </span>
                    {selectedValues.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearMultiSelect}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  {selectedValues.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedValues?.map((value) => {
                        const option = multiselectOptions.find(
                          (opt) => opt.value === value,
                        );
                        return (
                          <Badge
                            key={value}
                            variant="secondary"
                            className="text-xs h-5 px-1.5"
                          >
                            {option?.label || value}
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {multiselectOptions?.map((option) => (
                      <button
                        key={option.value}
                        className="w-full flex items-center justify-between p-1.5 rounded cursor-pointer"
                        onClick={() => handleMultiSelectToggle(option.value)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedValues.includes(option.value)}
                            onCheckedChange={() =>
                              handleMultiSelectToggle(option.value)
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{option.label}</span>
                        </div>
                        {selectedValues.includes(option.value) && (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Date Picker */}
          {datepicker && (
            <>
              <div className="p-2">
                <Popover
                  open={isDatePopoverOpen}
                  onOpenChange={setIsDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-8 justify-start text-left text-sm font-normal hover:text-primary-foreground",
                        !dateValue && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateValue
                        ? format(dateValue, "PPP")
                        : datePlaceholderText}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue || undefined}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                    {dateValue && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearDate}
                          className="w-full h-8 text-xs"
                        >
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Date Range Picker */}
          {dateRangePicker && (
            <>
              <div className="p-2">
                <Popover
                  open={isDateRangePopoverOpen}
                  onOpenChange={setIsDateRangePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-8 justify-start text-left text-sm font-normal",
                        !dateRangeValue.from &&
                        !dateRangeValue.to &&
                        "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateRangeValue.from ? (
                        dateRangeValue.to ? (
                          <>
                            {format(dateRangeValue.from, "LLL dd")} -{" "}
                            {format(dateRangeValue.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRangeValue.from, "LLL dd, y")
                        )
                      ) : (
                        dateRangePlaceholderText
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRangeValue.from || undefined,
                        to: dateRangeValue.to || undefined,
                      }}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                      initialFocus
                    />
                    {(dateRangeValue.from || dateRangeValue.to) && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearDateRange}
                          className="w-full h-8 text-xs"
                        >
                          Clear Range
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* ↕ Sort */}
          <DropdownMenuItem onClick={handleSortAsc}>
            <ArrowUp className="w-4 h-4 mr-2" />
            Sort A to Z
            {isActive && currentSortOrder === "A_TO_Z" && (
              <span className="ml-auto text-primary text-xs">Active</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSortDesc}>
            <ArrowDown className="w-4 h-4 mr-2" />
            Sort Z to A
            {isActive && currentSortOrder === "Z_TO_A" && (
              <span className="ml-auto text-primary text-xs">Active</span>
            )}
          </DropdownMenuItem>

          {isActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClearSort}>
                <X className="w-4 h-4 mr-2" />
                Clear Sort
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}
