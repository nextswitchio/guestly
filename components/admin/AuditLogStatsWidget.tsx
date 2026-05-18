'use client';
import { ArrowRight } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface AuditLogStats {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByAdmin: Record<string, { name: string; count: number }>;
  logsByTargetType: Record<string, number>;
  recentActivity: Array<{
    id: string;
    adminUserName: string;
    action: string;
    targetType: string;
    targetName?: string;
    timestamp: number;
  }>;
}

export function AuditLogStatsWidget() {
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/audit-logs?stats=true&period=month');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error?.message || 'Failed to fetch audit log stats');
      }
    } catch (err) {
      setError('Failed to fetch audit log stats');
      console.error('Error fetching audit log stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTopActions = () => {
    if (!stats) return [];
    return Object.entries(stats.logsByAction)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const getTopAdmins = () => {
    if (!stats) return [];
    return Object.entries(stats.logsByAdmin)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <Icon name="file-text" className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Icon name="file-text" className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Audit Activity</h3>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>
      </div>

      {/* Total Logs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total Actions</span>
          <span className="text-2xl font-bold text-gray-900">{stats.totalLogs}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (stats.totalLogs / 100) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Top Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Actions</h4>
        <div className="space-y-2">
          {getTopActions().map(([action, count]) => (
            <div key={action} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{formatAction(action)}</span>
              <span className="font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Admins */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Most Active Admins</h4>
        <div className="space-y-2">
          {getTopAdmins().map(([adminId, admin]) => (
            <div key={adminId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon name="user" className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">{admin.name}</span>
              </div>
              <span className="font-medium text-gray-900">{admin.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {stats.recentActivity.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Icon name="activity" className="h-3 w-3 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-900 font-medium">
                  {formatAction(activity.action)}
                </p>
                <p className="text-xs text-gray-500">
                  by {activity.adminUserName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="clock" className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a 
          href="/admin/audit-logs" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all audit logs<ArrowRight className="h-4 w-4 inline" />
        </a>
      </div>
    </Card>
  );
}