'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { DisputeDetailsModal } from '@/components/admin/DisputeDetailsModal';
import { DisputeStatsCards } from '@/components/admin/DisputeStatsCards';
import { DisputeFilters } from '@/components/admin/DisputeFilters';
import { formatCurrency } from '@/lib/utils';
import type { Dispute, DisputeStatus, DisputeReason } from '@/lib/store';

interface DisputeStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  rejected: number;
  totalRefunded: number;
  averageResolutionTime: number;
}

function normalizeDisputesResponse(response: unknown): Dispute[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object') {
    if ('data' in response && Array.isArray((response as any).data)) return (response as any).data;
    if ('disputes' in response && Array.isArray((response as any).disputes)) return (response as any).disputes;
  }
  return [];
}

function normalizeStatsResponse(response: unknown): DisputeStats | null {
  if (!response || typeof response !== 'object') return null;
  const src = response as Record<string, any>;
  return {
    total: src.total ?? 0,
    open: src.open ?? 0,
    investigating: src.investigating ?? 0,
    resolved: src.resolved ?? 0,
    rejected: src.rejected ?? 0,
    totalRefunded: src.totalRefunded ?? src.total_refunded ?? 0,
    averageResolutionTime: src.averageResolutionTime ?? src.average_resolution_time ?? 0,
  };
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<DisputeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as DisputeStatus | '',
    reason: '' as DisputeReason | '',
    search: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDisputes(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [filters]);

  const fetchDisputes = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.reason) params.append('reason', filters.reason);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/disputes?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setDisputes(normalizeDisputesResponse(data));
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      setError('Failed to load disputes');
      setDisputes([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/disputes/stats');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const statsData = (data as any).data ?? (data as any).stats ?? data;
      setStats(normalizeStatsResponse(statsData));
    } catch (error) {
      console.error('Failed to fetch dispute stats:', error);
    }
  };

  const handleDisputeClick = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
  };

  const handleDisputeUpdate = () => {
    fetchDisputes();
    fetchStats();
    setShowDetailsModal(false);
  };

  const getStatusBadgeVariant = (status: DisputeStatus) => {
    switch (status) {
      case 'open': return 'warning';
      case 'investigating': return 'primary';
      case 'resolved': return 'success';
      case 'rejected': return 'danger';
      default: return 'neutral';
    }
  };

  const getReasonLabel = (reason: DisputeReason) => {
    const labels: Record<DisputeReason, string> = {
      event_cancelled: 'Event Cancelled',
      event_changed: 'Event Changed',
      poor_experience: 'Poor Experience',
      technical_issues: 'Technical Issues',
      billing_error: 'Billing Error',
      unauthorized_charge: 'Unauthorized Charge',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dispute Management
          </h1>
          <p className="text-slate-500 mt-1">
            Handle customer disputes and process refunds
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && <DisputeStatsCards stats={stats} />}

      {/* Filters */}
      <DisputeFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Disputes Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-slate-900">
            All Disputes ({disputes.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-4 font-medium text-slate-500">
                  Dispute ID
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Event
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Reason
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Amount
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Created
                </th>
                <th className="text-left p-4 font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => (
                <tr
                  key={dispute.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => handleDisputeClick(dispute)}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-900">
                      {dispute.id.slice(-8)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {dispute.eventTitle}
                      </div>
                      <div className="text-sm text-slate-500">
                        Order: {dispute.orderId.slice(-8)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-900">
                      {dispute.userName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-900">
                      {getReasonLabel(dispute.reason)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-900">
                      {formatCurrency(dispute.orderAmount)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(dispute.status)}>
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-500">
                      {formatDate(dispute.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisputeClick(dispute);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {disputes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-500">
                No disputes found matching your criteria
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <DisputeDetailsModal
          dispute={selectedDispute}
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleDisputeUpdate}
        />
      )}
    </div>
  );
}