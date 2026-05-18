'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface NotificationPreferencesProps {
  userId?: string;
  onUpdate?: () => void;
}

interface Preferences {
  enablePromotional: boolean;
  enableTransactional: boolean;
  enableEventUpdates: boolean;
  enableReminders: boolean;
}

export function NotificationPreferences({ userId, onUpdate }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    enablePromotional: true,
    enableTransactional: true,
    enableEventUpdates: true,
    enableReminders: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/push/preferences');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load preferences');
      }

      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/push/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      setSuccess('Preferences saved successfully!');
      onUpdate?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
        <p className="text-sm text-gray-600">
          Choose which types of push notifications you want to receive. You can change these settings anytime.
        </p>
      </div>

      <div className="space-y-4">
        {/* Transactional Notifications */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-1">
            <button
              type="button"
              onClick={() => togglePreference('enableTransactional')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enableTransactional ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enableTransactional ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">Transactional Notifications</h4>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                Recommended
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Order confirmations, ticket updates, payment receipts, and account security alerts.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              These notifications are important for your account security and cannot be fully disabled.
            </p>
          </div>
        </div>

        {/* Event Updates */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-1">
            <button
              type="button"
              onClick={() => togglePreference('enableEventUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enableEventUpdates ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enableEventUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">Event Updates</h4>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                Recommended
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Important changes to events you're attending: venue changes, time updates, cancellations, and lineup announcements.
            </p>
          </div>
        </div>

        {/* Event Reminders */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-1">
            <button
              type="button"
              onClick={() => togglePreference('enableReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enableReminders ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enableReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Event Reminders</h4>
            <p className="text-sm text-gray-600">
              Reminders about upcoming events you're attending: 24 hours before, 1 hour before, and when the event starts.
            </p>
          </div>
        </div>

        {/* Promotional Notifications */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-1">
            <button
              type="button"
              onClick={() => togglePreference('enablePromotional')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enablePromotional ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enablePromotional ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Promotional Notifications</h4>
            <p className="text-sm text-gray-600">
              New events, special offers, early bird tickets, exclusive deals, and personalized recommendations.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Limited to 3 notifications per week to prevent notification fatigue.
            </p>
          </div>
        </div>
      </div>

      {/* Frequency Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="lightbulb" className="text-blue-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Notification Frequency</h4>
            <p className="text-sm text-blue-800">
              We respect your attention. Promotional notifications are limited to 3 per week. 
              Transactional and event update notifications are sent as needed and are not subject to this limit.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-700 text-sm flex items-center gap-2">
          <Icon name="check" size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <Icon name="alert-triangle" className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={savePreferences}
          disabled={saving}
          leftIcon={<Icon name="settings" />}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

      {/* Privacy Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <Icon name="shield" className="inline mr-1" size={14} />
          Your notification preferences are private and secure. We never share your device information with third parties.
          You can disable all notifications at any time through your browser settings.
        </p>
      </div>
    </Card>
  );
}
