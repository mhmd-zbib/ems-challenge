import { useSearchParams } from "react-router";

interface UsePaginationOptions {
  pageParam?: string;
  defaultPage?: number;
}

export function usePagination({
  pageParam = "page",
  defaultPage = 1
}: UsePaginationOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get(pageParam) || String(defaultPage));

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, newPage.toString());
    return `?${params.toString()}`;
  };

  const setPage = (newPage: number) => {
    setSearchParams(prev => {
      prev.set(pageParam, newPage.toString());
      return prev;
    });
  };

  return {
    currentPage,
    buildPageUrl,
    setPage
  };
} 