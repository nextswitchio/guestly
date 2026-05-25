"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Save, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import {
  DEFAULT_PLATFORM_CATALOG,
  PlatformCategory,
  normalizeCatalog,
  toCamelCategory,
} from "@/lib/platformCatalog";

type CategoryResource = "event-categories" | "vendor-categories";

type CategoryCatalogManagerProps = {
  resource: CategoryResource;
  title: string;
  description: string;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  color: "#0F766E",
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

const AVAILABLE_ICONS = [
  'calendar', 'ticket', 'money', 'rocket', 'chart', 'trending-up', 'trending-down',
  'target', 'sparkles', 'lightbulb', 'bell', 'clock', 'megaphone', 'shield',
  'settings', 'document', 'users', 'trophy', 'palette', 'music', 'camera',
  'home', 'package', 'edit', 'clipboard', 'user', 'star', 'fire', 'heart',
  'thumbs-up', 'party', 'globe', 'mail', 'search',
  'location', 'wallet', 'bar-chart', 'briefcase', 'store', 'laptop',
  'utensils', 'landmark', 'speaker', 'mic',
  'folder-transfer', 'records', 'mail-heart', 'starburst', 'justice', 'world-2',
];

function fallbackFor(resource: CategoryResource) {
  return resource === "event-categories"
    ? DEFAULT_PLATFORM_CATALOG.eventCategories
    : DEFAULT_PLATFORM_CATALOG.vendorCategories;
}

export default function CategoryCatalogManager({ resource, title, description }: CategoryCatalogManagerProps) {
  const [items, setItems] = useState<PlatformCategory[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeItems = useMemo(
    () => items.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [items],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/catalog/${resource}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map(toCamelCategory);
        setItems(mapped);
        return;
      }

      const fallbackRes = await fetch("/api/platform/catalog", { cache: "no-store" });
      const catalog = normalizeCatalog(await fallbackRes.json());
      setItems(resource === "event-categories" ? catalog.eventCategories : catalog.vendorCategories);
    } catch {
      setItems(fallbackFor(resource));
      setError("Using default catalog while the backend is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [resource]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function edit(item: PlatformCategory) {
    setEditingId(item.id || null);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      icon: item.icon || "",
      color: item.color || "#0F766E",
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/admin/catalog/${resource}/${editingId}` : `/api/admin/catalog/${resource}`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "Unable to save category.");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: PlatformCategory) {
    if (!item.id) return;
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/catalog/${resource}/${item.id}`, { method: "DELETE" });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleFeatured(item: PlatformCategory) {
    if (!item.id) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/catalog/${resource}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isFeatured: !item.isFeatured }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  function IconSelector({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
    return (
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl">
        {AVAILABLE_ICONS.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${
              value === iconName
                ? 'border-2 border-lime bg-lime/10 text-lime-700'
                : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Icon name={iconName} size={16} />
            <span>{iconName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{editingId ? "Edit Category" : "Add Category"}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if blank" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Icon</label>
              <IconSelector value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            </div>
            <Input label="Sort order" type="number" value={String(form.sortOrder)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Color</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-2"
              />
            </div>
            <div className="flex items-center gap-6 pt-7">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
              />
            </div>
          </div>
          <Button type="submit" loading={saving}>
            {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingId ? "Save Category" : "Add Category"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map((item) => (
                <tr key={item.id || item.slug} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || "#0F766E" }} />
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {item.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Featured</span>}
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => toggleFeatured(item)} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700">
                        <Star className={`h-4 w-4 ${item.isFeatured ? "fill-current" : ""}`} />
                      </button>
                      <button type="button" onClick={() => edit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove(item)} disabled={!item.id} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
