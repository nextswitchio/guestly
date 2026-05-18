'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw, Edit3, EyeOff, Eye, Trash2, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ServiceProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [maxProfiles, setMaxProfiles] = useState(1);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [subRes, pRes] = await Promise.all([
        fetch('/api/vendor/subscription'),
        fetch('/api/vendor/service-profiles'),
      ]);
      if (subRes.ok) {
        const d = await subRes.json();
        setPlan(d.subscription?.plan || null);
        setMaxProfiles(d.maxServiceProfiles || 1);
      }
      if (pRes.ok) setProfiles((await pRes.json()).profiles || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try { await fetch(`/api/vendor/service-profiles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !active }) }); fetchData(); }
    catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service profile?')) return;
    try { await fetch(`/api/vendor/service-profiles/${id}`, { method: 'DELETE' }); fetchData(); }
    catch (e) { console.error(e); }
  };

  const cats: Record<string, string> = { Security: 'bg-amber-50 text-amber-700', Sound: 'bg-purple-50 text-purple-700', Catering: 'bg-orange-50 text-orange-700', Decoration: 'bg-pink-50 text-pink-700', Logistics: 'bg-cyan-50 text-cyan-700', Photography: 'bg-blue-50 text-blue-700' };
  const atLimit = profiles.length >= maxProfiles;

  if (loading) return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Service Profiles</h1>
          <p className="text-gray-500 mt-1">Create specialised service profiles for organisers to discover</p>
        </div>
        <div className="flex items-center gap-3">
          {plan && <span className="text-xs text-gray-400">{profiles.length}/{maxProfiles === Infinity ? '∞' : maxProfiles} profiles used</span>}
          <Button onClick={() => router.push('/vendor/service-profiles/new')} disabled={atLimit}><Plus className="w-4 h-4 mr-2" />New Profile</Button>
        </div>
      </div>

      {atLimit && profiles.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          <span className="font-semibold">Profile limit reached.</span>
          <span>Upgrade your subscription to create more service profiles.</span>
          <Button variant="outline" size="sm" href="/vendor/subscription" className="ml-auto shrink-0">Upgrade</Button>
        </div>
      )}

      {profiles.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark mb-2">No service profiles yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Create service profiles to showcase your specific offerings. Organisers can discover and invite you based on your profiles.</p>
          <Button onClick={() => router.push('/vendor/service-profiles/new')} disabled={atLimit}><Plus className="w-4 h-4 mr-2" />Create Your First Profile</Button>
          {atLimit && <p className="text-xs text-warning-600 mt-3">Upgrade your subscription to create service profiles.</p>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p: any) => (
            <Card key={p.id} className="p-5 relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cats[p.category] || 'bg-gray-100 text-gray-600'}`}>{p.category}</span>
                <button onClick={() => handleToggle(p.id, p.isActive)} className={`p-1.5 rounded-lg transition-colors ${p.isActive ? 'text-lime bg-lime/10 hover:bg-lime/20' : 'text-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-dark">{p.pricing}</span>
                <span className="text-xs text-gray-400 capitalize">/ {p.pricingModel}</span>
              </div>
              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">{p.tags.map((t: string, i: number) => <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-xs">{t}</span>)}</div>
              )}
              <div className="mb-1">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.isActive ? 'text-dark' : 'text-gray-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-lime' : 'bg-gray-300'}`} />
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/vendor/service-profiles/${p.id}/edit`)}><Edit3 className="w-3.5 h-3.5 mr-1.5" />Edit</Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete</Button>
              </div>
            </Card>
          ))}
          {!atLimit && (
            <button onClick={() => router.push('/vendor/service-profiles/new')} className="p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-lime hover:bg-lime/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[280px] group cursor-pointer">
              <Plus className="w-8 h-8 text-gray-300 group-hover:text-lime transition-colors" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-dark transition-colors">Add New Profile</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
