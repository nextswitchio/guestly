'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

interface ReportedContent {
  id: string;
  type: 'event' | 'user' | 'review' | 'comment';
  reason: string;
  reporterId: string;
  reportedAt: number;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  details: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/moderation');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    actioned: reports.filter(r => r.status === 'actioned').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
  };

  const typeColors: Record<string, string> = {
    event: 'bg-blue-100 text-blue-700',
    user: 'bg-purple-100 text-purple-700',
    review: 'bg-amber-100 text-amber-700',
    comment: 'bg-green-100 text-green-700',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    dismissed: 'bg-slate-100 text-slate-600',
    actioned: 'bg-green-100 text-green-700',
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Reports',
      content: (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[report.type]}`}>
                    {report.type}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                    {report.status}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 mb-2">{report.details}</p>
              <p className="text-sm text-slate-400">
                Reason: {report.reason}
              </p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'pending',
      label: `Pending (${stats.pending})`,
      content: (
        <div className="space-y-4">
          {reports.filter(r => r.status === 'pending').map((report) => (
            <Card key={report.id} className="p-6 border-yellow-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[report.type]}`}>
                    {report.type}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 mb-2">{report.details}</p>
              <p className="text-sm text-slate-400 mb-4">
                Reason: {report.reason}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
          {reports.filter(r => r.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pending reports</h3>
              <p className="text-slate-500">All content has been reviewed.</p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'reviewed',
      label: `Reviewed (${stats.reviewed})`,
      content: (
        <div className="space-y-4">
          {reports.filter(r => r.status === 'reviewed').map((report) => (
            <Card key={report.id} className="p-6">
              <p className="text-slate-600">{report.details}</p>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moderation</h1>
          <p className="text-slate-500 mt-1">Review and manage reported content</p>
        </div>
        <Button variant="outline" onClick={fetchReports}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Reviewed</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.reviewed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Actioned</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.actioned}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Dismissed</p>
          <p className="text-2xl font-bold mt-1 text-slate-600">{stats.dismissed}</p>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <Tabs tabs={tabs} defaultTabId="all" />
      )}
    </div>
  );
}
