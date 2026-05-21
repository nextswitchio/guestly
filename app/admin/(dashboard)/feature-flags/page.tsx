"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
}

const defaultFlags: FeatureFlag[] = [
  { id: "1", name: "virtual_events", description: "Enable virtual event streaming", enabled: true, rollout: 100 },
  { id: "2", name: "group_wallets", description: "Enable group wallet feature", enabled: true, rollout: 100 },
  { id: "3", name: "affiliate_program", description: "Enable affiliate marketing program", enabled: false, rollout: 0 },
  { id: "4", name: "crypto_payments", description: "Enable cryptocurrency payments", enabled: false, rollout: 0 },
  { id: "5", name: "ai_recommendations", description: "Enable AI-powered event recommendations", enabled: false, rollout: 0 },
];

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(defaultFlags);

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feature Flags</h1>
        <p className="text-sm text-slate-500">Toggle platform features on and off</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {flags.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{f.name}</p>
                <p className="text-sm text-slate-500">{f.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">{f.rollout}% rollout</span>
                <button
                  onClick={() => toggleFlag(f.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${f.enabled ? "bg-lime" : "bg-neutral-100"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${f.enabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
