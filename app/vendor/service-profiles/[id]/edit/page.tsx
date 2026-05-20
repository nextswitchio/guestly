'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, AlertCircle, Plus, X, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CATEGORIES = [
  { value: 'Security', label: 'Security' }, { value: 'Sound', label: 'Sound & Audio' },
  { value: 'Catering', label: 'Catering' }, { value: 'Decoration', label: 'Decoration' },
  { value: 'Logistics', label: 'Logistics' }, { value: 'Photography', label: 'Photography & Video' },
];
const PRICING_MODELS = [
  { value: 'fixed', label: 'Fixed Price' }, { value: 'hourly', label: 'Hourly Rate' },
  { value: 'project', label: 'Per Project' }, { value: 'quote', label: 'Request Quote' },
];

export default function EditServiceProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '', subcategory: '', pricing: '', pricingModel: 'fixed', minBudget: '', maxBudget: '', tags: [] as string[], isActive: true });

  useEffect(() => {
    fetch(`/api/vendor/service-profiles/${id}`).then(r => r.json()).then(d => {
      const p = d.profile || d;
      setForm({ name: p.name || '', description: p.description || '', category: p.category || '', subcategory: p.subcategory || '', pricing: p.pricing || '', pricingModel: p.pricingModel || 'fixed', minBudget: p.minBudget?.toString() || '', maxBudget: p.maxBudget?.toString() || '', tags: p.tags || [], isActive: p.isActive ?? true });
    }).catch(() => setError('Failed to load profile')).finally(() => setLoading(false));
  }, [id]);

  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) { setForm({...form, tags: [...form.tags, t]}); setTagInput(''); } };
  const removeTag = (tag: string) => setForm({...form, tags: form.tags.filter(t => t !== tag)});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/vendor/service-profiles/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, minBudget: form.minBudget ? parseFloat(form.minBudget) : undefined, maxBudget: form.maxBudget ? parseFloat(form.maxBudget) : undefined }),
      });
      if (res.ok) router.push('/vendor/service-profiles');
      else { 
        const d = await res.json(); 
        let errorMsg = 'Failed to update profile';
        
        if (d.error) {
          errorMsg = typeof d.error === 'string' 
            ? d.error 
            : Array.isArray(d.error)
            ? d.error[0]?.msg || 'Validation error'
            : d.error.msg || 'Validation error';
        } else if (d.detail) {
          errorMsg = typeof d.detail === 'string'
            ? d.detail
            : Array.isArray(d.detail)
            ? d.detail[0]?.msg || 'Validation error'
            : 'Validation error';
        }
        setError(errorMsg);
      }
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime";

  if (loading) return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-dark" /></button>
        <div><h1 className="text-3xl font-bold text-dark">Edit Service Profile</h1><p className="text-gray-500 mt-1">Update your service profile details</p></div>
      </div>
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Service Details</h2>
            <Input label="Profile Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <div><label className="block text-sm font-medium text-dark mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Subcategory" value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})} />
            <div><label className="block text-sm font-medium text-dark mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className={`${inputClass} min-h-[100px]`} />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Price Display" value={form.pricing} onChange={e => setForm({...form, pricing: e.target.value})} />
              <div><label className="block text-sm font-medium text-dark mb-1.5">Pricing Model</label>
                <select value={form.pricingModel} onChange={e => setForm({...form, pricingModel: e.target.value})} className={inputClass}>
                  {PRICING_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Tags</h2>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">{form.tags.map(tag => <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-lime/10 text-dark rounded-full text-sm">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-dark/70"><X className="w-3 h-3" /></button></span>)}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-dark focus:ring-lime" />
              <span className="text-sm font-medium text-dark">Active</span>
            </label>
          </div>
          {error && <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200"><AlertCircle className="w-4 h-4 shrink-0" />{typeof error === 'string' ? error : String(error)}</div>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
