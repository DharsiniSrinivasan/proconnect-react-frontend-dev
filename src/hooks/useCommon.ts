/**
 * Custom Hooks
 * Reusable hooks for common patterns across the application
 */

import { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Debounced value hook
 * Useful for search inputs to avoid excessive filtering/API calls
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Pagination hook
 * Manages pagination state for tables and lists
 */
export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Reset to page 1 if current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  };
}

/**
 * Sorting hook
 * Manages sort state for tables
 */
export type SortDirection = "asc" | "desc" | null;

export interface UseSortingOptions<T> {
  data: T[];
  initialSortKey?: keyof T;
  initialDirection?: SortDirection;
}

export interface UseSortingReturn<T> {
  sortedData: T[];
  sortKey: keyof T | null;
  sortDirection: SortDirection;
  toggleSort: (key: keyof T) => void;
  clearSort: () => void;
}

export function useSorting<T>({
  data,
  initialSortKey = null,
  initialDirection = null,
}: UseSortingOptions<T> & {
  initialSortKey?: keyof T | null;
}): UseSortingReturn<T> {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const toggleSort = useCallback(
    (key: keyof T) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDirection("asc");
      } else {
        setSortDirection((prevDir) => {
          if (prevDir === "asc") return "desc";
          if (prevDir === "desc") return null;
          return "asc";
        });
        if (sortDirection === "desc") {
          setSortKey(null);
        }
      }
    },
    [sortKey, sortDirection],
  );

  const clearSort = useCallback(() => {
    setSortKey(null);
    setSortDirection(null);
  }, []);

  return {
    sortedData,
    sortKey,
    sortDirection,
    toggleSort,
    clearSort,
  };
}

/**
 * Loading state hook with simulated delay
 * Useful for showing skeletons during initial load
 */
export function useLoadingDelay(delayMs: number = 600): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}

/**
 * Local storage hook with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
