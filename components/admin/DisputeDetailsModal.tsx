'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { Dispute, DisputeStatus } from '@/lib/store';

interface DisputeDetailsModalProps {
  dispute: Dispute;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function DisputeDetailsModal({ 
  dispute, 
  open, 
  onClose, 
  onUpdate 
}: DisputeDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'full_refund' | 'partial_refund' | 'no_refund' | 'event_credit'>('no_refund');
  const [refundAmount, setRefundAmount] = useState(dispute.orderAmount);
  const [adminNotes, setAdminNotes] = useState(dispute.adminNotes || '');
  const [assignedTo, setAssignedTo] = useState(dispute.assignedTo || '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
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

  const handleAssign = async () => {
    if (!assignedTo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUserId: assignedTo }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to assign dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution: resolution.trim(),
          action: resolutionAction,
          refundAmount: resolutionAction === 'partial_refund' ? refundAmount : undefined,
        }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!resolution.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution: resolution.trim(),
        }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to reject dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNotes: adminNotes.trim(),
        }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionOptions = [
    { value: 'no_refund', label: 'No Refund' },
    { value: 'full_refund', label: 'Full Refund' },
    { value: 'partial_refund', label: 'Partial Refund' },
    { value: 'event_credit', label: 'Event Credit' },
  ];

  const canResolve = dispute.status === 'open' || dispute.status === 'investigating';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Dispute Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Dispute Overview */}
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">
                Dispute Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">Dispute ID:</span>
                  <div className="font-mono text-sm">{dispute.id}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Status:</span>
                  <div>
                    <Badge variant={getStatusBadgeVariant(dispute.status)}>
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Reason:</span>
                  <div>{getReasonLabel(dispute.reason)}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Order Amount:</span>
                  <div className="font-semibold">{formatCurrency(dispute.orderAmount)}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Created:</span>
                  <div>{formatDate(dispute.createdAt)}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">
                Event & Customer
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">Event:</span>
                  <div className="font-medium">{dispute.eventTitle}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Customer:</span>
                  <div>{dispute.userName}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Order ID:</span>
                  <div className="font-mono text-sm">{dispute.orderId}</div>
                </div>
                {dispute.assignedTo && (
                  <div>
                    <span className="text-sm text-slate-500">Assigned To:</span>
                    <div>{dispute.assignedTo}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Description */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Customer Description
          </h3>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <p className="text-slate-900 whitespace-pre-wrap">
              {dispute.description}
            </p>
          </div>
        </Card>

        {/* Admin Notes */}
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Admin Notes
          </h3>
          <div className="space-y-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this dispute..."
              rows={4}
            />
            <Button
              onClick={handleUpdateNotes}
              loading={loading}
              disabled={adminNotes === (dispute.adminNotes || '')}
            >
              Update Notes
            </Button>
          </div>
        </Card>

        {/* Assignment */}
        {dispute.status === 'open' && (
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Assign Dispute
            </h3>
            <div className="flex gap-4">
              <Input
                placeholder="Admin User ID"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAssign}
                loading={loading}
                disabled={!assignedTo.trim()}
              >
                Assign
              </Button>
            </div>
          </Card>
        )}

        {/* Resolution */}
        {canResolve && (
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Resolve Dispute
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Resolution Action
                </label>
                <Select
                  value={resolutionAction}
                  onChange={(e) => setResolutionAction(e.target.value as any)}
                  options={actionOptions}
                />
              </div>

              {resolutionAction === 'partial_refund' && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Refund Amount
                  </label>
                  <Input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    max={dispute.orderAmount}
                    min={0}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Resolution Details
                </label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Explain the resolution and reasoning..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleResolve}
                  loading={loading}
                  disabled={!resolution.trim()}
                  variant="primary"
                >
                  Resolve Dispute
                </Button>
                <Button
                  onClick={handleReject}
                  loading={loading}
                  disabled={!resolution.trim()}
                  variant="danger"
                >
                  Reject Dispute
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Resolution Details (if resolved) */}
        {dispute.status === 'resolved' && dispute.resolution && (
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Resolution
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Action Taken:</span>
                <div className="font-medium">
                  {dispute.resolutionAction?.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              {dispute.refundAmount && (
                <div>
                  <span className="text-sm text-slate-500">Refund Amount:</span>
                  <div className="font-semibold text-success-600">
                    {formatCurrency(dispute.refundAmount)}
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm text-slate-500">Resolution Details:</span>
                <div className="bg-neutral-100 p-4 rounded-lg mt-2">
                  <p className="text-slate-900 whitespace-pre-wrap">
                    {dispute.resolution}
                  </p>
                </div>
              </div>
              {dispute.resolvedAt && (
                <div>
                  <span className="text-sm text-slate-500">Resolved:</span>
                  <div>{formatDate(dispute.resolvedAt)}</div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
}