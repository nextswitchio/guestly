'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CacheStats {
  hits: number;
  misses: number;
  staleHits: number;
  evictions: number;
  size: number;
  hitRate: number;
}

interface CacheEntry {
  key: string;
  timestamp: number;
  ttl: number;
  staleTime: number;
  tags: string[];
  isStale: boolean;
  isExpired: boolean;
}

interface CacheStatsResponse {
  ok: boolean;
  stats: CacheStats;
  totalKeys: number;
  entries: CacheEntry[];
  timestamp: number;
}

export function CacheMonitor() {
  const [stats, setStats] = useState<CacheStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/cache/stats');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cache stats');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (type: 'all' | 'expired', key?: string, tag?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/admin/cache/stats';
      const params = new URLSearchParams();
      
      if (type === 'all') {
        params.set('all', 'true');
      } else if (key) {
        params.set('key', key);
      } else if (tag) {
        params.set('tag', tag);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Refresh stats after clearing
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const cleanupCache = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/cache/cleanup', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Refresh stats after cleanup
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cleanup cache');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cache Monitor</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh
          </label>
          <Button onClick={fetchStats} disabled={loading} size="sm">
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Cache Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-slate-600">Hit Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {(stats.stats.hitRate * 100).toFixed(1)}%
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-sm text-slate-600">Cache Size</div>
              <div className="text-2xl font-bold">
                {stats.stats.size}
              </div>
              <div className="text-xs text-slate-500">
                {stats.totalKeys} total keys
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-sm text-slate-600">Cache Hits</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.stats.hits}
              </div>
              <div className="text-xs text-slate-500">
                {stats.stats.staleHits} stale hits
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-sm text-slate-600">Cache Misses</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.stats.misses}
              </div>
              <div className="text-xs text-slate-500">
                {stats.stats.evictions} evictions
              </div>
            </Card>
          </div>

          {/* Cache Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Cache Management</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={cleanupCache}
                disabled={loading}
                variant="secondary"
                size="sm"
              >
                Cleanup Expired
              </Button>
              <Button
                onClick={() => clearCache('all')}
                disabled={loading}
                variant="danger"
                size="sm"
              >
                Clear All Cache
              </Button>
              <Button
                onClick={() => clearCache('expired', undefined, 'events')}
                disabled={loading}
                variant="secondary"
                size="sm"
              >
                Clear Events Cache
              </Button>
              <Button
                onClick={() => clearCache('expired', undefined, 'users')}
                disabled={loading}
                variant="secondary"
                size="sm"
              >
                Clear Users Cache
              </Button>
            </div>
          </Card>

          {/* Cache Entries */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Recent Cache Entries ({stats.entries.length} shown)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Key</th>
                    <th className="text-left py-2">Age</th>
                    <th className="text-left py-2">TTL</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Tags</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.entries.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-mono text-xs max-w-xs truncate">
                        {entry.key}
                      </td>
                      <td className="py-2">
                        {formatDuration(Date.now() - entry.timestamp)}
                      </td>
                      <td className="py-2">
                        {formatDuration(entry.ttl)}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            entry.isExpired
                              ? 'bg-red-100 text-red-700'
                              : entry.isStale
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {entry.isExpired ? 'Expired' : entry.isStale ? 'Stale' : 'Fresh'}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-1 py-0.5 bg-neutral-100 text-slate-600 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {entry.tags.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{entry.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2">
                        <Button
                          onClick={() => clearCache('expired', entry.key)}
                          disabled={loading}
                          variant="ghost"
                          size="sm"
                        >
                          Clear
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Last Updated */}
          <div className="text-sm text-slate-500 text-center">
            Last updated: {formatTimestamp(stats.timestamp)}
          </div>
        </>
      )}
    </div>
  );
}