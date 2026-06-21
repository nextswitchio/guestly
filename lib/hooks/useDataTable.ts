"use client";
import { useState, useCallback, useMemo } from 'react';

export interface UseDataTableOptions<T extends Record<string, any>> {
  data: T[];
  defaultPageSize?: number;
  defaultSort?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
  searchFields?: (keyof T)[];
}

export interface UseDataTableReturn<T extends Record<string, any>> {
  // Pagination
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Sorting
  sortKey: keyof T | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (key: keyof T) => void;
  
  // Search
  searchValue: string;
  setSearchValue: (value: string) => void;
  
  // Selection
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  
  // Processed data
  filteredData: T[];
  paginatedData: T[];
  selectedData: T[];
  
  // Stats
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export function useDataTable<T extends Record<string, any>>({
  data,
  defaultPageSize = 10,
  defaultSort,
  searchFields = [],
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSort?.key || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSort?.direction || 'asc');
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Handle sorting
  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1); // Reset to first page when sorting
  }, [sortKey]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    
    const searchLower = searchValue.toLowerCase();
    return data.filter(item => {
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field];
          return String(value).toLowerCase().includes(searchLower);
        });
      } else {
        // Search all string fields if no specific fields provided
        return Object.values(item).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(searchLower)
        );
      }
    });
  }, [data, searchValue, searchFields]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal === bVal) return 0;
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, pageSize]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const totalItems = sortedData.length;
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalItems);

  // Selection helpers
  const selectAll = useCallback(() => {
    const allIndices = paginatedData.map((_, index) => (page - 1) * pageSize + index);
    setSelectedRows(allIndices);
  }, [paginatedData, page, pageSize]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const isAllSelected = selectedRows.length === paginatedData.length && paginatedData.length > 0;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < paginatedData.length;

  // Get selected data
  const selectedData = useMemo(() => {
    return selectedRows.map(index => sortedData[index]).filter(Boolean);
  }, [selectedRows, sortedData]);

  // Reset page when page size changes
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  // Reset selection when data changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setSelectedRows([]);
    setPage(1);
  }, []);

  return {
    // Pagination
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize: handlePageSizeChange,
    
    // Sorting
    sortKey,
    sortDirection,
    handleSort,
    
    // Search
    searchValue,
    setSearchValue: handleSearchChange,
    
    // Selection
    selectedRows,
    setSelectedRows,
    selectAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
    
    // Processed data
    filteredData: sortedData,
    paginatedData,
    selectedData,
    
    // Stats
    totalItems,
    startIndex,
    endIndex,
  };
}