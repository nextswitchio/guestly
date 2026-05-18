"use client";
import React, { useState, useMemo, useCallback } from "react";
import Button from "./Button";
import Input from "./Input";
import Icon, { IconName } from "./Icon";
import Checkbox from "./Checkbox";

// Types for the DataTable component
export interface DataTableColumn<T extends Record<string, any>> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  exportRender?: (value: T[keyof T], row: T) => string | number;
}

export interface DataTableAction<T extends Record<string, any>> {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface DataTableBulkAction<T extends Record<string, any>> {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick: (selectedRows: T[], selectedIndices: number[]) => void;
  disabled?: (selectedRows: T[]) => boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  
  // Sorting
  sortable?: boolean;
  defaultSort?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  
  // Selection
  selectable?: boolean;
  selectedRows?: number[];
  onSelectionChange?: (selectedIndices: number[]) => void;
  
  // Actions
  actions?: DataTableAction<T>[];
  bulkActions?: DataTableBulkAction<T>[];
  
  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Export
  exportable?: boolean;
  exportFilename?: string;
  onExport?: (data: T[], columns: DataTableColumn<T>[]) => void;
  
  // Styling
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  
  // Empty state
  emptyState?: {
    icon?: IconName;
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  sortable = true,
  defaultSort,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  actions,
  bulkActions,
  searchable = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  exportable = false,
  exportFilename = "data",
  onExport,
  className = "",
  rowClassName,
  emptyState,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(defaultSort || null);
  
  const [internalSearch, setInternalSearch] = useState(searchValue);

  // Handle sorting
  const handleSort = useCallback((key: keyof T) => {
    if (!sortable) return;
    
    const newDirection: 'asc' | 'desc' = 
      internalSort?.key === key && internalSort.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    const newSort = { key, direction: newDirection };
    setInternalSort(newSort);
    
    if (onSort) {
      onSort(key, newDirection);
    }
  }, [sortable, internalSort, onSort]);

  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setInternalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, [onSearchChange]);

  // Filter and sort data if no external handlers
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply search filter if no external handler
    if (searchable && !onSearchChange && internalSearch) {
      result = result.filter(row => 
        columns.some(col => {
          const value = row[col.key];
          return String(value).toLowerCase().includes(internalSearch.toLowerCase());
        })
      );
    }
    
    // Apply sorting if no external handler
    if (sortable && !onSort && internalSort) {
      result.sort((a, b) => {
        const aVal = a[internalSort.key];
        const bVal = b[internalSort.key];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return internalSort.direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [data, columns, searchable, onSearchChange, internalSearch, sortable, onSort, internalSort]);

  // Handle selection
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    
    const allSelected = selectedRows.length === processedData.length;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(processedData.map((_, index) => index));
    }
  }, [selectedRows, processedData, onSelectionChange]);

  const handleSelectRow = useCallback((index: number) => {
    if (!onSelectionChange) return;
    
    const newSelection = selectedRows.includes(index)
      ? selectedRows.filter(i => i !== index)
      : [...selectedRows, index];
    
    onSelectionChange(newSelection);
  }, [selectedRows, onSelectionChange]);

  // Handle export
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(processedData, columns);
      return;
    }
    
    // Default CSV export
    const headers = columns.map(col => col.header).join(',');
    const rows = processedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (col.exportRender) {
          return col.exportRender(value, row);
        }
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : String(value);
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportFilename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [processedData, columns, onExport, exportFilename]);

  // Get selected data
  const selectedData = useMemo(() => 
    selectedRows.map(index => processedData[index]).filter(Boolean),
    [selectedRows, processedData]
  );

  const isAllSelected = selectedRows.length === processedData.length && processedData.length > 0;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < processedData.length;

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-neutral-200 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-neutral-50 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-neutral-50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processedData.length === 0 && !loading) {
    return (
      <div className={`bg-white rounded-2xl border border-neutral-200 ${className}`}>
        <div className="p-12 text-center">
          {emptyState ? (
            <>
              {emptyState.icon && (
                <Icon name={emptyState.icon} size={48} className="mx-auto text-neutral-500 mb-4" />
              )}
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {emptyState.title}
              </h3>
              {emptyState.description && (
                <p className="text-neutral-500 mb-4">
                  {emptyState.description}
                </p>
              )}
              {emptyState.action && (
                <Button onClick={emptyState.action.onClick}>
                  {emptyState.action.label}
                </Button>
              )}
            </>
          ) : (
            <>
              <Icon name="table" size={48} className="mx-auto text-neutral-500 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No data found
              </h3>
              <p className="text-neutral-500">
                {searchable && internalSearch 
                  ? "No results match your search criteria."
                  : "No data available to display."
                }
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-neutral-200 ${className}`}>
      {/* Header with search, bulk actions, and export */}
      {(searchable || bulkActions?.length || exportable) && (
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Search */}
              {searchable && (
                <div className="relative">
                  <Input
                    value={internalSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    leftIcon={<Icon name="search" size={18} />}
                    className="w-64"
                  />
                </div>
              )}
              
              {/* Bulk Actions */}
              {bulkActions && selectedRows.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">
                    {selectedRows.length} selected
                  </span>
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'secondary'}
                      size="sm"
                      onClick={() => action.onClick(selectedData, selectedRows)}
                      disabled={action.disabled?.(selectedData)}
                      icon={action.icon}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Export */}
            {exportable && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                icon="download"
              >
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${
                    column.sortable !== false && sortable ? 'cursor-pointer hover:bg-neutral-50' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortable && (
                      <div className="flex flex-col">
                        <Icon
                          name="chevron-up"
                          size={12}
                          className={`${
                            internalSort?.key === column.key && internalSort.direction === 'asc'
                              ? 'text-lime'
                              : 'text-neutral-500'
                          }`}
                        />
                        <Icon
                          name="chevron-down"
                          size={12}
                          className={`-mt-1 ${
                            internalSort?.key === column.key && internalSort.direction === 'desc'
                              ? 'text-lime'
                              : 'text-neutral-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions column */}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {processedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-neutral-50 transition-colors ${
                  rowClassName ? rowClassName(row, index) : ''
                }`}
              >
                {/* Selection column */}
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.includes(index)}
                      onChange={() => handleSelectRow(index)}
                    />
                  </td>
                )}
                
                {/* Data columns */}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-3 text-sm text-neutral-900 ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, index)
                      : String(row[column.key] ?? '')
                    }
                  </td>
                ))}
                
                {/* Actions column */}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, actionIndex) => {
                        if (action.hidden?.(row)) return null;
                        
                        return (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'ghost'}
                            size="sm"
                            onClick={() => action.onClick(row, index)}
                            disabled={action.disabled?.(row)}
                            icon={action.icon}
                          >
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-500">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            {pagination.onPageSizeChange && pagination.pageSizeOptions && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Show:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onPageSizeChange!(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-neutral-200 rounded bg-neutral-50 text-neutral-900"
                >
                  {pagination.pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              icon="chevron-left"
            >
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm text-neutral-900">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              icon="chevron-right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}