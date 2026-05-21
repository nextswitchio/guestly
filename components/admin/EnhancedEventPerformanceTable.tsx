"use client";
import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction, DataTableBulkAction } from '@/components/ui/DataTable';
import { DataTableFormatters, DataTableExporter } from '@/lib/utils/dataTableUtils';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

type EventPerformanceData = {
  id: string;
  title: string;
  date: string;
  category: string;
  city: string;
  country: string;
  eventType: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  orders: number;
  conversionRate: number;
  averageOrderValue: number;
  attendanceRate?: number;
};

type EventPerformanceFilters = {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  city?: string;
  country?: string;
  eventType?: 'Physical' | 'Virtual' | 'Hybrid';
  dateFrom?: string;
  dateTo?: string;
};

interface EnhancedEventPerformanceTableProps {
  onEventClick?: (eventId: string) => void;
  onBulkStatusUpdate?: (eventIds: string[], status: string) => void;
  onEventDelete?: (eventId: string) => void;
}

export default function EnhancedEventPerformanceTable({ 
  onEventClick,
  onBulkStatusUpdate,
  onEventDelete
}: EnhancedEventPerformanceTableProps) {
  const [events, setEvents] = useState<EventPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventPerformanceFilters>({});
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<keyof EventPerformanceData>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Add sorting and pagination
      params.append('sortBy', String(sortBy));
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      const response = await fetch(`/api/admin/events/performance?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data.events);
        setTotalPages(result.data.totalPages);
        setTotal(result.data.total);
      } else {
        setError(result.error?.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters, sortBy, sortOrder, page, pageSize]);

  // Handle sorting
  const handleSort = (key: keyof EventPerformanceData, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
  };

  // Define table columns
  const columns: DataTableColumn<EventPerformanceData>[] = useMemo(() => [
    {
      key: 'title',
      header: 'Event',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-slate-900 cursor-pointer hover:text-primary-600"
               onClick={() => onEventClick?.(row.id)}>
            {row.title}
          </div>
          <div className="text-sm text-slate-500">
            {row.category} • {row.city}, {row.country}
          </div>
          <div className="text-xs text-slate-500">
            {row.eventType}
          </div>
        </div>
      ),
      exportRender: (value, row) => `${row.title} (${row.category}, ${row.city})`,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-slate-900">
          {value ? DataTableFormatters.date(value) : '-'}
        </span>
      ),
      exportRender: (value) => value ? DataTableFormatters.date(value) : '-',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          upcoming: { color: 'bg-primary-50 text-primary-700', label: 'Upcoming' },
          ongoing: { color: 'bg-success-50 text-success-700', label: 'Live' },
          completed: { color: 'bg-neutral-100 text-neutral-700', label: 'Completed' },
          cancelled: { color: 'bg-danger-50 text-danger-700', label: 'Cancelled' },
        };
        
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
      exportRender: (value) => String(value),
    },
    {
      key: 'ticketsSold',
      header: 'Tickets Sold',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900">
            {DataTableFormatters.number(row.ticketsSold)}
          </div>
          <div className="text-xs text-slate-500">
            of {DataTableFormatters.number(row.totalTickets)}
          </div>
          {row.attendanceRate !== undefined && (
            <div className="text-xs text-success-600">
              {DataTableFormatters.percentage(row.attendanceRate / 100)} attendance
            </div>
          )}
        </div>
      ),
      exportRender: (value, row) => `${row.ticketsSold}/${row.totalTickets}`,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900">
            {DataTableFormatters.currency(row.revenue, 'NGN')}
          </div>
          <div className="text-xs text-slate-500">
            {row.orders} orders
          </div>
          <div className="text-xs text-slate-500">
            {DataTableFormatters.currency(row.averageOrderValue, 'NGN')} avg
          </div>
        </div>
      ),
      exportRender: (value) => value ? DataTableFormatters.currency(Number(value), 'NGN') : '₦0',
    },
    {
      key: 'conversionRate',
      header: 'Conversion',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="text-center">
          <div className="text-sm font-medium text-slate-900">
            {value ? DataTableFormatters.percentage(Number(value) / 100) : '-'}
          </div>
        </div>
      ),
      exportRender: (value) => value ? DataTableFormatters.percentage(Number(value) / 100) : '-',
    },
  ], [onEventClick]);

  // Define row actions
  const actions: DataTableAction<EventPerformanceData>[] = useMemo(() => [
    {
      label: 'View Details',
      icon: 'eye',
      variant: 'ghost',
      onClick: (event) => onEventClick?.(event.id),
    },
    {
      label: 'Edit',
      icon: 'edit',
      variant: 'ghost',
      onClick: (event) => {
        // Navigate to edit page
        window.location.href = `/dashboard/events/${event.id}/edit`;
      },
      hidden: (event) => event.status === 'completed' || event.status === 'cancelled',
    },
    {
      label: 'Cancel',
      icon: 'x-circle',
      variant: 'danger',
      onClick: (event) => {
        if (window.confirm(`Are you sure you want to cancel "${event.title}"?`)) {
          onBulkStatusUpdate?.([event.id], 'cancelled');
        }
      },
      hidden: (event) => event.status !== 'upcoming',
    },
    {
      label: 'Delete',
      icon: 'trash-2',
      variant: 'danger',
      onClick: (event) => {
        if (window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
          onEventDelete?.(event.id);
        }
      },
      disabled: (event) => event.status === 'ongoing',
    },
  ], [onEventClick, onBulkStatusUpdate, onEventDelete]);

  // Define bulk actions
  const bulkActions: DataTableBulkAction<EventPerformanceData>[] = useMemo(() => [
    {
      label: 'Mark as Featured',
      icon: 'star',
      variant: 'secondary',
      onClick: (selectedEvents) => {
        // Implement featured marking logic
      },
      disabled: (selectedEvents) => selectedEvents.some(e => e.status === 'cancelled'),
    },
    {
      label: 'Cancel Selected',
      icon: 'x-circle',
      variant: 'secondary',
      onClick: (selectedEvents) => {
        const eventTitles = selectedEvents.map(e => e.title).join(', ');
        if (window.confirm(`Cancel ${selectedEvents.length} events?\n\n${eventTitles}`)) {
          onBulkStatusUpdate?.(selectedEvents.map(e => e.id), 'cancelled');
          setSelectedRows([]);
        }
      },
      disabled: (selectedEvents) => selectedEvents.some(e => e.status !== 'upcoming'),
    },
    {
      label: 'Export Selected',
      icon: 'download',
      variant: 'secondary',
      onClick: (selectedEvents) => {
        DataTableExporter.toCSV(
          selectedEvents, 
          columns, 
          `selected-events-${new Date().toISOString().split('T')[0]}`
        );
      },
    },
  ], [columns, onBulkStatusUpdate]);

  // Custom export handler
  const handleExport = (data: EventPerformanceData[], cols: DataTableColumn<EventPerformanceData>[]) => {
    DataTableExporter.toCSV(data, cols, `events-performance-${new Date().toISOString().split('T')[0]}`);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="text-center text-danger-600">
          <Icon name="alert-circle" size={48} className="mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading events</p>
          <p className="text-sm text-neutral-600 mt-2">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Event Performance</h2>
          <p className="text-sm text-slate-500">
            Monitor and analyze event performance metrics
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={fetchEvents}
          icon="refresh-cw"
        >
          Refresh
        </Button>
      </div>

      {/* Enhanced DataTable */}
      <DataTable
        data={events}
        columns={columns}
        loading={loading}
        
        // Pagination
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        
        // Sorting
        sortable={true}
        onSort={handleSort}
        
        // Selection
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        
        // Actions
        actions={actions}
        bulkActions={bulkActions}
        
        // Search
        searchable={true}
        searchPlaceholder="Search events by title, category, or city..."
        
        // Export
        exportable={true}
        exportFilename="event-performance"
        onExport={handleExport}
        
        // Empty state
        emptyState={{
          icon: 'calendar',
          title: 'No events found',
          description: 'No events match your current filters. Try adjusting your search criteria.',
        }}
        
        className="shadow-sm"
      />
    </div>
  );
}