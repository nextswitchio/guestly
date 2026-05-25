import { DataTableColumn } from '@/components/ui/DataTable';
import { formatCurrency } from '@/lib/utils';

// Export utilities for common data table operations
export class DataTableExporter {
  static toCSV<T extends Record<string, any>>(
    data: T[], 
    columns: DataTableColumn<T>[], 
    filename: string = 'export'
  ): void {
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (col.exportRender) {
          return col.exportRender(value, row);
        }
        
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (value && typeof value === 'object' && 'toISOString' in value && typeof value.toISOString === 'function') {
          return value.toISOString();
        }
        
        return String(value);
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  static toJSON<T extends Record<string, any>>(
    data: T[], 
    columns: DataTableColumn<T>[], 
    filename: string = 'export'
  ): void {
    const exportData = data.map(row => {
      const exportRow: Record<string, any> = {};
      columns.forEach(col => {
        const value = row[col.key];
        if (col.exportRender) {
          exportRow[String(col.key)] = col.exportRender(value, row);
        } else {
          exportRow[String(col.key)] = value;
        }
      });
      return exportRow;
    });
    
    const json = JSON.stringify(exportData, null, 2);
    this.downloadFile(json, `${filename}.json`, 'application/json');
  }

  static toExcel<T extends Record<string, any>>(
    data: T[], 
    columns: DataTableColumn<T>[], 
    filename: string = 'export'
  ): void {
    // Simple TSV format that Excel can open
    const headers = columns.map(col => col.header).join('\t');
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (col.exportRender) {
          return col.exportRender(value, row);
        }
        
        if (value === null || value === undefined) return '';
        if (value && typeof value === 'object' && 'toLocaleDateString' in value && typeof value.toLocaleDateString === 'function') {
          return value.toLocaleDateString();
        }
        
        return String(value).replace(/\t/g, ' ');
      }).join('\t')
    );
    
    const tsv = [headers, ...rows].join('\n');
    this.downloadFile(tsv, `${filename}.xls`, 'application/vnd.ms-excel');
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Common column formatters
export const DataTableFormatters = {
  currency: (amount: number, currency?: string): string => {
    return formatCurrency(amount, currency);
  },

  date: (date: Date | string | number): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  dateTime: (date: Date | string | number): string => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  number: (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  percentage: (value: number, decimals: number = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  truncate: (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  badge: (
    value: string, 
    colorMap: Record<string, string> = {}
  ): React.ReactNode => {
    const color = colorMap[value] || 'bg-neutral-100 text-neutral-700';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {value}
      </span>
    );
  },
};

// Common filter functions
export const DataTableFilters = {
  textContains: <T extends Record<string, any>>(
    data: T[], 
    field: keyof T, 
    searchTerm: string
  ): T[] => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      String(item[field]).toLowerCase().includes(term)
    );
  },

  dateRange: <T extends Record<string, any>>(
    data: T[], 
    field: keyof T, 
    startDate: Date, 
    endDate: Date
  ): T[] => {
    return data.filter(item => {
      const itemDate = new Date(item[field] as string | number | Date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  },

  numberRange: <T extends Record<string, any>>(
    data: T[], 
    field: keyof T, 
    min: number, 
    max: number
  ): T[] => {
    return data.filter(item => {
      const value = Number(item[field]);
      return value >= min && value <= max;
    });
  },

  multiSelect: <T extends Record<string, any>>(
    data: T[], 
    field: keyof T, 
    selectedValues: any[]
  ): T[] => {
    if (selectedValues.length === 0) return data;
    return data.filter(item => selectedValues.includes(item[field]));
  },
};

// Validation helpers
export const DataTableValidators = {
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  phoneNumber: (value: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  },

  positiveNumber: (value: number): boolean => {
    return typeof value === 'number' && value > 0;
  },
};

// Common bulk actions
export const DataTableBulkActions = {
  delete: <T extends Record<string, any>>(
    selectedData: T[],
    onDelete: (items: T[]) => Promise<void>,
    confirmMessage?: string
  ) => {
    const message = confirmMessage || 
      `Are you sure you want to delete ${selectedData.length} item(s)? This action cannot be undone.`;
    
    if (window.confirm(message)) {
      return onDelete(selectedData);
    }
  },

  export: <T extends Record<string, any>>(
    selectedData: T[],
    columns: DataTableColumn<T>[],
    filename?: string
  ) => {
    const exportFilename = filename || `selected-data-${new Date().toISOString().split('T')[0]}`;
    DataTableExporter.toCSV(selectedData, columns, exportFilename);
  },

  updateStatus: <T extends Record<string, any>>(
    selectedData: T[],
    newStatus: string,
    onUpdate: (items: T[], status: string) => Promise<void>
  ) => {
    return onUpdate(selectedData, newStatus);
  },
};