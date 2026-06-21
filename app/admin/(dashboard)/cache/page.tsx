"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface CacheEntry {
  key: string;
  timestamp: number;
  ttl: number;
  staleTime: number;
  size: number;
  isStale: boolean;
  isExpired: boolean;
}

interface ApiStats {
  totalEntries: number;
  hitRate: number;
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  evictions: number;
}

interface ApiResponse {
  ok: boolean;
  stats?: ApiStats;
  totalKeys?: number;
  entries?: CacheEntry[];
  message?: string;
  cleaned?: number;
  cleared?: number;
}

export default function AdminCachePage() {
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [totalKeys, setTotalKeys] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchCacheStats = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cache/stats");
      if (res.ok) {
        const data: ApiResponse = await res.json();
        if (data.ok) {
          setStats(data.stats || null);
          setEntries(data.entries || []);
          setTotalKeys(data.totalKeys || 0);
        }
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: "Failed to fetch cache stats", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCacheStats();
  }, [fetchCacheStats]);

  const runCleanup = async () => {
    setClearing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cache/cleanup", { method: "POST" });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        setMessage({ text: data.message || "Cache cleaned successfully", type: "success" });
        fetchCacheStats();
      }
    } catch {
      setMessage({ text: "Failed to clean cache", type: "error" });
    } finally {
      setClearing(false);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL cache entries? This may temporarily slow down the application.")) return;
    setClearing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cache/stats?all=true", { method: "DELETE" });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        setMessage({ text: data.message || "All cache cleared", type: "success" });
        fetchCacheStats();
      }
    } catch {
      setMessage({ text: "Failed to clear cache", type: "error" });
    } finally {
      setClearing(false);
    }
  };

  const deleteKey = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/cache/stats?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        setEntries(prev => prev.filter(e => e.key !== key));
        setMessage({ text: data.message || "Entry cleared", type: "success" });
      }
    } catch {
      setMessage({ text: "Failed to delete cache entry", type: "error" });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(0)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  if (loading && !stats) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cache Management</h1>
          <p className="text-sm text-slate-500">Monitor, manage, and clear application cache entries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchCacheStats} disabled={loading}>
            <Icon name="refresh-cw" size={14} className="mr-1.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={runCleanup} disabled={clearing}>
            <Icon name="zap" size={14} className="mr-1.5" />
            Clean Expired
          </Button>
          <Button onClick={clearAll} disabled={clearing} className="bg-red-600 hover:bg-red-700 text-white">
            <Icon name="trash-2" size={14} className="mr-1.5" />
            Clear All
          </Button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <Icon name={message.type === "success" ? "check-circle" : "alert-circle"} size={16} />
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Icon name="clipboard" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Keys</p>
                <p className="text-xl font-bold text-slate-900">{totalKeys}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Icon name="monitor" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Memory</p>
                <p className="text-xl font-bold text-slate-900">{formatBytes(stats.size || 0)}</p>
                {stats.maxSize > 0 && (
                  <p className="text-[10px] text-slate-400">of {formatBytes(stats.maxSize)}</p>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Icon name="trending-up" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Hit Rate</p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.hitRate != null ? `${(stats.hitRate * 100).toFixed(1)}%` : "N/A"}
                </p>
                <p className="text-[10px] text-slate-400">{stats.hits || 0} hits / {stats.misses || 0} misses</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Icon name="alert-triangle" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Evictions</p>
                <p className="text-xl font-bold text-slate-900">{stats.evictions || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cache Entries Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Cache Entries</h2>
          <span className="text-xs text-slate-400">{entries.length} of {totalKeys} shown</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-slate-500">Loading cache entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="save" size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No cache entries</p>
            <p className="text-xs text-slate-400 mt-1">Cache is empty or entries were cleared.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Key</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Age</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">TTL</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.key} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono text-slate-900 break-all max-w-[300px] block">
                        {entry.key}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {formatDuration(Date.now() - entry.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {formatDuration(entry.ttl)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {formatBytes(entry.size)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        entry.isExpired
                          ? "bg-red-100 text-red-600"
                          : entry.isStale
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {entry.isExpired ? "Expired" : entry.isStale ? "Stale" : "Fresh"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteKey(entry.key)}
                        title="Delete entry"
                      >
                        <Icon name="x" size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
