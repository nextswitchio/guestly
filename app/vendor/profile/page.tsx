"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Star, Phone, Mail, Globe, MapPin, Building2, Save, Edit3, RefreshCw } from "lucide-react";

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ businessName: "", category: "", description: "", services: "", pricing: "", location: "", phone: "", email: "", website: "" });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/profile");
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.data) {
          setProfile(d.data);
          setForm({
            businessName: d.data.businessName || "", category: d.data.category || "", description: d.data.description || "",
            services: (d.data.services || []).join(", "), pricing: d.data.pricing || "", location: d.data.location || "",
            phone: d.data.phone || "", email: d.data.email || "", website: d.data.website || "",
          });
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services: form.services.split(",").map(s => s.trim()).filter(Boolean), website: form.website || undefined }),
      });
      if (res.ok) { await load(); setEditMode(false); }
      else { const d = await res.json(); alert(d.error?.message || "Failed to save"); }
    } catch { alert("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Vendor Profile</h1>
          <p className="text-gray-500 mt-1">Manage your business information and portfolio</p>
        </div>
        {!editMode && profile && <Button onClick={() => setEditMode(true)}><Edit3 className="w-4 h-4 mr-2" />Edit Profile</Button>}
      </div>

      {!profile && !editMode ? (
        <Card className="p-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark mb-2">No Profile Found</h2>
          <p className="text-sm text-gray-500 mb-6">Create your vendor profile to start receiving event invitations</p>
          <Button onClick={() => setEditMode(true)}>Create Profile</Button>
        </Card>
      ) : editMode ? (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-dark" />Business Information</h2>
            <div className="space-y-4">
              <Input label="Business Name" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} required />
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass}>
                  <option value="">Select category</option>
                  {["Sound & Lighting","Security","Decor","Catering","Photography","Videography","Entertainment","Transportation"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className={inputClass} placeholder="Describe your services and experience" />
              </div>
              <Input label="Services (comma-separated)" value={form.services} onChange={e => setForm({...form, services: e.target.value})} placeholder="e.g., DJ Services, Sound System, Lighting" />
              <Input label="Pricing" value={form.pricing} onChange={e => setForm({...form, pricing: e.target.value})} placeholder="e.g., ₦50,000 - ₦200,000" />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-dark" />Contact Information</h2>
            <div className="space-y-4">
              <Input label="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, State" required />
              <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+234 XXX XXX XXXX" required />
              <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
              <Input label="Website (optional)" type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://yourwebsite.com" />
            </div>
          </Card>
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            <Button variant="outline" onClick={() => { setEditMode(false); load(); }} disabled={saving}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-5 mb-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lime/10 text-3xl font-bold text-dark">
                {profile?.businessName?.charAt(0).toUpperCase() || "V"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-dark">{profile?.businessName}</h2>
                <p className="text-sm text-gray-500">{profile?.category}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-dark">{profile?.rating?.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({profile?.reviewCount} reviews)</span>
                  </div>
                  <span className="text-sm text-gray-400">{profile?.completedEvents} events completed</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-dark mb-1.5">About</h3>
                <p className="text-sm text-gray-500">{profile?.description}</p>
              </div>
              {profile?.services?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-dark mb-1.5">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((s: string, i: number) => <span key={i} className="rounded-full bg-lime/10 px-3 py-1 text-xs font-medium text-dark">{s}</span>)}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-dark mb-1.5">Pricing</h3>
                <p className="text-sm text-gray-500">{profile?.pricing}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Contact Information</h3>
            <div className="space-y-3">
              {[{ icon: MapPin, text: profile?.location }, { icon: Phone, text: profile?.phone }, { icon: Mail, text: profile?.email }].map((item, i) => item.text ? (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ) : null)}
              {profile?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-lime-600 hover:underline">{profile.website}</a>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
