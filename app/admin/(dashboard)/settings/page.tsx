'use client';

import React, { useState, useEffect } from 'react';
import { Save, Settings, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';

type PlatformSettings = {
  // General
  platformName: string;
  primaryCurrency: string;
  supportEmail: string;
  supportPhone: string;
  siteUrl: string;

  // Financial
  commissionRate: string;
  organizerCommissionRate: string;
  vendorCommissionRate: string;
  minPayout: string;
  maxTicketPrice: string;

  // Vendor Subscription Pricing
  subscription1mPrice: string;
  subscription3mPrice: string;
  subscription6mPrice: string;
  subscription12mPrice: string;

  // Organizer Subscription Pricing
  organizerSubscription1mPrice: string;
  organizerSubscription3mPrice: string;
  organizerSubscription6mPrice: string;
  organizerSubscription12mPrice: string;

  // Payment Methods
  enableCard: boolean;
  enableMobileMoney: boolean;
  enableCrypto: boolean;
  enableWallet: boolean;

  // Payment Providers
  paystackPublicKey: string;
  paystackSecretKey: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;

  // Registration
  enableAttendeeSignup: boolean;
  enableOrganizerSignup: boolean;
  enableVendorSignup: boolean;
  enableAffiliateSignup: boolean;
  requireEmailVerification: boolean;

  // Communications
  sendgridFromEmail: string;
  bulkSmsSenderId: string;
  twilioPhoneNumber: string;

  // Features
  enableBlog: boolean;
  enableCommunity: boolean;
  enableStreaming: boolean;
  enableMerchandise: boolean;
  enableWalletSavings: boolean;
  enableCryptoWallet: boolean;
  enableReferrals: boolean;
  enableSocialLogin: boolean;
  enableGoogleLogin: boolean;
  enableAppleLogin: boolean;

  // Security
  enforce2FA: boolean;
  sessionTimeoutMinutes: string;

  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Affiliate
  affiliateCommissionRate: string;
  affiliateMinPayout: string;
};

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: 'Guestly',
  primaryCurrency: 'NGN',
  supportEmail: 'support@guestly.com',
  supportPhone: '+234 800 123 4567',
  siteUrl: 'http://localhost:3000',

  commissionRate: '5',
  organizerCommissionRate: '3',
  vendorCommissionRate: '5',
  minPayout: '1000',
  maxTicketPrice: '500000',

  subscription1mPrice: '4999',
  subscription3mPrice: '12999',
  subscription6mPrice: '23999',
  subscription12mPrice: '44999',

  organizerSubscription1mPrice: '9999',
  organizerSubscription3mPrice: '24999',
  organizerSubscription6mPrice: '44999',
  organizerSubscription12mPrice: '79999',

  enableCard: true,
  enableMobileMoney: true,
  enableCrypto: true,
  enableWallet: true,

  paystackPublicKey: '',
  paystackSecretKey: '',
  flutterwavePublicKey: '',
  flutterwaveSecretKey: '',

  enableAttendeeSignup: true,
  enableOrganizerSignup: true,
  enableVendorSignup: true,
  enableAffiliateSignup: true,
  requireEmailVerification: true,

  sendgridFromEmail: 'noreply@guestly.com',
  bulkSmsSenderId: 'Guestly',
  twilioPhoneNumber: '',

  enableBlog: true,
  enableCommunity: true,
  enableStreaming: true,
  enableMerchandise: true,
  enableWalletSavings: true,
  enableCryptoWallet: true,
  enableReferrals: true,
  enableSocialLogin: true,
  enableGoogleLogin: true,
  enableAppleLogin: true,

  enforce2FA: false,
  sessionTimeoutMinutes: '60',

  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back shortly.',

  affiliateCommissionRate: '10',
  affiliateMinPayout: '2000',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.data });
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'financial', label: 'Financial', icon: 'credit-card' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'package' },
    { id: 'payments', label: 'Payments', icon: 'wallet' },
    { id: 'registration', label: 'Registration', icon: 'users' },
    { id: 'features', label: 'Features', icon: 'star' },
    { id: 'communications', label: 'Communications', icon: 'mail' },
    { id: 'affiliates', label: 'Affiliates', icon: 'megaphone' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'maintenance', label: 'Maintenance', icon: 'alert-triangle' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-neutral-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure global platform-wide settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium animate-pulse">Saved!</span>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-56 shrink-0 space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeSection === s.id
                  ? 'bg-lime/10 text-dark border border-lime/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon name={s.icon as any} size={16} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeSection === 'general' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>
              <div className="space-y-5">
                <Input label="Platform Name" value={settings.platformName} onChange={e => update('platformName', e.target.value)} />
                <Input label="Support Email" type="email" value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} />
                <Input label="Support Phone" value={settings.supportPhone} onChange={e => update('supportPhone', e.target.value)} />
                <Input label="Site URL" value={settings.siteUrl} onChange={e => update('siteUrl', e.target.value)} />
                <Input label="Sender Email (SendGrid)" value={settings.sendgridFromEmail} onChange={e => update('sendgridFromEmail', e.target.value)} />
                <Input label="SMS Sender ID (BulkSMS)" value={settings.bulkSmsSenderId} onChange={e => update('bulkSmsSenderId', e.target.value)} />
                <Input label="Twilio Phone Number" value={settings.twilioPhoneNumber} onChange={e => update('twilioPhoneNumber', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSection === 'financial' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Financial Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Configure commission rates, payouts, and pricing limits.</p>
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-900">Primary Currency</label>
                  <select
                    value={settings.primaryCurrency}
                    onChange={e => update('primaryCurrency', e.target.value)}
                    className="h-11 w-full rounded-xl border bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-lime focus-visible:ring-lime/20 px-3.5 transition-all duration-200"
                  >
                    <option value="NGN">₦ NGN — Nigerian Naira</option>
                    <option value="USD">$ USD — US Dollar</option>
                    <option value="GHS">GH₵ GHS — Ghanaian Cedi</option>
                    <option value="KES">KSh KES — Kenyan Shilling</option>
                    <option value="ZAR">R ZAR — South African Rand</option>
                    <option value="GBP">£ GBP — British Pound</option>
                    <option value="EUR">€ EUR — Euro</option>
                    <option value="XOF">CFA XOF — CFA Franc</option>
                    <option value="RWF">FRw RWF — Rwandan Franc</option>
                    <option value="UGX">USh UGX — Ugandan Shilling</option>
                    <option value="TZS">TSh TZS — Tanzanian Shilling</option>
                  </select>
                  <p className="text-xs text-neutral-500">All monetary values are stored and displayed in this currency. User locale detection will automatically convert displayed amounts.</p>
                </div>
                <Input label="Global Commission Rate (%)" type="number" value={settings.commissionRate} onChange={e => update('commissionRate', e.target.value)} />
                <Input label="Organizer Commission Rate (%)" type="number" value={settings.organizerCommissionRate} onChange={e => update('organizerCommissionRate', e.target.value)} />
                <Input label="Vendor Commission Rate (%)" type="number" value={settings.vendorCommissionRate} onChange={e => update('vendorCommissionRate', e.target.value)} />
                <Input label={`Minimum Payout (${settings.primaryCurrency === 'NGN' ? '₦' : settings.primaryCurrency === 'USD' ? '$' : settings.primaryCurrency})`} type="number" value={settings.minPayout} onChange={e => update('minPayout', e.target.value)} />
                <Input label={`Max Ticket Price (${settings.primaryCurrency === 'NGN' ? '₦' : settings.primaryCurrency === 'USD' ? '$' : settings.primaryCurrency})`} type="number" value={settings.maxTicketPrice} onChange={e => update('maxTicketPrice', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSection === 'subscriptions' && (
            <>
              <Card className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">Vendor Subscription Plans</h2>
                <p className="text-sm text-slate-500 mb-6">Set pricing for vendor subscription plans. Prices in Naira (kobo).</p>
                <div className="space-y-5">
                  <Input label="Vendor 1 Month Plan (₦)" type="number" value={settings.subscription1mPrice} onChange={e => update('subscription1mPrice', e.target.value)} />
                  <Input label="Vendor 3 Months Plan (₦)" type="number" value={settings.subscription3mPrice} onChange={e => update('subscription3mPrice', e.target.value)} />
                  <Input label="Vendor 6 Months Plan (₦)" type="number" value={settings.subscription6mPrice} onChange={e => update('subscription6mPrice', e.target.value)} />
                  <Input label="Vendor 12 Months Plan (₦)" type="number" value={settings.subscription12mPrice} onChange={e => update('subscription12mPrice', e.target.value)} />
                </div>
              </Card>
              <Card className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">Organizer Subscription Plans</h2>
                <p className="text-sm text-slate-500 mb-6">Set pricing for organizer subscription plans. Prices in Naira (kobo).</p>
                <div className="space-y-5">
                  <Input label="Organizer 1 Month Plan (₦)" type="number" value={settings.organizerSubscription1mPrice} onChange={e => update('organizerSubscription1mPrice', e.target.value)} />
                  <Input label="Organizer 3 Months Plan (₦)" type="number" value={settings.organizerSubscription3mPrice} onChange={e => update('organizerSubscription3mPrice', e.target.value)} />
                  <Input label="Organizer 6 Months Plan (₦)" type="number" value={settings.organizerSubscription6mPrice} onChange={e => update('organizerSubscription6mPrice', e.target.value)} />
                  <Input label="Organizer 12 Months Plan (₦)" type="number" value={settings.organizerSubscription12mPrice} onChange={e => update('organizerSubscription12mPrice', e.target.value)} />
                </div>
              </Card>
            </>
          )}

          {activeSection === 'payments' && (
            <>
              <Card className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  {[
                    { key: 'enableCard' as const, label: 'Card Payments', desc: 'Accept debit/credit card payments' },
                    { key: 'enableMobileMoney' as const, label: 'Mobile Money', desc: 'Accept M-Pesa, MTN Mobile Money, etc.' },
                    { key: 'enableCrypto' as const, label: 'Cryptocurrency', desc: 'Accept BTC, ETH, and USDT' },
                    { key: 'enableWallet' as const, label: 'Wallet Payments', desc: 'Allow users to pay from platform wallet' },
                  ].map(m => (
                    <label key={m.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50">
                      <input type="checkbox" checked={settings[m.key]} onChange={e => update(m.key, e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-lime focus:ring-lime" />
                      <div>
                        <p className="font-medium">{m.label}</p>
                        <p className="text-sm text-slate-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              <Card className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">Payment Providers</h2>
                <p className="text-sm text-slate-500 mb-6">Configure payment gateway API keys.</p>
                <div className="space-y-5">
                  <Input label="Paystack Public Key" type="password" value={settings.paystackPublicKey} onChange={e => update('paystackPublicKey', e.target.value)} />
                  <Input label="Paystack Secret Key" type="password" value={settings.paystackSecretKey} onChange={e => update('paystackSecretKey', e.target.value)} />
                  <Input label="Flutterwave Public Key" type="password" value={settings.flutterwavePublicKey} onChange={e => update('flutterwavePublicKey', e.target.value)} />
                  <Input label="Flutterwave Secret Key" type="password" value={settings.flutterwaveSecretKey} onChange={e => update('flutterwaveSecretKey', e.target.value)} />
                </div>
              </Card>
            </>
          )}

          {activeSection === 'registration' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Registration Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Control which user roles can sign up and registration requirements.</p>
              <div className="space-y-4">
                {[
                  { key: 'enableAttendeeSignup' as const, label: 'Attendee Signup', desc: 'Allow new attendee accounts' },
                  { key: 'enableOrganizerSignup' as const, label: 'Organizer Signup', desc: 'Allow new organizer accounts' },
                  { key: 'enableVendorSignup' as const, label: 'Vendor Signup', desc: 'Allow new vendor accounts' },
                  { key: 'enableAffiliateSignup' as const, label: 'Affiliate Signup', desc: 'Allow new affiliate accounts' },
                ].map(r => (
                  <label key={r.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50">
                    <input type="checkbox" checked={settings[r.key]} onChange={e => update(r.key, e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-lime focus:ring-lime" />
                    <div>
                      <p className="font-medium">{r.label}</p>
                      <p className="text-sm text-slate-500">{r.desc}</p>
                    </div>
                  </label>
                ))}
                <div className="pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50">
                    <input type="checkbox" checked={settings.requireEmailVerification} onChange={e => update('requireEmailVerification', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-lime focus:ring-lime" />
                    <div>
                      <p className="font-medium">Require Email Verification</p>
                      <p className="text-sm text-slate-500">Users must verify email before accessing the platform</p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'features' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Platform Features</h2>
              <p className="text-sm text-slate-500 mb-6">Toggle platform features on/off.</p>
              <div className="space-y-4">
                {[
                  { key: 'enableBlog' as const, label: 'Blog', desc: 'Blog and content management system' },
                  { key: 'enableCommunity' as const, label: 'Community', desc: 'Event community features (chat, Q&A, polls)' },
                  { key: 'enableStreaming' as const, label: 'Live Streaming', desc: 'Virtual and hybrid event streaming' },
                  { key: 'enableMerchandise' as const, label: 'Merchandise', desc: 'Event merchandise store' },
                  { key: 'enableWalletSavings' as const, label: 'Wallet Savings', desc: 'Savings goals feature in wallet' },
                  { key: 'enableCryptoWallet' as const, label: 'Crypto Wallet', desc: 'Cryptocurrency wallet feature' },
                  { key: 'enableReferrals' as const, label: 'Referral Program', desc: 'Referral and earn program' },
                  { key: 'enableSocialLogin' as const, label: 'Social Login', desc: 'Allow login with social accounts' },
                  { key: 'enableGoogleLogin' as const, label: 'Google Login', desc: 'Login with Google accounts' },
                  { key: 'enableAppleLogin' as const, label: 'Apple Login', desc: 'Login with Apple accounts' },
                ].map(f => (
                  <label key={f.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50">
                    <input type="checkbox" checked={settings[f.key]} onChange={e => update(f.key, e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-lime focus:ring-lime" />
                    <div>
                      <p className="font-medium">{f.label}</p>
                      <p className="text-sm text-slate-500">{f.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'communications' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Communication Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Configure email, SMS, and notification providers.</p>
              <div className="space-y-5">
                <Input label="SendGrid From Email" type="email" value={settings.sendgridFromEmail} onChange={e => update('sendgridFromEmail', e.target.value)} />
                <Input label="BulkSMS Sender ID" value={settings.bulkSmsSenderId} onChange={e => update('bulkSmsSenderId', e.target.value)} />
                <Input label="Twilio Phone Number" value={settings.twilioPhoneNumber} onChange={e => update('twilioPhoneNumber', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSection === 'affiliates' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Affiliate Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Configure affiliate program commissions and payouts.</p>
              <div className="space-y-5">
                <Input label="Affiliate Commission Rate (%)" type="number" value={settings.affiliateCommissionRate} onChange={e => update('affiliateCommissionRate', e.target.value)} />
                <Input label="Affiliate Minimum Payout (₦)" type="number" value={settings.affiliateMinPayout} onChange={e => update('affiliateMinPayout', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
              <div className="space-y-5">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-neutral-50">
                    <input type="checkbox" checked={settings.enforce2FA} onChange={e => update('enforce2FA', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-lime focus:ring-lime" />
                    <div>
                      <p className="font-medium">Enforce Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Require 2FA for all admin accounts</p>
                    </div>
                  </label>
                </div>
                <Input label="Session Timeout (minutes)" type="number" value={settings.sessionTimeoutMinutes} onChange={e => update('sessionTimeoutMinutes', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSection === 'maintenance' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Maintenance Mode</h2>
              <div className="space-y-5">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-red-50">
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={e => update('maintenanceMode', e.target.checked)} className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500" />
                  <div>
                    <p className="font-medium text-red-600">Maintenance Mode</p>
                    <p className="text-sm text-slate-500">Disable public access to the platform and show maintenance message</p>
                  </div>
                </label>
                {settings.maintenanceMode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 font-medium">⚠ Maintenance mode is active. Public users will see the maintenance message instead of the platform.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Maintenance Message</label>
                  <textarea
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    rows={3}
                    value={settings.maintenanceMessage}
                    onChange={e => update('maintenanceMessage', e.target.value)}
                    placeholder="Message to display during maintenance..."
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
