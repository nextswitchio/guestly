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

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<DisputeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as DisputeStatus | '',
    reason: '' as DisputeReason | '',
    search: '',
  });

  useEffect(() => {
    fetchDisputes();
    fetchStats();
  }, [filters]);

  const fetchDisputes = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.reason) params.append('reason', filters.reason);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/disputes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDisputes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/disputes/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Dispute Management
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Handle customer disputes and process refunds
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <DisputeStatsCards stats={stats} />}

      {/* Filters */}
      <DisputeFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Disputes Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-[var(--surface-border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            All Disputes ({disputes.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Dispute ID
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Event
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Reason
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Amount
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Created
                </th>
                <th className="text-left p-4 font-medium text-[var(--foreground-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => (
                <tr
                  key={dispute.id}
                  className="border-b border-[var(--surface-border)] hover:bg-[var(--surface-hover)] cursor-pointer"
                  onClick={() => handleDisputeClick(dispute)}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--foreground)]">
                      {dispute.id.slice(-8)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-[var(--foreground)]">
                        {dispute.eventTitle}
                      </div>
                      <div className="text-sm text-[var(--foreground-muted)]">
                        Order: {dispute.orderId.slice(-8)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[var(--foreground)]">
                      {dispute.userName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[var(--foreground)]">
                      {getReasonLabel(dispute.reason)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-[var(--foreground)]">
                      {formatCurrency(dispute.orderAmount)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(dispute.status)}>
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-[var(--foreground-muted)]">
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
              <div className="text-[var(--foreground-muted)]">
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