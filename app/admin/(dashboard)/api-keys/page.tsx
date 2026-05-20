"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
}

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  const generateKey = () => {
    if (!newName) return;
    const key = `gk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    setKeys([...keys, { id: Date.now().toString(), name: newName, key, permissions: ["read"], createdAt: new Date().toISOString(), lastUsed: null }]);
    setNewName("");
    setShowForm(false);
  };

  const revokeKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">API Key Management</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Generate and manage API keys for external integrations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} />
          Generate Key
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="flex gap-4">
            <Input placeholder="Key name (e.g., Production API)" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
            <Button onClick={generateKey}>Generate</Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {keys.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="key" size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
            <p className="text-[var(--foreground-muted)]">No API keys generated</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between p-4 border border-[var(--surface-border)] rounded-lg">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{k.name}</p>
                  <p className="text-sm font-mono text-[var(--foreground-muted)]">{k.key.substring(0, 20)}...</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Created {new Date(k.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)}><Icon name="trash-2" size={16} /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
