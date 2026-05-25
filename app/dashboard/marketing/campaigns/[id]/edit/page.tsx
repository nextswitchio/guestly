'use client';
import { RefreshCw, Save } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'social' | 'influencer' | 'referral';
  budget: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  status: string;
}

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Campaign>({
    id: '',
    name: '',
    description: '',
    type: 'email',
    budget: 0,
    startDate: '',
    endDate: '',
    targetAudience: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      if (response.ok) {
        const data = await response.json();
        const c = data.campaign;
        setForm({
          id: c.id,
          name: c.name,
          description: c.description || '',
          type: c.type || 'email',
          budget: c.budget || 0,
          startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
          endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
          targetAudience: c.targetAudience || '',
          status: c.status || 'draft',
        });
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => router.push(`/dashboard/marketing/campaigns/${id}`), 1500);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update campaign');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Edit Campaign</h1>
        <p className="text-neutral-500 mt-1">Update your marketing campaign details</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        {saved ? (
          <div className="text-center py-8">
            <div className="flex h-12 w-12 mx-auto mb-4 items-center justify-center rounded-full bg-green-100">
              <Save className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Campaign Updated!</h3>
            <p className="text-neutral-500">Redirecting to campaign details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Campaign Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Campaign Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Campaign['type'] })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              >
                <option value="email">Email</option>
                <option value="social">Social Media</option>
                <option value="influencer">Influencer</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Budget (₦)</label>
              <input
                type="number"
                value={form.budget.toString()}
                onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Target Audience</label>
              <input
                type="text"
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                placeholder="e.g., Lagos residents aged 18-35"
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                loading={saving}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/marketing/campaigns/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
