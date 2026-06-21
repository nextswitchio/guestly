"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export default function AdminWebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const addWebhook = async () => {
    if (!newUrl) return;
    setWebhooks([...webhooks, { id: Date.now().toString(), url: newUrl, events: ["order.created", "user.registered"], active: true, createdAt: new Date().toISOString() }]);
    setNewUrl("");
    setShowForm(false);
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
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

      {showForm && (
        <Card className="p-6">
          <div className="flex gap-4">
            <Input placeholder="https://example.com/webhook" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1" />
            <Button onClick={addWebhook}>Add</Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {webhooks.length === 0 ? (
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
                  <span className={`px-2 py-1 text-xs rounded-full ${w.active ? "bg-green-100 text-green-800" : "bg-neutral-100 text-slate-500"}`}>
                    {w.active ? "Active" : "Inactive"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => toggleWebhook(w.id)}><Icon name="power" size={16} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteWebhook(w.id)}><Icon name="trash-2" size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
