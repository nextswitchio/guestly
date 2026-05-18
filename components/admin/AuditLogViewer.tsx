'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';

interface AuditLog {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
}

interface AuditLogViewerProps {
  className?: string;
}

const actionIcons: Record<string, string> = {
  user_role_changed: 'user',
  user_status_changed: 'user',
  event_featured: 'eye',
  event_unfeatured: 'eye',
  dispute_created: 'alert-triangle',
  dispute_assigned: 'alert-triangle',
  dispute_resolved: 'shield',
  dispute_rejected: 'alert-triangle',
  refund_processed: 'credit-card',
  announcement_created: 'bell',
  announcement_published: 'bell',
  announcement_deleted: 'bell',
  commission_settled: 'credit-card',
  fraud_alert_created: 'alert-triangle',
  fraud_alert_resolved: 'shield',
  platform_settings_changed: 'settings',
  admin_login: 'user',
  admin_logout: 'user',
};

const actionColors: Record<string, string> = {
  user_role_changed: 'bg-blue-100 text-blue-800',
  user_status_changed: 'bg-blue-100 text-blue-800',
  event_featured: 'bg-green-100 text-green-800',
  event_unfeatured: 'bg-yellow-100 text-yellow-800',
  dispute_created: 'bg-red-100 text-red-800',
  dispute_assigned: 'bg-orange-100 text-orange-800',
  dispute_resolved: 'bg-green-100 text-green-800',
  dispute_rejected: 'bg-red-100 text-red-800',
  refund_processed: 'bg-purple-100 text-purple-800',
  announcement_created: 'bg-blue-100 text-blue-800',
  announcement_published: 'bg-green-100 text-green-800',
  announcement_deleted: 'bg-red-100 text-red-800',
  commission_settled: 'bg-green-100 text-green-800',
  fraud_alert_created: 'bg-red-100 text-red-800',
  fraud_alert_resolved: 'bg-green-100 text-green-800',
  platform_settings_changed: 'bg-gray-100 text-gray-800',
  admin_login: 'bg-blue-100 text-blue-800',
  admin_logout: 'bg-gray-100 text-gray-800',
};

export function AuditLogViewer({ className }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    adminUserId: '',
    action: '',
    targetType: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.adminUserId) params.append('adminUserId', filters.adminUserId);
      if (filters.action) params.append('action', filters.action);
      if (filters.targetType) params.append('targetType', filters.targetType);
      if (filters.startDate) params.append('startDate', new Date(filters.startDate).getTime().toString());
      if (filters.endDate) params.append('endDate', new Date(filters.endDate).getTime().toString());
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
        setError(null);
      } else {
        setError(data.error?.message || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError('Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      adminUserId: '',
      action: '',
      targetType: '',
      startDate: '',
      endDate: '',
      search: '',
    });
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDetails = (details: Record<string, any>) => {
    return Object.entries(details).map(([key, value]) => (
      <span key={key} className="text-xs text-gray-600">
        {key}: <span className="font-medium">{JSON.stringify(value)}</span>
      </span>
    ));
  };

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <Icon name="alert-triangle" className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
          <Button onClick={fetchLogs} className="mt-4">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600">Track all administrative actions and changes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icon name="filter" className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={fetchLogs} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Admin User ID"
              value={filters.adminUserId}
              onChange={(e) => handleFilterChange('adminUserId', e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="user_role_changed">User Role Changed</option>
              <option value="user_status_changed">User Status Changed</option>
              <option value="event_featured">Event Featured</option>
              <option value="event_unfeatured">Event Unfeatured</option>
              <option value="dispute_resolved">Dispute Resolved</option>
              <option value="refund_processed">Refund Processed</option>
              <option value="announcement_created">Announcement Created</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.targetType}
              onChange={(e) => handleFilterChange('targetType', e.target.value)}
            >
              <option value="">All Target Types</option>
              <option value="user">User</option>
              <option value="event">Event</option>
              <option value="order">Order</option>
              <option value="dispute">Dispute</option>
              <option value="announcement">Announcement</option>
            </select>
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Logs Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Icon name="file-text" className="h-8 w-8 mx-auto mb-2" />
            <p>No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => {
                  const actionIcon = actionIcons[log.action] || 'file-text';
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`}>
                            <Icon name={actionIcon as any} className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {formatAction(log.action)}
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {log.targetType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.adminUserName}</div>
                        <div className="text-xs text-gray-500">{log.adminUserId}</div>
                        {log.ipAddress && (
                          <div className="text-xs text-gray-400">{log.ipAddress}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.targetName || log.targetId}
                        </div>
                        <div className="text-xs text-gray-500">{log.targetId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 space-y-1">
                          {formatDetails(log.details)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Icon name="clock" className="h-4 w-4 mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}