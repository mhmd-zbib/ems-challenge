import { useSearchParams } from "react-router";
import { useState } from "react";

interface UseListManagementOptions {
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  defaultPage?: number;
  searchParamName?: string;
}

export function useListManagement(options: UseListManagementOptions = {}) {
  const {
    defaultSortBy = 'id',
    defaultSortOrder = 'asc',
    defaultPage = 1,
    searchParamName = 'search'
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(searchParamName) || ""
  );

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchTerm) {
        prev.set(searchParamName, searchTerm);
      } else {
        prev.delete(searchParamName);
      }
      prev.set("page", "1"); // Reset to first page on search
      return prev;
    });
  };

  // Sorting
  const handleSort = (column: string) => {
    setSearchParams(prev => {
      const currentSortBy = prev.get("sortBy") || defaultSortBy;
      const currentOrder = prev.get("sortOrder") || defaultSortOrder;

      if (currentSortBy === column) {
        prev.set("sortOrder", currentOrder === "asc" ? "desc" : "asc");
      } else {
        prev.set("sortBy", column);
        prev.set("sortOrder", defaultSortOrder);
      }
      return prev;
    });
  };

  // Pagination
  const currentPage = parseInt(searchParams.get("page") || String(defaultPage));
  
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  // Generic filter handler
  const handleFilter = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set("page", "1"); // Reset to first page on filter change
      return prev;
    });
  };

  return {
    // Search
    searchTerm,
    setSearchTerm,
    handleSearch,

    // Sort
    sortBy: searchParams.get("sortBy") || defaultSortBy,
    sortOrder: searchParams.get("sortOrder") || defaultSortOrder,
    handleSort,

    // Pagination
    currentPage,
    buildPageUrl,

    // Filters
    handleFilter,
    searchParams,
  };
} 