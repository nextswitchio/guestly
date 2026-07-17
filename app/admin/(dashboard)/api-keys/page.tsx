"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  key_prefix: string;
  key_type: string;
  status: string;
  permissions: string[];
  user_email?: string;
  last_used_at: string | null;
  created_at: string;
  usage_count: number;
}

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/api-keys", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setKeys(data.keys || []);
      } else {
        setError(data.detail || "Failed to load API keys");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const generateKey = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.key) {
        setNewKeyValue(data.key.key);
        setNewName("");
        setShowForm(false);
        fetchKeys();
      } else {
        setError(data.detail || "Failed to create API key");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
      }
    } catch {
      setError("Failed to revoke key");
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Key Management</h1>
          <p className="text-sm text-slate-500">Generate and manage API keys for external integrations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} />
          Generate Key
        </Button>
      </div>

      {newKeyValue && (
        <Card className="p-6 border-lime bg-lime-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">New API Key Created</p>
              <p className="text-sm text-slate-600 mt-1 font-mono break-all">{newKeyValue}</p>
              <p className="text-xs text-red-600 mt-2">Copy this key now &mdash; it won&rsquo;t be shown again.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => copyKey(newKeyValue)}>
                <Icon name="copy" size={14} />
                Copy
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setNewKeyValue(null)}>
                <Icon name="x" size={14} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {showForm && (
        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Key name (e.g., Production API)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateKey} disabled={creating}>
              {creating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto" />
            <p className="text-sm text-slate-500 mt-4">Loading API keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="key" size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">No API keys generated</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{k.name}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      k.status === "active" ? "bg-green-100 text-green-800" : "bg-neutral-100 text-slate-500"
                    }`}>
                      {k.status}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-500">gk_{k.key_prefix}...</p>
                  {k.user_email && (
                    <p className="text-xs text-slate-400">Owner: {k.user_email}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Created {new Date(k.created_at).toLocaleDateString()}
                    {k.last_used_at ? ` · Last used ${new Date(k.last_used_at).toLocaleDateString()}` : " · Never used"}
                    {" · "}{k.usage_count} requests
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)}>
                  <Icon name="trash-2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
