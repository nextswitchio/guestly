'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, AlertCircle, Plus, X, Link as LinkIcon, Share2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { DEFAULT_PLATFORM_CATALOG, PlatformCatalog, normalizeCatalog } from '@/lib/platformCatalog';
import { useToast } from '@/components/ui/ToastProvider';

const PRICING_MODELS = [
  { value: 'fixed', label: 'Fixed Price' }, { value: 'hourly', label: 'Hourly Rate' },
  { value: 'project', label: 'Per Project' }, { value: 'quote', label: 'Request Quote' },
];

export default function NewServiceProfilePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [atLimit, setAtLimit] = useState(false);
  const [identityStatus, setIdentityStatus] = useState<string | null>(null);
  const [identityLoading, setIdentityLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [catalog, setCatalog] = useState<PlatformCatalog>(DEFAULT_PLATFORM_CATALOG);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    pricing: '',
    pricingModel: 'fixed',
    minBudget: '',
    maxBudget: '',
    bannerImage: '',
    rateCardUrl: '',
    portfolioUrl: '',
    socialUrl: '',
    tags: [] as string[],
    images: [] as string[],
  });

  useEffect(() => {
    fetch('/api/vendor/subscription').then(r => r.json()).then(d => {
      const max = d.maxServiceProfiles || 1;
      fetch('/api/vendor/service-profiles').then(r => r.json()).then(pd => { if (pd.profiles?.length >= max) setAtLimit(true); });
    }).catch(() => {});
    fetch('/api/identity')
      .then(r => r.json())
      .then(d => setIdentityStatus(d.verification?.status || null))
      .catch(() => setIdentityStatus(null))
      .finally(() => setIdentityLoading(false));
    fetch('/api/platform/catalog')
      .then(r => r.json())
      .then(d => setCatalog(normalizeCatalog(d)))
      .catch(() => setCatalog(DEFAULT_PLATFORM_CATALOG));
  }, []);

  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) { setForm({ ...form, tags: [...form.tags, t] }); setTagInput(''); } };
  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.category) { setError('Please fill in all required fields'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/vendor/service-profiles', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, minBudget: form.minBudget ? parseFloat(form.minBudget) : undefined, maxBudget: form.maxBudget ? parseFloat(form.maxBudget) : undefined }),
      });
      if (res.ok) {
        addToast('Service profile created successfully!', { type: 'success' });
        router.push('/vendor/service-profiles');
      } else { 
        const d = await res.json(); 
        let errorMsg = 'Failed to create profile';
        
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
        addToast(errorMsg, { type: 'error' });
      }
    } catch { 
      const msg = 'Network error.';
      setError(msg);
      addToast(msg, { type: 'error' });
    }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime";

  if (atLimit) return (
    <div className="max-w-2xl mx-auto mt-12"><Card className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-dark mb-2">Profile Limit Reached</h2>
      <p className="text-gray-500 mb-6">Upgrade your subscription to create more service profiles.</p>
      <Button href="/vendor/subscription">Upgrade Subscription</Button>
    </Card></div>
  );

  if (!identityLoading && identityStatus !== 'verified') return (
    <div className="max-w-2xl mx-auto mt-12"><Card className="p-12 text-center">
      <Shield className="w-12 h-12 text-warning-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-dark mb-2">Verify Your Identity</h2>
      <p className="text-gray-500 mb-6">Identity verification is required before creating service profiles.</p>
      <Button href="/vendor/identity">Verify Identity</Button>
    </Card></div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-dark" /></button>
        <div><h1 className="text-3xl font-bold text-dark">New Service Profile</h1><p className="text-gray-500 mt-1">Create a service profile that organisers can discover</p></div>
      </div>
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Service Details</h2>
            <Input label="Profile Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Premium DJ & Sound System" required />
            <div><label className="block text-sm font-medium text-dark mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className={inputClass}>
                <option value="">Select a category</option>
                {catalog.vendorCategories.filter(c => c.isActive).map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Subcategory (optional)" value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})} placeholder="e.g., Wedding DJ, Club Sound System" />
            <div><label className="block text-sm font-medium text-dark mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} placeholder="Describe what makes this service offering unique..." className={`${inputClass} min-h-[100px]`} />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Price Display *" value={form.pricing} onChange={e => setForm({...form, pricing: e.target.value})} placeholder="e.g., ₦50,000 - ₦200,000" required />
              <div><label className="block text-sm font-medium text-dark mb-1.5">Pricing Model</label>
                <select value={form.pricingModel} onChange={e => setForm({...form, pricingModel: e.target.value})} className={inputClass}>
                  {PRICING_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Min Budget (₦)" type="number" value={form.minBudget} onChange={e => setForm({...form, minBudget: e.target.value})} placeholder="50000" />
              <Input label="Max Budget (₦)" type="number" value={form.maxBudget} onChange={e => setForm({...form, maxBudget: e.target.value})} placeholder="200000" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Media & Links</h2>
            <CloudinaryUploadField label="Banner Image" value={form.bannerImage} onChange={url => setForm({...form, bannerImage: url})} placeholder="Upload service banner" folder="guestly/service-profiles/banners" accept="image/*" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CloudinaryUploadField label="Rate Card" value={form.rateCardUrl} onChange={url => setForm({...form, rateCardUrl: url})} placeholder="Upload rate card" folder="guestly/service-profiles/rate-cards" accept=".pdf,image/*" preview="file" />
              <Input label="Portfolio URL" type="url" value={form.portfolioUrl} onChange={e => setForm({...form, portfolioUrl: e.target.value})} placeholder="https://example.com/portfolio" leftIcon={<LinkIcon className="w-4 h-4" />} />
            </div>
            <Input label="Business Social Media URL" type="url" value={form.socialUrl} onChange={e => setForm({...form, socialUrl: e.target.value})} placeholder="https://instagram.com/yourbusiness" leftIcon={<Share2 className="w-4 h-4" />} />
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
          {error && <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200"><AlertCircle className="w-4 h-4 shrink-0" />{typeof error === 'string' ? error : String(error)}</div>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}><Save className="w-4 h-4 mr-2" />Create Profile</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
