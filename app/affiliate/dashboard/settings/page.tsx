'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CreditCard, Bell, Save, Check, Shield, Globe, MapPin, Link as LinkIcon } from 'lucide-react';
import Switch from '@/components/ui/Switch';
import IdentityVerification, { type IdentityData } from '@/components/identity/IdentityVerification';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { useToast } from '@/components/ui/ToastProvider';

interface AffiliateSettings {
  displayName: string;
  email: string;
  phone: string;
  website: string;
  avatar?: string;
  bio: string;
  locationCity: string;
  locationCountry: string;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
  socialLinkedin: string;
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

type SettingsTab = 'profile' | 'social' | 'payment' | 'notifications' | 'identity';

export default function AffiliateSettingsPage() {
  const { addToast } = useToast();
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
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const p = profileData?.profile ?? {};
        setSettings({
          displayName: p.display_name || '',
          email: p.email || '',
          phone: p.phone || '',
          website: p.website || '',
          avatar: p.avatar || '',
          bio: p.bio || '',
          locationCity: p.location_city || '',
          locationCountry: p.location_country || '',
          socialInstagram: p.social_instagram || '',
          socialTwitter: p.social_twitter || '',
          socialFacebook: p.social_facebook || '',
          socialLinkedin: p.social_linkedin || '',
          promotionalChannels: p.interests || [],
          paymentMethod: 'bank',
          paymentDetails: {},
          emailNotifications: true,
          payoutNotifications: true,
          collaborationNotifications: true,
        });
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
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: settings.displayName,
          phone: settings.phone || null,
          website: settings.website || null,
          avatar: settings.avatar || null,
          bio: settings.bio || null,
          location_city: settings.locationCity || null,
          location_country: settings.locationCountry || null,
          social_instagram: settings.socialInstagram || null,
          social_twitter: settings.socialTwitter || null,
          social_facebook: settings.socialFacebook || null,
          social_linkedin: settings.socialLinkedin || null,
          interests: settings.promotionalChannels,
        }),
      });
      if (res.ok) {
        setSaved(true);
        addToast('Settings saved successfully!', { type: 'success' });
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to save settings', { type: 'error' });
      }
    } catch {
      addToast('Failed to save settings', { type: 'error' });
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
      addToast(err.error || 'Failed to submit identity', { type: 'error' });
      throw new Error(err.error || 'Failed to submit');
    }
    const result = await res.json();
    setIdentityData({ ...data, id: result.verification.id, status: result.verification.status, submittedAt: result.verification.submittedAt });
    addToast('Identity submitted successfully!', { type: 'success' });
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
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
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
    { id: 'social' as const, label: 'Social Links', icon: <LinkIcon className="h-4 w-4" /> },
    { id: 'payment' as const, label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'identity' as const, label: 'Identity', icon: <Shield className="h-4 w-4" /> },
  ];

  const inputClass = "w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your profile, social links, payment details, and notifications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1">
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
            <CloudinaryUploadField
              label="Profile Image"
              value={settings.avatar || ''}
              onChange={(avatar) => setSettings({ ...settings, avatar })}
              folder="guestly/profiles/affiliates"
              accept="image/*"
              placeholder="Upload profile image"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Display Name</label>
              <input type="text" value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input type="email" value={settings.email} readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed`} />
              <p className="text-xs text-neutral-400 mt-1">Email cannot be changed here</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
              <input type="tel" value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bio</label>
              <textarea value={settings.bio} rows={3}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                placeholder="Tell organizers about yourself and your audience…"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />City
                </label>
                <input type="text" value={settings.locationCity}
                  onChange={(e) => setSettings({ ...settings, locationCity: e.target.value })}
                  placeholder="e.g. Lagos" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />Country
                </label>
                <input type="text" value={settings.locationCountry}
                  onChange={(e) => setSettings({ ...settings, locationCountry: e.target.value })}
                  placeholder="e.g. Nigeria" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Promotional Channels</label>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <button key={channel} onClick={() => toggleChannel(channel)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      settings.promotionalChannels.includes(channel)
                        ? 'bg-lime text-dark'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}>
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Social Media Links</h3>
          <p className="text-sm text-neutral-500 mb-6">
            Add your social media profiles so event organizers can discover you and review your audience before sending a collaboration invite.
          </p>
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                <LinkIcon className="w-4 h-4 text-pink-500" /> Instagram
              </label>
              <input type="url" value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
                className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                <LinkIcon className="w-4 h-4 text-sky-500" /> Twitter / X
              </label>
              <input type="url" value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                placeholder="https://twitter.com/yourhandle"
                className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                <Globe className="w-4 h-4 text-blue-600" /> Facebook
              </label>
              <input type="url" value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                <LinkIcon className="w-4 h-4 text-blue-700" /> LinkedIn
              </label>
              <input type="url" value={settings.socialLinkedin}
                onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                <Globe className="w-4 h-4 text-neutral-500" /> Website / Blog
              </label>
              <input type="url" value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className={inputClass} />
            </div>
            <div className="rounded-xl bg-lime/10 border border-lime/20 p-4">
              <p className="text-sm text-neutral-700 font-medium mb-1">💡 Why this matters</p>
              <p className="text-xs text-neutral-500">
                Organizers browse affiliate profiles when looking for influencers to promote their events. 
                Adding your social links lets them check your audience size and content style before sending an invite.
              </p>
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
                  <button key={method}
                    onClick={() => setSettings({ ...settings, paymentMethod: method })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      settings.paymentMethod === method ? 'border-lime bg-lime/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}>
                    <p className="text-sm font-medium text-neutral-900 capitalize">{method.replace('-', ' ')}</p>
                  </button>
                ))}
              </div>
            </div>
            {settings.paymentMethod === 'bank' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bank Name</label>
                  <input type="text" value={settings.paymentDetails.bankName || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, bankName: e.target.value } })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Name</label>
                  <input type="text" value={settings.paymentDetails.accountName || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, accountName: e.target.value } })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Account Number</label>
                  <input type="text" value={settings.paymentDetails.accountNumber || ''}
                    onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, accountNumber: e.target.value } })}
                    className={inputClass} />
                </div>
              </>
            )}
            {settings.paymentMethod === 'mobile-money' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mobile Number</label>
                <input type="tel" value={settings.paymentDetails.mobileNumber || ''}
                  onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, mobileNumber: e.target.value } })}
                  className={inputClass} />
              </div>
            )}
            {settings.paymentMethod === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">PayPal Email</label>
                <input type="email" value={settings.paymentDetails.paypalEmail || ''}
                  onChange={(e) => setSettings({ ...settings, paymentDetails: { ...settings.paymentDetails, paypalEmail: e.target.value } })}
                  className={inputClass} />
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
                <Switch checked={settings[item.key]}
                  onChange={(checked) => setSettings({ ...settings, [item.key]: checked })} />
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

      {/* Save Button — not shown on identity tab */}
      {activeTab !== 'identity' && (
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-lime px-6 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}