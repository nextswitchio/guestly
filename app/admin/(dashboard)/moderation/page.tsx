'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, Flag, MessageSquare, User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';

interface ReportedContent {
  id: string;
  type: 'event' | 'user' | 'review' | 'comment';
  reason: string;
  reporterId: string;
  reporterName?: string;
  reportedAt: number;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  details: string;
  targetId?: string;
  targetTitle?: string;
  moderatorNotes?: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [moderatorNote, setModeratorNote] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/moderation', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      await fetch(`/api/admin/moderation/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, moderatorNotes: moderatorNote }),
        credentials: 'include',
      });
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: status as ReportedContent['status'], moderatorNotes: moderatorNote } : r))
      );
      setModeratorNote('');
      setShowDetail(false);
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    actioned: reports.filter(r => r.status === 'actioned').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
  };

  const typeIcons: Record<string, React.ReactNode> = {
    event: <Calendar className="w-4 h-4" />,
    user: <User className="w-4 h-4" />,
    review: <MessageSquare className="w-4 h-4" />,
    comment: <MessageSquare className="w-4 h-4" />,
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

  const filteredReports = activeTab === 'all'
    ? reports
    : reports.filter(r => r.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-slate-500 mt-1">Review, approve, or dismiss reported content from across the platform</p>
        </div>
        <Button variant="outline" onClick={fetchReports}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`p-4 cursor-pointer transition-all ${activeTab === 'pending' ? 'ring-2 ring-yellow-400' : ''}`} onClick={() => setActiveTab('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Review</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card className={`p-4 cursor-pointer transition-all ${activeTab === 'reviewed' ? 'ring-2 ring-blue-400' : ''}`} onClick={() => setActiveTab('reviewed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Under Review</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats.reviewed}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card className={`p-4 cursor-pointer transition-all ${activeTab === 'actioned' ? 'ring-2 ring-green-400' : ''}`} onClick={() => setActiveTab('actioned')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Action Taken</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.actioned}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className={`p-4 cursor-pointer transition-all ${activeTab === 'dismissed' ? 'ring-2 ring-slate-400' : ''}`} onClick={() => setActiveTab('dismissed')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Dismissed</p>
              <p className="text-2xl font-bold mt-1 text-slate-600">{stats.dismissed}</p>
            </div>
            <XCircle className="w-8 h-8 text-slate-400" />
          </div>
        </Card>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
        {[
          { id: 'pending', label: 'Pending', color: 'text-yellow-700' },
          { id: 'reviewed', label: 'Reviewed', color: 'text-blue-700' },
          { id: 'actioned', label: 'Actioned', color: 'text-green-700' },
          { id: 'dismissed', label: 'Dismissed', color: 'text-slate-600' },
          { id: 'all', label: 'All Reports', color: 'text-slate-700' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-slate-900'
                : `${tab.color} hover:bg-white/50`
            }`}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className="ml-1">({stats[tab.id as keyof typeof stats]})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filteredReports.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Clear</h3>
          <p className="text-slate-500">
            {activeTab === 'pending'
              ? 'No pending reports. The community is behaving well!'
              : `No ${activeTab} reports found.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(report => (
            <Card key={report.id} className={`p-5 ${
              report.status === 'pending' ? 'border-l-4 border-l-yellow-400' :
              report.status === 'actioned' ? 'border-l-4 border-l-green-400' :
              report.status === 'dismissed' ? 'border-l-4 border-l-slate-300' :
              'border-l-4 border-l-blue-400'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[report.type]}`}>
                      {typeIcons[report.type]}
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    {report.reporterName && (
                      <span className="text-xs text-slate-400">
                        Reported by {report.reporterName}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 text-sm mb-1 font-medium">
                    {report.details}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span>Reason: {report.reason}</span>
                    <span>&middot;</span>
                    <span>{new Date(report.reportedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    {report.targetTitle && (
                      <>
                        <span>&middot;</span>
                        <span>Target: {report.targetTitle}</span>
                      </>
                    )}
                  </div>

                  {report.moderatorNotes && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-500 italic">
                      Moderator note: {report.moderatorNotes}
                    </div>
                  )}

                  {report.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedReport(report);
                          setShowDetail(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Review & Act
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      <Modal
        open={showDetail}
        onClose={() => { setShowDetail(false); setSelectedReport(null); setModeratorNote(''); }}
        title="Review Report"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b">
              <Flag className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-semibold text-slate-900">Report #{selectedReport.id.slice(0, 8)}</p>
                <p className="text-xs text-slate-400">
                  {new Date(selectedReport.reportedAt).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[selectedReport.type]}`}>
                  {selectedReport.type}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[selectedReport.status]}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Details</label>
                <p className="text-sm text-slate-900 mt-1 bg-neutral-50 p-3 rounded-lg">{selectedReport.details}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reason for Report</label>
                <p className="text-sm text-slate-900 mt-1">{selectedReport.reason}</p>
              </div>
              {selectedReport.targetTitle && (
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reported Content</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedReport.targetTitle}</p>
                </div>
              )}
              {selectedReport.reporterName && (
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reported By</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedReport.reporterName}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
                Moderator Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-lime focus:border-transparent"
                rows={3}
                placeholder="Add notes about this report (optional)..."
                value={moderatorNote}
                onChange={e => setModeratorNote(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => updateReportStatus(selectedReport.id, 'actioned')}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Take Action
              </Button>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-200"
                onClick={() => updateReportStatus(selectedReport.id, 'reviewed')}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                Mark Reviewed
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200"
                onClick={() => updateReportStatus(selectedReport.id, 'dismissed')}
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
