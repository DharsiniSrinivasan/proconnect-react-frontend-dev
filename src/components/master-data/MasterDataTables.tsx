import React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TABLE COMPONENTS - Unified Design System
// ============================================================================

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div
    className={cn(
      "w-full overflow-x-auto rounded-lg border border-border/50",
      className,
    )}
  >
    <table className="w-full text-sm">{children}</table>
  </div>
);

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
}) => (
  <thead className={cn("bg-muted/30 border-b border-border/50", className)}>
    {children}
  </thead>
);

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  empty?: boolean;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className,
  empty,
}) => (
  <tbody className={cn("divide-y divide-border/30", className)}>
    {empty ? (
      <tr>
        <td
          colSpan={100}
          className="py-8 px-6 text-center text-muted-foreground"
        >
          No records found
        </td>
      </tr>
    ) : (
      children
    )}
  </tbody>
);

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  hover = true,
  selected = false,
  onClick,
}) => (
  <tr
    onClick={onClick}
    className={cn(
      "transition-all duration-200",
      hover && "hover:bg-primary/5",
      selected && "bg-primary/10",
      onClick && "cursor-pointer",
      className,
    )}
  >
    {children}
  </tr>
);

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className,
  sortable = false,
  sortDirection = null,
  onSort,
}) => (
  <th
    onClick={sortable ? onSort : undefined}
    className={cn(
      "px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap",
      sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
      className,
    )}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <div className="flex items-center">
          {sortDirection === "asc" && <ChevronUp className="w-4 h-4" />}
          {sortDirection === "desc" && <ChevronDown className="w-4 h-4" />}
          {!sortDirection && (
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  align = "left",
}) => (
  <td
    className={cn(
      "px-6 py-4",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className,
    )}
  >
    {children}
  </td>
);

interface TableStatusCellProps {
  status: "active" | "pending" | "archived" | "error" | "success";
  label?: string;
  icon?: React.ReactNode;
}

export const TableStatusCell: React.FC<TableStatusCellProps> = ({
  status,
  label,
  icon,
}) => {
  const statusConfig = {
    active: "bg-success/10 text-success border-success/30",
    pending: "bg-warning/10 text-warning border-warning/30",
    archived: "bg-muted/10 text-muted-foreground border-muted/30",
    error: "bg-error/10 text-error border-error/30",
    success: "bg-success/10 text-success border-success/30",
  };

  return (
    <td className="px-6 py-4">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
          statusConfig[status],
        )}
      >
        {icon}
        {label || status}
      </span>
    </td>
  );
};

interface TableActionsCellProps {
  actions: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
  }>;
}

export const TableActionsCell: React.FC<TableActionsCellProps> = ({
  actions,
}) => (
  <td className="px-6 py-4">
    <div className="flex items-center gap-1">
      {actions?.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          title={action.label}
          className={cn(
            "p-2 rounded transition-all duration-200",
            action.variant === "danger"
              ? "text-error hover:bg-error/10 border border-error/20"
              : "text-primary hover:bg-primary/10 border border-primary/20",
          )}
        >
          {action.icon}
        </button>
      ))}
    </div>
  </td>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-6 border-t border-border/30 bg-muted/20">
      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="items-per-page"
            className="text-sm text-muted-foreground"
          >
            Show
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="px-3 py-1.5 bg-card border border-border/50 rounded text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      )}

      {/* Center - Item info */}
      <div className="text-sm text-muted-foreground">
        {startItem}-{endItem} of {totalItems.toLocaleString()} items
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {/* Page info */}
          <span className="text-sm font-medium text-foreground px-2">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// FILTER & SEARCH COMPONENTS
// ============================================================================

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export const TableSearch: React.FC<TableSearchProps> = ({
  value,
  onChange,
  placeholder = "Search records...",
  loading = false,
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={loading}
      className="w-full px-4 py-2.5 pl-10 bg-card border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
    />
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface TableFilterProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  loading?: boolean;
}

export const TableFilter: React.FC<TableFilterProps> = ({
  label,
  options,
  selected,
  onChange,
  multiple = true,
  loading = false,
}) => {
  const handleChange = (value: string) => {
    if (multiple) {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    } else {
      onChange(selected[0] === value ? [] : [value]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="space-y-1">
        {options?.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 cursor-pointer transition-all"
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={label}
              checked={selected.includes(option.value)}
              onChange={() => handleChange(option.value)}
              disabled={loading}
              className="w-4 h-4 rounded border-border/50 text-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SKELETON LOADERS
// ============================================================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        {[...Array(columns)].map((_, i) => (
          <TableHead key={i}>
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// ============================================================================
// ADVANCED TABLE WITH BUILT-IN FEATURES
// ============================================================================

interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: string;
  rowKey: keyof T;
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalItems: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSort?: (column: keyof T, direction: "asc" | "desc") => void;
  selectedRows?: (keyof T)[];
  onRowSelect?: (rowKey: keyof T, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  actions?: (row: T) => Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
  }>;
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      data,
      columns,
      loading = false,
      error,
      rowKey,
      pagination,
      onPaginationChange,
      onSort,
      selectedRows = [],
      onRowSelect,
      onSelectAll,
      actions,
    },
    ref,
  ) => {
    const [sortConfig, setSortConfig] = React.useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);

    const handleSort = (columnKey: any) => {
      const newDirection =
        sortConfig?.key === columnKey && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key: String(columnKey), direction: newDirection });
      onSort?.(columnKey, newDirection);
    };

    if (error) {
      return (
        <div className="p-6 text-center text-error border border-error/30 rounded-lg bg-error/5">
          {error}
        </div>
      );
    }

    return (
      <div ref={ref} className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      data.length > 0 && selectedRows.length === data.length
                    }
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    disabled={loading || data.length === 0}
                    className="w-4 h-4 rounded border-border/50 text-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  sortable={column.sortable}
                  sortDirection={
                    sortConfig?.key === String(column.key)
                      ? sortConfig.direction
                      : null
                  }
                  onSort={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                  className={column.width}
                >
                  {column.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-12 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody empty={!loading && data.length === 0}>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {onRowSelect && (
                      <TableCell>
                        <div className="h-4 bg-muted/50 rounded animate-pulse" />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        <div className="h-4 bg-muted/50 rounded animate-pulse" />
                      </TableCell>
                    ))}
                    {actions && <TableCell children={""} />}
                  </TableRow>
                ))
              : data?.map((row) => (
                  <TableRow key={String(row[rowKey])}>
                    {onRowSelect && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row[rowKey])}
                          onChange={(e) =>
                            onRowSelect(row[rowKey], e.target.checked)
                          }
                          className="w-4 h-4 rounded border-border/50 text-primary focus:ring-2 focus:ring-primary/50"
                        />
                      </TableCell>
                    )}
                    {columns?.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                    {actions && <TableActionsCell actions={actions(row)} />}
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(pagination.totalItems / pagination.pageSize)}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.pageSize}
            onPageChange={(page) =>
              onPaginationChange?.(page, pagination.pageSize)
            }
            onItemsPerPageChange={(pageSize) =>
              onPaginationChange?.(1, pageSize)
            }
            loading={loading}
          />
        )}
      </div>
    );
  },
);

DataTable.displayName = "DataTable";
