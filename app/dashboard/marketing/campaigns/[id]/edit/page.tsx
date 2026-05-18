'use client';
import { RefreshCw, Save } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';

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
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Campaign</h1>
        <p className="text-slate-500 mt-1">Update your marketing campaign details</p>
      </div>

      <Card className="p-6 sm:p-8">
        {saved ? (
          <div className="text-center py-8">
            <Save className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Campaign Updated!</h3>
            <p className="text-slate-500">Redirecting to campaign details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Campaign Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <Select
              label="Campaign Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Campaign['type'] })}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'social', label: 'Social Media' },
                { value: 'influencer', label: 'Influencer' },
                { value: 'referral', label: 'Referral' },
              ]}
            />
            <Input
              label="Budget (₦)"
              type="number"
              value={form.budget.toString()}
              onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <Input
              label="Target Audience"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              placeholder="e.g., Lagos residents aged 18-35"
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4 mr-2" />
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
      </Card>
    </div>
  );
}
