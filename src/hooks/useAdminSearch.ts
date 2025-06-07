
import { useState, useMemo } from "react";

interface UseAdminSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  dateFields?: (keyof T)[];
}

export const useAdminSearch = <T extends Record<string, any>>({
  data,
  searchFields,
  dateFields = []
}: UseAdminSearchProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<{
    start?: string;
    end?: string;
  }>({});

  const filteredData = useMemo(() => {
    if (!searchQuery && !dateFilter.start && !dateFilter.end) {
      return data;
    }

    return data.filter((item) => {
      // Text search
      const matchesSearch = !searchQuery || searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        // For nested objects (like teams.name)
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

      // Date filter
      const matchesDate = !dateFilter.start && !dateFilter.end || dateFields.some(field => {
        const dateValue = item[field];
        if (!dateValue) return false;

        const itemDate = new Date(dateValue);
        const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
        const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        
        return true;
      });

      return matchesSearch && (dateFields.length === 0 || matchesDate);
    });
  }, [data, searchQuery, dateFilter, searchFields, dateFields]);

  return {
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    filteredData,
    resultCount: filteredData.length,
    totalCount: data.length
  };
};
