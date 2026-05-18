'use client';

import { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'Guestly',
    supportEmail: 'support@guestly.com',
    supportPhone: '+234 800 123 4567',
    commissionRate: '5',
    minPayout: '1000',
    maxTicketPrice: '500000',
    enableCrypto: true,
    enableMobileMoney: true,
    maintenanceMode: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
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
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-slate-500 mt-1">Configure global platform settings</p>
      </div>

      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">General</h2>
        <div className="space-y-5">
          <Input
            label="Platform Name"
            value={settings.platformName}
            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
          />
          <Input
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
          />
          <Input
            label="Support Phone"
            value={settings.supportPhone}
            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Financial</h2>
        <div className="space-y-5">
          <Input
            label="Commission Rate (%)"
            type="number"
            value={settings.commissionRate}
            onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
          />
          <Input
            label="Minimum Payout (₦)"
            type="number"
            value={settings.minPayout}
            onChange={(e) => setSettings({ ...settings, minPayout: e.target.value })}
          />
          <Input
            label="Max Ticket Price (₦)"
            type="number"
            value={settings.maxTicketPrice}
            onChange={(e) => setSettings({ ...settings, maxTicketPrice: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableCrypto}
              onChange={(e) => setSettings({ ...settings, enableCrypto: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-primary-600"
            />
            <div>
              <p className="font-medium">Cryptocurrency Payments</p>
              <p className="text-sm text-slate-500">Accept BTC, ETH, and USDT</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableMobileMoney}
              onChange={(e) => setSettings({ ...settings, enableMobileMoney: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-primary-600"
            />
            <div>
              <p className="font-medium">Mobile Money</p>
              <p className="text-sm text-slate-500">Accept M-Pesa, MTN Mobile Money, etc.</p>
            </div>
          </label>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-6">Maintenance</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-danger-600"
          />
          <div>
            <p className="font-medium text-danger-600">Maintenance Mode</p>
            <p className="text-sm text-slate-500">Disable public access to the platform</p>
          </div>
        </label>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">Settings saved successfully!</span>
        )}
      </div>
    </div>
  );
}
