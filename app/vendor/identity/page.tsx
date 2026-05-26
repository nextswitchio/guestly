"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import IdentityVerification, { type IdentityData } from "@/components/identity/IdentityVerification";
import { Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function VendorIdentityPage() {
  const { addToast } = useToast();
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/identity')
      .then(r => r.json())
      .then(d => { if (d.verification) setIdentityData(d.verification); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleIdentitySubmit = async (data: IdentityData) => {
    const res = await fetch('/api/identity/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      addToast(err.error || 'Failed to submit identity', { type: 'error' });
      throw new Error(err.error || 'Failed to submit');
    }
    const result = await res.json();
    setIdentityData({ ...data, id: result.verification.id, status: result.verification.status, submittedAt: result.verification.submittedAt });
    addToast('Identity submitted successfully!', { type: 'success' });
  };

  if (loading) return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-dark">Identity Verification</h1>
        <p className="text-gray-500 mt-1">Verify your identity to receive event invitations and build trust with organizers</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
            <Shield className="h-5 w-5 text-lime" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">Government-Issued ID</h2>
            <p className="text-sm text-gray-500">Upload a valid identity document to verify your business</p>
          </div>
        </div>
        <IdentityVerification
          userId="vendor_123"
          role="vendor"
          existingData={identityData}
          onSubmit={handleIdentitySubmit}
        />
      </Card>
    </div>
  );
}
