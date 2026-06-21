"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface SeoSetting {
  key: string;
  value: string;
}

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SeoSetting[]>([
    { key: "site_title", value: "Guestly — Discover & Organise Events" },
    { key: "site_description", value: "Discover, attend, and organise unforgettable events across Africa." },
    { key: "og_image", value: "/og-image.jpg" },
    { key: "canonical_url", value: "https://guestly.app" },
    { key: "robots_txt", value: "User-agent: *\nAllow: /" },
  ]);

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seo", settings }),
        credentials: 'include',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Management</h1>
          <p className="text-sm text-slate-500">Manage site-wide SEO settings and metadata</p>
        </div>
        <Button onClick={saveSettings}>
          <Icon name="save" size={16} />
          Save Changes
        </Button>
      </div>

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
    </div>
  );
}
