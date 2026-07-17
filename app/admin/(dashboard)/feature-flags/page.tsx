"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
}

const FLAG_DEFINITIONS: FeatureFlag[] = [
  { name: "virtual_events", description: "Enable virtual event streaming", enabled: false, rollout: 100 },
  { name: "group_wallets", description: "Enable group wallet feature", enabled: false, rollout: 100 },
  { name: "affiliate_program", description: "Enable affiliate marketing program", enabled: false, rollout: 0 },
  { name: "crypto_payments", description: "Enable cryptocurrency payments", enabled: false, rollout: 0 },
  { name: "ai_recommendations", description: "Enable AI-powered event recommendations", enabled: false, rollout: 0 },
];

const DEFAULT_FEATURES: Record<string, { enabled: boolean; rollout: number }> = {
  virtual_events: { enabled: true, rollout: 100 },
  group_wallets: { enabled: true, rollout: 100 },
  affiliate_program: { enabled: false, rollout: 0 },
  crypto_payments: { enabled: false, rollout: 0 },
  ai_recommendations: { enabled: false, rollout: 0 },
};

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(FLAG_DEFINITIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullSettings, setFullSettings] = useState<Record<string, unknown> | null>(null);

  const mergeFlags = (savedFeatures: unknown) => {
    const featureValues = savedFeatures && typeof savedFeatures === "object" ? savedFeatures as Record<string, { enabled?: boolean; rollout?: number }> : {};
    return FLAG_DEFINITIONS.map((f) => {
      const saved = featureValues[f.name];
      return {
        ...f,
        enabled: saved?.enabled ?? f.enabled,
        rollout: saved?.rollout ?? f.rollout,
      };
    });
  };

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data) {
        setFullSettings(data.data);
        setFlags(mergeFlags(data.data.features));
      } else {
        setFlags(mergeFlags(DEFAULT_FEATURES));
      }
    } catch {
      setError("Could not connect to server");
      setFlags(mergeFlags(DEFAULT_FEATURES));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const persistFlags = async (updated: FeatureFlag[]) => {
    const features: Record<string, { enabled: boolean; rollout: number }> = {};
    for (const f of updated) {
      features[f.name] = { enabled: f.enabled, rollout: f.rollout };
    }
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(fullSettings || {}), features }),
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        setError("Failed to save feature flags");
      }
    } catch {
      setError("Could not save feature flags");
    }
  };

  const toggleFlag = (name: string) => {
    const updated = flags.map((f) =>
      f.name === name ? { ...f, enabled: !f.enabled } : f
    );
    setFlags(updated);
    persistFlags(updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feature Flags</h1>
        <p className="text-sm text-slate-500">Toggle platform features on and off</p>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto" />
            <p className="text-sm text-slate-500 mt-4">Loading feature flags...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flags.map((f) => (
              <div key={f.name} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{f.name}</p>
                  <p className="text-sm text-slate-500">{f.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">{f.rollout}% rollout</span>
                  <button
                    onClick={() => toggleFlag(f.name)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      f.enabled ? "bg-lime" : "bg-neutral-100"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        f.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
