"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import { RefreshCw } from "lucide-react";

interface SeoSetting {
  key: string;
  value: string;
}

const DEFAULTS: SeoSetting[] = [
  { key: "site_title", value: "Guestly — Discover & Organise Events" },
  { key: "site_description", value: "Discover, attend, and organise unforgettable events across Africa." },
  { key: "og_image", value: "/og-image.jpg" },
  { key: "canonical_url", value: "https://guestly.com" },
  { key: "robots_txt", value: "User-agent: *\nAllow: /" },
];

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SeoSetting[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        setSettings(
          DEFAULTS.map((d) => {
            const value = data?.[d.key] ?? d.value;
            return { ...d, value: String(value) };
          })
        );
      }
    } catch (e) {
      console.error("Failed to load SEO settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      settings.forEach((s) => { payload[s.key] = s.value; });
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Management</h1>
          <p className="text-sm text-slate-500">Manage site-wide SEO settings and metadata</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Icon name="save" size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {settings.map((s) => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-slate-900 mb-2 capitalize">{s.key.replace(/_/g, " ")}</label>
                <Input value={s.value} onChange={(e) => updateSetting(s.key, e.target.value)} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
