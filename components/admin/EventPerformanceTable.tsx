"use client";
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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

type SortBy = 'revenue' | 'attendance' | 'date' | 'title' | 'ticketsSold' | 'conversionRate';
type SortOrder = 'asc' | 'desc';

interface EventPerformanceTableProps {
  onEventClick?: (eventId: string) => void;
}

export default function EventPerformanceTable({ onEventClick }: EventPerformanceTableProps) {
  const [events, setEvents] = useState<EventPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventPerformanceFilters>({});
  const [sortBy, setSortBy] = useState<SortBy>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Add sorting and pagination
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('pageSize', '20');
      
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
  }, [filters, sortBy, sortOrder, page]);

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleFilterChange = (key: keyof EventPerformanceFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: EventPerformanceData['status']) => {
    const statusConfig = {
      upcoming: { color: 'bg-primary-50 text-primary-700', label: 'Upcoming' },
      ongoing: { color: 'bg-success-50 text-success-700', label: 'Live' },
      completed: { color: 'bg-neutral-100 text-neutral-700', label: 'Completed' },
      cancelled: { color: 'bg-danger-50 text-danger-700', label: 'Cancelled' },
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) {
      return <Icon name="chevron-up" size={16} className="text-neutral-400" />;
    }
    return (
      <Icon 
        name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'} 
        size={16} 
        className="text-primary-600" 
      />
    );
  };

  if (loading && events.length === 0) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-danger-600">
          <Icon name="alert-circle" size={48} className="mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading events</p>
          <p className="text-sm text-neutral-600 mt-2">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Event Performance</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {total} events • Page {page} of {totalPages}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Icon name="filter" size={16} />}
          >
            Filters
          </Button>
          <Button
            variant="secondary"
            onClick={fetchEvents}
            leftIcon={<Icon name="refresh-cw" size={16} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
              >
                <option value="">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
              >
                <option value="">All Categories</option>
                <option value="Music">Music</option>
                <option value="Tech">Tech</option>
                <option value="Art">Art</option>
                <option value="Food">Food</option>
                <option value="Cultural">Cultural</option>
                <option value="Faith">Faith</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                City
              </label>
              <Input
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Filter by city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Event Type
              </label>
              <select
                value={filters.eventType || ''}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
              >
                <option value="">All Types</option>
                <option value="Physical">Physical</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--surface-border)]">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>
            
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Events Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--surface-bg)] border-b border-[var(--surface-border)]">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Event
                    {getSortIcon('title')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {getSortIcon('date')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => handleSort('ticketsSold')}
                >
                  <div className="flex items-center gap-2">
                    Tickets Sold
                    {getSortIcon('ticketsSold')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center gap-2">
                    Revenue
                    {getSortIcon('revenue')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => handleSort('conversionRate')}
                >
                  <div className="flex items-center gap-2">
                    Conversion
                    {getSortIcon('conversionRate')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--surface-border)]">
              {events.map((event) => (
                <tr 
                  key={event.id} 
                  className="hover:bg-[var(--surface-hover)] cursor-pointer"
                  onClick={() => onEventClick?.(event.id)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {event.title}
                      </div>
                      <div className="text-sm text-[var(--foreground-muted)]">
                        {event.category} • {event.city}, {event.country}
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)]">
                        {event.eventType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {event.ticketsSold.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      of {event.totalTickets.toLocaleString()}
                    </div>
                    {event.attendanceRate !== undefined && (
                      <div className="text-xs text-success-600">
                        {event.attendanceRate.toFixed(1)}% attendance
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {formatCurrency(event.revenue)}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {event.orders} orders
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {formatCurrency(event.averageOrderValue)} avg
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {event.conversionRate.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event.id);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--surface-border)] flex items-center justify-between">
            <div className="text-sm text-[var(--foreground-muted)]">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} events
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                leftIcon={<Icon name="chevron-left" size={16} />}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-[var(--foreground)]">
                {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                rightIcon={<Icon name="chevron-right" size={16} />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {events.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Icon name="calendar" size={48} className="mx-auto mb-4 text-neutral-400" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No events found</h3>
          <p className="text-[var(--foreground-muted)]">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters to see more events.'
              : 'No events have been created yet.'
            }
          </p>
        </Card>
      )}
    </div>
  );
}