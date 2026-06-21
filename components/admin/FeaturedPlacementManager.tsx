'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency } from "@/lib/utils";

type PlacementStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
type PaymentStatus = 'pending' | 'charged' | 'paid' | 'waived';

type FeaturedPlacement = {
  id: string;
  coverage_type: 'city' | 'country';
  country: string;
  city?: string | null;
  start_date: string;
  end_date: string;
  duration_hours: number;
  fee_per_hour: number;
  total_fee: number;
  currency: string;
  status: PlacementStatus;
  payment_status: PaymentStatus;
  notes?: string | null;
  media_files?: { url: string; name: string; type: string; size: number }[] | null;
  rejection_reason?: string | null;
  created_at: string;
  event?: {
    id: string;
    title: string;
    category: string;
    city: string;
    country: string;
    date: string;
  } | null;
  organizer_name?: string | null;
};

type PlacementStats = {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  active_placements: number;
  rejected_requests: number;
  total_revenue: number;
  currency: string;
};

const statusTabs: Array<'all' | PlacementStatus> = ['all', 'pending', 'approved', 'rejected', 'cancelled', 'expired'];

export default function FeaturedPlacementManager() {
  const [placements, setPlacements] = React.useState<FeaturedPlacement[]>([]);
  const [stats, setStats] = React.useState<PlacementStats | null>(null);
  const [feePerHour, setFeePerHour] = React.useState('5000');
  const [currency, setCurrency] = React.useState('NGN');
  const [filter, setFilter] = React.useState<'all' | PlacementStatus>('all');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [settingsRes, statsRes, placementsRes] = await Promise.all([
        fetch('/api/admin/featured?action=settings', { cache: 'no-store', credentials: 'include' }),
        fetch('/api/admin/featured?action=stats', { cache: 'no-store', credentials: 'include' }),
        fetch(`/api/admin/featured${filter !== 'all' ? `?status=${filter}` : ''}`, { cache: 'no-store', credentials: 'include' }),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setFeePerHour(String(settingsData.data?.fee_per_hour ?? 5000));
          setCurrency(settingsData.data?.currency || 'NGN');
        } else if (settingsData.fee_per_hour) {
          setFeePerHour(String(settingsData.fee_per_hour));
          setCurrency(settingsData.currency || 'NGN');
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
        else if (statsData.total_requests !== undefined) setStats(statsData);
        else if (statsData.data) setStats(statsData.data);
      }

      if (placementsRes.ok) {
        const placementsData = await placementsRes.json();
        if (placementsData.success) setPlacements(placementsData.data || []);
        else if (Array.isArray(placementsData)) setPlacements(placementsData);
        else if (placementsData.data) setPlacements(placementsData.data);
        else setError('Unable to load featured placement requests.');
      } else {
        setError('Unable to load featured placement requests.');
      }
    } catch {
      setError('Unable to load featured placement requests.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feePerHour: Number(feePerHour), currency }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error?.detail || data.error?.message || 'Unable to update fee.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update fee.');
    } finally {
      setSaving(false);
    }
  }

  async function updatePlacement(id: string, body: Record<string, unknown>) {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/featured/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error?.detail || data.error?.message || 'Unable to update placement.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update placement.');
    } finally {
      setSaving(false);
    }
  }

  async function rejectPlacement(id: string) {
    const rejectionReason = window.prompt('Reason for rejection');
    if (rejectionReason === null) return;
    await updatePlacement(id, { status: 'rejected', rejectionReason });
  }

  const statusBadge = (status: PlacementStatus) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      cancelled: 'neutral',
      expired: 'neutral',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const paymentBadge = (status: PaymentStatus) => {
    const variants = {
      pending: 'warning',
      charged: 'primary',
      paid: 'success',
      waived: 'neutral',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const activePlacements = placements.filter((placement) => placement.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="text-slate-500">Loading featured placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Total Requests</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total_requests}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.pending_requests}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{stats.approved_requests}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Active Placements</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.active_placements}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-red-600">{stats.rejected_requests}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-500">Revenue</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(stats.total_revenue, stats.currency)}</p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={saveSettings} className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end">
          <Input
            label="Fee per hour"
            type="number"
            min="0"
            step="100"
            value={feePerHour}
            onChange={(event) => setFeePerHour(event.target.value)}
          />
          <Input
            label="Currency"
            value={currency}
            maxLength={3}
            onChange={(event) => setCurrency(event.target.value.toUpperCase())}
          />
          <Button type="submit" disabled={saving}>
            <Icon name="save" size={16} />
            Save Fee
          </Button>
        </form>
        <p className="mt-3 text-sm text-slate-500">
          Organizer charges are calculated automatically as fee per hour multiplied by the selected placement duration.
        </p>
      </Card>

      {activePlacements.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Approved Featured Events</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePlacements.map((placement) => (
              <div key={placement.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  {statusBadge(placement.status)}
                  <span className="text-sm font-semibold text-success-600">{formatCurrency(placement.total_fee, placement.currency)}</span>
                </div>
                <h4 className="font-medium text-slate-900">{placement.event?.title || 'Unknown Event'}</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {placement.coverage_type === 'city' ? placement.city : placement.country} coverage
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(placement.start_date).toLocaleString()} - {new Date(placement.end_date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Featured Placement Requests</h3>
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  filter === status ? 'bg-lime text-dark font-bold' : 'bg-neutral-100 text-slate-600 hover:bg-neutral-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Event</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Coverage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Period</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Fee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Media</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement) => (
                <tr key={placement.id} className="border-b border-neutral-200 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{placement.event?.title || 'Unknown Event'}</p>
                    <p className="text-sm text-slate-500">{placement.organizer_name || 'Organizer'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <p className="capitalize">{placement.coverage_type}</p>
                    <p className="text-slate-500">{placement.coverage_type === 'city' ? `${placement.city}, ${placement.country}` : placement.country}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <p>{new Date(placement.start_date).toLocaleString()}</p>
                    <p className="text-slate-500">to {new Date(placement.end_date).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{placement.duration_hours} hours</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-semibold text-slate-900">{formatCurrency(placement.total_fee, placement.currency)}</p>
                    <p className="text-slate-500">{formatCurrency(placement.fee_per_hour, placement.currency)} / hour</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {placement.media_files && placement.media_files.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {placement.media_files.map((file, i) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 hover:border-lime hover:bg-lime/5 transition-colors"
                            title={file.name}
                          >
                            {file.type.startsWith("image/") ? (
                              <img src={file.url} alt="" className="h-full w-full rounded object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-neutral-500 uppercase">
                                {file.name.split(".").pop() || "?"}
                              </span>
                            )}
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="h-3 w-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      {statusBadge(placement.status)}
                      {paymentBadge(placement.payment_status)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {placement.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => updatePlacement(placement.id, { status: 'approved', paymentStatus: 'charged' })} disabled={saving}>
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => rejectPlacement(placement.id)} disabled={saving}>
                            Reject
                          </Button>
                        </>
                      )}
                      {placement.status === 'approved' && placement.payment_status !== 'paid' && (
                        <Button size="sm" variant="secondary" onClick={() => updatePlacement(placement.id, { paymentStatus: 'paid' })} disabled={saving}>
                          Mark Paid
                        </Button>
                      )}
                      {placement.status === 'approved' && (
                        <Button size="sm" variant="ghost" onClick={() => updatePlacement(placement.id, { status: 'cancelled' })} disabled={saving}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {placements.length === 0 && <p className="py-8 text-center text-slate-500">No featured placement requests found.</p>}
        </div>
      </Card>
    </div>
  );
}
