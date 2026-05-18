'use client';
import { AlertTriangle, Check } from 'lucide-react';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface DeviceTokenRegistrationProps {
  userId?: string;
  onSuccess?: () => void;
}

export function DeviceTokenRegistration({ userId, onSuccess }: DeviceTokenRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission !== 'granted') {
        setError('Notification permission denied. Please enable notifications in your browser settings.');
        setLoading(false);
        return;
      }

      // Register service worker for web push
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Get push subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '') as any,
        });

        // Extract device token from subscription
        const token = JSON.stringify(subscription);

        // Register token with backend
        const response = await fetch('/api/push/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            platform: 'web',
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to register device token');
        }

        setSuccess('Push notifications enabled successfully!');
        onSuccess?.();
      } else {
        throw new Error('Service workers are not supported in this browser');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Test Notification', {
        body: 'Push notifications are working! You\'ll receive event updates here.',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
      });
    }
  };

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (!isSupported) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl"><AlertTriangle className="h-4 w-4 inline-block" /></span>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Notifications Not Supported</h4>
            <p className="text-sm text-gray-700">
              Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            notificationPermission === 'granted' ? 'bg-success-100' : 'bg-gray-100'
          }`}>
            <Icon 
              name={notificationPermission === 'granted' ? 'check' : 'bell'} 
              className={notificationPermission === 'granted' ? 'text-success-600' : 'text-gray-600'}
              size={24}
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Push Notifications'}
          </h3>
          
          {notificationPermission === 'default' && (
            <p className="text-sm text-gray-600 mb-4">
              Get instant updates about events, ticket sales, and important announcements directly on your device.
            </p>
          )}

          {notificationPermission === 'denied' && (
            <div className="mb-4">
              <p className="text-sm text-red-600 mb-2">
                Notifications are blocked. To enable them:
              </p>
              <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find "Notifications" in the permissions list</li>
                <li>Change the setting to "Allow"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}

          {notificationPermission === 'granted' && (
            <div className="mb-4">
              <p className="text-sm text-success-700 mb-2">
               <Check className="h-4 w-4 inline" /> You're all set! You'll receive notifications for:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Event reminders and updates</li>
                <li>Ticket sales and promotions</li>
                <li>Important announcements</li>
                <li>Last-minute changes</li>
              </ul>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-700 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
              <Button
                onClick={requestNotificationPermission}
                disabled={loading}
                leftIcon={<Icon name="bell" />}
              >
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            )}

            {notificationPermission === 'granted' && (
              <Button
                variant="outline"
                onClick={testNotification}
                leftIcon={<Icon name="megaphone" />}
              >
                Send Test Notification
              </Button>
            )}
          </div>

          {notificationPermission === 'granted' && (
            <p className="text-xs text-gray-500 mt-3">
              You can manage notification preferences in your account settings.
            </p>
          )}
        </div>
      </div>

      {/* Platform Support Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Platform Support</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="check" className="text-success-600" size={16} />
            <span className="text-gray-700">Chrome (Desktop & Mobile)</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="check" className="text-success-600" size={16} />
            <span className="text-gray-700">Firefox (Desktop & Mobile)</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="check" className="text-success-600" size={16} />
            <span className="text-gray-700">Safari (Desktop & iOS 16.4+)</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="check" className="text-success-600" size={16} />
            <span className="text-gray-700">Edge (Desktop & Mobile)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
