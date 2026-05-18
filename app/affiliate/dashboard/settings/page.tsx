'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CreditCard, Bell, Save, RefreshCw, Check, Shield } from 'lucide-react';
import Switch from '@/components/ui/Switch';
import IdentityVerification, { type IdentityData } from '@/components/identity/IdentityVerification';

interface AffiliateSettings {
  businessName: string;
  email: string;
  phone: string;
  website: string;
  promotionalChannels: string[];
  paymentMethod: 'bank' | 'mobile-money' | 'paypal';
  paymentDetails: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    mobileNumber?: string;
    paypalEmail?: string;
  };
  emailNotifications: boolean;
  payoutNotifications: boolean;
  collaborationNotifications: boolean;
}

type SettingsTab = 'profile' | 'payment' | 'notifications' | 'identity';

export default function AffiliateSettingsPage() {
  const [settings, setSettings] = useState<AffiliateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchIdentity();
  }, []);

  const fetchIdentity = async () => {
    try {
      const res = await fetch('/api/identity');
      if (res.ok) {
        const data = await res.json();
        if (data.verification) setIdentityData(data.verification);
      }
    } catch (error) {
      console.error('Failed to fetch identity:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/affiliates/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/affiliates/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleIdentitySubmit = async (data: IdentityData) => {
    const res = await fetch('/api/identity/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit');
    }
    const result = await res.json();
    setIdentityData({ ...data, id: result.verification.id, status: result.verification.status, submittedAt: result.verification.submittedAt });
  };

  const channels = ['Instagram', 'Twitter', 'TikTok', 'YouTube', 'Facebook', 'Blog', 'WhatsApp', 'Email'];

  const toggleChannel = (channel: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      promotionalChannels: settings.promotionalChannels.includes(channel)
        ? settings.promotionalChannels.filter(c => c !== channel)
        : [...settings.promotionalChannels, channel],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <User className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No settings found</h3>
          <p className="text-neutral-500">Complete your affiliate registration to access settings</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'payment' as const, label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'identity' as const, label: 'Identity', icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your profile, payment details, and notifications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-lime text-dark' : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Profile Information</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Website (optional)</label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Promotional Channels</label>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <button
                    key={channel}
                    onClick={() => toggleChannel(channel)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      settings.promotionalChannels.includes(channel)
                        ? 'bg-lime text-dark'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Payment Details</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['bank', 'mobile-money', 'paypal'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setSettings({ ...settings, paymentMethod: method })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      settings.paymentMethod === method
                        ? 'border-lime bg-lime/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-neutral-900 capitalize">{method.replace('-', ' ')}</p>
                  </button>
                ))}
              </div>
            </div>

            {settings.paymentMethod === 'bank' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    value={settings.paymentDetails.bankName || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, bankName: e.target.value } })}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Name</label>
                  <input
                    type="text"
                    value={settings.paymentDetails.accountName || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, accountName: e.target.value } })}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Number</label>
                  <input
                    type="text"
                    value={settings.paymentDetails.accountNumber || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, accountNumber: e.target.value } })}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
              </>
            )}

            {settings.paymentMethod === 'mobile-money' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  value={settings.paymentDetails.mobileNumber || ''}
                  onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, mobileNumber: e.target.value } })}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
            )}

            {settings.paymentMethod === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">PayPal Email</label>
                <input
                  type="email"
                  value={settings.paymentDetails.paypalEmail || ''}
                  onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, paypalEmail: e.target.value } })}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'Email Updates', desc: 'Receive performance reports and tips via email' },
              { key: 'payoutNotifications' as const, label: 'Payout Alerts', desc: 'Get notified when payouts are processed' },
              { key: 'collaborationNotifications' as const, label: 'Collaboration Invites', desc: 'Receive notifications for new organizer invitations' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
                <Switch
                  checked={settings[item.key]}
                  onChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Identity Tab */}
      {activeTab === 'identity' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
              <Shield className="h-5 w-5 text-lime" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Identity Verification</h3>
              <p className="text-sm text-neutral-500">Verify your identity to build trust and unlock higher commission rates</p>
            </div>
          </div>
          <IdentityVerification
            userId="affiliate_123"
            role="affiliate"
            existingData={identityData}
            onSubmit={handleIdentitySubmit}
          />
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-lime px-6 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
