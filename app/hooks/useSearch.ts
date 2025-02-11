import { useState } from "react";
import { useSearchParams } from "react-router";

interface UseSearchOptions {
  searchParamName?: string;
  defaultValue?: string;
}

export function useSearch({ 
  searchParamName = "search",
  defaultValue = ""
}: UseSearchOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(searchParamName) || defaultValue
  );

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

  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams(prev => {
      prev.delete(searchParamName);
      prev.set("page", "1");
      return prev;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    clearSearch
  };
} 