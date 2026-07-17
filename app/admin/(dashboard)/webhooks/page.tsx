"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminWebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/webhooks", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setWebhooks(data.webhooks || []);
      } else {
        setError(data.detail || "Failed to load webhooks");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const addWebhook = async () => {
    if (!newUrl.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl.trim(),
          events: ["order.created", "user.registered"],
          is_active: true,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setNewUrl("");
        setShowForm(false);
        fetchWebhooks();
      } else {
        setError(data.detail || "Failed to create webhook");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setCreating(false);
    }
  };

  const toggleWebhook = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/webhooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.webhook) {
        setWebhooks((prev) =>
          prev.map((w) => (w.id === id ? { ...w, is_active: data.webhook.is_active } : w))
        );
      }
    } catch {
      setError("Failed to toggle webhook");
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/webhooks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      setError("Failed to delete webhook");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Webhook Management</h1>
          <p className="text-sm text-slate-500">Configure webhook endpoints for external integrations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} />
          Add Webhook
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {showForm && (
        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="https://example.com/webhook"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addWebhook} disabled={creating}>
              {creating ? "Adding..." : "Add"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto" />
            <p className="text-sm text-slate-500 mt-4">Loading webhooks...</p>
          </div>
        ) : error && webhooks.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="webhook" size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">Could not load webhooks</p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="webhook" size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">No webhooks configured</p>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{w.url}</p>
                  <p className="text-sm text-slate-500">{w.events.join(", ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      w.is_active ? "bg-green-100 text-green-800" : "bg-neutral-100 text-slate-500"
                    }`}
                  >
                    {w.is_active ? "Active" : "Inactive"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => toggleWebhook(w.id, w.is_active)}>
                    <Icon name="power" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteWebhook(w.id)}>
                    <Icon name="trash-2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
