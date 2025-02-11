import { useSearchParams } from "react-router";

interface UseSortOptions {
  sortByParam?: string;
  sortOrderParam?: string;
  defaultSortBy?: string;
  defaultOrder?: 'asc' | 'desc';
}

export function useSort({
  sortByParam = "sortBy",
  sortOrderParam = "sortOrder",
  defaultSortBy = "id",
  defaultOrder = "asc"
}: UseSortOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortBy = searchParams.get(sortByParam) || defaultSortBy;
  const currentOrder = searchParams.get(sortOrderParam) || defaultOrder;

  const handleSort = (column: string) => {
    setSearchParams(prev => {
      if (currentSortBy === column) {
        prev.set(sortOrderParam, currentOrder === "asc" ? "desc" : "asc");
      } else {
        prev.set(sortByParam, column);
        prev.set(sortOrderParam, defaultOrder);
      }
      prev.set("page", "1"); // Reset to first page on sort change
      return prev;
    });
  };

  const clearSort = () => {
    setSearchParams(prev => {
      prev.delete(sortByParam);
      prev.delete(sortOrderParam);
      return prev;
    });
  };

  return {
    sortBy: currentSortBy,
    sortOrder: currentOrder,
    handleSort,
    clearSort
  };
} 