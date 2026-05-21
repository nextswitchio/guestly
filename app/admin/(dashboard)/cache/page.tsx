"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface CacheStats {
  keys: number;
  memory: string;
  hitRate: number;
  uptime: string;
}

export default function AdminCachePage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCacheStats();
  }, []);

  const fetchCacheStats = async () => {
    try {
      const res = await fetch("/api/admin/cache/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await fetch("/api/admin/cache/cleanup", { method: "POST" });
      fetchCacheStats();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cache Management</h1>
          <p className="text-sm text-slate-500">Monitor and manage application cache</p>
        </div>
        <Button onClick={clearCache}>
          <Icon name="trash-2" size={16} />
          Clear Cache
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm text-slate-500">Total Keys</h3>
            <p className="text-2xl font-bold text-slate-900">{stats.keys}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-slate-500">Memory Usage</h3>
            <p className="text-2xl font-bold text-slate-900">{stats.memory}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-slate-500">Hit Rate</h3>
            <p className="text-2xl font-bold text-slate-900">{stats.hitRate}%</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-slate-500">Uptime</h3>
            <p className="text-2xl font-bold text-slate-900">{stats.uptime}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
