"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, MapPin, Plus, RefreshCw, Save, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import CloudinaryUploadField from "@/components/ui/CloudinaryUploadField";
import {
  DEFAULT_PLATFORM_CATALOG,
  PlatformCity,
  PlatformCountry,
  normalizeCatalog,
  toCamelCity,
  toCamelCountry,
} from "@/lib/platformCatalog";

const emptyCountry = { name: "", code: "", nationality: "", isActive: true, sortOrder: 0 };
const emptyCity = {
  name: "",
  countryName: "",
  state: "",
  slug: "",
  image: "",
  latitude: "",
  longitude: "",
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

export default function AdminGeographyPage() {
  const [countries, setCountries] = useState<PlatformCountry[]>([]);
  const [cities, setCities] = useState<PlatformCity[]>([]);
  const [countryForm, setCountryForm] = useState(emptyCountry);
  const [cityForm, setCityForm] = useState(emptyCity);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sortedCountries = useMemo(
    () => countries.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [countries],
  );
  const sortedCities = useMemo(
    () => cities.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [cities],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [countriesRes, citiesRes] = await Promise.all([
        fetch("/api/admin/catalog/countries", { cache: "no-store" }),
        fetch("/api/admin/catalog/cities", { cache: "no-store" }),
      ]);
      if (countriesRes.ok && citiesRes.ok) {
        const nextCountries = (await countriesRes.json()).map(toCamelCountry);
        const nextCities = (await citiesRes.json()).map(toCamelCity);
        if (nextCountries.length || nextCities.length) {
          setCountries(nextCountries);
          setCities(nextCities);
          return;
        }
      }
      const catalogRes = await fetch("/api/platform/catalog", { cache: "no-store" });
      const catalog = normalizeCatalog(await catalogRes.json());
      setCountries(catalog.countries);
      setCities(catalog.cities);
    } catch {
      setCountries(DEFAULT_PLATFORM_CATALOG.countries);
      setCities(DEFAULT_PLATFORM_CATALOG.cities);
      setError("Using default geography coverage while the backend is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetCountryForm() {
    setCountryForm(emptyCountry);
    setEditingCountryId(null);
  }

  function resetCityForm() {
    setCityForm(emptyCity);
    setEditingCityId(null);
  }

  async function saveCountry(e: React.FormEvent) {
    e.preventDefault();
    if (!countryForm.name.trim()) return setError("Country name is required.");
    setSaving(true);
    setError("");
    try {
      const url = editingCountryId ? `/api/admin/catalog/countries/${editingCountryId}` : "/api/admin/catalog/countries";
      const res = await fetch(url, {
        method: editingCountryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(countryForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "Unable to save country.");
      }
      resetCountryForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save country.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCity(e: React.FormEvent) {
    e.preventDefault();
    if (!cityForm.name.trim() || !cityForm.countryName) return setError("City and country are required.");
    setSaving(true);
    setError("");
    try {
      const url = editingCityId ? `/api/admin/catalog/cities/${editingCityId}` : "/api/admin/catalog/cities";
      const res = await fetch(url, {
        method: editingCityId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cityForm,
          latitude: cityForm.latitude ? Number(cityForm.latitude) : undefined,
          longitude: cityForm.longitude ? Number(cityForm.longitude) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "Unable to save city.");
      }
      resetCityForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save city.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(resource: "countries" | "cities", id?: string) {
    if (!id) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/catalog/${resource}/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleCityFeatured(city: PlatformCity) {
    if (!city.id) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/catalog/cities/${city.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...city, isFeatured: !city.isFeatured }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  function editCountry(country: PlatformCountry) {
    setEditingCountryId(country.id || null);
    setCountryForm({
      name: country.name,
      code: country.code || "",
      nationality: country.nationality || "",
      isActive: country.isActive,
      sortOrder: country.sortOrder,
    });
  }

  function editCity(city: PlatformCity) {
    setEditingCityId(city.id || null);
    setCityForm({
      name: city.name,
      countryName: city.countryName,
      state: city.state || "",
      slug: city.slug,
      image: city.image || "",
      latitude: city.latitude?.toString() || "",
      longitude: city.longitude?.toString() || "",
      isFeatured: city.isFeatured,
      isActive: city.isActive,
      sortOrder: city.sortOrder,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Countries & Cities</h1>
          <p className="text-sm text-slate-500">Manage Guestly coverage and featured city placements used across organizer forms and discovery pages.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={saveCountry} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{editingCountryId ? "Edit Country" : "Add Country"}</h2>
              {editingCountryId && (
                <button type="button" onClick={resetCountryForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Input label="Country" value={countryForm.name} onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Code" value={countryForm.code} onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })} placeholder="NG" />
              <Input label="Nationality" value={countryForm.nationality} onChange={(e) => setCountryForm({ ...countryForm, nationality: e.target.value })} placeholder="Nigerian" />
            </div>
            <div className="flex items-center gap-6">
              <Input label="Sort order" type="number" value={String(countryForm.sortOrder)} onChange={(e) => setCountryForm({ ...countryForm, sortOrder: Number(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={countryForm.isActive} onChange={(e) => setCountryForm({ ...countryForm, isActive: e.target.checked })} />
                Active
              </label>
            </div>
            <Button type="submit" loading={saving}>
              {editingCountryId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingCountryId ? "Save Country" : "Add Country"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <form onSubmit={saveCity} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{editingCityId ? "Edit City" : "Add City"}</h2>
              {editingCityId && (
                <button type="button" onClick={resetCityForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} required />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Country</label>
                <select
                  value={cityForm.countryName}
                  onChange={(e) => setCityForm({ ...cityForm, countryName: e.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                  required
                >
                  <option value="">Select country</option>
                  {sortedCountries.map((country) => (
                    <option key={country.id || country.name} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
              <Input label="State / Region" value={cityForm.state} onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })} />
              <Input label="Slug" value={cityForm.slug} onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })} placeholder="auto-generated if blank" />
              <Input label="Latitude" type="number" step="any" value={cityForm.latitude} onChange={(e) => setCityForm({ ...cityForm, latitude: e.target.value })} />
              <Input label="Longitude" type="number" step="any" value={cityForm.longitude} onChange={(e) => setCityForm({ ...cityForm, longitude: e.target.value })} />
            </div>
            <CloudinaryUploadField
              label="City Image"
              value={cityForm.image}
              onChange={(image) => setCityForm({ ...cityForm, image })}
              folder="guestly/cities"
              accept="image/*"
            />
            <div className="flex items-center gap-6">
              <Input label="Sort order" type="number" value={String(cityForm.sortOrder)} onChange={(e) => setCityForm({ ...cityForm, sortOrder: Number(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={cityForm.isFeatured} onChange={(e) => setCityForm({ ...cityForm, isFeatured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={cityForm.isActive} onChange={(e) => setCityForm({ ...cityForm, isActive: e.target.checked })} />
                Active
              </label>
            </div>
            <Button type="submit" loading={saving}>
              {editingCityId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingCityId ? "Save City" : "Add City"}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Coverage</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Country</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCities.map((city) => (
                <tr key={city.id || city.slug} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {city.image ? <img src={city.image} alt="" className="h-full w-full object-cover" /> : <MapPin className="h-4 w-4 text-slate-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{city.name}</p>
                        <p className="text-xs text-slate-500">{city.state || city.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{city.countryName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {city.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Featured</span>}
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${city.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                        {city.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => toggleCityFeatured(city)} disabled={!city.id} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40">
                        <Star className={`h-4 w-4 ${city.isFeatured ? "fill-current" : ""}`} />
                      </button>
                      <button type="button" onClick={() => editCity(city)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove("cities", city.id)} disabled={!city.id} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40">
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

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Countries</h2>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCountries.map((country) => (
            <div key={country.id || country.name} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{country.name}</p>
                  <p className="text-sm text-slate-500">{country.code || "No code"} · {country.nationality || "No nationality"}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => editCountry(country)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => remove("countries", country.id)} disabled={!country.id} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
